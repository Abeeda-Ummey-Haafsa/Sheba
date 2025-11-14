import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EmergencyButton from "../components/EmergencyButton";
import VoiceAssistant from "../components/VoiceAssistant";
import { FaBell, FaMicrophone, FaPhoneAlt, FaUser } from "react-icons/fa";
import moment from "moment";
import "moment/locale/bn";

// Utility: Convert English numerals to Bengali
const toBn = (str) => str.replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

export default function SeniorInterface() {
  const { user, userMetadata } = useAuth();
  const [now, setNow] = useState(moment());
  const [showVoice, setShowVoice] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const navigate = useNavigate();

  // Bengali time update
  useEffect(() => {
    moment.locale("bn");
    const timer = setInterval(() => setNow(moment()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock: Scheduled visit (replace with Supabase real-time query)
  const scheduledVisit = {
    caregiver: {
      name: "ফাতেমা বেগম",
      photo: "/caregiver.jpg", // Place a sample photo in public/
    },
    etaMinutes: 15,
    etaEnd: moment().add(15, "minutes"),
  };

  // Countdown for ETA
  const [eta, setEta] = useState(scheduledVisit.etaMinutes);
  useEffect(() => {
    if (!scheduledVisit) return;
    const interval = setInterval(() => {
      const diff = scheduledVisit.etaEnd.diff(moment(), "minutes");
      setEta(diff > 0 ? diff : 0);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Button handlers
  const handleEmergency = () => setShowEmergency(true);
  const handleVoice = () => setShowVoice(true);
  const handleCallFamily = () => {
    window.navigator.vibrate?.([200, 100, 200]);
    window.speechSynthesis.speak(
      new window.SpeechSynthesisUtterance("পরিবারকে কল করা হচ্ছে")
    );
    window.location.href = "tel:017XXXXXXXX"; // Replace with real contact
  };
  const handleCallCaregiver = () => {
    window.navigator.vibrate?.([200, 100, 200]);
    window.speechSynthesis.speak(
      new window.SpeechSynthesisUtterance("কেয়ারগিভারকে কল করা হচ্ছে")
    );
    window.location.href = "tel:018XXXXXXXX"; // Replace with real caregiver
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-6 pb-4 px-2">
      {/* Header */}
      <div className="w-full flex flex-col items-center mb-2">
        <span
          className="text-[64px] font-extrabold text-teal-600 select-none"
          aria-label="শেবা"
        >
          শেবা
        </span>
        <span
          className="text-[48px] font-bold text-black mt-2"
          aria-live="polite"
        >
          {toBn(now.format("hh:mm A"))}
        </span>
      </div>
      {/* Scheduled Visit Banner */}
      {scheduledVisit && (
        <div
          className="w-full flex items-center bg-orange-100 border-4 border-orange-400 animate-pulse rounded-2xl px-4 py-3 mb-4"
          style={{ maxWidth: 480 }}
        >
          <img
            src={scheduledVisit.caregiver.photo}
            alt="Caregiver"
            className="w-20 h-20 rounded-full border-4 border-orange-300 mr-4"
          />
          <div className="flex-1">
            <div className="text-lg font-bold text-orange-700 mb-1">
              আপনার কেয়ারগিভার: {scheduledVisit.caregiver.name}
            </div>
            <div className="text-base text-orange-800">
              আসছেন {toBn(eta.toString())} মিনিটে
            </div>
          </div>
        </div>
      )}
      {/* Main Buttons */}
      <div
        className="flex flex-col gap-6 w-full items-center mt-2"
        style={{ maxWidth: 480 }}
      >
        <button
          className="w-full h-[150px] bg-red-500 rounded-2xl flex flex-col items-center justify-center text-white text-[40px] font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300 animate-pulse"
          style={{ minWidth: "80vw" }}
          aria-label="জরুরি সাহায্য"
          onClick={handleEmergency}
        >
          <FaBell size={64} className="mb-2" />
          জরুরি সাহায্য
        </button>
        <button
          className="w-full h-[150px] bg-blue-500 rounded-2xl flex flex-col items-center justify-center text-white text-[36px] font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
          style={{ minWidth: "80vw" }}
          aria-label="কথা বলুন"
          onClick={handleVoice}
        >
          <FaMicrophone size={64} className="mb-2" />
          কথা বলুন
        </button>
        <button
          className="w-full h-[150px] bg-green-500 rounded-2xl flex flex-col items-center justify-center text-white text-[36px] font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300"
          style={{ minWidth: "80vw" }}
          aria-label="পরিবারকে কল করুন"
          onClick={handleCallFamily}
        >
          <FaPhoneAlt size={64} className="mb-2" />
          পরিবারকে কল করুন
        </button>
        <button
          className="w-full h-[150px] bg-orange-400 rounded-2xl flex flex-col items-center justify-center text-white text-[36px] font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-300"
          style={{ minWidth: "80vw" }}
          aria-label="কেয়ারগিভার ডাকুন"
          onClick={handleCallCaregiver}
        >
          <FaUser size={64} className="mb-2" />
          কেয়ারগিভার ডাকুন
        </button>
      </div>
      {/* Emergency Modal */}
      {showEmergency && (
        <EmergencyButton onClose={() => setShowEmergency(false)} />
      )}
      {/* Voice Assistant Modal */}
      {showVoice && <VoiceAssistant onClose={() => setShowVoice(false)} />}
    </div>
  );
}
