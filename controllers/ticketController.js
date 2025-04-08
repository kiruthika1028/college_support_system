const Ticket = require("../models/ticketModel");

// Create a new ticket
const createTicket = async (req, res) => {
  const { studentName, rollNumber, department, year, category, description } = req.body;

  try {
    const newTicket = await Ticket.create({ studentName, rollNumber, department, year, category, description, status: "Pending" });
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tickets
const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update ticket status
const updateTicketStatus = async (req, res) => {
  const { id } = req.params;   // Get the ticket ID from the URL
  const { status } = req.body; // Get the new status from the request body

  try {
    const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket status updated successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add chat message to a ticket
const addChatMessage = async (req, res) => {
  const { id } = req.params;   // Get the ticket ID from the URL
  const { message, sender } = req.body;  // Get the message and sender from the request body

  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Add the new message to the ticket's chat history (assuming a `chatMessages` field exists)
    ticket.chatMessages = ticket.chatMessages || [];
    ticket.chatMessages.push({ message, sender, date: new Date() });

    await ticket.save();

    res.status(200).json({ message: "Chat message added", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTicket, getTickets, updateTicketStatus, addChatMessage };
