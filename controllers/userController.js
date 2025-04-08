const bcrypt = require('bcryptjs'); // bcryptjs is already correctly used here
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  const { name, rollNumber, department, year, password } = req.body;

  if (!name || !rollNumber || !department || !year || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ rollNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      rollNumber,
      department,
      year,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser._id,
        name: newUser.name,
        rollNumber: newUser.rollNumber,
        department: newUser.department,
        year: newUser.year,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { rollNumber, password } = req.body;

  if (!rollNumber || !password) {
    return res.status(400).json({ message: "Roll number and password are required." });
  }

  try {
    const user = await User.findOne({ rollNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretKey",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        rollNumber: user.rollNumber,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const adminLogin = async (req, res) => {
  const { id, password } = req.body;

  if (id === "admin123" && password === "admin123") {
    const token = jwt.sign({ role: "admin" }, "secretKey", { expiresIn: "1h" });
    return res.status(200).json({ message: "Admin login successful.", token });
  }

  res.status(401).json({ message: "Invalid admin credentials." });
};

module.exports = { registerUser, loginUser, adminLogin };
