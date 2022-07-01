const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000/",
    method: ["GET", "POST"],
  },
});
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const Message = require("./models/Message");
const morgan = require("morgan");

mongoose.connect(process.env.MONGO_URL, () => {
  console.log("Connected to DB!");
});

app.use(morgan("common"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get("/api", (req, res) => {
//   res.send("<h1>Hello everyone</h1>");
// });

app.get("/api/messages", async (req, res, next) => {
  try {
    const msgList = await Message.find();
    return res.status(200).json(msgList);
  } catch (error) {
    next(error);
  }
});

app.post("/api/add-message", async (req, res, next) => {
  try {
    const newMessage = new Message({
      content: req.body.content,
      sender: req.body.sender,
    });
    await newMessage.save();
    return res
      .status(200)
      .json({ content: req.body.content, sender: req.body.sender });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/delete", async (req, res, next) => {
  try {
    await Message.deleteMany();
    return res.status(200).json({ message: "Deleted!" });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  return res.send(`<h1>Error: ${err.message}</h1>`);
});

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);
  socket.on("send message", (data) => {
    socket.broadcast.emit("receive message", data);
  });
  socket.on("delete all messages", () => {
    socket.emit("delete all messages client");
  });
});

server.listen(3001, () => {
  console.log("Server at port 3001!");
});
