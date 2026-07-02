import { Worker } from "bullmq";
import { connection } from "./queue";
import { prisma } from "../lib/prisma";
console.log("Conversation worker started...");

// Create a worker for the conversation queue
const conversationWorker = new Worker(
  "conversation",
  async (job) => {
    //   console.log("Processing:", job.data);
    const { content, conversationId, senderId, fileUrl, fileType } = job.data;

    await prisma.message.create({
      data: {
        content,
        conversationId,
        senderId,
        fileUrl,
        fileType,
      },
    });
    console.log("Message saved:", job.id);
  },
  { connection },
);

conversationWorker.on("completed", (job) => {
  console.log(`Job with id:${job.id} has been completed`);
});

conversationWorker.on("failed", (job, err) => {
  console.log(`Job with id ${job?.id} has failed with error: ${err.message}`);
});

//notification worker
const notificationWorker = new Worker("notification", async (job) => {
  const { receiverId, message } = job.data;
  // Here you can implement the logic to send a notification to the receiver

  // For example, you can use a push notification service or send an email
  console.log(`Sending notification to user ${receiverId}: ${message}`);
});

notificationWorker.on("completed", (job) => {
  console.log(`Job with id:${job.id} has been completed`);
});

notificationWorker.on("failed", (job, err) => {
  console.log(`Job with id ${job?.id} has failed with error: ${err.message}`);
});
