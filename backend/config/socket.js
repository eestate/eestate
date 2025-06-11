

// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"], // Your frontend URL
//     methods: ["GET", "POST"],
//     credentials: true, // Allow cookies
//   },
// });

// const userSocketMap = {}; // { userId: socketId }

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId && userId !== "null" && userId !== "undefined") {
//     userSocketMap[userId] = socket.id;
//     io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Broadcast online users
//   } else {
//     console.warn("Invalid userId received:", userId);
//   }

//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);
//     if (userId) {
//       delete userSocketMap[userId];
//       io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     }
//   });
// });

// export { io, app, server };

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== "null" && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.warn("Invalid userId received:", userId);
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export function initializeSocket(httpServer) {
  io.attach(httpServer);
}

export { io, app, server };