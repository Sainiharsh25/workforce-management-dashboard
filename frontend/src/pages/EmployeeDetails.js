import React from "react";
import { useParams } from "react-router-dom";

const employees = [
  {
    id: "EMP1001",
    name: "Employee 1",
    gender: "Male",
    status: "Absent",
    email: "employee1@example.com",
    phone: "+1-555-0101",
    photo: "/profile1.jpg",
  },
  {
    id: "EMP1002",
    name: "Employee 2",
    gender: "Female",
    status: "Present",
    email: "employee2@example.com",
    phone: "+1-555-0102",
    photo: "/profile2.jpg",
  },
  // Add more employees...
];

const EmployeeDetails = () => {
  const { id } = useParams();
  const employee = employees.find((emp) => emp.id === id);

  if (!employee) {
    return <h2 className="text-white text-center mt-10">Employee Not Found</h2>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <img
          src={employee.photo}
          alt={employee.name}
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-white text-center">{employee.name}</h2>
        <p className="text-gray-400 text-center">{employee.id}</p>
        <div className="mt-4 text-white">
          <p><strong>Gender:</strong> {employee.gender}</p>
          <p><strong>Status:</strong> {employee.status}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Phone No.:</strong> {employee.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
