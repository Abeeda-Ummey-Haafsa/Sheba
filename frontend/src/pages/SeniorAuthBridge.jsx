import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import Home from "./Home";

// This component wraps the home page and checks for senior device pairing on first load
export default function SeniorAuthBridge() {
  const navigate = useNavigate();
  const { loginAsSenior, loading: authLoading, isAuthenticated } = useAuth();
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Only run once when component first mounts
    if (checked) return;

    let mounted = true;

    const checkSenior = async () => {
      try {
        // TESTING MODE: Skip device ID check, just show home
        console.log("[SeniorAuthBridge] Testing mode - skipping device check");
        if (mounted) {
          setChecking(false);
          setChecked(true);
        }
        return;

        /* DISABLED FOR TESTING - Original device check logic
        const deviceId = localStorage.getItem("seba_device_id");
        console.log(
          "[SeniorAuthBridge] Device ID from localStorage:",
          deviceId
        );

        if (!deviceId) {
          console.log("[SeniorAuthBridge] No device ID found, showing home");
          if (mounted) {
            setChecking(false);
            setChecked(true);
          }
          return;
        }
        */

        console.log("[SeniorAuthBridge] Found device ID, querying Supabase...");

        // Query senior_devices and join senior_profiles
        const { data, error } = await supabase
          .from("senior_devices")
          .select("*, senior_profiles(*)")
          .eq("device_id", deviceId)
          .single();

        if (!mounted) return;

        let senior = null;

        if (!error && data && data.senior_profiles) {
          senior = data.senior_profiles;
        } else {
          // Only log once on mount, suppress 406 errors (table doesn't exist yet)
          if (
            error?.code !== "PGRST116" &&
            !sessionStorage.getItem("senior_check_logged")
          ) {
            console.warn(
              "[SeniorAuthBridge] Device not found in Supabase:",
              error?.message || "No profile"
            );
            sessionStorage.setItem("senior_check_logged", "true");
          }

          // Fallback: check for local mock mapping stored in localStorage
          try {
            const raw = localStorage.getItem("mock_senior_devices");
            if (raw) {
              const map = JSON.parse(raw || "{}");
              const mock = map[deviceId];
              if (mock) {
                console.log(
                  "[SeniorAuthBridge] Found mock senior for device:",
                  deviceId
                );
                senior = mock;
              }
            }
          } catch (err) {
            console.error(
              "[SeniorAuthBridge] Failed to read mock_senior_devices:",
              err
            );
          }
        }

        if (!senior) {
          // No senior found in Supabase or mock map
          console.warn(
            "[SeniorAuthBridge] No senior profile found for device",
            deviceId
          );
          localStorage.removeItem("seba_device_id");
          toast.error(
            "ডিভাইস সংযুক্তি পাওয়া যায়নি। পরিবার সেটআপ পরীক্ষা করুন।"
          );
          setChecking(false);
          setTimeout(() => {
            navigate("/senior-setup", { replace: true });
          }, 2000);
          return;
        }
        console.log(
          "[SeniorAuthBridge] Senior found:",
          senior.full_name || senior.name
        );

        // Programmatically mark senior as authenticated
        loginAsSenior(senior);

        // Haptic and voice feedback
        window.navigator.vibrate?.([200]);
        window.speechSynthesis.speak(
          new window.SpeechSynthesisUtterance("সেবা প্রস্তুত।")
        );

        // Navigate to senior interface after brief delay
        if (mounted) {
          setTimeout(() => {
            navigate("/senior", { replace: true });
          }, 1500);
        }
      } catch (err) {
        console.error("[SeniorAuthBridge] Error:", err);
        if (mounted) {
          toast.error("ডিভাইস সংযোগে সমস্যা। পরিবারের সাথে যোগাযোগ করুন।");
          setChecking(false);
          setChecked(true);
        }
      }
    };

    checkSenior();
    return () => {
      mounted = false;
    };
  }, [checked, loginAsSenior, navigate]);

  // If still checking, show loading screen
  if (checking) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-6"
        >
          <h1 className="text-teal-600 text-4xl font-extrabold mb-4">সেবা</h1>
          <p className="text-2xl font-semibold">
            অপেক্ষা করুন... আপনার জন্য প্রস্তুত হচ্ছে
          </p>
        </motion.div>
      </div>
    );
  }

  // If checked and not authenticating as senior, show home
  return isAuthenticated ? null : <Home />;
}
