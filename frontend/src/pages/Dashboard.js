import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LiveStatusFeed from "../components/LiveStatusFeed";

// CSV Export helper
function exportToCSV(data, filename = "financial_data.csv") {
  const csvRows = [["Month", "Earnings"], ...data.map((row) => [row.month, row.earnings])];
  const csvContent = csvRows.map((e) => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Dashboard() {
  const [selectedCard, setSelectedCard] = useState(null);
  // const [topPerformers, setTopPerformers] = useState([]);
  const [employeeActivity, setEmployeeActivity] = useState([]);
  const [activityData, setActivityData] = useState([]);

  const taskData = [
    { month: "Jan", created: 3000, completed: 2500 },
    { month: "Feb", created: 2000, completed: 1800 },
    { month: "Mar", created: 5000, completed: 3200 },
    { month: "Apr", created: 4000, completed: 3900 },
    { month: "May", created: 7000, completed: 6800 },
    { month: "Jun", created: 9000, completed: 8200 },
  ];

  const earningData = [
    { month: "Jan", earnings: 4000 },
    { month: "Feb", earnings: 2000 },
    { month: "Mar", earnings: 3500 },
    { month: "Apr", earnings: 5000 },
    { month: "May", earnings: 6500 },
    { month: "Jun", earnings: 8000 },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/performance/top5")
      // .then((res) => setTopPerformers(res.data))
      .catch((err) => console.error("Failed to fetch top performers:", err));

    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("✅ Socket.IO connected");
    });

    socket.on("statusUpdate", (data) => {
      if (data.status === "Activity Update") {
        setActivityData((prev) => [
          ...prev.slice(-19),
          {
            time: new Date(data.timestamp).toLocaleTimeString(),
            activity: data.activity === "Active" ? 1 : 0,
          },
        ]);
      }

      setEmployeeActivity((prev) => {
        const existing = prev.find((u) => u.employeeId === data.employeeId);
        if (existing && existing.status !== data.status) {
          toast.info(`${data.employeeId} is now ${data.status}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
        const updated = prev.filter((u) => u.employeeId !== data.employeeId);
        return [data, ...updated].slice(0, 20);
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket.IO disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg p-4 space-y-6 sticky top-0 h-screen">
        <div className="text-2xl font-bold text-gray-800">Dashboard</div>
        <nav className="flex flex-col space-y-4">
          {[
            { to: "/", label: "Home" },
            { to: "/tasks", label: "Daily Task" },
            { to: "/employees", label: "Team Members" },
            { to: "/performance", label: "Performance Overview" },
            { to: "/employee-activity", label: "Employee Status" },
            { to: "/monthly-income", label: "Monthly Income" },
            { to: "/salaries", label: "Salaries" },
            { to: "/settings", label: "Settings" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 ${isActive ? "font-bold text-blue-700" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card title="Task Progress" value="212" color="green" onClick={() => setSelectedCard("progress")} />
          <Card title="Task Completed" value="301" color="purple" onClick={() => setSelectedCard("completed")} />
          <Card title="Monthly Task Summary" value="1294" color="yellow" onClick={() => setSelectedCard("summary")} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Task Created vs Completed</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={taskData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="created" stroke="#8884d8" name="Created" />
              <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Employee Activity</h3>
          <ul className="space-y-3">
            {employeeActivity.length === 0 && <p className="text-gray-400">Waiting for activity...</p>}
            {employeeActivity.map((activity, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-semibold">{activity.employeeId || activity.name}</span>
                <span className={`px-3 py-1 rounded-full text-white ${activity.status === "Active" || activity.status === "active" ? "bg-green-500" : "bg-red-500"}`}>
                  {activity.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Team Performance This Week</h3>
            <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 flex items-center justify-center text-white font-bold text-xl">
              78%
            </div>
            <p className="mt-4">10% better than last week</p>
            <button className="mt-2 px-4 py-1 bg-green-600 text-white rounded" onClick={() => setSelectedCard("performance")}>View Details</button>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Financial Chart</h3>
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => exportToCSV(earningData)}>Export CSV</button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={earningData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="earnings" fill="#8884d8" name="Earnings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🌟 Top 5 Performers</h3>
          <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { name: "Brian", completion: 95, efficiency: 88 },
                        { name: "Regina.W", completion: 90, efficiency: 85 },
                        { name: "Christopher.G", completion: 98, efficiency: 92 },
                        { name: "Lauren", completion: 85, efficiency: 80 },
                        { name: "Tiffany.B", completion: 92, efficiency: 90 },
                      ]}
                    >
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} unit="%" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completion" fill="#ff6699" name="Task Completion Rate (%)" />
                      <Bar dataKey="efficiency" fill="#10b981" name="Efficiency Score (%)" />
                    </BarChart>
                  </ResponsiveContainer>
        </div>

        <LiveStatusFeed />

        {/* 🖱️ Live Mouse/Keyboard Activity Chart */}
        <div className="bg-white p-4 rounded-xl shadow-md mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🖱️ Live Mouse/Keyboard Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityData}>
              <XAxis dataKey="time" />
              <YAxis domain={[0, 1]} ticks={[0, 1]} tickFormatter={(v) => (v ? "Active" : "Idle")} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="activity" stroke="#6366f1" dot={false} name="Activity" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {selectedCard && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold capitalize">{selectedCard} Overview</h2>
                <button onClick={() => setSelectedCard(null)} className="text-red-500 text-xl font-bold">×</button>
              </div>
              <p>Detailed chart or information for "{selectedCard}" goes here...</p>
            </div>
          </div>
        )}

        <ToastContainer />
      </main>
    </div>
  );
}

function Card({ title, value, color, onClick }) {
  const bgColor = {
    green: "bg-green-300 text-green-600",
    purple: "bg-purple-300 text-purple-600",
    yellow: "bg-yellow-300 text-yellow-600",
  }[color];

  return (
    <div className="bg-white p-4 rounded-xl shadow-md cursor-pointer" onClick={onClick}>
      <p className="text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold ${bgColor.split(" ")[1]}`}>{value}</h2>
      <div className={`mt-2 h-2 rounded-full ${bgColor.split(" ")[0]}`}></div>
    </div>
  );
}
