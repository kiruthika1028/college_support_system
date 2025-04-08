const express = require("express");
const { createTicket, getTickets, updateTicketStatus, addChatMessage } = require("../controllers/ticketController");

const router = express.Router();

// Create a new ticket
router.post("/create", createTicket);

// Get all tickets
router.get("/all", getTickets);

// Update ticket status
router.patch("/update/:id", updateTicketStatus);

// Add chat message to a ticket
router.post("/chat/:id", addChatMessage);

module.exports = router;
