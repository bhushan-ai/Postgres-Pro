import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";

export const onlineUsers = new Map<string, string>();

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("Connection", (socket) => {
    console.log("Connected: ", socket.id);

    socket.on("Register", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log(`${userId} is online`);
    });

    io.on("Disconnected", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log("Disconnected: ", socket.id);
    });
  });
  return io;
};

export const getIo = () => io;
