import React, { useState } from "react";
import { useProfile } from "../context/ProfileContext"; // ⬅ Import Profile Context

const ProfileManagement = () => {
  const { setProfilePic } = useProfile(); // ⬅ Get function to update profile picture globally
  const [image, setImage] = useState(localStorage.getItem("profilePic") || "/default-profile.png");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("profilePic", reader.result);
        setImage(reader.result);
        setProfilePic(reader.result); // 🔄 Update Profile Context (Navbar updates instantly)
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Profile Management</h2>
      <div className="flex flex-col items-center">
        <img src={image} alt="Profile" className="w-32 h-32 rounded-full border-4 border-blue-500 mb-4" />
        <input type="file" onChange={handleImageUpload} className="bg-gray-800 p-2 rounded" />
      </div>
    </div>
  );
};

export default ProfileManagement;
