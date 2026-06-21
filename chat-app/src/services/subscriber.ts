import { Redis } from "ioredis";
import { redis } from "../server";
import { getIo } from "../socket/socket";

const redisUrl = process.env.REDIS_URL as string;

export const subscriber = new Redis(redisUrl);

subscriber.subscribe("chat", (err, count) => {
  if (err) {
    console.error("Failed to subscribe: ", err);
  }
  console.log(
    `Subscribed successfully! This client is currently subscribed to ${count} channels.`,
  );
});

subscriber.on("message", async (channel, message) => {
  const data = JSON.parse(message);

  const io = getIo();

  const socketId = await redis.get(`online:${data.targetedUserId}`);

  if (socketId) {
    io.to(socketId).emit("new-message", data);
  }
});
