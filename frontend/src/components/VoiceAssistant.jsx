import React, { useEffect, useRef, useState } from "react";

const COMMANDS = [
  { phrase: "পানি দিন", action: "notify_caregiver" },
  { phrase: "ঔষধ খাওয়ান", action: "medication_reminder" },
  { phrase: "টিভি চালান", action: "tv_on" },
];

export default function VoiceAssistant({ onClose }) {
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setResult("আপনার ডিভাইসে ভয়েস সাপোর্ট নেই");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "bn-BD";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setResult(transcript);
      handleCommand(transcript);
    };
    recognition.onerror = (e) => setResult("ভয়েস সনাক্ত করা যায়নি");
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
    window.navigator.vibrate?.([200]);
    window.speechSynthesis.speak(
      new window.SpeechSynthesisUtterance("আপনি কথা বলতে পারেন")
    );
    return () => recognition.stop();
    // eslint-disable-next-line
  }, []);

  const handleCommand = (text) => {
    const cmd = COMMANDS.find((c) => text.includes(c.phrase));
    if (cmd) {
      if (cmd.action === "notify_caregiver") {
        window.speechSynthesis.speak(
          new window.SpeechSynthesisUtterance(
            "আপনার কেয়ারগিভারকে জানানো হয়েছে"
          )
        );
      } else if (cmd.action === "medication_reminder") {
        window.speechSynthesis.speak(
          new window.SpeechSynthesisUtterance("ঔষধ খাওয়ার সময় হয়েছে")
        );
      } else if (cmd.action === "tv_on") {
        window.speechSynthesis.speak(
          new window.SpeechSynthesisUtterance("টিভি চালু করা হচ্ছে")
        );
      }
    } else {
      window.speechSynthesis.speak(
        new window.SpeechSynthesisUtterance("বুঝতে পারিনি")
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm w-full">
        <div className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center animate-pulse mb-4">
          <span className="text-6xl">🎤</span>
        </div>
        <div className="text-2xl font-bold text-blue-700 mb-2">কথা বলুন</div>
        <div className="text-xl text-gray-800 mb-4 min-h-[40px]">{result}</div>
        <button
          className="w-full h-16 bg-gray-300 rounded-xl text-2xl font-bold text-gray-800 mt-2 flex items-center justify-center"
          onClick={onClose}
          aria-label="বাতিল করুন"
        >
          বাতিল করুন
        </button>
      </div>
    </div>
  );
}
