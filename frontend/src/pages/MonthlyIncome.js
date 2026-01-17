import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", income2024: 11000, income2025: 12000 },
  { month: "Feb", income2024: 12500, income2025: 14500 },
  { month: "Mar", income2024: 9500, income2025: 10000 },
  { month: "Apr", income2024: 14000, income2025: 15500 },
  { month: "May", income2024: 12000, income2025: 13000 },
  { month: "Jun", income2024: 15000, income2025: 16500 },
  { month: "Jul", income2024: 13500 },
  { month: "Aug", income2024: 14200 },
  { month: "Sep", income2024: 12800 },
  { month: "Oct", income2024: 15000 },
  { month: "Nov", income2024: 15800 },
  { month: "Dec", income2024: 16200 },
];

const MonthlyIncome = () => {
  return (
    <div className="p-6 text-white">
      {/* Heading with emoji */}
      <h1 className="text-3xl font-bold mb-2 text-center text-black">
        📊 Monthly Income
      </h1>
      <p className="text-center text-gray-400 mb-6">
        Overview of Monthly Income Comparison: 2024 vs 2025
      </p>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            {/* 2024 Income in blue */}
            <Bar dataKey="income2024" fill="#3B82F6" name="2024 Income" />
            {/* 2025 Income in green */}
            <Bar dataKey="income2025" fill="#22C55E" name="2025 Income" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyIncome;
