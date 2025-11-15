import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";

export default function SeniorSetupScreen() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Accept either a 6-digit numeric code or a development mock pin like MOCK-XXXX
    const isNumeric6 = /^[0-9]{6}$/.test(pin);
    const isMockPin = /^MOCK-[A-Z0-9]{4,16}$/.test(pin);
    if (!isNumeric6 && !isMockPin) {
      toast.error(
        "দয়া করে ৬ অঙ্কের কোড অথবা MOCK-পিন লিখুন (উদাহরণ: MOCK-AB12)"
      );
      return;
    }
    setLoading(true);
    try {
      if (isMockPin) {
        // Development: check localStorage mock mapping
        const raw = localStorage.getItem("mock_senior_devices");
        const map = raw ? JSON.parse(raw) : {};
        const mock = map[pin];
        if (mock && mock.device_id) {
          localStorage.setItem("seba_device_id", mock.device_id);
          toast.success("Mock device paired. অ্যাপে ফিরে যান।");
          navigate("/");
          return;
        } else {
          toast.error(
            "Mock pin পাওয়া যায়নি। পরিবার থেকে কোডটি গ্রহণ করুন বা প্রথমে প্রোফাইলে পিন তৈরি করুন।"
          );
          return;
        }
      }

      // Real flow: lookup setup_pin in Supabase
      const { data, error } = await supabase
        .from("senior_profiles")
        .select("*, devices:senior_devices(*)")
        .eq("setup_pin", pin)
        .single();

      if (error || !data) {
        toast.error("কোড সঠিক নয়। পরিবারের সাথে যোগাযোগ করুন।");
        return;
      }

      // If found, store device id locally (family should have generated pairing)
      const device = data.devices?.[0];
      if (device && device.device_id) {
        localStorage.setItem("seba_device_id", device.device_id);
        toast.success("ডিভাইস সংযুক্তি সফল। অ্যাপে ফিরে যান।");
        navigate("/");
      } else {
        toast.error(
          "পেয়ার করা ডিভাইস পাওয়া যায়নি। পরিবারের সাথে যোগাযোগ করুন।"
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("ডিভাইস যাচাইকরণে ত্রুটি।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg"
      >
        <h1 className="text-3xl font-extrabold text-teal-600 mb-4">
          সেবা সেটআপ
        </h1>
        <p className="mb-4 text-lg">
          পরিবার আপনাকে একটি ৬-অঙ্কের কোড পাঠিয়েছে। কোড টাইপ করুন বা QR স্ক্যান
          করুন।
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            autoFocus
            className="w-full h-16 text-2xl p-4 border rounded-lg"
            value={pin}
            onChange={(e) => {
              // allow alphanumeric and hyphen; convert to uppercase and cap length
              const cleaned = e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9-]/g, "")
                .slice(0, 20);
              setPin(cleaned);
            }}
            placeholder="৬ অঙ্কের কোড বা MOCK-পিন (e.g. MOCK-AB12)"
            inputMode="text"
            aria-label="৬ অঙ্কের কোড বা MOCK-পিন"
            maxLength={20}
          />
          <div className="text-xs text-gray-500">
            Enter a 6-digit code or a mock pin like <code>MOCK-XXXX</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-teal-600 text-white text-2xl rounded-lg font-bold"
          >
            {loading ? "যাচাই করা হচ্ছে..." : "কোড যাচাই করুন"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full h-12 mt-2 text-teal-600 border border-teal-600 rounded-lg"
          >
            ফিরে যান
          </button>
        </form>
      </motion.div>
    </div>
  );
}
