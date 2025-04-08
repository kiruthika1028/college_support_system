const express = require("express");
const router = express.Router();
const { sendMessage, getMessages } = require("../controllers/chatController");

router.post("/", sendMessage);
router.get("/:ticketId", getMessages);

module.exports = router;
