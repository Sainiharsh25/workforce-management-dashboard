import React, { useState, useEffect } from "react";
import axios from "axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // 📡 Fetch data from MongoDB backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("https://workforce-backend-syjg.onrender.com/api/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="p-6 text-white relative">
      <h2 className="text-2xl font-bold mb-4">Employees List</h2>

      {/* 🔍 Search & Filter Bar */}
      <div className="sticky top-16 z-10 bg-gray-900 p-4 flex flex-wrap items-center justify-between shadow-md rounded-md">
        <input
          type="text"
          placeholder="🔍 Search by Name or Email..."
          className="p-3 border border-gray-600 rounded-lg w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-3 border border-gray-600 rounded-lg text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 md:mt-0"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">📋 All</option>
          <option value="Present">✅ Present</option>
          <option value="Absent">❌ Absent</option>
        </select>
      </div>

      {/* 📊 Employee Table */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees
              .filter((employee) => {
                const fullName = `${employee.firstName} ${employee.lastName}`;
                return (
                  (filter === "All" || employee.status === filter) &&
                  (fullName.toLowerCase().includes(search.toLowerCase()) ||
                    employee.email.toLowerCase().includes(search.toLowerCase()))
                );
              })
              .map((employee) => (
                <tr
                  key={employee._id}
                  className="border-b border-gray-600 hover:bg-gray-700 transition cursor-pointer"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <td className="p-2 text-center">{employee._id.slice(-4)}</td>
                  <td className="p-2 text-center">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td
                    className={`p-2 text-center font-semibold ${
                      employee.status === "Present"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {employee.status}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 📌 Employee Details Card */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 text-white max-w-sm w-full text-center relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
              onClick={() => setSelectedEmployee(null)}
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4">Employee Details</h3>
            <div className="flex flex-col items-center">
              <img
                src={selectedEmployee.profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full border border-gray-600 mb-4"
              />
              <p><strong>Name:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
              <p><strong>ID:</strong> {selectedEmployee._id}</p>
              <p><strong>Gender:</strong> {selectedEmployee.gender}</p>
              <p><strong>Job:</strong> {selectedEmployee.job}</p>
              <p><strong>Age:</strong> {selectedEmployee.age}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`ml-2 font-semibold ${
                    selectedEmployee.status === "Present" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {selectedEmployee.status}
                </span>
              </p>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
              <p><strong>Salary:</strong> ₹{selectedEmployee.salary.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
