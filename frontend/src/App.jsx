import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Login from "./pages/login/Login";
import Signup from "./pages/login/SignUp";
import JudgesDashboard from "./pages/judges/Dashboard";
import AdminDashboard from "./pages/admin/DashBoard";
import Score from "./pages/judges/Score";
import "./App.css";
import { useEffect } from "react";
import { checkAuthState } from "./redux/slices/AuthenticationSlice";

// Role-based route guard component
const ProtectedRoute = ({ children, allowedRole, redirectPath = "/login" }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={`/${role === 'admin' ? 'admin' : ''}/dashboard`} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRole: PropTypes.oneOf(['admin', 'judge']),
  redirectPath: PropTypes.string
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate 
                to={role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                replace 
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Judge Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="judge">
              <JudgesDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/score/:id"
          element={
            <ProtectedRoute allowedRole="judge">
              <Score />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route 
          path="*" 
          element={
            <Navigate 
              to={isAuthenticated ? 
                (role === 'admin' ? '/admin/dashboard' : '/dashboard') 
                : '/login'} 
              replace 
            />
          } 
        />
      </Routes>
    </HashRouter>
  );
}

export default App;