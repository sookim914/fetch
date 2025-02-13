import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
    };

    checkAuthentication();
  }, []);

  const isAuthenticated = async () => {
    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/check",
        {
          method: "GET",
          credentials: "include",
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  };

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  if (isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
