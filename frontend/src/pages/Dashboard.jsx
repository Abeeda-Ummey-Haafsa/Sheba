import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, userMetadata } = useAuth();
  const [userSeniors, setUserSeniors] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const displayName = userMetadata?.full_name || "User";
    console.log("[Dashboard] Rendering with:", {
      user_id: user?.id,
      user_email: user?.email,
      userMetadata,
      displayName,
    });

    const fetchUserData = async () => {
      try {
        // Fetch user's seniors (in a real app)
        // const { data: seniors } = await supabase
        //   .from('seniors')
        //   .select('*')
        //   .eq('guardian_id', user?.id);
        // setUserSeniors(seniors || []);

        // For now, use mock data
        setUserSeniors([
          {
            id: 1,
            name: "আম্মা",
            age: 75,
            condition: "Diabetes, Hypertension",
          },
          { id: 2, name: "দাদা", age: 82, condition: "Arthritis" },
        ]);

        // Mock recent bookings
        setRecentBookings([
          {
            id: 1,
            caregiver: "Fatima Khan",
            date: "2025-01-14",
            status: "Confirmed",
          },
          {
            id: 2,
            caregiver: "Ravi Roy",
            date: "2025-01-15",
            status: "Pending",
          },
        ]);

        console.log("[Dashboard] Mock data loaded successfully");
      } catch (error) {
        console.error("[Dashboard] Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    // Always fetch, regardless of user state (uses mock data anyway)
    fetchUserData();
  }, [user?.id, userMetadata]);

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
              Care for Your Loved Ones with Confidence
            </h1>
            <p className="text-gray-600 text-xl mb-8">
              আপনার প্রিয়জনদের যত্ন নিন আত্মবিশ্বাসের সাথে
            </p>
            <p className="text-2xl font-semibold text-primary mb-6">
              Welcome back, {userMetadata?.full_name || "User"}! 👋
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Find a Caregiver
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition"
              >
                View Logs
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Your Seniors Section */}
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
            Your Seniors
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userSeniors.map((senior) => (
              <motion.div
                key={senior.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
              >
                <h3 className="text-2xl font-bold text-text mb-2">
                  {senior.name}
                </h3>
                <p className="text-gray-600 mb-4">Age: {senior.age} years</p>
                <p className="text-gray-600 mb-4">
                  Conditions: {senior.condition}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  Manage Profile
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Feature Cards */}
      <motion.section
        className="py-12 px-4 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-text mb-8 text-center"
            variants={itemVariants}
          >
            Why Sheba is Trusted by Families
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "✓",
                title: "Verified Caregivers",
                description:
                  "All caregivers are background-checked and verified.",
              },
              {
                icon: "📍",
                title: "Real-time Monitoring",
                description:
                  "GPS tracking and live updates on your loved ones.",
              },
              {
                icon: "🤖",
                title: "AI-Powered Matching",
                description: "Smart matching based on skills and requirements.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Recent Bookings */}
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
            Recent Bookings
          </motion.h2>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <motion.div
                key={booking.id}
                variants={itemVariants}
                className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition"
              >
                <div>
                  <h3 className="text-lg font-bold text-text">
                    {booking.caregiver}
                  </h3>
                  <p className="text-gray-600">Date: {booking.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-4 py-2 rounded-full font-semibold ${
                      booking.status === "Confirmed"
                        ? "bg-success/20 text-success"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                  >
                    Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-12 px-4 bg-gradient-to-r from-primary/10 to-accent/10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { number: "50+", label: "Verified Caregivers" },
              { number: "1000+", label: "Happy Families" },
              { number: "24/7", label: "Support Available" },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <motion.p
                  className="text-4xl font-bold text-primary mb-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {stat.number}
                </motion.p>
                <p className="text-text font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-16 px-4 bg-gradient-to-r from-primary to-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto text-center text-white">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={itemVariants}
          >
            Ready to Find the Perfect Caregiver?
          </motion.h2>
          <motion.p className="text-lg mb-8 opacity-90" variants={itemVariants}>
            Browse our verified network of caregivers and find the right match
            today.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-white text-primary rounded-lg font-bold hover:shadow-lg transition"
          >
            Browse Caregivers
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}
