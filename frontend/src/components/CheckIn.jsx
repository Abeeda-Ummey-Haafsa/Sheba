import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import {
  FiMapPin,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";

/**
 * CheckIn Component - GPS-based check-in for caregivers
 * Calculates distance to senior location using Haversine formula
 * Requires: booking_id, senior_location (lat, lng)
 */
export default function CheckIn({
  bookingId,
  seniorLat,
  seniorLng,
  seniorName = "Senior",
  onCheckInSuccess,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const watchIdRef = useRef(null);

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Convert to meters
  };

  const convertToDevnagari = (num) => {
    const devnagariDigits = ["০", "১", "२", "३", "४", "५", "६", "७", "८", "९"];
    return String(num)
      .split("")
      .map((d) => (devnagariDigits[d] ? devnagariDigits[d] : d))
      .join("");
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setErrorMessage("");
    setStatus("idle");

    try {
      if (!("geolocation" in navigator)) {
        throw new Error(
          "অবস্থান সেবা উপলব্ধ নয় / GPS not available on this device"
        );
      }

      // Request high accuracy location
      const position = await new Promise((resolve, reject) => {
        const timeout = setTimeout(
          () =>
            reject(
              new Error(
                "অবস্থান যাচাই সময় শেষ / Location verification timeout"
              )
            ),
          15000
        );

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timeout);
            resolve(pos);
          },
          (error) => {
            clearTimeout(timeout);
            let message =
              "অবস্থান অনুমতি প্রয়োজন / Location permission denied";
            if (error.code === 1) {
              message =
                "অনুগ্রহ করে অবস্থান অনুমতি দিন / Please allow location access";
            } else if (error.code === 2) {
              message =
                "অবস্থান নেটওয়ার্ক সমস্যা / Network error getting location";
            } else if (error.code === 3) {
              message =
                "অবস্থান যাচাই সময় শেষ / Location verification timeout";
            }
            reject(new Error(message));
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
      });

      const { latitude, longitude, accuracy } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude, accuracy });

      // Calculate distance to senior
      const dist = calculateDistance(latitude, longitude, seniorLat, seniorLng);
      setDistance(dist);

      const MAX_DISTANCE = 100; // 100 meters

      if (dist <= MAX_DISTANCE) {
        // Success - within acceptable range
        const now = new Date();
        setCheckInTime(now);
        setStatus("success");

        // Record check-in in Supabase
        const { error: insertError } = await supabase.from("checkins").insert([
          {
            booking_id: bookingId,
            caregiver_lat: latitude,
            caregiver_lng: longitude,
            accuracy,
            distance: dist,
            status: "completed",
            created_at: now.toISOString(),
          },
        ]);

        if (insertError) {
          console.error("Error saving check-in:", insertError);
          toast.error("Check-in recorded but failed to save to database");
        } else {
          toast.success("✓ সফলভাবে চেক-ইন সম্পন্ন / Check-in successful!");
        }

        if (onCheckInSuccess) {
          onCheckInSuccess({
            lat: latitude,
            lng: longitude,
            distance: dist,
            timestamp: now,
          });
        }
      } else {
        // Too far from location
        setStatus("error");
        setErrorMessage(
          `আপনি সঠিক অবস্থানে নেই / Not at location. ${Math.round(
            dist
          )}m দূরে / away`
        );
        toast.error(
          `আপনি ${Math.round(dist)}m দূরে আছেন / You are ${Math.round(
            dist
          )}m away`
        );
      }
    } catch (error) {
      console.error("Check-in error:", error);
      setStatus("error");
      setErrorMessage(
        error.message || "অবস্থান যাচাই ব্যর্থ / Location verification failed"
      );
      toast.error(error.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md p-6 md:p-8 shadow-xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">
              চেক-ইন করুন / Check In
            </h2>
            <p className="text-gray-600 text-lg">
              {seniorName} অবস্থানে / At {seniorName}'s location
            </p>
          </div>

          {/* Status Content */}
          {status === "idle" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-accent rounded-lg p-4 text-center">
                <FiMapPin className="mx-auto mb-2 text-accent" size={32} />
                <p className="text-sm md:text-base text-text font-medium">
                  অনুমতি দিন আপনার অবস্থান শেয়ার করতে
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  Allow location sharing
                </p>
              </div>

              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full btn-primary min-h-16 text-lg font-bold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <FiLoader size={24} />
                    </motion.div>
                    অবস্থান যাচাই হচ্ছে...
                  </>
                ) : (
                  <>
                    <FiMapPin size={24} />
                    আমার অবস্থান যাচাই করুন / Verify My Location
                  </>
                )}
              </button>
            </div>
          )}

          {/* Success Status */}
          {status === "success" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-success/10 border border-success rounded-lg p-6 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="flex justify-center mb-4"
                >
                  <FiCheckCircle className="text-success" size={64} />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold text-success mb-2">
                  সফলভাবে চেক-ইন সম্পন্ন!
                </h3>
                <p className="text-gray-600 text-base">Check-in successful!</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm md:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">সময় / Time:</span>
                  <span className="font-semibold">
                    {checkInTime?.toLocaleTimeString("bn-BD")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">দূরত্ব / Distance:</span>
                  <span className="font-semibold text-success">
                    {Math.round(distance)}m ✓
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">নির্ভুলতা / Accuracy:</span>
                  <span className="font-semibold">
                    ±{Math.round(currentLocation?.accuracy || 0)}m
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full btn-primary min-h-14 text-lg font-bold"
              >
                চলুন / Continue
              </button>
            </motion.div>
          )}

          {/* Error Status */}
          {status === "error" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-error/10 border border-error rounded-lg p-6 text-center">
                <FiAlertCircle className="mx-auto mb-4 text-error" size={48} />
                <h3 className="text-xl md:text-2xl font-bold text-error mb-2">
                  চেক-ইন ব্যর্থ
                </h3>
                <p className="text-error mb-4">{errorMessage}</p>
                {distance && (
                  <p className="text-sm text-gray-600">
                    আপনি {Math.round(distance)}m দূরে আছেন
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckIn}
                  className="w-full btn-primary min-h-14 text-base font-bold"
                >
                  আবার চেষ্টা করুন / Try Again
                </button>
                <button
                  onClick={onClose}
                  className="w-full btn-outline min-h-14 text-base font-bold"
                >
                  বন্ধ করুন / Close
                </button>
                <button
                  onClick={() => {
                    toast.info(
                      "সাপোর্ট দলকে যোগাযোগ করুন / Contacting support..."
                    );
                    // TODO: Implement support contact
                  }}
                  className="w-full px-4 py-3 text-base font-bold border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  সাপোর্ট যোগাযোগ / Contact Support
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
