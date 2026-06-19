import { Context } from "hono";
import { prisma } from "../lib/prisma";
import { getIo } from "../socket/socket";
import { redis } from "../server";

export const searchMessages = async (c: Context) => {
  try {
    const limit = 20;
    const lastMsgId = c.req.query("cursor");
    const conversationId = c.req.param("conversationId");

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      take: limit,
      ...(lastMsgId && {
        cursor: {
          id: lastMsgId,
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: "desc",
      },
    });

    messages.reverse();

    return c.json({
      success: true,
      message: "messages Fetched",
      data: messages,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while searching the message`, err);

    return c.json(
      {
        success: false,
        message: "Server side error",
        error: err,
      },
      500,
    );
  }
};

//send message
export const sendMessage = async (c: Context) => {
  try {
    const { content, targetedUserId } = await c.req.json();

    const sender = c.get("user") as {
      id: string;
    };

    if (!sender) {
      return c.json({ success: false, message: "sender not found" }, 404);
    }

    const targetedUser = await prisma.user.findUnique({
      where: {
        id: targetedUserId,
      },
    });

    if (!targetedUser) {
      return c.json({ success: false, message: "receiver not found" }, 404);
    }
    if (!content?.trim()) {
      return c.json({ success: false, message: "content is required" }, 404);
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                userId: sender.id,
              },
            },
          },
          {
            participants: {
              some: {
                userId: targetedUser.id,
              },
            },
          },
        ],
      },
    });

    let activeConversation = conversation;

    if (!activeConversation) {
      activeConversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [
              {
                userId: sender.id,
              },
              {
                userId: targetedUser.id,
              },
            ],
          },
        },
      });
    }

    const message = await prisma.message.create({
      data: {
        content: content,
        conversationId: activeConversation.id,
        senderId: sender.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await redis.rpush(
      `conversation:${activeConversation.id}`,
      JSON.stringify(message),
    );

    await redis.ltrim(`conversation:${activeConversation.id}`, -100, -1);

    const io = getIo();

    if (io) {
      const receiverSocketId = await redis.get(`online:${targetedUser.id}`);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new-message", message);
      }
    }

    return c.json({
      success: true,
      message: "message stored",
      data: message,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while creating send message`, err);

    return c.json(
      {
        success: false,
        message: "Server side error",
        error: err,
      },
      500,
    );
  }
};

//delete message
export const deleteMessage = async (c: Context) => {
  try {
    const conversationId = c.req.param("conversationId");
    const messageId = c.req.param("messageId");

    const sender = c.get("user") as {
      id: string;
    };

    if (!sender) {
      return c.json({ success: false, message: "sender not found" }, 400);
    }

    if (!messageId) {
      return c.json({ success: false, message: "messageId is required" }, 400);
    }

    if (!conversationId) {
      return c.json(
        {
          success: false,
          message: "Conversation id required",
        },
        400,
      );
    }

    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        conversationId,
      },
    });

    if (!message) {
      return c.json(
        {
          success: false,
          message: "Message not found",
        },
        404,
      );
    }
    if (sender.id !== message?.senderId) {
      return c.json(
        {
          success: false,
          message: "Not authorized",
        },
        403,
      );
    }
    const deletedMessage = await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    return c.json({
      success: true,
      message: "message deleted",
      data: deletedMessage,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while deleting the message`, err);

    return c.json(
      {
        success: false,
        message: "Server side error",
        error: err,
      },
      500,
    );
  }
};

//edit message
export const editMessage = async (c: Context) => {
  try {
    const conversationId = c.req.param("conversationId");
    const messageId = c.req.param("messageId");
    const { content } = await c.req.json();

    const sender = c.get("user") as {
      id: string;
    };

    if (!content?.trim()) {
      return c.json({ success: false, message: "content is required" }, 400);
    }

    if (!sender) {
      return c.json({ success: false, message: "sender not found" }, 400);
    }

    if (!messageId) {
      return c.json({ success: false, message: "messageId is required" }, 400);
    }

    if (!conversationId) {
      return c.json(
        {
          success: false,
          message: "Conversation id required",
        },
        400,
      );
    }

    // console.log("Prisma client loaded");
    // console.dir((prisma as any)._runtimeDataModel, {
    //   depth: null,
    // });
    // console.log(prisma.constructor.name);
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        conversationId,
      },
    });

    if (!message) {
      return c.json(
        {
          success: false,
          message: "Message not found",
        },
        404,
      );
    }

    if (sender.id !== message.senderId) {
      return c.json(
        {
          success: false,
          message: "Not authorized",
        },
        403,
      );
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        ...(content && { content }),
        editedAt: new Date(),
      },
    });

    return c.json({
      success: true,
      message: "message edited",
      data: updatedMessage,
    });
  } catch (err: unknown) {
    console.dir(err, { depth: null });

    return c.json(
      {
        success: false,
        message: "Server side error",
        error: err,
      },
      500,
    );
  }
};
