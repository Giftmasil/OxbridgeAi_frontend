import { useEffect, useState } from "react";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/login/SignUp";
import Score from "./pages/judges/Score";
import "./App.css";
import AdminDashboard from "./pages/admin/Dashboard";
import JudgeDashboard from "./pages/judges/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("isAuthenticated") === "true";
      const userRole = localStorage.getItem("role");
      setIsAuthenticated(token);
      setRole(userRole);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  const redirectToDashboard = () => {
    if (role === "admin") return <Navigate to="/admin-dashboard" replace />;
    if (role === "judge") return <Navigate to="/judge-dashboard" replace />;
    return <Navigate to="/login" replace />;
  };

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? redirectToDashboard() : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              redirectToDashboard()
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              redirectToDashboard()
            ) : (
              <Signup />
            )
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated && role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/judge-dashboard"
          element={
            isAuthenticated && role === "judge" ? (
              <JudgeDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/judge-dashboard/score/:id"
          element={
            isAuthenticated && role === "judge" ? (
              <Score />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;