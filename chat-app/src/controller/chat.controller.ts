import { Context } from "hono";
import { prisma } from "../lib/prisma";
import { conversationQueue } from "../services/queue";
import Redis from "ioredis";
import { getIo } from "../socket/socket";
import { s3Client } from "../services/aws/s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const publisher = new Redis(process.env.REDIS_URL!);

//upload File old feature 
// export const upload = async (c: Context) => {
//   try {
//     const body = await c.req.parseBody();
//     const file = body["file"];

//     if (!(file instanceof File)) {
//       return c.text("File is required", 400);
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());

//     const key = `${Date.now()}-${file.name}`;

//     await s3Client.send(
//       new PutObjectCommand({
//         Bucket: process.env.AWS_BUCKET_NAME!,
//         Key: key,
//         Body: buffer,
//         ContentType: file.type,
//       }),
//     );

//     const command = new GetObjectCommand({
//       Bucket: process.env.AWS_BUCKET_NAME!,
//       Key: key,
//     });

//     const url = await getSignedUrl(s3Client, command, {
//       expiresIn: 3600,
//     });

//     return c.json(
//       {
//         success: true,
//         message: "File Uploaded",
//         url: url,
//         fileName: file.name,
//         fileType: file.type,
//       },
//       200,
//     );
//   } catch (error: unknown) {
//     const err = error as Error;
//     console.log(`Something went wrong while uploading the file`, err);

//     return c.json(
//       {
//         success: false,
//         message: "Server side error",
//         error: err,
//       },
//       500,
//     );
//   }
// };

//get url
export const getUrl = async (c: Context) => {
  try {
    const { fileName, contentType } = await c.req.json();

    if (!fileName || !contentType) {
      return c.json(
        {
          success: false,
          message: "fileName and contentType are required",
        },
        400,
      );
    }
    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return c.json(
      {
        success: true,
        message: "Pre-signed upload URL generated",
        uploadUrl: url,
        key,
      },
      200,
    );

  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while uploading the file`, err);

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

//search messages
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

//send message in group
export const sendGroupMessage = async (c: Context) => {
  try {
    const conversationId = c.req.param("conversationId");
    const { content, fileUrl, fileType } = await c.req.json();

    const sender = c.get("user") as {
      id: string;
    };

    if (!conversationId) {
      return c.json(
        {
          success: false,
          message: "Conversation id required",
        },
        400,
      );
    }
    if (!content?.trim() && !fileUrl) {
      return c.json(
        {
          success: false,
          message: "Message content or file is required",
        },
        400,
      );
    }

    const checkConversation = await prisma.conversation.findFirst({
      where: {
        isGroup: true,
        id: conversationId,
      },
    });

    if (!checkConversation) {
      return c.json(
        {
          success: false,
          message: "Conversation not exist",
        },
        404,
      );
    }

    //check participants
    const isMember = await prisma.participant.findFirst({
      where: {
        conversationId,
        userId: sender.id,
      },
    });

    if (!isMember) {
      return c.json(
        {
          success: false,
          message: "You are not a member of this group",
        },
        404,
      );
    }

    // Enqueue message so the worker can persist it asynchronously
    const job = await conversationQueue.add(
      "new-message",
      {
        content,
        conversationId: conversationId,
        senderId: sender.id,
        fileUrl: fileUrl,
        fileType: fileType,
      },
      {
        removeOnComplete: true,
      },
    );

    const io = getIo();

    if (io) {
      io.to(`group:${conversationId}`).emit("new-message", {
        content,
        conversationId,
        senderId: sender.id,
        fileUrl,
        fileType,
      });
    }

    return c.json({
      success: true,
      message: "message sent",
      data: job.id,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while sending message to group`, err);

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
    const { content, targetedUserId, fileType, fileUrl } = await c.req.json();

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

    // Enqueue message so the worker can persist it asynchronously
    const job = await conversationQueue.add(
      "new-message",
      {
        content,
        conversationId: activeConversation.id,
        senderId: sender.id,
        fileType: fileType,
        fileUrl: fileUrl,
      },
      {
        removeOnComplete: true,
      },
    );

    console.log("Job added:", job.id);

    // Publish chat event to Redis channel so subscribers can deliver it in real time
    await publisher.publish(
      "chat",
      JSON.stringify({
        senderId: sender.id,
        content,
        conversationId: activeConversation.id,
        targetedUserId: targetedUser.id,
      }),
    );

    return c.json({
      success: true,
      message: "message stored",
      data: job.id,
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
        content,
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

// export const deleteAllMessage = async (c: Context) => {
//   try {
//     await prisma.message.deleteMany({});

//     return c.json({
//       success: true,
//       message: "all message deleted",
//     });
//   } catch (error: unknown) {
//     const err = error as Error;
//     console.log(`Something went wrong while deleting the message`, err);

//     return c.json(
//       {
//         success: false,
//         message: "Server side error",
//         error: err,
//       },
//       500,
//     );
//   }
// };
