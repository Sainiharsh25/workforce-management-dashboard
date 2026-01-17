import React from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Charts = () => {
  // Sample Data
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [120, 190, 300, 500, 200, 350],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Active Employees",
        data: [50, 65, 80, 100],
        borderColor: "rgb(75, 192, 192)",
        fill: false,
      },
    ],
  };

  const doughnutData = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-white text-lg mb-2">Sales Data</h2>
        <Bar data={barData} />
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-white text-lg mb-2">Employee Activity</h2>
        <Line data={lineData} />
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-white text-lg mb-2">Task Distribution</h2>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
};

export default Charts;
