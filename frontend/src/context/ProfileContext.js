import React, { createContext, useContext, useState, useEffect } from "react";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "/default-profile.png");

  useEffect(() => {
    const updateProfilePicture = () => {
      setProfilePic(localStorage.getItem("profilePic") || "/default-profile.png");
    };
    window.addEventListener("storage", updateProfilePicture);
    return () => window.removeEventListener("storage", updateProfilePicture);
  }, []);

  return (
    <ProfileContext.Provider value={{ profilePic, setProfilePic }}>
      {children}
    </ProfileContext.Provider>
  );
};
