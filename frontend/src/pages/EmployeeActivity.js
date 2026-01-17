// EmployeeActivity.js (Frontend Component)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const KPIBox = ({ title, value }) => (
  <div className="bg-white shadow-md rounded-lg p-6 w-full text-center">
    <p className="text-gray-500 text-sm mb-2">{title}</p>
    <h2 className="text-2xl font-bold text-blue-700">{value}</h2>
  </div>
);

const getColor = (score) => {
  if (score >= 80) return '#34D399'; // Green
  if (score >= 50) return '#FBBF24'; // Yellow
  return '#F87171'; // Red
};

const EmployeeActivity = () => {
  const [kpis, setKpis] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);
  const [allRatings, setAllRatings] = useState([]);

  useEffect(() => {
    axios.get("https://workforce-backend-syjg.onrender.com/api/kpi/metrics")
      .then(res => setKpis(res.data))
      .catch(err => console.error("Failed to load KPI data:", err));

    axios.get("https://workforce-backend-syjg.onrender.com/api/kpi/performance")
      .then(res => {
        setTopPerformers(res.data.top5);
        setAllRatings(res.data.all);
      })
      .catch(err => console.error("Failed to load performance data:", err));
  }, []);

  if (!kpis) return <p className="p-6">Loading KPI Metrics...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <span role="img" aria-label="chart" className="mr-2">👥</span>Employee Activity Metrics
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <KPIBox title="Total Employees" value={kpis.totalEmployees} />
        <KPIBox title="Active Employees" value={kpis.activeEmployees} />
        <KPIBox title="Inactive Employees" value={kpis.inactiveEmployees} />
        <KPIBox title="Office Employees" value={kpis.officeEmployees} />
        <KPIBox title="Work From Home" value={kpis.workFromHome} />
        <KPIBox title="Daily Login Rate" value={kpis.dailyLoginRate} />
        <KPIBox title="Avg. Active Time" value={kpis.avgActiveTime} />
      </div>

      {/* 📊 Top 5 Performers Chart */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">📊 Top 5 Performers by Activity Efficiency</h2>
        <ResponsiveContainer width="100%" height={300}>
  <BarChart layout="vertical" data={topPerformers} margin={{ left: 50 }}>
    <XAxis type="number" domain={[0, 100]} />
    <YAxis dataKey="name" type="category" />
    <Tooltip formatter={(value) => [`KPI Score: ${value}`]} />
    <Bar dataKey="kpiScore">
      {topPerformers.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={getColor(entry.kpiScore)} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>

      </div>

      {/* 📉 Employee Ratings Table */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">📉 Employee Performance Ratings</h2>
        <div className="overflow-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto text-sm text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Employee ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Active Time</th>
                <th className="px-4 py-2">Task Score</th>
                <th className="px-4 py-2">KPI Rating</th>
              </tr>
            </thead>
            <tbody>
              {allRatings.map((emp, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{emp.employeeId}</td>
                  <td className="px-4 py-2">{emp.name}</td>
                  <td className="px-4 py-2">{(emp.activeTime / 3600).toFixed(1)}h</td>
                  <td className="px-4 py-2">{emp.taskScore}%</td>
                  <td className="px-4 py-2">
                    {emp.kpiScore >= 80 ? '⭐⭐⭐⭐⭐' : emp.kpiScore >= 50 ? '⭐⭐⭐' : '🔴 Poor'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeActivity;
