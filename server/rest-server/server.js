import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // your MySQL password if any
  database: "musical_chat",
});

db.connect((err) => {
  if (err) console.log("❌ MySQL Connection Error:", err);
  else console.log("✅ Connected to MySQL");
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Musical Chat Backend is running...");
});

// ✅ Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
