import { Context } from "hono";
import { prisma } from "../lib/prisma";

export const createConversation = async (c: Context) => {
  try {
    const currentUser = c.get("user") as {
      id: string;
    };
    const { targetedUserId } = await c.req.json();

    if (!currentUser) {
      return c.json({ success: false, message: "User not found" }, 404);
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          some: {
            userId: currentUser.id,
          },
        },
        AND: {
          participants: {
            some: {
              userId: targetedUserId,
            },
          },
        },
      },
    });

    if (conversation) {
      return c.json(
        {
          success: true,
          message: "Conversation already exists",
          data: conversation,
        },
        200,
      );
    }

    //create conversation

    const convoCreated = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            {
              userId: currentUser.id,
            },
            {
              userId: targetedUserId,
            },
          ],
        },
      },
      include: {
        participants: true,
      },
    });

    return c.json(
      {
        success: true,
        message: "Conversation Found",
        data: convoCreated,
      },
      201,
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while creating Conversation`, err);

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

export const getUserConversations = async (c: Context) => {
  try {
    const user = c.get("user") as {
      id: string;
    };
    if (!user) {
      return c.json(
        { success: false, message: "ConversationId not found" },
        404,
      );
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        Messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (conversations.length <= 0) {
      return c.json({ success: false, message: "No conversation yet" }, 404);
    }

    return c.json(
      {
        success: true,
        message: "Conversation Found",
        data: conversations,
      },
      200,
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while fetching all Conversation`, err);

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

export const getSingleConversation = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const user = c.get("user") as {
      id: string;
    };

    if (!id) {
      return c.json(
        { success: false, message: "ConversationId not found" },
        404,
      );
    }

    //get convo
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: id,
        participants: {
          some: {
            userId: user.id,
          },
        },
      },

      include: {
        participants: {
          include: {
            user: true,
          },
        },
        Messages: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!conversation) {
      return c.json(
        {
          success: true,
          message: "Conversation not found",
        },
        404,
      );
    }

    return c.json(
      {
        success: true,
        message: "Conversation Found",
        data: conversation,
      },
      200,
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while fetching one Conversation`, err);

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
