const Chat = require("../models/chatModel");

const sendMessage = async (req, res) => {
  try {
    const { ticketId, sender, message } = req.body;
    const newMsg = new Chat({ ticketId, sender, message });
    await newMsg.save();
    res.status(201).json(newMsg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const messages = await Chat.find({ ticketId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
