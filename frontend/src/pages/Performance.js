import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const Performance = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actionTaken, setActionTaken] = useState({});
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await axios.get("https://workforce-backend-syjg.onrender.com/api/performance/overview");
        const employeeData = empRes.data.allEmployees || [];

        const alertsGenerated = employeeData
          .filter(
            (emp) =>
              emp.taskCompletionLastMonth !== undefined &&
              emp.taskCompletionThisMonth !== undefined &&
              emp.taskCompletionThisMonth < emp.taskCompletionLastMonth * 0.7
          )
          .map((emp) => `${emp.name} - Drop in performance: ${emp.taskCompletionThisMonth} vs ${emp.taskCompletionLastMonth}`);

        setAlerts(alertsGenerated);
        setEmployees(employeeData);
      } catch (err) {
        console.error("❌ Failed to fetch performance data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    if (filter === "good") return emp.performanceRating >= 4;
    if (filter === "average") return emp.performanceRating >= 2.5 && emp.performanceRating < 4;
    if (filter === "bad") return emp.performanceRating < 2.5;
    return true;
  });

  const avgRating =
    employees.length > 0
      ? (
          employees.reduce((acc, emp) => acc + (emp.performanceRating || 0), 0) /
          employees.length
        ).toFixed(2)
      : 0;

  const topPerformer =
    employees.length > 0
      ? employees.reduce((top, current) =>
          current.performanceRating > (top.performanceRating || 0) ? current : top
        , {})
      : null;

  const handleAction = (id, action) => {
    const confirmationMsg =
      action === "reassign"
        ? "Are you sure you want to Reassign Task?"
        : "Are you sure you want to mark as Under Performance?";

    if (window.confirm(confirmationMsg)) {
      setActionTaken((prev) => ({
        ...prev,
        [id]: action === "reassign" ? "Reassigned Task" : "Under Performance",
      }));
    }
  };

  const handleWithdraw = (id) => {
    const confirmWithdraw = window.confirm("Are you sure you want to withdraw the action?");
    if (confirmWithdraw) {
      setActionTaken((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">📊 Employee Performance Dashboard</h1>

      {/* AI-Generated Alerts */}
      {alerts.length > 0 && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <h2 className="font-bold mb-2">⚠️ Smart Alerts</h2>
          <ul className="list-disc pl-6">
            {alerts.map((alert, i) => (
              <li key={i}>{alert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-2xl shadow">
          <h2 className="font-semibold text-xl">Total Employees</h2>
          <p className="text-2xl mt-2">{employees.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-2xl shadow">
          <h2 className="font-semibold text-xl">Top Performer</h2>
          <p className="text-lg mt-2">
            {topPerformer?.firstName
              ? `${topPerformer.firstName} ${topPerformer.lastName}`
              : "N/A"}
          </p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-2xl shadow">
          <h2 className="font-semibold text-xl">Average Rating</h2>
          <p className="text-2xl mt-2">
            {avgRating} <span className="text-sm text-gray-600">/ 5</span>
          </p>
        </div>
      </div>

      {/* Productivity Bar Chart for Top 5 */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-2">📊 Task Completion & Efficiency (Top 5)</h2>
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} unit="%" />
            <Tooltip />
            <Legend />
            <Bar dataKey="completion" fill="#60a5fa" name="Task Completion Rate (%)" />
            <Bar dataKey="efficiency" fill="#10b981" name="Efficiency Score (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 flex justify-center flex-wrap gap-2">
        {["all", "good", "average", "bad"].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded transition ${
              filter === key
                ? key === "good"
                  ? "bg-green-500 text-white"
                  : key === "average"
                  ? "bg-yellow-500 text-white"
                  : key === "bad"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {key === "good" && "🌟 Good"}
            {key === "average" && "😐 Average"}
            {key === "bad" && "😞 Bad"}
            {key === "all" && "All"}
          </button>
        ))}
      </div>

      {/* Employee Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">🧑‍💼 Employee Ratings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : filteredEmployees.length === 0 ? (
          <p className="text-gray-500">No employees match the selected filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Job</th>
                  <th className="p-2 text-left">Completed Tasks</th>
                  <th className="p-2 text-left">Rating</th>
                  {filter === "bad" && <th className="p-2 text-left">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="border-b border-gray-200 dark:border-gray-600">
                    <td className="p-2">{emp.firstName} {emp.lastName}</td>
                    <td className="p-2">{emp.job}</td>
                    <td className="p-2">{emp?.performance?.completedTasks || 0}</td>
                    <td className="p-2 font-semibold">
                      {emp.performanceRating >= 4 ? (
                        <span className="text-green-600">{emp.performanceRating} 🌟 Good</span>
                      ) : emp.performanceRating >= 2.5 ? (
                        <span className="text-yellow-500">{emp.performanceRating} 😐 Average</span>
                      ) : (
                        <span className="text-red-500">{emp.performanceRating} 😞 Bad</span>
                      )}
                    </td>

                    {filter === "bad" && (
                      <td className="p-2">
                        {actionTaken[emp._id] ? (
                          <div className="flex flex-col gap-2 md:flex-row">
                            <span
                              className={`font-semibold px-3 py-1 rounded ${
                                actionTaken[emp._id] === "Reassigned Task"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {actionTaken[emp._id]}
                            </span>
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                              onClick={() => handleWithdraw(emp._id)}
                            >
                              Withdraw
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 md:flex-row">
                            <button
                              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                              onClick={() => handleAction(emp._id, "reassign")}
                            >
                              Reassign Task
                            </button>
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                              onClick={() => handleAction(emp._id, "underPerformance")}
                            >
                              UP
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;
