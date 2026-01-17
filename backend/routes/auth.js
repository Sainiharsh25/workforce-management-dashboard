import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();

/* -----------------------------------
   🔐 REGISTER: Create new user/admin
------------------------------------ */
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // ✅ Password is hashed
      role,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/* -------------------------------
   🔑 LOGIN: Authenticate user
-------------------------------- */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔹 Login request received:", { email, password: "****" });

  // Validate input fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    console.log("🔍 User found:", user ? user.email : "No user found");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check for JWT_SECRET in environment variables
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not defined");
      return res.status(500).json({ message: "Server Error: Missing JWT Secret" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ success: true, token });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

export default router;
