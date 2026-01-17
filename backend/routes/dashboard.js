import express from "express";

const router = express.Router();

// Sample dashboard data (Replace with actual database logic)
router.get("/", (req, res) => {
    const dashboardData = {
        clientProgress: 75,
        manpowerStatus: 120,
        attendance: 85,
        overallProgress: 60,
        sprintSchedule: "Sprint 5",
        deadlines: 10 // Days remaining
    };
    res.json(dashboardData);
});

export default router;
