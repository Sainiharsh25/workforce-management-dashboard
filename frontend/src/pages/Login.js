import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For registration
  const [role, setRole] = useState(""); // For registration
  const [isNewUser, setIsNewUser] = useState(false); // Toggle between login and register
  const navigate = useNavigate();

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login Successful!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Server Error! Please try again.");
    }
  };

  // Registration handler
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful! You can now log in.");
        setIsNewUser(false); // Switch back to login view
      } else {
        alert(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Server Error! Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl text-white mb-4">
          {isNewUser ? "Create Account" : "Login"}
        </h2>
        <form onSubmit={isNewUser ? handleRegister : handleLogin}>
          {isNewUser && (
            <>
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <select
                className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 p-2 rounded text-white"
          >
            {isNewUser ? "Register" : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center text-white">
          {isNewUser ? (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-400 underline"
                onClick={() => setIsNewUser(false)}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              New user?{" "}
              <button
                className="text-blue-400 underline"
                onClick={() => setIsNewUser(true)}
              >
                Create an Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
