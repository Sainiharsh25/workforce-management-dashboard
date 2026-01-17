import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import employeeRoutes from "./routes/employee.js";
import taskRoutes from "./routes/task.js";
import performanceRoutes from "./routes/performance.js";
import statusRoutes from "./routes/statusRoutes.js";
import { getIpAddress } from './utils/ipUtils.js';
import kpiRoutes from './routes/kpiRoutes.js';




dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use('/api/kpi', kpiRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/sendStatus", statusRoutes);

// Basic test route
app.get("/", (req, res) => res.send("API Running"));

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO Server
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("✅ New Socket.IO connection:", socket.id);

    socket.on("loginStatus", (loginData) => {
        console.log("[LOGIN STATUS] Received:", loginData);

        const ip = getIpAddress(loginData.req); // If not needed, you can remove this
        const loginTime = new Date().toISOString();

        const statusData = {
            username: loginData.username,
            loginTime,
            ip,
            status: "Active",
            activity: "Mouse and keyboard active",
        };

        io.emit("loginStatus", statusData);
        console.log("[STATUS UPDATE] Login status sent:", statusData);
        
    });

    socket.on("taskUpdate", (data) => {
        console.log("📌 Task Updated:", data);
        io.emit("updateTaskData", data);
    });

    socket.on("attendanceChange", (data) => {
        console.log("📋 Attendance Changed:", data);
        io.emit("attendanceChange", data);
    });

    socket.on("performanceUpdate", (data) => {
        console.log("📈 Performance Updated:", data);
        io.emit("updatePerformance", data);
    });

    socket.on("earningsUpdate", (data) => {
        console.log("💰 Earnings Updated:", data);
        io.emit("updateEarnings", data);
    });

    socket.on("topPerformersUpdate", (data) => {
        console.log("🏆 Top Performers Updated:", data);
        io.emit("updateTopPerformers", data);
    });

    socket.on("statusUpdate", (data) => {
        console.log("[STATUS UPDATE] From tracker:", data);
        io.emit("statusUpdate", data);
    });

    socket.on("disconnect", () => {
        console.log("❌ Socket.IO Disconnected:", socket.id);
    });
});

export { io };

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));