import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import ProfileManagement from "./pages/ProfileManagement";
import MonthlyIncome from "./pages/MonthlyIncome";  // ⬅ Add this
import Salaries from "./pages/Salaries";            // ⬅ Add this
import { ProfileProvider } from "./context/ProfileContext";
import Performance from "./pages/Performance";
import EmployeeActivity from "./pages/EmployeeActivity";
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ProfileProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" />} /> {/* Home redirects to dashboard */}
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/employees" element={<PrivateRoute element={<Employees />} />} />
          <Route path="/tasks" element={<PrivateRoute element={<Tasks />} />} />
          <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
          <Route path="/monthly-income" element={<PrivateRoute element={<MonthlyIncome />} />} /> {/* New */}
          <Route path="/salaries" element={<PrivateRoute element={<Salaries />} />} />             {/* New */}
          <Route path="/profile-management" element={<PrivateRoute element={<ProfileManagement />} />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/employee-activity" element={<EmployeeActivity />} />
        </Routes>
      </Router>
    </ProfileProvider>
  );
};

export default App;
