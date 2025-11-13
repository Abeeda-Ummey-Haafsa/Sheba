import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import MobileMenu from "./components/MobileMenu";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import FindCaregivers from "./pages/FindCaregivers";
import LiveTracking from "./pages/LiveTracking";
import ActivityLogs from "./pages/ActivityLogs";
import Profile from "./pages/Profile";
import Debug from "./pages/Debug";

function AppRoutes() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  // Redirect authenticated users away from login/signup
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (!loading && isAuthenticated && isAuthPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navigation onOpenMobile={() => setShowMobileMenu(true)} />
      <MobileMenu
        open={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
      />

      <main className="pt-20">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/debug" element={<Debug />} />

          {/* Guardian Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="guardian">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Caregiver Protected Routes */}
          <Route
            path="/caregiver-dashboard"
            element={
              <ProtectedRoute role="caregiver">
                <CaregiverDashboard />
              </ProtectedRoute>
            }
          />

          {/* Shared Protected Routes */}
          <Route
            path="/find-caregivers"
            element={
              <ProtectedRoute>
                <FindCaregivers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/live-tracking"
            element={
              <ProtectedRoute>
                <LiveTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity-logs"
            element={
              <ProtectedRoute>
                <ActivityLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {showScroll && (
        <button
          aria-label="Scroll to top"
          className="scroll-top bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}

      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
