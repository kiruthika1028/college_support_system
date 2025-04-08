const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  ticketId: { type: String, required: true }, // ✅ Changed to String
  sender: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
