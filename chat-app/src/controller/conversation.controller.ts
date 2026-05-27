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

    const convoCreate = await prisma.conversation.create({
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
        message: "Conversation Created",
        data: convoCreate,
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
