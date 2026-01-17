import express from "express";

const router = express.Router();

// Example Task API Route
router.get("/", (req, res) => {
  res.json({ message: "Task API is working" });
});

export default router;
