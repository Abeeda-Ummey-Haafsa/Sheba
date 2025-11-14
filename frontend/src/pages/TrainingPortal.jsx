import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Confetti from "react-confetti";
import {
  FiX,
  FiPlay,
  FiCheck,
  FiDownload,
  FiStar,
  FiAward,
  FiVideo,
  FiBook as FiBookOpen,
} from "react-icons/fi";

/**
 * TrainingPortal.jsx - Mobile-first training & certification platform for caregivers
 * Includes course catalog, progress tracking, gamification, and certifications
 */
export default function TrainingPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("catalog"); // catalog, progress, certs
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedQuiz, setCompletedQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  // Mock course data
  const courses = [
    {
      id: 1,
      title_bn: "প্রাথমিক চিকিৎসা প্রশিক্ষণ",
      title_en: "First Aid Training",
      description_bn: "সিনিয়র সিটিজেনদের জন্য প্রাথমিক চিকিৎসা",
      description_en: "Basic first aid for senior citizens",
      duration: "45 মিনিট",
      level: "শুরু",
      progress: 75,
      image: "🏥",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      lessons: 8,
      quizzes: 2,
      completed: true,
      certified: true,
    },
    {
      id: 2,
      title_bn: "যোগাযোগ দক্ষতা",
      title_en: "Communication Skills",
      description_bn: "সিনিয়রদের সাথে কার্যকর যোগাযোগ",
      description_en: "Effective communication with seniors",
      duration: "30 মিনিট",
      level: "শুরু",
      progress: 45,
      image: "💬",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      lessons: 6,
      quizzes: 1,
      completed: false,
      certified: false,
    },
    {
      id: 3,
      title_bn: "স্বাস্থ্যবিধি এবং স্বাস্থ্যসেবা",
      title_en: "Hygiene & Health Care",
      description_bn: "ব্যক্তিগত স্বাস্থ্যবিধি এবং রোগ নিয়ন্ত্রণ",
      description_en: "Personal hygiene and infection control",
      duration: "50 মিনিট",
      level: "মধ্যম",
      progress: 0,
      image: "🧼",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      lessons: 10,
      quizzes: 2,
      completed: false,
      certified: false,
    },
  ];

  const handleStartCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleQuizSubmit = (courseId) => {
    setShowConfetti(true);
    setCompletedQuiz(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-32 md:pb-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={100} />}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-40"
      >
        <div className="px-4 py-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-text mb-2">
            প্রশিক্ষণ / Training Portal
          </h1>
          <p className="text-gray-600">
            আপনার দক্ষতা বৃদ্ধি করুন এবং প্রত্যয়পত্র অর্জন করুন
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="px-4 py-4 bg-white border-b border-gray-200 sticky top-20 z-30">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
          {[
            {
              id: "catalog",
              label_bn: "কোর্স",
              label_en: "Catalog",
              icon: "📚",
            },
            {
              id: "progress",
              label_bn: "অগ্রগতি",
              label_en: "Progress",
              icon: "📈",
            },
            {
              id: "certs",
              label_bn: "সার্টিফিকেট",
              label_en: "Certificates",
              icon: "🏆",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text hover:bg-gray-200"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label_bn}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-8 max-w-6xl mx-auto">
        {/* Catalog Tab */}
        {activeTab === "catalog" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-text mb-6">
              উপলব্ধ কোর্স / Available Courses
            </h2>
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card border-2 border-gray-200 hover:border-primary transition cursor-pointer"
                onClick={() => handleStartCourse(course)}
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="text-4xl md:text-5xl flex-shrink-0">
                    {course.image}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-text mb-1">
                          {course.title_bn}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {course.title_en}
                        </p>
                        <p className="text-gray-700 text-sm md:text-base mb-3">
                          {course.description_bn}
                        </p>
                      </div>
                      {course.certified && (
                        <FiAward
                          className="text-yellow-500 flex-shrink-0"
                          size={28}
                        />
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 mb-4 text-sm">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">
                        ⏱️ {course.duration}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                        📚 {course.lessons} পাঠ
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                        🧪 {course.quizzes} কুইজ
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {course.progress > 0 && (
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="bg-primary h-2 rounded-full"
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {course.progress}% সম্পন্ন
                        </p>
                      </div>
                    )}

                    {/* Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full px-4 py-3 rounded-lg font-bold text-base transition flex items-center justify-center gap-2 ${
                        course.completed
                          ? "bg-success/20 text-success"
                          : "bg-secondary text-white hover:bg-secondary/90"
                      }`}
                    >
                      {course.completed ? (
                        <>
                          <FiCheck size={20} />
                          সম্পন্ন / Completed
                        </>
                      ) : (
                        <>
                          <FiPlay size={20} />
                          শুরু করুন / Start
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Progress Tab */}
        {activeTab === "progress" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-text mb-6">
              আপনার অগ্রগতি / Your Progress
            </h2>

            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card flex items-center gap-6"
              >
                <div className="w-24 h-24 flex-shrink-0">
                  <CircularProgressbar
                    value={course.progress}
                    text={`${course.progress}%`}
                    styles={buildStyles({
                      textColor: "#14B8A6",
                      pathColor: "#14B8A6",
                      trailColor: "#f3f4f6",
                    })}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-text mb-2">
                    {course.title_bn}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      📚 {Math.round((course.progress / 100) * course.lessons)}{" "}
                      / {course.lessons} পাঠ সম্পন্ন
                    </p>
                    <p>
                      🧪 {Math.round((course.progress / 100) * course.quizzes)}{" "}
                      / {course.quizzes} কুইজ
                    </p>
                  </div>
                </div>

                {course.certified && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl flex-shrink-0"
                  >
                    🏆
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Certificates Tab */}
        {activeTab === "certs" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-text mb-6">
              আমার সার্টিফিকেট / My Certificates
            </h2>

            {courses
              .filter((c) => c.certified)
              .map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-text mb-1">
                        {cert.title_bn}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Completed on {new Date().toLocaleDateString("bn-BD")}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl"
                    >
                      🏅
                    </motion.div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    এটি প্রমাণ করে যে আপনি {cert.title_bn} কোর্সটি সফলভাবে
                    সম্পন্ন করেছেন এবং প্রয়োজনীয় সব শর্ত পূরণ করেছেন।
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full btn-secondary min-h-14 text-base font-bold flex items-center justify-center gap-2"
                  >
                    <FiDownload size={20} />
                    ডাউনলোড / Download Certificate
                  </motion.button>
                </motion.div>
              ))}

            {!courses.some((c) => c.certified) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card text-center py-16"
              >
                <p className="text-5xl mb-4">🔒</p>
                <p className="text-xl font-bold text-text mb-2">
                  কোনো সার্টিফিকেট নেই
                </p>
                <p className="text-gray-600">
                  কোর্স সম্পন্ন করুন সার্টিফিকেট অর্জনের জন্য
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Course Details Modal */}
      <AnimatePresence>
        {showCourseModal && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center p-4 z-50 md:overflow-y-auto"
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCourseModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition z-10"
              >
                <FiX size={28} />
              </button>

              {/* Video Player */}
              <div className="relative bg-black h-48 md:h-64">
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedCourse.videoUrl}
                  title="Course video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                  <FiPlay size={80} className="text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">
                    {selectedCourse.title_bn}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {selectedCourse.description_bn}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                      {selectedCourse.level}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {selectedCourse.duration}
                    </span>
                  </div>
                </div>

                {/* Lessons & Quizzes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">📚 পাঠ</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedCourse.lessons}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">🧪 কুইজ</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedCourse.quizzes}
                    </p>
                  </div>
                </div>

                {/* Quiz Section */}
                {!completedQuiz && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-bold text-text text-lg mb-4">
                      🧪 সমাপনী কুইজ / Final Quiz
                    </h3>

                    <div className="space-y-4 mb-6">
                      {["প্রশ্ন ১", "প্রশ্ন ২", "প্রশ্ন ৩"].map((q, idx) => (
                        <div key={idx} className="space-y-2">
                          <p className="font-semibold text-text">{q}</p>
                          <div className="space-y-2">
                            {["অপশন ক", "অপশন খ", "অপশন গ"].map((opt, i) => (
                              <label
                                key={i}
                                className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition"
                              >
                                <input
                                  type="radio"
                                  name={`q${idx}`}
                                  onChange={() =>
                                    setQuizAnswers({
                                      ...quizAnswers,
                                      [`q${idx}`]: i,
                                    })
                                  }
                                  className="w-4 h-4"
                                />
                                <span className="text-text">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuizSubmit(selectedCourse.id)}
                      className="w-full btn-secondary min-h-14 text-lg font-bold"
                    >
                      সাবমিট / Submit Quiz
                    </motion.button>
                  </div>
                )}

                {completedQuiz && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-success/10 border border-success rounded-lg p-6 text-center"
                  >
                    <p className="text-4xl mb-3">🎉</p>
                    <h3 className="font-bold text-success text-xl mb-2">
                      অসাধারণ! / Great Job!
                    </h3>
                    <p className="text-gray-700 mb-6">
                      আপনি এই কোর্সটি সফলভাবে সম্পন্ন করেছেন!
                    </p>
                    <button
                      onClick={() => setShowCourseModal(false)}
                      className="w-full btn-primary min-h-14 font-bold"
                    >
                      বন্ধ করুন / Close
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
