import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

// Example GET route
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
