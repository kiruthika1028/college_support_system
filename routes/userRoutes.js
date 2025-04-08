const express = require("express");
const { registerUser, loginUser, adminLogin } = require("../controllers/userController");

const router = express.Router();

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// Admin Login
router.post("/admin-login", adminLogin);

module.exports = router;
