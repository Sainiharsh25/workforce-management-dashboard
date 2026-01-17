import React from "react";

const DashboardCards = () => {
  const stats = [
    { title: "Total Employees", value: "120", bgColor: "bg-blue-500" },
    { title: "Active Tasks", value: "45", bgColor: "bg-green-500" },
    { title: "Revenue", value: "$1.2M", bgColor: "bg-yellow-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-6 rounded-lg shadow-md text-white ${stat.bgColor}`}
        >
          <h3 className="text-lg font-semibold">{stat.title}</h3>
          <p className="text-3xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
