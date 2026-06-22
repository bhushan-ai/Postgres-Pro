import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { redis } from "../server";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected: ", socket.id);

    socket.on("Register", async (userId: string) => {
      await redis.set(`online:${userId}`, socket.id);
      await redis.set(`socket:${socket.id}`, userId);
      console.log(`${userId} is online`);
    });

    //Group room Join
    socket.on("join-group", async (conversationId: string) => {
      socket.join(`group:${conversationId}`);

      console.log(`${socket.id} joined group:${conversationId}`);
    });

    //disconnect
    socket.on("disconnect", async () => {
      const userId = await redis.get(`socket:${socket.id}`);
      if (userId) {
        await redis.del(`online:${userId}`);
        await redis.del(`socket:${socket.id}`);
      }

      console.log("Disconnected: ", socket.id);
    });
  });
  return io;
};

export const getIo = () => io;
