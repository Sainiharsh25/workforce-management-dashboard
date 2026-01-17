import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client"; // 👈 Add this

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

// Export CSV helper
function exportToCSV(data, filename = "financial_data.csv") {
  const csvRows = [["Month", "Earnings"], ...data.map(row => [row.month, row.earnings])];
  const csvContent = csvRows.map(e => e.join(",")).join("\n");
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
  const [topPerformers, setTopPerformers] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [earningData, setEarningData] = useState([]);
  const [dailyPerformanceData, setDailyPerformanceData] = useState([]);

  useEffect(() => {
    // Initial fetch from REST API
    axios.get("https://workforce-backend-syjg.onrender.com/api/performance/top5")
      .then(res => setTopPerformers(res.data))
      .catch(err => console.error("Failed to fetch top performers:", err));

    axios.get("https://workforce-backend-syjg.onrender.com/api/dashboard/task-data")
      .then(res => setTaskData(res.data))
      .catch(err => console.error("Failed to fetch task data:", err));

    axios.get("https://workforce-backend-syjg.onrender.com/api/dashboard/earnings")
      .then(res => setEarningData(res.data))
      .catch(err => console.error("Failed to fetch earnings:", err));

    axios.get("https://workforce-backend-syjg.onrender.com/api/dashboard/performance-weekly")
      .then(res => setDailyPerformanceData(res.data))
      .catch(err => console.error("Failed to fetch performance data:", err));

    // Connect to WebSocket server
    const socket = io("https://workforce-backend-syjg.onrender.com"); // 👈 Adjust if your server runs on another port

    // Listen for updates
    socket.on("updateTaskData", newTaskData => setTaskData(newTaskData));
    socket.on("updateEarnings", newEarnings => setEarningData(newEarnings));
    socket.on("updatePerformance", newPerformance => setDailyPerformanceData(newPerformance));
    socket.on("updateTopPerformers", newTop => setTopPerformers(newTop));

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  const closeModal = () => setSelectedCard(null);

  return (
   <div className="flex min-h-screen bg-gray-100">
         {/* Sidebar */}
         <aside className="w-64 bg-white shadow-lg p-4 space-y-6">
           <div className="text-2xl font-bold text-gray-800">Dashboard</div>
           <nav className="flex flex-col space-y-4">
             <NavLink to="/" className="text-gray-700 hover:text-blue-600">Home</NavLink>
             <NavLink to="/tasks" className="text-gray-700 hover:text-blue-600">Daily Task</NavLink>
             <NavLink to="/employees" className="text-gray-700 hover:text-blue-600">Team Members</NavLink>
             <NavLink to="/performance" className="text-gray-700 hover:text-blue-600">Performance Overview</NavLink>
             <NavLink to="/monthly-income" className="text-gray-700 hover:text-blue-600">Monthly Income</NavLink>
             <NavLink to="/salaries" className="text-gray-700 hover:text-blue-600">Salaries</NavLink>
             <NavLink to="/settings" className="text-gray-700 hover:text-blue-600">Settings</NavLink>
           </nav>
         </aside>
   
         {/* Main Content */}
         <main className="flex-1 p-6">
           {/* Top Cards */}
           <div className="grid grid-cols-3 gap-6 mb-6">
             <div className="bg-white p-4 rounded-xl shadow-md cursor-pointer" onClick={() => setSelectedCard("progress")}>
               <p className="text-gray-500">Task Progress</p>
               <h2 className="text-2xl font-bold text-green-600">212</h2>
               <div className="mt-2 h-2 bg-green-300 rounded-full"></div>
             </div>
             <div className="bg-white p-4 rounded-xl shadow-md cursor-pointer" onClick={() => setSelectedCard("completed")}>
               <p className="text-gray-500">Task Completed</p>
               <h2 className="text-2xl font-bold text-purple-600">301</h2>
               <div className="mt-2 h-2 bg-purple-300 rounded-full"></div>
             </div>
             <div className="bg-white p-4 rounded-xl shadow-md cursor-pointer" onClick={() => setSelectedCard("summary")}>
               <p className="text-gray-500">Monthly Task Summary</p>
               <h2 className="text-2xl font-bold text-yellow-600">1294</h2>
               <div className="mt-2 h-2 bg-yellow-300 rounded-full"></div>
             </div>
           </div>
   
           {/* Task Chart */}
           <div className="bg-white p-4 rounded-xl shadow-md mb-6">
             <h3 className="text-lg font-semibold text-gray-700 mb-4">Task Created vs Task Completed</h3>
             <ResponsiveContainer width="100%" height={300}>
               <LineChart data={taskData}>
                 <XAxis dataKey="month" />
                 <YAxis />
                 <Tooltip />
                 <Legend />
                 <Line type="monotone" dataKey="created" stroke="#8884d8" name="Task Created" />
                 <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Task Completed" />
               </LineChart>
             </ResponsiveContainer>
           </div>
   
           {/* Performance + Financial */}
           <div className="grid grid-cols-2 gap-6">
             <div className="bg-white p-4 rounded-xl shadow-md">
               <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Team Performance This Week</h3>
               <div className="text-center">
                 <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 flex items-center justify-center text-white font-bold text-xl">
                   78%
                 </div>
                 <p className="mt-4">Your Team Performance is 5% better than last week</p>
                 <button className="mt-2 px-4 py-1 bg-green-600 text-white rounded" onClick={() => setSelectedCard("performance")}>
                   View Details
                 </button>
               </div>
             </div>
   
             <div className="bg-white p-4 rounded-xl shadow-md">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-700">Financial Chart</h3>
                 <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => exportToCSV(earningData)}>
                   Export CSV
                 </button>
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
   
           {/* Top 5 Performers */}
           <div className="bg-white p-4 rounded-xl shadow-md mt-6">
             <h3 className="text-lg font-semibold text-gray-700 mb-4">🌟 Top 5 Performers</h3>
             <ResponsiveContainer width="100%" height={300}>
               <BarChart layout="vertical" data={topPerformers}>
                 <XAxis type="number" domain={[0, 5]} />
                 <YAxis type="category" dataKey="name" />
                 <Tooltip />
                 <Legend />
                 <Bar dataKey="rating" fill="#34d399" name="Rating" />
               </BarChart>
             </ResponsiveContainer>
           </div>
   
           {/* Modal Section */}
           {selectedCard && (
             <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
               <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                 <div className="flex justify-between items-center mb-4">
                   <h2 className="text-xl font-semibold">
                     {selectedCard === "progress" && "Task Progress Overview"}
                     {selectedCard === "completed" && "Completed Task Trends"}
                     {selectedCard === "summary" && "Monthly Task Summary Chart"}
                     {selectedCard === "performance" && "Team Performance Breakdown"}
                   </h2>
                   <button className="text-red-500" onClick={closeModal}>✖</button>
                 </div>
   
                 <ResponsiveContainer width="100%" height={300}>
                   {selectedCard === "performance" ? (
                     <LineChart data={dailyPerformanceData}>
                       <XAxis dataKey="day" />
                       <YAxis domain={[60, 100]} />
                       <Tooltip />
                       <Legend />
                       <Line type="monotone" dataKey="lastWeek" stroke="#f97316" strokeWidth={2} name="Last Week" />
                       <Line type="monotone" dataKey="thisWeek" stroke="#10b981" strokeWidth={2} name="This Week" />
                     </LineChart>
                   ) : (
                     <BarChart data={taskData}>
                       <XAxis dataKey="month" />
                       <YAxis />
                       <Tooltip />
                       <Legend />
                       {selectedCard === "progress" && <Bar dataKey="created" fill="#34d399" name="Tasks Created" />}
                       {selectedCard === "completed" && <Bar dataKey="completed" fill="#a78bfa" name="Tasks Completed" />}
                       {selectedCard === "summary" && (
                         <>
                           <Bar dataKey="created" fill="#facc15" name="Created" />
                           <Bar dataKey="completed" fill="#4ade80" name="Completed" />
                         </>
                       )}
                     </BarChart>
                   )}
                 </ResponsiveContainer>
   
                 <div className="mt-4 text-right">
                   <button className="px-4 py-1 bg-blue-600 text-white rounded" onClick={closeModal}>
                     Close
                   </button>
                 </div>
               </div>
             </div>
           )}
         </main>
       </div>
  );
}
