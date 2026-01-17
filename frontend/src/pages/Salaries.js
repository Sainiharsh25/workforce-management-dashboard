import React, { useEffect, useState } from "react";
import axios from "axios";

const Salaries = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  const formatRupees = (amount) => {
    return Number(amount).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 1,
    });
  };

  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    return (
      emp.firstName.toLowerCase().includes(query) ||
      emp.lastName.toLowerCase().includes(query) ||
      emp.job.toLowerCase().includes(query) ||
      emp.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-gray-800 shadow-md">
        {/* Search Bar */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search by name, job, or status"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Table Header */}
        <table className="w-full table-fixed">
          <thead>
            <tr className="text-left text-gray-300 bg-gray-800">
              <th className="px-4 py-2 w-[5%]">#</th>
              <th className="px-4 py-2 w-[20%]">Name</th>
              <th className="px-4 py-2 w-[25%]">Job</th>
              <th className="px-4 py-2 w-[10%]">Age</th>
              <th className="px-4 py-2 w-[20%]">Salary (₹)</th>
              <th className="px-4 py-2 w-[20%]">Status</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable Table Body */}
      <div className="flex-1 overflow-auto">
        <table className="w-full table-fixed">
          <tbody>
            {filteredEmployees.map((emp, index) => (
              <tr
                key={emp._id}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="px-4 py-3 w-[5%]">{index + 1}</td>
                <td className="px-4 py-3 w-[20%]">
                  {emp.firstName} {emp.lastName}
                </td>
                <td className="px-4 py-3 w-[25%]">{emp.job}</td>
                <td className="px-4 py-3 w-[10%]">{emp.age}</td>
                <td className="px-4 py-3 w-[20%] text-green-400 font-medium">
                  {formatRupees(emp.salary)}
                </td>
                <td
                  className={`px-4 py-3 font-semibold w-[20%] ${
                    emp.status === "Present"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {emp.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Salaries;
