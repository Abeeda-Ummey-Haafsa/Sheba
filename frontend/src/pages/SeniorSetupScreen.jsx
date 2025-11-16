import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function SeniorSetupScreen() {
  const navigate = useNavigate();
  const { loginAsSenior } = useAuth();

  const handleSignup = () => {
    // Create a mock senior profile for testing
    const mockSenior = {
      id: `senior-test-${Date.now()}`,
      name: "Test Senior",
      full_name: "Test Senior User",
      age: 70,
      gender: "male",
      device_id: `TEST-DEVICE-${Date.now()}`,
    };

    // Log in as senior without PIN authentication
    loginAsSenior(mockSenior);

    toast.success("স্বাগতম! Welcome to Seba Senior Portal");

    // Navigate to senior dashboard
    setTimeout(() => {
      navigate("/senior", { replace: true });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-teal-600 mb-3">সেবা</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Senior Portal
          </h2>
          <p className="text-lg text-gray-600">
            বয়স্কদের জন্য বিশেষ ইন্টারফেস
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-center text-gray-700 mb-6">
            Click the button below to access your personalized senior dashboard.
            <br />
            <span className="text-sm text-gray-500">
              (Testing mode - no authentication required)
            </span>
          </p>

          <button
            onClick={handleSignup}
            className="w-full h-16 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-2xl rounded-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            সাইন আপ / Sign Up
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full h-12 mt-4 text-teal-600 border-2 border-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition"
          >
            ফিরে যান / Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
