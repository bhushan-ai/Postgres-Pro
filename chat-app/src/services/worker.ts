import { Worker } from "bullmq";
import { connection } from "./queue";
import { prisma } from "../lib/prisma";

const conversationWorker = new Worker(
  "conversation",
  async (job) => {
    const { content, conversationId, senderId } = job.data;

    await prisma.message.create({
      data: {
        content,
        conversationId,
        senderId,
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
