import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { Bell, Menu, X } from "lucide-react"; // Optional for icons

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { profilePic } = useProfile();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profilePic");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-30 bg-gray-900 p-4 flex items-center justify-between px-6 shadow-md">
      {/* Left: Sidebar Toggle + Company Name */}
      <div className="flex items-center space-x-4">
        <button
          className="text-white md:hidden"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center">
          <img
            src="/output-onlinepngtools.png"
            alt="Company Logo"
            className="h-10 w-auto"
          />
          <h1 className="text-white text-xl ml-3 font-semibold">
            Inspirisys Solutions Limited
          </h1>
        </div>
      </div>

      {/* Right: Search, Notification, Profile */}
      <div className="flex items-center space-x-4 text-white">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 rounded-md bg-gray-800 text-sm text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button className="relative hover:text-blue-400 transition">
          <Bell size={22} />
        </button>

        {token ? (
          <div className="relative">
            <img
              src={profilePic}
              alt="Profile"
              className="w-9 h-9 rounded-full cursor-pointer border-2 border-white"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-gray-800 text-white rounded shadow-lg w-40">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile-management");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowLogoutPopup(true);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            Login
          </button>
        )}
      </div>

      {/* Logout Confirmation */}
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl text-white text-center">
            <p className="text-lg mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
