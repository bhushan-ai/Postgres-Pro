import { Queue } from "bullmq";

export const connection = {
  host: "localhost",
  port: 6379,
};

export const conversationQueue = new Queue("conversation", { connection });
export const notificationQueue = new Queue("notification", { connection });
