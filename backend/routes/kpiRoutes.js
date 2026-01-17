import express from 'express';
import Employee from '../models/Employee.js';

const router = express.Router();

// 📊 Route 1: Metrics Summary
router.get('/metrics', async (req, res) => {
  try {
    const employees = await Employee.find();
    const totalEmployees = employees.length;

    // Simulated values for demonstration
    const activeEmployees = 82;
    const inactiveEmployees = 38;

    const officeEmployees = employees.filter(e => e.location === "Office").length;
    const workFromHome = totalEmployees - officeEmployees;

    const avgActiveTime =
      (employees.reduce((sum, emp) => sum + (emp.activeTimeToday || 0), 0) / totalEmployees / 3600).toFixed(1) + " hours";

    const dailyLoginRate = `${Math.round((activeEmployees / totalEmployees) * 100)}%`;

    res.json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      officeEmployees,
      workFromHome,
      dailyLoginRate,
      avgActiveTime,
    });
  } catch (err) {
    console.error("KPI error:", err);
    res.status(500).json({ error: "Failed to load KPI data" });
  }
});

// 📈 Route 2: Performance Ratings & Top 5
router.get('/performance', async (req, res) => {
  try {
    const employees = await Employee.find();

    const maxActiveTime = Math.max(...employees.map(e => e.activeTimeToday || 0));

    const performanceData = employees.map(emp => {
      const taskEfficiency = emp.performance?.totalTasks
        ? emp.performance.completedTasks / emp.performance.totalTasks
        : 0;
      const activeRatio = (emp.activeTimeToday || 0) / (maxActiveTime || 1);
      const kpiScore = ((taskEfficiency + activeRatio) / 2) * 100;

      return {
        employeeId: emp._id,
        name: `${emp.firstName} ${emp.lastName}`,
        activeTime: emp.activeTimeToday || 0,
        taskScore: Math.round(taskEfficiency * 100),
        kpiScore: Math.round(kpiScore)
      };
    });

    const sorted = performanceData.sort((a, b) => b.kpiScore - a.kpiScore);
    const top5 = sorted.slice(0, 5);

    res.json({ top5, all: sorted });
  } catch (err) {
    console.error("KPI Performance Error:", err);
    res.status(500).json({ error: "Failed to load performance data" });
  }
});

export default router;
