import { Context } from "hono";
import { prisma } from "../lib/prisma";

const sendMessage = async (c: Context) => {
  try {
    const { content } = await c.req.json();
    const conversationId = c.req.param("conversationId");

    const sender = c.get("user") as {
      id: string;
    };

    if (!sender) {
      return c.json({ success: false, message: "sender not found" }, 404);
    }

    if (!content) {
      return c.json({ success: false, message: "content is required" }, 404);
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

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      return c.json({ success: false, message: "conversation not found" }, 404);
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.userId === sender.id,
    );

    if (!isParticipant) {
      return c.json(
        {
          success: false,
          message: "sender is not a participant in this conversation",
        },
        403,
      );
    }

    const message = await prisma.message.create({
      data: {
        content: content,
        conversationId: conversation.id,
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
const deleteMessage = async (c: Context) => {
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


