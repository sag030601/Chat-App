const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const msgRoutes = require("./routes/messagesRoutes");
const socket = require("socket.io");

const app = express();
require("dotenv").config();

// app.use("/", (req, res) => {
//   res.send("Hello, this is your backend server!");
// });

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", msgRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db connection successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});

// const io = socket(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
  transports: ["websocket", "polling"], // Make sure "websocket" is included
});

global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });

//   socket.on("send-msg", (data) => {
//     console.log(data.msg);
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-recieve", data.msg);
//     }
//   });
// });


io.on("connection", (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} added with socket ID: ${socket.id}`);
  });

  socket.on("send-msg", (data) => {
    console.log(`Received message from ${data.from} to ${data.to}: ${data.message}`);
    
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
      console.log(`Sent message to ${data.to}: ${data.message}`);
    } else {
      console.log(`User ${data.to} not found in onlineUsers map`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected with socket ID: ${socket.id}`);
    // Remove the user from the onlineUsers map on disconnect if needed
  });
});
