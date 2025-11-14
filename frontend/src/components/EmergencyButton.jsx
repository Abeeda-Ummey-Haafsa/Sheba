import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { supabase } from "../supabaseClient";
import { FaBell, FaTimes } from "react-icons/fa";

// Mock alarm sound (replace with real .mp3 in production)
const SIREN_URL =
  "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae3e2.mp3";

export default function EmergencyButton({ onClose }) {
  const [countdown, setCountdown] = useState(5);
  const [cancelled, setCancelled] = useState(false);
  const alarmRef = useRef(null);
  const [sending, setSending] = useState(false);

  // Play alarm and vibrate
  useEffect(() => {
    alarmRef.current = new Howl({ src: [SIREN_URL], loop: true, volume: 1 });
    alarmRef.current.play();
    window.navigator.vibrate?.([200, 100, 200, 100, 200]);
    window.speechSynthesis.speak(
      new window.SpeechSynthesisUtterance("জরুরি সাহায্য চাপা হয়েছে")
    );
    return () => alarmRef.current && alarmRef.current.stop();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown === 0) {
      if (!cancelled) handleSendAlerts();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, cancelled]);

  // Send alerts after countdown
  const handleSendAlerts = async () => {
    setSending(true);
    // 1. Push notification (mock)
    await supabase.from("push_notifications").insert({
      type: "emergency",
      message: "EMERGENCY: আব্দুল করিমের জরুরি সাহায্য প্রয়োজন!",
      senior_id: "00000000-0000-0000-0000-000000000003", // Replace with real
      timestamp: new Date().toISOString(),
    });
    // 2. SMS (mock)
    console.log("শেভা অ্যালার্ট: ধানমন্ডি। কল করুন ৯৯৯।");
    // 3. Notify nearest caregiver (mock query)
    await supabase.from("emergency_alerts").insert({
      senior_id: "00000000-0000-0000-0000-000000000003",
      status: "pending",
      location: "23.7,90.4",
      created_at: new Date().toISOString(),
    });
    // 4. Emergency log
    await supabase.from("emergency_logs").insert({
      senior_id: "00000000-0000-0000-0000-000000000003",
      location: "23.7,90.4",
      timestamp: new Date().toISOString(),
    });
    // 5. Start GPS tracking (mock)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Send location every 10s (mock)
          setInterval(() => {
            supabase.from("emergency_logs").insert({
              senior_id: "00000000-0000-0000-0000-000000000003",
              location: `${pos.coords.latitude},${pos.coords.longitude}`,
              timestamp: new Date().toISOString(),
            });
          }, 10000);
        },
        (err) => {
          console.warn("GPS denied", err);
        }
      );
    }
    setSending(false);
    onClose();
  };

  // Cancel emergency
  const handleCancel = () => {
    setCancelled(true);
    alarmRef.current && alarmRef.current.stop();
    window.navigator.vibrate?.([100]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm w-full">
        <FaBell size={80} className="text-red-500 animate-pulse mb-4" />
        <div className="text-3xl font-bold text-red-600 mb-2">
          জরুরি সাহায্য পাঠানো হচ্ছে
        </div>
        <div className="text-2xl text-gray-800 mb-4">
          {countdown > 0
            ? `বাতিল করতে ${countdown} সেকেন্ড`
            : sending
            ? "পাঠানো হচ্ছে..."
            : "সম্পন্ন"}
        </div>
        {countdown > 0 && (
          <button
            className="w-full h-16 bg-gray-300 rounded-xl text-2xl font-bold text-gray-800 mt-2 flex items-center justify-center"
            onClick={handleCancel}
            aria-label="বাতিল করুন"
          >
            <FaTimes size={32} className="mr-2" /> বাতিল করুন
          </button>
        )}
      </div>
    </div>
  );
}
