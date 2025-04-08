require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const chatRoutes = require("./routes/chatRoutes"); // ✅ Chat routes

const app = express();
const server = http.createServer(app);

// CORS Setup
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/chat", chatRoutes); // ✅ Chat route integrated

// Initialize Socket.IO
const io = socketIo(server, {
  cors: corsOptions,
});

// Socket.IO Events
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // Join chat room (identified by ticketId)
  socket.on("joinRoom", (ticketId) => {
    socket.join(ticketId);
    console.log(`👥 Client joined room: ${ticketId}`);
  });

  // Handle incoming chat messages
  socket.on("chatMessage", (data) => {
    console.log(`💬 Message for ticket ${data.ticketId}: ${data.message}`);
    io.to(data.ticketId).emit("chatMessage", data); // Emit only to that room
  });

  // Handle ticket status updates
  socket.on("ticketUpdate", (updatedTicket) => {
    console.log(`📝 Ticket status updated:`, updatedTicket);
    io.emit("ticketUpdate", updatedTicket);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
