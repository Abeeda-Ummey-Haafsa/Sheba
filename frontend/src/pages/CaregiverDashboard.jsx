import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function CaregiverDashboard() {
  const { user, userMetadata } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Mock data - in real app, fetch from Supabase
        setBookings([
          {
            id: 1,
            guardianName: "Ahmed Family",
            date: "2025-01-15",
            time: "09:00 - 12:00",
            status: "confirmed",
            location: "Dhaka",
          },
          {
            id: 2,
            guardianName: "Rahman Household",
            date: "2025-01-16",
            time: "14:00 - 18:00",
            status: "pending",
            location: "Chittagong",
          },
        ]);
      } catch (error) {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
              Your Caregiver Dashboard
            </h1>
            <p className="text-gray-600 text-xl mb-8">
              আপনার যত্নকারী ড্যাশবোর্ড
            </p>
            <p className="text-2xl font-semibold text-primary mb-6">
              Welcome back, {userMetadata?.full_name || "Caregiver"}! 👋
            </p>
            <p className="text-gray-600 mb-6">
              Verification Status:{" "}
              <span className="font-semibold">
                {userMetadata?.verification_status === "verified" ? (
                  <span className="text-success">✓ Verified</span>
                ) : (
                  <span className="text-yellow-600">⏳ Pending Review</span>
                )}
              </span>
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-12 px-4 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                number: userMetadata?.experience_years || 0,
                label: "Years of Experience",
              },
              { number: bookings.length, label: "Upcoming Bookings" },
              { number: "5", label: "Families Booked" },
              { number: "4.8", label: "Average Rating" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition"
              >
                <p className="text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </p>
                <p className="text-text font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Your Skills */}
      <motion.section
        className="py-12 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-text mb-8"
            variants={itemVariants}
          >
            Your Services
          </motion.h2>
          <div className="flex flex-wrap gap-3">
            {(userMetadata?.skills || []).map((skill) => (
              <motion.span
                key={skill}
                variants={itemVariants}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold"
              >
                {skill}
              </motion.span>
            ))}
            {(!userMetadata?.skills || userMetadata.skills.length === 0) && (
              <p className="text-gray-600">No services added yet</p>
            )}
          </div>
        </div>
      </motion.section>

      {/* Upcoming Bookings */}
      <motion.section
        className="py-12 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-text mb-8"
            variants={itemVariants}
          >
            Upcoming Bookings
          </motion.h2>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  variants={itemVariants}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-text">
                        {booking.guardianName}
                      </h3>
                      <p className="text-gray-600">
                        {booking.date} • {booking.time}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-success/20 text-success"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">📍 {booking.location}</p>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                    >
                      View Details
                    </motion.button>
                    {booking.status === "pending" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition"
                      >
                        Accept
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <p className="text-gray-600 text-lg">No upcoming bookings</p>
              <p className="text-gray-500">Check back soon for new requests</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Profile Completion */}
      {userMetadata?.verification_status !== "verified" && (
        <motion.section
          className="py-12 px-4 bg-yellow-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border-l-4 border-yellow-400 rounded-lg p-6">
              <h3 className="text-xl font-bold text-text mb-2">
                ⏳ Verification Pending
              </h3>
              <p className="text-gray-600 mb-4">
                Your profile is under review by our admin team. This typically
                takes 1-2 business days. Once approved, you'll be able to accept
                bookings from families.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
              >
                View Application Status
              </motion.button>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
