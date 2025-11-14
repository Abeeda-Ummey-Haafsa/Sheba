import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, loading, userRole } = useAuth();
  const location = useLocation();

  // Debug logging
  React.useEffect(() => {
    console.log("[ProtectedRoute]", {
      path: location.pathname,
      loading,
      authenticated: isAuthenticated,
      userRole,
      requiredRole: role,
    });
  }, [loading, isAuthenticated, userRole, location.pathname, role]);

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
    console.log("[ProtectedRoute] Redirecting to login (not authenticated)");
    return <Navigate to="/login" replace />;
  }

  if (role && userRole) {
    // Allow 'family' as an alias for 'guardian'
    const allowedForGuardian = ["guardian", "family"];
    const roleIsGuardian = role === "guardian";

    if (roleIsGuardian && allowedForGuardian.includes(userRole)) {
      console.log("[ProtectedRoute] Guardian route - allowing access");
      return children;
    }

    if (role === userRole) {
      console.log("[ProtectedRoute] Role match - allowing access");
      return children;
    }

    // Redirect only if role mismatch
    console.log(
      "[ProtectedRoute] Role mismatch - required:",
      role,
      "got:",
      userRole
    );
    if (userRole === "caregiver") {
      return <Navigate to="/caregiver-dashboard" replace />;
    }
    if (userRole === "guardian" || userRole === "family") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // No role requirement, allow through
  return children;
};

export default ProtectedRoute;
