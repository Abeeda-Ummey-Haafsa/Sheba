import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CheckIn from "../components/CheckIn";
import ActivityLogForm from "../components/ActivityLogForm";
import {
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiTrendingUp,
  FiBook,
  FiUser,
  FiPlusCircle,
} from "react-icons/fi";
import CountUp from "react-countup";

/**
 * CaregiverDashboard - Mobile-first dashboard for caregivers
 * Shows today's earnings, assigned jobs with check-in, quick links
 */
export default function CaregiverDashboard() {
  const { user, userMetadata, isMobile: isMobileDevice } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkInBookingId, setCheckInBookingId] = useState(null);
  const [activityLogBookingId, setActivityLogBookingId] = useState(null);
  const [earnings, setEarnings] = useState(0);
  const [checkedInJobs, setCheckedInJobs] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock bookings data - in production fetch from Supabase
        setBookings([
          {
            id: 1,
            senior_name: "রিনা আন্টি",
            senior_name_en: "Rina Aunty",
            address: "ধানমন্ডি, ঢাকা",
            address_en: "Dhanmondi, Dhaka",
            time_slot: "১০:০০ AM - ১২:০০ PM",
            time_slot_en: "10:00 AM - 12:00 PM",
            services: ["খাবার প্রস্তুতি", "ওষুধ সেবন"],
            payment: 500,
            lat: 23.7645,
            lng: 90.3667,
            status: "pending", // pending, checked_in, completed
          },
          {
            id: 2,
            senior_name: "করিম বাবা",
            senior_name_en: "Karim Baba",
            address: "গুলশান, ঢাকা",
            address_en: "Gulshan, Dhaka",
            time_slot: "২:০০ PM - ৪:০০ PM",
            time_slot_en: "2:00 PM - 4:00 PM",
            services: ["গতিশীলতা সহায়তা", "সঙ্গ"],
            payment: 400,
            lat: 23.7951,
            lng: 90.4167,
            status: "pending",
          },
        ]);
        setEarnings(bookings.reduce((sum, b) => sum + b.payment, 0));
        setLoading(false);
      } catch (error) {
        console.error("Error loading bookings:", error);
        toast.error("বুকিং লোড করতে ব্যর্থ / Failed to load bookings");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCheckInSuccess = (bookingId) => {
    setCheckedInJobs((prev) => new Set(prev).add(bookingId));
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "checked_in" } : b))
    );
  };

  const handleCheckOut = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking?.status === "checked_in") {
      setActivityLogBookingId(bookingId);
    }
  };

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
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-40"
      >
        <div className="px-4 py-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text mb-1">
                সেবা কেয়ারগিভার
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Seba Caregiver
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/profile")}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-lg md:text-xl font-bold hover:shadow-lg transition"
              title="Profile"
            >
              {userMetadata?.full_name?.charAt(0).toUpperCase() || "U"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-6xl mx-auto pb-32 md:pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Today's Earnings Card */}
          <motion.div
            variants={itemVariants}
            className="card bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm md:text-base font-medium mb-2">
                  আজকের আয় / Today's Earnings
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-bold text-primary">
                    ৳
                  </span>
                  <motion.span className="text-4xl md:text-5xl font-bold text-primary">
                    <CountUp start={0} end={earnings} duration={2} />
                  </motion.span>
                </div>
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl md:text-6xl"
              >
                💰
              </motion.div>
            </div>
          </motion.div>

          {/* Assigned Jobs Section */}
          {bookings.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
                <FiBriefcase size={24} />
                আজকের কাজ / Today's Jobs
              </h2>

              <div className="space-y-4">
                {bookings.map((booking, idx) => (
                  <motion.div
                    key={booking.id}
                    variants={itemVariants}
                    className={`card relative overflow-hidden transition-all ${
                      booking.status === "checked_in"
                        ? "border-2 border-success"
                        : "border border-gray-200"
                    }`}
                  >
                    {/* Status Badge */}
                    {booking.status === "checked_in" && (
                      <div className="absolute top-0 right-0 bg-success text-white px-4 py-2 text-xs font-bold rounded-bl-lg">
                        ✓ চেক-ইন
                      </div>
                    )}

                    {/* Senior Info */}
                    <div className="mb-4">
                      <h3 className="text-xl md:text-2xl font-bold text-text mb-1">
                        {booking.senior_name}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        {booking.senior_name_en}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3 mb-4">
                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <FiMapPin
                          className="text-primary flex-shrink-0 mt-1"
                          size={20}
                        />
                        <div>
                          <p className="font-semibold text-text">
                            {booking.address}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.address_en}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-3">
                        <FiClock
                          className="text-primary flex-shrink-0"
                          size={20}
                        />
                        <div>
                          <p className="font-semibold text-text">
                            {booking.time_slot}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.time_slot_en}
                          </p>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="flex gap-2 flex-wrap">
                        {booking.services.map((service, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs md:text-sm font-semibold"
                          >
                            {service}
                          </span>
                        ))}
                      </div>

                      {/* Payment */}
                      <div className="flex items-center gap-3 bg-success/10 p-3 rounded-lg">
                        <FiTrendingUp
                          className="text-success flex-shrink-0"
                          size={24}
                        />
                        <div>
                          <p className="text-gray-600 text-sm">পেমেন্ট</p>
                          <p className="text-2xl font-bold text-success">
                            ৳{booking.payment}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {booking.status !== "checked_in" ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCheckInBookingId(booking.id)}
                          className="flex-1 btn-primary min-h-14 text-base font-bold flex items-center justify-center gap-2"
                        >
                          <FiMapPin size={20} />
                          চেক-ইন / Check-In
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCheckOut(booking.id)}
                          className="flex-1 bg-secondary text-white min-h-14 text-base font-bold rounded-lg hover:bg-secondary/90 transition flex items-center justify-center gap-2"
                        >
                          <FiClock size={20} />
                          চেক-আউট / Check-Out
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/?q=${booking.lat},${booking.lng}`,
                            "_blank"
                          )
                        }
                        className="btn-outline min-h-14 px-4"
                        title="View on Maps"
                      >
                        🗺️
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="card text-center py-12"
            >
              <p className="text-2xl text-gray-400 mb-4">📋</p>
              <p className="text-lg text-gray-600 font-semibold">
                আজ কোনো কাজ নেই / No jobs today
              </p>
              <p className="text-gray-500 mt-2">নতুন কাজের জন্য অপেক্ষা করুন</p>
            </motion.div>
          )}

          {/* Quick Links Section */}
          <div>
            <h2 className="text-2xl font-bold text-text mb-4">
              দ্রুত লিঙ্ক / Quick Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Browse Jobs */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/find-caregivers")}
                className="card border-2 border-transparent hover:border-primary transition"
              >
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-bold text-text text-lg mb-1">
                  নতুন কাজ / New Jobs
                </h3>
                <p className="text-sm text-gray-600">Available opportunities</p>
              </motion.button>

              {/* Training */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/training")}
                className="card border-2 border-transparent hover:border-primary transition"
              >
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-bold text-text text-lg mb-1">
                  প্রশিক্ষণ / Training
                </h3>
                <p className="text-sm text-gray-600">Learn new skills</p>
              </motion.button>

              {/* Earnings History */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/activity-logs")}
                className="card border-2 border-transparent hover:border-primary transition"
              >
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-text text-lg mb-1">
                  আয়ের ইতিহাস / Earnings
                </h3>
                <p className="text-sm text-gray-600">View all earnings</p>
              </motion.button>

              {/* My Profile */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/profile")}
                className="card border-2 border-transparent hover:border-primary transition"
              >
                <div className="text-4xl mb-3">👤</div>
                <h3 className="font-bold text-text text-lg mb-1">
                  আমার প্রোফাইল / Profile
                </h3>
                <p className="text-sm text-gray-600">Edit your profile</p>
              </motion.button>
            </div>
          </div>

          {/* Info Cards */}
          {userMetadata?.verification_status !== "verified" && (
            <motion.div
              variants={itemVariants}
              className="card bg-yellow-50 border-l-4 border-yellow-400"
            >
              <h3 className="font-bold text-yellow-800 text-lg mb-2">
                ⏳ যাচাই অপেক্ষমাণ / Verification Pending
              </h3>
              <p className="text-yellow-700 text-sm md:text-base">
                আপনার প্রোফাইল আমাদের টিম দ্বারা পর্যালোচনা করা হচ্ছে। সাধারণত
                ১-২ ব্যবসায়িক দিন সময় লাগে।
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Check-In Modal */}
      {checkInBookingId && (
        <CheckIn
          bookingId={checkInBookingId}
          seniorName={
            bookings.find((b) => b.id === checkInBookingId)?.senior_name
          }
          seniorLat={bookings.find((b) => b.id === checkInBookingId)?.lat}
          seniorLng={bookings.find((b) => b.id === checkInBookingId)?.lng}
          onCheckInSuccess={() => handleCheckInSuccess(checkInBookingId)}
          onClose={() => setCheckInBookingId(null)}
        />
      )}

      {/* Activity Log Modal */}
      {activityLogBookingId && (
        <ActivityLogForm
          bookingId={activityLogBookingId}
          seniorName={
            bookings.find((b) => b.id === activityLogBookingId)?.senior_name
          }
          onSubmitSuccess={() => {
            setBookings((prev) =>
              prev.map((b) =>
                b.id === activityLogBookingId
                  ? { ...b, status: "completed" }
                  : b
              )
            );
          }}
          onClose={() => setActivityLogBookingId(null)}
        />
      )}
    </div>
  );
}
