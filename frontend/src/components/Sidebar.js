import React from "react";
import { FaTachometerAlt, FaUsers, FaTasks, FaCog } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen w-64 p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        <li className="flex items-center gap-2 hover:text-gray-300 cursor-pointer">
          <FaTachometerAlt /> Dashboard
        </li>
        <li className="flex items-center gap-2 hover:text-gray-300 cursor-pointer">
          <FaUsers /> Employees
        </li>
        <li className="flex items-center gap-2 hover:text-gray-300 cursor-pointer">
          <FaTasks /> Tasks
        </li>
        <li className="flex items-center gap-2 hover:text-gray-300 cursor-pointer">
          <FaCog /> Settings
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
