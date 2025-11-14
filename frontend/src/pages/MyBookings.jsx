import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiMapPin, FiClock, FiX } from "react-icons/fi";

/**
 * MyBookings.jsx - Vertical timeline of caregiver bookings
 * Shows booking history with timeline, filters, and status
 */
export default function MyBookings() {
  const { user, isMobile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, completed, cancelled

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Mock bookings data
        setBookings([
          {
            id: 1,
            senior_name: "রিনা আন্টি",
            date: "2025-01-15",
            time: "10:00 - 12:00",
            location: "ধানমন্ডি, ঢাকা",
            status: "completed",
            payment: 500,
            checked_in_time: "10:02",
            checked_out_time: "11:58",
          },
          {
            id: 2,
            senior_name: "করিম বাবা",
            date: "2025-01-14",
            time: "14:00 - 16:00",
            location: "গুলশান, ঢাকা",
            status: "completed",
            payment: 400,
            checked_in_time: "14:05",
            checked_out_time: "15:55",
          },
          {
            id: 3,
            senior_name: "ফাতেমা আম্মা",
            date: "2025-01-20",
            time: "09:00 - 11:00",
            location: "বসুন্ধরা, ঢাকা",
            status: "pending",
            payment: 450,
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error loading bookings:", error);
        toast.error("বুকিং লোড করতে ব্যর্থ / Failed to load bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) =>
    filter === "all" ? true : b.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-32 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-40"
      >
        <div className="px-4 py-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-text mb-4">
            আমার বুকিং / My Bookings
          </h1>

          {/* Filter Bar */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["all", "pending", "completed", "cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition ${
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text hover:bg-gray-200"
                }`}
              >
                {f === "all"
                  ? "সব / All"
                  : f === "pending"
                  ? "অপেক্ষমাণ / Pending"
                  : f === "completed"
                  ? "সম্পন্ন / Completed"
                  : "বাতিল / Cancelled"}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="px-4 py-8 max-w-6xl mx-auto">
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                {/* Timeline marker */}
                <div className="hidden md:block absolute -left-6 top-6 w-4 h-4 bg-primary rounded-full border-4 border-white" />
                <div className="hidden md:block absolute -left-2 top-16 w-1 h-16 bg-primary/20" />

                {/* Card */}
                <div
                  className={`card border-l-4 ${
                    booking.status === "completed"
                      ? "border-success"
                      : booking.status === "pending"
                      ? "border-yellow-400"
                      : "border-error"
                  }`}
                >
                  {/* Status Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-text mb-1">
                        {booking.senior_name}
                      </h3>
                      <p className="text-gray-600">
                        {new Date(booking.date).toLocaleDateString("bn-BD")}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        booking.status === "completed"
                          ? "bg-success/20 text-success"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-error/20 text-error"
                      }`}
                    >
                      {booking.status === "completed"
                        ? "✓ সম্পন্ন"
                        : booking.status === "pending"
                        ? "অপেক্ষমাণ"
                        : "বাতিল"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <FiClock
                        className="text-primary flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <p className="font-semibold text-text">
                          {booking.time}
                        </p>
                        {booking.status === "completed" && (
                          <p className="text-sm text-gray-600">
                            চেক-ইন: {booking.checked_in_time} | চেক-আউট:{" "}
                            {booking.checked_out_time}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FiMapPin
                        className="text-primary flex-shrink-0"
                        size={20}
                      />
                      <p className="font-semibold text-text">
                        {booking.location}
                      </p>
                    </div>

                    <div className="bg-primary/10 px-4 py-3 rounded-lg">
                      <p className="text-gray-600 text-sm">পেমেন্ট / Payment</p>
                      <p className="text-2xl font-bold text-primary">
                        ৳{booking.payment}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === "completed" && (
                    <button className="w-full px-4 py-3 bg-success/10 text-success rounded-lg font-bold hover:bg-success/20 transition">
                      রিপোর্ট দেখুন / View Report
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-16"
          >
            <p className="text-5xl mb-4">📋</p>
            <p className="text-xl font-bold text-text mb-2">
              বুকিং নেই / No Bookings
            </p>
            <p className="text-gray-600">
              {filter === "all"
                ? "আপনার কোনো বুকিং নেই"
                : `${filter} বুকিং কোনটি নেই`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
