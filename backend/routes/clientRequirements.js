import express from "express";

const router = express.Router();

// Dummy data for client requirements
let clientRequirements = [
    { id: 1, client: "ABC Corp", progress: "In Progress", deadline: "2025-03-15" },
    { id: 2, client: "XYZ Ltd", progress: "Completed", deadline: "2025-03-10" },
];

// Get all client requirements
router.get("/", (req, res) => {
    res.json({ success: true, data: clientRequirements });
});

// Add a new client requirement
router.post("/", (req, res) => {
    const { client, progress, deadline } = req.body;
    const newRequirement = { id: clientRequirements.length + 1, client, progress, deadline };
    clientRequirements.push(newRequirement);
    res.json({ success: true, message: "Client requirement added", data: newRequirement });
});

export default router;
