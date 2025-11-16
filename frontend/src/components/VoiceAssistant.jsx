import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// Command groups with Bangla phrases and English translations
const COMMAND_GROUPS = {
  help: {
    phrases: ["সাহায্য দরকার", "হেল্প", "সাহায্য", "help"],
    action: "help",
    translation: "Help needed",
    confirmation: "আপনি কি সাহায্য চান?",
    response: "সাহায্য আসছে",
  },
  food: {
    phrases: ["খাবার তৈরি করুন", "খাবার লাগবে", "খাবার চাই", "খাবার"],
    action: "food",
    translation: "Food request",
    confirmation: "আপনি কি খাবার চান?",
    response: "খাবার তৈরি করা হচ্ছে",
  },
  medicine: {
    phrases: ["ওষুধের সময়", "মেডিসিন", "ঔষধ", "ওষুধ খাওয়ান"],
    action: "medicine",
    translation: "Medicine reminder",
    confirmation: "আপনি কি ওষুধ খাবেন?",
    response: "ওষুধ দেওয়া হচ্ছে",
  },
  doctor: {
    phrases: ["ডাক্তার ডাকুন", "ডাক্তার লাগবে", "ডাক্তার চাই", "ডাক্তার"],
    action: "doctor",
    translation: "Call doctor",
    confirmation: "আপনি কি ডাক্তার ডাকবেন?",
    response: "ডাক্তারকে কল করা হচ্ছে",
  },
  call_family: {
    phrases: ["পরিবারকে কল করুন", "ফ্যামিলি কল", "পরিবার", "পরিবারকে ডাকুন"],
    action: "call_family",
    translation: "Call family",
    confirmation: "আপনি কি পরিবারকে কল করবেন?",
    response: "পরিবারকে কল করা হচ্ছে",
  },
  book_caregiver: {
    phrases: ["কেয়ারগিভার চাই", "কেয়ারগিভার ডাকুন", "পরিচর্যাকারী চাই"],
    action: "book_caregiver",
    translation: "Book caregiver",
    confirmation: "আপনি কি কেয়ারগিভার বুক করবেন?",
    response: "কেয়ারগিভার বুক করা হচ্ছে",
  },
};

// Mock API for triggering actions
if (typeof window !== "undefined") {
  window.ShebaAPI = {
    trigger: (action) => {
      console.log(`[Sheba API] Action triggered: ${action}`);
      // This would call actual API in production
      return Promise.resolve({ success: true, action });
    },
  };
}

export default function VoiceAssistant({ onClose }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [matchedCommand, setMatchedCommand] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setBrowserSupported(false);
      toast.error("আপনার ব্রাউজার ভয়েস সাপোর্ট করে না");
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.lang = "bn-BD";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      // Vibration requires user interaction - ignore if blocked
      try {
        window.navigator.vibrate?.(200);
      } catch (e) {
        // Silently ignore vibration errors
      }
      speak("আপনি কথা বলতে পারেন");
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      handleCommand(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);

      if (event.error === "no-speech") {
        toast.error("কোন কথা শোনা যায়নি");
        speak("কোন কথা শুনতে পাইনি। আবার চেষ্টা করুন");
      } else if (event.error === "audio-capture") {
        toast.error("মাইক কাজ করছে না");
        speak("দুঃখিত, মাইক কাজ করছে না। বোতাম টিপুন");
      } else if (event.error === "not-allowed") {
        toast.error("মাইক অনুমতি প্রয়োজন");
        speak("মাইক ব্যবহারের অনুমতি দিন");
      } else {
        toast.error("ভয়েস সনাক্ত করা যায়নি");
        speak("ভয়েস সনাক্ত করা যায়নি। আবার চেষ্টা করুন");
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    // Start listening
    try {
      recognition.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
      toast.error("ভয়েস চালু করা যায়নি");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text) => {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Wait a bit for voices to load
    const speakNow = () => {
      const utterance = new SpeechSynthesisUtterance(text);

      // Try to find Bangla voice, fallback to any available voice
      const voices = window.speechSynthesis.getVoices();
      const banglaVoice = voices.find((v) => v.lang.startsWith("bn"));
      const hindiVoice = voices.find((v) => v.lang.startsWith("hi")); // Fallback
      const defaultVoice = voices.find((v) => v.default);

      if (banglaVoice) {
        utterance.voice = banglaVoice;
        utterance.lang = banglaVoice.lang;
      } else if (hindiVoice) {
        utterance.voice = hindiVoice;
        utterance.lang = hindiVoice.lang;
      } else if (defaultVoice) {
        utterance.voice = defaultVoice;
        utterance.lang = "bn-BD";
      } else {
        utterance.lang = "bn-BD";
      }

      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Log for debugging
      console.log(`[Voice] Speaking: ${text}`);
      console.log(`[Voice] Using voice: ${utterance.voice?.name || "default"}`);
      console.log(`[Voice] Language: ${utterance.lang}`);

      utterance.onstart = () => {
        console.log("[Voice] Speech started");
        setIsSpeaking(true);
        setLastSpokenText(text);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        setIsSpeaking(false);
        // Show visual feedback if audio fails
        toast(text, { icon: "🔊", duration: 3000 });
      };

      utterance.onend = () => {
        console.log("[Voice] Speech ended");
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    // Check if voices are loaded
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      speakNow();
    } else {
      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = () => {
        speakNow();
      };
      // Fallback timeout
      setTimeout(speakNow, 100);
    }
  };

  const handleCommand = (text) => {
    const lowerText = text.toLowerCase();

    // Find matching command group
    for (const [key, commandGroup] of Object.entries(COMMAND_GROUPS)) {
      const isMatch = commandGroup.phrases.some((phrase) =>
        lowerText.includes(phrase.toLowerCase())
      );

      if (isMatch) {
        setMatchedCommand(commandGroup);
        setTranslation(commandGroup.translation);
        setShowConfirmDialog(true);
        speak(commandGroup.confirmation);
        return;
      }
    }

    // No match found
    setTranslation("Command not recognized");
    speak("বুঝতে পারিনি। আবার চেষ্টা করুন");
    toast.error("কমান্ড চিনতে পারিনি");
  };

  const handleConfirm = async () => {
    if (!matchedCommand) return;

    setIsProcessing(true);
    setShowConfirmDialog(false);

    try {
      // Trigger the action via mock API
      await window.ShebaAPI.trigger(matchedCommand.action);

      // Speak response in Bangla
      speak(matchedCommand.response);

      // Wait for speech to start before showing toast
      setTimeout(() => {
        // After response, speak confirmation
        speak("আপনার অনুরোধ গৃহীত হয়েছে");
      }, 1500);

      // Show success toast
      toast.success(matchedCommand.response, { duration: 3000 });

      // Close after speech completes
      setTimeout(() => {
        onClose();
      }, 4000);
    } catch (error) {
      console.error("Action failed:", error);
      toast.error("কমান্ড সম্পূর্ণ করা যায়নি");
      speak("দুঃখিত, সমস্যা হয়েছে। আবার চেষ্টা করুন");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setMatchedCommand(null);
    setTranscript("");
    setTranslation("");

    // Speak cancellation message
    speak("বাতিল করা হয়েছে। আবার কথা বলুন");
    toast("বাতিল করা হয়েছে", { icon: "❌" });

    // Restart listening after a delay
    setTimeout(() => {
      if (recognitionRef.current && !listening) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Failed to restart:", e);
          speak("দুঃখিত, মাইক কাজ করছে না। বোতাম টিপুন");
        }
      }
    }, 1500);
  };

  const handleRetry = () => {
    setTranscript("");
    setTranslation("");
    setMatchedCommand(null);

    if (recognitionRef.current && !listening) {
      try {
        speak("আপনি কথা বলতে পারেন");
        recognitionRef.current.start();
        toast.success("মাইক চালু হয়েছে");
      } catch (e) {
        console.error("Failed to restart:", e);
        toast.error("মাইক চালু করা যায়নি");
        speak("দুঃখিত, মাইক কাজ করছে না। বোতাম টিপুন");
      }
    }
  };

  if (!browserSupported) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ভয়েস সাপোর্ট নেই
          </h2>
          <p className="text-xl text-gray-700 mb-2 leading-relaxed">
            দুঃখিত, আপনার ব্রাউজার ভয়েস কমান্ড সাপোর্ট করে না।
          </p>
          <p className="text-lg text-gray-600 mb-6">
            অনুগ্রহ করে Chrome বা Edge ব্রাউজার ব্যবহার করুন।
          </p>
          <p className="text-md text-gray-500 mb-6 bg-yellow-50 p-3 rounded-lg">
            💡 বোতাম টিপে সাহায্য নিতে পারেন
          </p>
          <button
            onClick={onClose}
            className="w-full py-4 bg-primary text-white text-xl rounded-xl font-bold hover:bg-primary/90 transition"
          >
            বন্ধ করুন
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center max-w-lg w-full"
      >
        {/* Microphone Button with Pulsing Animation */}
        <div className="relative mb-6">
          {listening && (
            <>
              {/* Pulsing waves */}
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/20"
                animate={{
                  scale: [1, 1.5, 1.8],
                  opacity: [0.6, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/30"
                animate={{
                  scale: [1, 1.3, 1.5],
                  opacity: [0.7, 0.4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.3,
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/40"
                animate={{
                  scale: [1, 1.2, 1.3],
                  opacity: [0.8, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.6,
                }}
              />
            </>
          )}

          {/* Microphone Button */}
          <motion.button
            className={`relative w-32 h-32 rounded-full flex items-center justify-center text-white shadow-2xl transition-all ${
              listening
                ? "bg-gradient-to-br from-primary to-primary/80"
                : "bg-gradient-to-br from-gray-400 to-gray-500"
            }`}
            animate={
              listening
                ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 10px 30px rgba(0,0,0,0.2)",
                      "0 15px 40px rgba(0,0,0,0.3)",
                      "0 10px 30px rgba(0,0,0,0.2)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 1.5, repeat: listening ? Infinity : 0 }}
            onClick={handleRetry}
            disabled={isProcessing}
          >
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </motion.button>
        </div>

        {/* Status Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-primary mb-2"
        >
          {listening
            ? "কথা বলুন..."
            : isProcessing
            ? "প্রক্রিয়াকরণ..."
            : isSpeaking
            ? "🔊 বলছি..."
            : "ক্লিক করুন"}
        </motion.div>

        {/* Speaking Indicator */}
        {isSpeaking && lastSpokenText && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-4 w-full"
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-2xl"
              >
                🔊
              </motion.div>
              <p className="text-green-700 font-bold">সিস্টেম বলছে:</p>
            </div>
            <p className="text-lg text-green-800">{lastSpokenText}</p>
          </motion.div>
        )}

        {/* Recognized Text */}
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="bg-gray-50 rounded-xl p-4 mb-2">
              <p className="text-sm text-gray-500 mb-1">আপনি বলেছেন:</p>
              <p className="text-lg text-gray-800 font-semibold">
                {transcript}
              </p>
            </div>
            {translation && (
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-600 mb-1">English:</p>
                <p className="text-md text-blue-800">{translation}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Help Text */}
        {!transcript && !listening && (
          <div className="text-center text-gray-500 text-sm mt-4">
            <p className="mb-2">বলুন:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="bg-gray-100 px-2 py-1 rounded">
                সাহায্য দরকার
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">খাবার চাই</span>
              <span className="bg-gray-100 px-2 py-1 rounded">ওষুধের সময়</span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                ডাক্তার ডাকুন
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                পরিবারকে কল করুন
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                কেয়ারগিভার চাই
              </span>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="w-full mt-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-800 font-bold transition disabled:opacity-50"
        >
          বাতিল করুন
        </button>
      </motion.div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && matchedCommand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">
                  {matchedCommand.action === "help" && "🆘"}
                  {matchedCommand.action === "food" && "🍽️"}
                  {matchedCommand.action === "medicine" && "💊"}
                  {matchedCommand.action === "doctor" && "👨‍⚕️"}
                  {matchedCommand.action === "call_family" && "📞"}
                  {matchedCommand.action === "book_caregiver" && "👩‍⚕️"}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  নিশ্চিত করুন
                </h3>
                <p className="text-lg text-gray-700">
                  {matchedCommand.confirmation}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-800 font-bold transition"
                >
                  না
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition"
                >
                  হ্যাঁ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
