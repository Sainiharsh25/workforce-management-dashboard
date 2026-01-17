import React, { useState } from "react";
import { FaUser, FaLock, FaDatabase, FaCogs, FaLink, FaChartBar, FaQuestionCircle } from "react-icons/fa";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Settings</h2>

      {/* Tab Navigation */}
      <div className="flex space-x-6 border-b border-gray-700 pb-4">
        {[
          { key: "general", icon: FaCogs, label: "General" },
          { key: "user", icon: FaUser, label: "User Management" },
          { key: "security", icon: FaLock, label: "Security" },
          { key: "data", icon: FaDatabase, label: "Data Management" },
          { key: "integrations", icon: FaLink, label: "Integrations" },
          { key: "monitoring", icon: FaChartBar, label: "Monitoring" },
          { key: "help", icon: FaQuestionCircle, label: "Help & Support" },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex items-center space-x-2 p-2 rounded-lg transition ${
              activeTab === key ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <Icon /> <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        {activeTab === "general" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">General Settings</h3>
            <div className="mb-4">
              <label className="block text-sm mb-2">Company Name</label>
              <input type="text" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600" placeholder="Enter company name" />
            </div>
            <div>
              <label className="block text-sm mb-2">Company Logo</label>
              <input type="file" className="w-full p-2" />
            </div>
          </div>
        )}
        {activeTab === "user" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">User Management</h3>
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm mb-2">Profile Picture</label>
                <input type="file" onChange={handleImageUpload} className="w-full p-2" />
              </div>
              {preview && <img src={preview} alt="Profile" className="w-16 h-16 rounded-full" />}
            </div>
            <div className="mt-4">
              <label className="block text-sm mb-2">Username</label>
              <input type="text" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600" placeholder="Enter username" />
            </div>
          </div>
        )}
        {activeTab === "security" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Security & Authentication</h3>
            <label className="block text-sm mb-2">Enable Two-Factor Authentication</label>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        )}
        {activeTab === "data" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Data Management</h3>
            <button className="bg-red-500 px-4 py-2 rounded-lg">Backup Data</button>
          </div>
        )}
        {activeTab === "integrations" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Integrations & APIs</h3>
            <p>Manage third-party integrations here.</p>
          </div>
        )}
        {activeTab === "monitoring" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">System Monitoring & Reports</h3>
            <p>View usage statistics and logs.</p>
          </div>
        )}
        {activeTab === "help" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Help & Support</h3>
            <button className="bg-blue-500 px-4 py-2 rounded-lg">Contact Support</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;