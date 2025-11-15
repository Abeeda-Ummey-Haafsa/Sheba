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
import MyBookings from "./pages/MyBookings";
import TrainingPortal from "./pages/TrainingPortal";
import FindCaregivers from "./pages/FindCaregivers";
import LiveTracking from "./pages/LiveTracking";
import ActivityLogs from "./pages/ActivityLogs";
import Profile from "./pages/Profile";
import Debug from "./pages/Debug";
import SeniorInterface from "./pages/SeniorInterface";
import SeniorAuthBridge from "./pages/SeniorAuthBridge";
import SeniorSetupScreen from "./pages/SeniorSetupScreen";
import FamilySeniorOnboarding from "./pages/FamilySeniorOnboarding";

function AppRoutes() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const location = useLocation();
  const { isAuthenticated, loading, userRole } = useAuth();

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setIsInstallable(false);
          setDeferredPrompt(null);
        }
      });
    }
  };

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
    // Redirect to appropriate dashboard based on role
    if (userRole === "senior") {
      return <Navigate to="/senior" replace />;
    }
    if (userRole === "caregiver") {
      return <Navigate to="/caregiver-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navigation onOpenMobile={() => setShowMobileMenu(true)} />
      <MobileMenu
        open={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
      />

      {/* PWA Install Banner */}
      {isInstallable && (
        <div className="sticky top-20 z-40 bg-primary text-white p-4 flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📱</span>
            <div className="text-sm md:text-base">
              <p className="font-bold">Seba অ্যাপ ইনস্টল করুন</p>
              <p className="text-primary/80 text-xs">আরও ভালো অভিজ্ঞতার জন্য</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInstallPWA}
              className="px-4 py-2 bg-white text-primary rounded-lg font-bold text-sm hover:bg-gray-100 transition"
            >
              ইনস্টল / Install
            </button>
            <button
              onClick={() => setIsInstallable(false)}
              className="px-4 py-2 bg-primary/80 text-white rounded-lg hover:bg-primary/60 transition"
            >
              পরে / Later
            </button>
          </div>
        </div>
      )}

      <main className="pt-20">
        <Routes>
          {/* Senior Auth Bridge - wraps home/setup routes */}
          <Route path="/" element={<SeniorAuthBridge />} />
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/debug" element={<Debug />} />
          <Route path="/senior-setup" element={<SeniorSetupScreen />} />
          <Route
            path="/family/onboard-senior"
            element={<FamilySeniorOnboarding />}
          />

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
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute role="caregiver">
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/training"
            element={
              <ProtectedRoute role="caregiver">
                <TrainingPortal />
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
          {/* Senior Protected Route */}
          <Route
            path="/senior/*"
            element={
              <ProtectedRoute role="senior">
                <SeniorInterface />
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
