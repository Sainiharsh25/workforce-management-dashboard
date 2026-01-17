import express from "express";
import Employee from "../models/Employee.js";
import { io } from "../server.js"; // ✅ Import Socket.IO instance


const router = express.Router();

// Function to calculate rating
const calculateRatings = (employees) => {
  return employees.map(emp => {
    const completed = emp.performance?.completedTasks ?? 0;
    const total = emp.performance?.totalTasks ?? 1; // avoid division by 0
    const completionPercentage = (completed / total) * 100;

    let rating;
    if (completionPercentage >= 80) {
      rating = 5;
    } else if (completionPercentage >= 50) {
      rating = 3;
    } else {
      rating = 1;
    }

    // Calculate monthly trends
    const monthlyCompletion = emp.performance?.monthlyCompletion || {};
    const months = Object.keys(monthlyCompletion).sort();
    const lastMonth = months[months.length - 2];
    const thisMonth = months[months.length - 1];
    const taskCompletionLastMonth = monthlyCompletion[lastMonth] || 0;
    const taskCompletionThisMonth = monthlyCompletion[thisMonth] || 0;

    return {
      ...emp.toObject(),
      performanceRating: rating,
      completionPercentage: completionPercentage.toFixed(1),
      taskCompletionLastMonth,
      taskCompletionThisMonth,
    };
  });
};


// Route: GET /api/performance/overview
router.get("/overview", async (req, res) => {
  try {
    const employees = await Employee.find();

    if (!employees || employees.length === 0) {
      const emptyData = {
        totalEmployees: 0,
        averageRating: "0.00",
        topPerformer: null,
        top5Performers: [],
        allEmployees: []
      };
      io.emit("updatePerformance", emptyData); // 📤 Real-time emit
      return res.json(emptyData);
    }

    const ratedEmployees = calculateRatings(employees);

    const totalRating = ratedEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0);
    const avgRating = (totalRating / ratedEmployees.length).toFixed(2);

    const sorted = [...ratedEmployees].sort((a, b) => b.performanceRating - a.performanceRating);

    const data = {
      totalEmployees: ratedEmployees.length,
      averageRating: avgRating,
      topPerformer: sorted[0],
      top5Performers: sorted.slice(0, 5),
      allEmployees: ratedEmployees
    };

    io.emit("updatePerformance", data); // 📤 Broadcast to all clients

    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching performance:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Route: GET /api/performance/top5
router.get("/top5", async (req, res) => {
  try {
    const employees = await Employee.find();
    if (!employees || employees.length === 0) {
      io.emit("updateTopPerformers", []); // 📤 Send empty update
      return res.json([]);
    }

    const ratedEmployees = calculateRatings(employees);
    const sorted = ratedEmployees.sort((a, b) => b.performanceRating - a.performanceRating);

    const top5 = sorted.slice(0, 5).map(emp => ({
      name: emp.firstName,
      rating: emp.performanceRating
    }));

    io.emit("updateTopPerformers", top5); // 📤 Emit real-time top5 data

    res.json(top5);
  } catch (err) {
    console.error("❌ Error fetching top 5 performers:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
