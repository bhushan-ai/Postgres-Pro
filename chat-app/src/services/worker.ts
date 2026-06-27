import { Worker } from "bullmq";
import { connection } from "./queue";
import { prisma } from "../lib/prisma";
console.log("Conversation worker started...");

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
