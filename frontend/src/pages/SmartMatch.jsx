import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import CaregiverMatcher from "../components/CaregiverMatcher";
import { FiUsers, FiTrendingUp, FiClock, FiMapPin } from "react-icons/fi";

const LOCAL_SENIORS_KEY = "seba_local_seniors";

export default function SmartMatch() {
  const { user } = useAuth();
  const [seniors, setSeniors] = useState([]);
  const [selectedSenior, setSelectedSenior] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadSeniors = async () => {
      setLoading(true);
      try {
        // Try to load from Supabase
        const { data, error } = await supabase
          .from("seniors")
          .select("*")
          .eq("family_user_id", user?.id);

        if (!error && data && data.length > 0) {
          setSeniors(data);
        } else {
          // Fallback to localStorage
          const stored = localStorage.getItem(LOCAL_SENIORS_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            setSeniors(Array.isArray(parsed) ? parsed : []);
          }
        }
      } catch (error) {
        console.error("Error loading seniors:", error);
        // Fallback to localStorage
        const stored = localStorage.getItem(LOCAL_SENIORS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSeniors(Array.isArray(parsed) ? parsed : []);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSeniors();

    // Set up interval to refresh seniors data every 3 seconds when tab is active
    const intervalId = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadSeniors();
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [user?.id]);

  const handleBooking = (match) => {
    toast.success(
      `Booking request initiated for ${match.name}!\nRate: ৳${match.details.hourly_rate}/hr`,
      { duration: 5000 }
    );
    // Here you would typically navigate to a booking confirmation page
    // or open a booking modal
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
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text">
                AI-Powered Smart Match
              </h1>
              <p className="text-gray-600">
                এআই-চালিত স্মার্ট ম্যাচিং • Find perfect caregivers using
                intelligent algorithms
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              icon: <FiMapPin size={24} />,
              title: "Distance-Based",
              desc: "Nearest caregivers first",
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: <FiUsers size={24} />,
              title: "Skill Matching",
              desc: "Perfect skill alignment",
              color: "from-green-500 to-green-600",
            },
            {
              icon: <FiTrendingUp size={24} />,
              title: "Smart Scoring",
              desc: "6-factor algorithm",
              color: "from-purple-500 to-purple-600",
            },
            {
              icon: <FiClock size={24} />,
              title: "Real-Time Availability",
              desc: "Live booking status",
              color: "from-orange-500 to-orange-600",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center text-white mb-3`}
              >
                {feature.icon}
              </div>
              <h3 className="font-bold text-text mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Senior Selection */}
        {seniors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-12 text-center shadow-sm"
          >
            <div className="text-6xl mb-4">👴</div>
            <h2 className="text-2xl font-bold text-text mb-2">
              No Seniors Added Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Add a senior profile to start finding matching caregivers
            </p>
            <button
              onClick={() => (window.location.href = "/profile")}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
            >
              Add Senior Profile
            </button>
          </motion.div>
        ) : !selectedSenior ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-text mb-6">
              Select a Senior to Find Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seniors.map((senior) => (
                <motion.div
                  key={senior.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSenior(senior)}
                  className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 cursor-pointer hover:shadow-md transition border-2 border-transparent hover:border-primary"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-3xl">
                      {senior.photo_url ? (
                        <img
                          src={senior.photo_url}
                          alt={senior.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        "👤"
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-text mb-1">
                        {senior.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {senior.age} years • {senior.gender || "Not specified"}
                      </p>
                      {senior.medical_conditions &&
                        senior.medical_conditions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {senior.medical_conditions
                              .slice(0, 2)
                              .map((condition) => (
                                <span
                                  key={condition}
                                  className="px-2 py-1 bg-white/80 text-primary text-xs rounded-full"
                                >
                                  {condition}
                                </span>
                              ))}
                            {senior.medical_conditions.length > 2 && (
                              <span className="px-2 py-1 bg-white/80 text-gray-600 text-xs rounded-full">
                                +{senior.medical_conditions.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Selected Senior Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-3xl">
                    {selectedSenior.photo_url ? (
                      <img
                        src={selectedSenior.photo_url}
                        alt={selectedSenior.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">
                      Finding caregivers for {selectedSenior.name}
                    </h3>
                    <p className="text-gray-600">
                      {selectedSenior.age} years •{" "}
                      {selectedSenior.gender || "Not specified"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSenior(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Change Senior
                </button>
              </div>
            </div>

            {/* Matcher Component */}
            <CaregiverMatcher
              seniorId={selectedSenior.id}
              seniorData={{
                location: {
                  lat: selectedSenior.latitude || 23.8103,
                  lon: selectedSenior.longitude || 90.4125,
                },
                gender: selectedSenior.gender,
                area: selectedSenior.location || selectedSenior.address,
                conditions: selectedSenior.medical_conditions || [],
              }}
              onBooking={handleBooking}
            />
          </motion.div>
        )}

        {/* Algorithm Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-text mb-4 text-center">
            🧠 How Our Smart Matching Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Distance Analysis",
                desc: "Uses Haversine formula to calculate exact distance and prioritize nearby caregivers",
                weight: "30%",
              },
              {
                title: "Skill Matching",
                desc: "Advanced cosine similarity to match caregiver skills with senior needs",
                weight: "25%",
              },
              {
                title: "Multi-Factor Scoring",
                desc: "Combines ratings, experience, gender preference, and language for optimal match",
                weight: "45%",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {item.weight}
                </div>
                <h4 className="font-bold text-text mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
