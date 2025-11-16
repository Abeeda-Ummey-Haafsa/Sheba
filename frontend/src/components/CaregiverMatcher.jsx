import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiStar,
  FiMapPin,
  FiPhone,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CaregiverMatcher({ seniorId, seniorData, onBooking }) {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [searchParams, setSearchParams] = useState({
    booking_date: new Date().toISOString().split("T")[0],
    start_time: "10:00:00",
    duration_hrs: 4,
    required_skills: [],
  });

  // Available skills for selection
  const availableSkills = [
    "Personal Care",
    "Medication Management",
    "Diabetes Care",
    "Physiotherapy",
    "Companionship",
    "Meal Preparation",
    "Mobility Assistance",
    "Blood Pressure Monitoring",
    "Wound Care",
    "Dementia Care",
    "Post-Surgery Care",
  ];

  const findMatches = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      const requestBody = {
        senior_id: seniorId,
        senior_lat: seniorData?.location?.lat,
        senior_lon: seniorData?.location?.lon,
        required_skills: searchParams.required_skills,
        senior_gender: seniorData?.gender,
        senior_area: seniorData?.area,
        booking_date: searchParams.booking_date,
        start_time: searchParams.start_time,
        duration_hrs: searchParams.duration_hrs,
        top_n: 10,
      };

      const response = await axios.post(
        `${API_URL}/api/matching/find-matches`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMatches(response.data.matches);
        toast.success(
          `Found ${response.data.matches.length} matching caregivers!`
        );
      } else {
        toast.error("No matches found. Try adjusting your requirements.");
      }
    } catch (error) {
      console.error("Matching error:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to find matches. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const ScoreBreakdown = ({ breakdown, totalScore }) => {
    const scoreItems = [
      {
        label: "Distance",
        value: breakdown.distance,
        max: 30,
        color: "bg-blue-500",
      },
      {
        label: "Skills",
        value: breakdown.skill,
        max: 25,
        color: "bg-green-500",
      },
      {
        label: "Rating",
        value: breakdown.rating,
        max: 20,
        color: "bg-yellow-500",
      },
      {
        label: "Experience",
        value: breakdown.experience,
        max: 15,
        color: "bg-purple-500",
      },
      {
        label: "Gender",
        value: breakdown.gender,
        max: 5,
        color: "bg-pink-500",
      },
      {
        label: "Language",
        value: breakdown.language,
        max: 5,
        color: "bg-indigo-500",
      },
    ];

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-lg">Match Score</span>
          <span className="text-2xl font-bold text-primary">
            {totalScore.toFixed(1)}/100
          </span>
        </div>
        {scoreItems.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-semibold">
                {item.value.toFixed(1)}/{item.max}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${item.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / item.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const StarRating = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          size={16}
          className={
            i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search Parameters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-text mb-4">
          🎯 Find Perfect Match / নিখুঁত ম্যাচ খুঁজুন
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              <FiClock className="inline mr-1" /> Service Date
            </label>
            <input
              type="date"
              value={searchParams.booking_date}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  booking_date: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              <FiClock className="inline mr-1" /> Start Time
            </label>
            <input
              type="time"
              value={searchParams.start_time}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  start_time: e.target.value + ":00",
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Duration (hours)
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={searchParams.duration_hrs}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  duration_hrs: parseInt(e.target.value),
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-text mb-2">
            Required Skills (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => (
              <button
                key={skill}
                onClick={() =>
                  setSearchParams((prev) => ({
                    ...prev,
                    required_skills: prev.required_skills.includes(skill)
                      ? prev.required_skills.filter((s) => s !== skill)
                      : [...prev.required_skills, skill],
                  }))
                }
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  searchParams.required_skills.includes(skill)
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={findMatches}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Finding Best Matches...
            </span>
          ) : (
            "🔍 Find Caregivers"
          )}
        </button>
      </motion.div>

      {/* Matches Display */}
      {matches.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-text">
            Found {matches.length} Matching Caregivers
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match, index) => (
              <motion.div
                key={match.caregiver_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-text">
                        {match.name}
                      </h4>
                      <p className="text-sm text-gray-600">{match.name_bn}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {match.total_score.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500">/ 100</div>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div className="mb-3">
                    {match.available ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <FiCheckCircle size={12} /> Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        <FiXCircle size={12} /> Busy
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMapPin size={16} />
                      <span>{match.distance_km.toFixed(2)} km away</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={match.details.rating} />
                      <span className="text-xs text-gray-500">
                        ({match.details.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiClock size={16} />
                      <span>{match.details.experience_years} years exp.</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <FiDollarSign size={16} />
                      <span>৳{match.details.hourly_rate}/hr</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {match.details.services.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {match.details.services.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{match.details.services.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reason */}
                  {match.reason && (
                    <p className="text-xs text-gray-600 italic mb-4 border-l-2 border-primary pl-2">
                      {match.reason}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedMatch(match);
                        setShowDetails(true);
                      }}
                      className="flex-1 px-3 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition text-sm font-medium"
                    >
                      View Details
                    </button>
                    {match.available && (
                      <button
                        onClick={() => onBooking && onBooking(match)}
                        className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium"
                      >
                        Book Now
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && selectedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-text">
                    {selectedMatch.name}
                  </h2>
                  <p className="text-gray-600">{selectedMatch.name_bn}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">Caregiver Details</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Distance:</span>{" "}
                      {selectedMatch.distance_km.toFixed(2)} km
                    </p>
                    <p>
                      <span className="font-semibold">Experience:</span>{" "}
                      {selectedMatch.details.experience_years} years
                    </p>
                    <p>
                      <span className="font-semibold">Rate:</span> ৳
                      {selectedMatch.details.hourly_rate}/hour
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {selectedMatch.details.location}
                    </p>
                    <div>
                      <StarRating rating={selectedMatch.details.rating} />
                      <span className="text-xs text-gray-500 ml-2">
                        ({selectedMatch.details.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mt-6 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMatch.details.services.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <ScoreBreakdown
                    breakdown={selectedMatch.breakdown}
                    totalScore={selectedMatch.total_score}
                  />

                  {selectedMatch.reason && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">
                        Why this match?
                      </h4>
                      <p className="text-sm text-gray-700">
                        {selectedMatch.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t flex gap-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
                {selectedMatch.available && (
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      onBooking && onBooking(selectedMatch);
                    }}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
                  >
                    Book This Caregiver
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
