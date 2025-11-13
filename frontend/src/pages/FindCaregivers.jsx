import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiSearch, FiX, FiStar, FiMapPin, FiPhone } from "react-icons/fi";

const mockCaregivers = [
  {
    id: 1,
    name: "Rahim Khan",
    name_bn: "রহিম খান",
    age: 35,
    gender: "male",
    gender_bn: "পুরুষ",
    location: "Dhaka",
    location_bn: "ঢাকা",
    skills: ["Personal Care", "Nursing", "Medication"],
    rating: 4.8,
    reviews: 42,
    hourly_rate: 300,
    distance_km: 2,
    photo: "https://via.placeholder.com/150/14B8A6/ffffff?text=RK",
    bio: "Experienced in elderly care with 8+ years",
    verified: true,
  },
  {
    id: 2,
    name: "Fatema Begum",
    name_bn: "ফাতেমা বেগম",
    age: 28,
    gender: "female",
    gender_bn: "মহিলা",
    location: "Dhaka",
    location_bn: "ঢাকা",
    skills: ["Hygiene Support", "Companionship", "Meal Prep"],
    rating: 4.9,
    reviews: 38,
    hourly_rate: 250,
    distance_km: 5,
    photo: "https://via.placeholder.com/150/FB923C/ffffff?text=FB",
    bio: "Compassionate caregiver specialized in companionship",
    verified: true,
  },
  {
    id: 3,
    name: "Karim Ali",
    name_bn: "করিম আলী",
    age: 42,
    gender: "male",
    gender_bn: "পুরুষ",
    location: "Gulshan",
    location_bn: "গুলশান",
    skills: ["Physiotherapy", "Mobility Assistance", "Rehabilitation"],
    rating: 4.7,
    reviews: 25,
    hourly_rate: 400,
    distance_km: 8,
    photo: "https://via.placeholder.com/150/3B82F6/ffffff?text=KA",
    bio: "Physical therapy specialist for post-injury recovery",
    verified: true,
  },
  {
    id: 4,
    name: "Nasrin Ahmed",
    name_bn: "নাসরিন আহমেদ",
    age: 31,
    gender: "female",
    gender_bn: "মহিলা",
    location: "Dhanmondi",
    location_bn: "ধানমণ্ডি",
    skills: ["Diabetes Care", "Nutrition", "Medication"],
    rating: 4.6,
    reviews: 31,
    hourly_rate: 280,
    distance_km: 3,
    photo: "https://via.placeholder.com/150/10B981/ffffff?text=NA",
    bio: "Specialized in chronic disease management",
    verified: true,
  },
  {
    id: 5,
    name: "Sujon Saha",
    name_bn: "সুজন সাহা",
    age: 38,
    gender: "male",
    gender_bn: "পুরুষ",
    location: "Mirpur",
    location_bn: "মিরপুর",
    skills: ["Palliative Care", "Companionship", "Personal Care"],
    rating: 4.8,
    reviews: 45,
    hourly_rate: 320,
    distance_km: 12,
    photo: "https://via.placeholder.com/150/EF4444/ffffff?text=SS",
    bio: "End-of-life care specialist with compassion",
    verified: true,
  },
  {
    id: 6,
    name: "Raiya Khan",
    name_bn: "রাইয়া খান",
    age: 26,
    gender: "female",
    gender_bn: "মহিলা",
    location: "Banani",
    location_bn: "বনানী",
    skills: ["Meal Prep", "Hygiene Support", "Companionship"],
    rating: 4.5,
    reviews: 18,
    hourly_rate: 220,
    distance_km: 6,
    photo: "https://via.placeholder.com/150/14B8A6/ffffff?text=RK2",
    bio: "Young caregiver eager to help with daily activities",
    verified: false,
  },
];

const allSkills = [
  { en: "Personal Care", bn: "ব্যক্তিগত যত্ন" },
  { en: "Medication", bn: "ওষুধ" },
  { en: "Physiotherapy", bn: "ফিজিওথেরাপি" },
  { en: "Companionship", bn: "সঙ্গ দেওয়া" },
  { en: "Nursing", bn: "নার্সিং" },
  { en: "Palliative Care", bn: "প্যালিয়েটিভ যত্ন" },
  { en: "Hygiene Support", bn: "স্বাস্থ্যবিধি সহায়তা" },
  { en: "Meal Prep", bn: "খাবার প্রস্তুতি" },
];

export default function FindCaregivers() {
  const [caregivers, setCaregivers] = useState(mockCaregivers);
  const [loading, setLoading] = useState(false);
  const [filteredCaregivers, setFilteredCaregivers] = useState(mockCaregivers);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filters, setFilters] = useState({
    gender: "",
    skills: [],
    distance: 50,
    priceMin: 100,
    priceMax: 1000,
  });

  useEffect(() => {
    let result = caregivers;
    if (searchQuery) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filters.gender)
      result = result.filter((c) => c.gender === filters.gender);
    if (filters.skills.length > 0) {
      result = result.filter((c) =>
        filters.skills.some((skill) => c.skills.includes(skill))
      );
    }
    result = result.filter((c) => c.distance_km <= filters.distance);
    result = result.filter(
      (c) =>
        c.hourly_rate >= filters.priceMin && c.hourly_rate <= filters.priceMax
    );
    setFilteredCaregivers(result);
  }, [searchQuery, filters, caregivers]);

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
      <span className="text-sm text-gray-600 ml-1">{rating}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-text mb-2">Find Caregivers</h1>
          <p className="text-gray-600">যত্নকারী খুঁজুন</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <FiX className="text-gray-400" />
              </button>
            )}
          </div>
        </motion.div>

        <div className="flex gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${
              showFilters ? "block" : "hidden"
            } md:block md:w-64 flex-shrink-0`}
          >
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg text-text mb-6">
                Filters / ফিল্টার
              </h3>
              <div className="mb-6 pb-6 border-b">
                <label className="block font-semibold text-text mb-3">
                  Gender / লিঙ্গ
                </label>
                {[
                  { value: "male", label: "Male / পুরুষ" },
                  { value: "female", label: "Female / মহিলা" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 mb-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={filters.gender === option.value}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              <div className="mb-6 pb-6 border-b">
                <label className="block font-semibold text-text mb-3">
                  Skills / দক্ষতা
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allSkills.map((skill) => (
                    <label
                      key={skill.en}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.skills.includes(skill.en)}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            skills: prev.skills.includes(skill.en)
                              ? prev.skills.filter((s) => s !== skill.en)
                              : [...prev.skills, skill.en],
                          }))
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700 text-sm">{skill.en}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6 pb-6 border-b">
                <label className="block font-semibold text-text mb-3">
                  Distance / দূরত্ব: {filters.distance} km
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={filters.distance}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      distance: parseInt(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>
              <button
                onClick={() =>
                  setFilters({
                    gender: "",
                    skills: [],
                    distance: 50,
                    priceMin: 100,
                    priceMax: 1000,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Clear / পরিষ্কার
              </button>
            </div>
          </motion.div>

          <div className="flex-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden mb-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <p className="text-gray-600 mb-6">
              Found {filteredCaregivers.length} caregiver
              {filteredCaregivers.length !== 1 ? "s" : ""}
            </p>

            {filteredCaregivers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredCaregivers.map((caregiver, index) => (
                    <motion.div
                      key={caregiver.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group"
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={caregiver.photo}
                          alt={caregiver.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        {caregiver.verified && (
                          <div className="absolute top-3 right-3 bg-success text-white px-2 py-1 rounded-full text-xs font-semibold">
                            ✓ Verified
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-text mb-1">
                          {caregiver.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {caregiver.name_bn}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          {caregiver.age} years, {caregiver.gender_bn}
                        </p>
                        <div className="mb-3">
                          <StarRating rating={caregiver.rating} />
                        </div>
                        <div className="mb-3 flex flex-wrap gap-2">
                          {caregiver.skills.slice(0, 2).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <FiMapPin size={16} />
                          <span>
                            {caregiver.location} ({caregiver.distance_km} km)
                          </span>
                        </div>
                        <p className="font-bold text-primary mb-4">
                          ৳{caregiver.hourly_rate}/hour
                        </p>
                        <div className="space-y-2">
                          <button
                            onClick={() => setSelectedProfile(caregiver)}
                            className="w-full px-3 py-2 bg-gray-100 text-text rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => setSelectedBooking(caregiver)}
                            className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No caregivers found. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProfile(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-text">
                    {selectedProfile.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProfile.photo}
                    alt={selectedProfile.name}
                    className="w-full rounded-lg mb-4"
                  />
                  <div className="space-y-3 text-sm">
                    <p>
                      <span className="font-semibold">Age:</span>{" "}
                      {selectedProfile.age}
                    </p>
                    <p>
                      <span className="font-semibold">Gender:</span>{" "}
                      {selectedProfile.gender_bn}
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {selectedProfile.location}
                    </p>
                    <p>
                      <StarRating rating={selectedProfile.rating} />
                    </p>
                    <p>
                      <span className="font-semibold">Rate:</span> ৳
                      {selectedProfile.hourly_rate}/hour
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-3">About</h3>
                  <p className="text-gray-700 mb-6">{selectedProfile.bio}</p>
                  <h3 className="font-bold text-lg mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProfile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProfile(null);
                      setSelectedBooking(selectedProfile);
                    }}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-md w-full p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-text">Book Caregiver</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="mb-6 p-4 bg-primary/5 rounded-lg">
                <p className="font-semibold text-text mb-1">
                  {selectedBooking.name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  ৳{selectedBooking.hourly_rate}/hour
                </p>
                <StarRating rating={selectedBooking.rating} />
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Booking request sent!");
                  setSelectedBooking(null);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Service Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    defaultValue="2"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
