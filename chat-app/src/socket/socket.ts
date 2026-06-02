import { Server } from "socket.io";


const onlineUsers = new Map();
export let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  return io;
};

// io.on("connection", (socket) => {
//   console.log("Connected:", socket.id);

//   socket.on("register", (userId: string) => {
//     onlineUsers.set(userId, socket.id);
//   });

//   socket.on("disconnect", () => {
//     for (const [userId, socketId] of onlineUsers.entries()) {
//       if (socketId === socket.id) {
//         onlineUsers.delete(userId);
//       }
//     }
//   });
// });
