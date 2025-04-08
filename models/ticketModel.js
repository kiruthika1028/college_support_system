const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true, match: /^[0-9]{2}[A-Z]{2}[0-9]{3}$/ }, // Pattern for roll number like 23CB024
  department: { type: String, required: true },
  year: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
  date: { type: Date, default: Date.now },
  ticketId: { type: String, unique: true }, // Unique ticket ID
  chatMessages: [ // Chat messages array
    {
      message: { type: String, required: true },
      sender: { type: String, required: true },
      date: { type: Date, default: Date.now },
    }
  ]
});

ticketSchema.pre("save", function (next) {
  // Generate a unique ticket ID if not already set
  if (!this.ticketId) {
    this.ticketId = `TICKET-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model("Ticket", ticketSchema);
