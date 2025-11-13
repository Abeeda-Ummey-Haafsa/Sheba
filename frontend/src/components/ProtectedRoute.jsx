import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, loading, userRole } = useAuth();

  // Debug logging
  React.useEffect(() => {
    console.log(
      "ProtectedRoute - loading:",
      loading,
      "authenticated:",
      isAuthenticated,
      "userRole:",
      userRole
    );
  }, [loading, isAuthenticated, userRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute - redirecting to login (not authenticated)");
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    // Redirect to appropriate dashboard based on role
    console.log(
      "ProtectedRoute - redirecting (role mismatch. expected:",
      role,
      "got:",
      userRole
    );
    if (userRole === "caregiver") {
      return <Navigate to="/caregiver-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
