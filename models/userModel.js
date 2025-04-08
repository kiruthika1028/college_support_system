const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, unique: true },
  department: { type: String },
  year: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
});

module.exports = mongoose.model("User", userSchema);
