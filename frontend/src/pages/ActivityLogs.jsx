import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import moment from "moment";
import "moment/locale/bn";
import { jsPDF } from "jspdf";
import { FiDownload } from "react-icons/fi";

moment.locale("bn");

const mockActivityLogs = [
  {
    id: 1,
    caregiver_name: "Rahim Khan",
    caregiver_photo: "https://via.placeholder.com/50/14B8A6/ffffff?text=RK",
    date: "2025-11-14",
    check_in_time: "09:00",
    check_out_time: "11:30",
    services: ["খাবার প্রস্তুতি", "ওষুধ সেবন", "স্বাস্থ্যবিধি"],
    services_en: ["Meal Prep", "Medication", "Hygiene"],
    notes: "খুবই সন্তুষ্ট সেবা পেয়েছি। সিনিয়র খুবই খুশি।",
    rating: 5,
  },
  {
    id: 2,
    caregiver_name: "Fatema Begum",
    caregiver_photo: "https://via.placeholder.com/50/FB923C/ffffff?text=FB",
    date: "2025-11-13",
    check_in_time: "14:00",
    check_out_time: "16:45",
    services: ["সঙ্গ দেওয়া", "খাবার প্রস্তুতি"],
    services_en: ["Companionship", "Meal Prep"],
    notes: "খুবই যত্নশীল ও ভালো আচরণ।",
    rating: 5,
  },
  {
    id: 3,
    caregiver_name: "Karim Ali",
    caregiver_photo: "https://via.placeholder.com/50/3B82F6/ffffff?text=KA",
    date: "2025-11-12",
    check_in_time: "10:00",
    check_out_time: "12:00",
    services: ["ফিজিওথেরাপি", "গতিশীলতা সাহায্য"],
    services_en: ["Physiotherapy", "Mobility Assistance"],
    notes: "দক্ষ ও পেশাদার সেবা প্রদান করেছেন।",
    rating: 4,
  },
];

export default function ActivityLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState(mockActivityLogs);
  const [filteredLogs, setFilteredLogs] = useState(mockActivityLogs);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCaregiver, setSelectedCaregiver] = useState("");

  useEffect(() => {
    let result = logs;
    if (dateFrom)
      result = result.filter((log) => new Date(log.date) >= new Date(dateFrom));
    if (dateTo)
      result = result.filter((log) => new Date(log.date) <= new Date(dateTo));
    if (selectedCaregiver)
      result = result.filter((log) => log.caregiver_name === selectedCaregiver);
    setFilteredLogs(result);
  }, [dateFrom, dateTo, selectedCaregiver, logs]);

  const caregiverNames = [...new Set(logs.map((log) => log.caregiver_name))];

  const calculateDuration = (checkIn, checkOut) => {
    const start = moment(`2025-01-01 ${checkIn}`, "YYYY-MM-DD HH:mm");
    const end = moment(`2025-01-01 ${checkOut}`, "YYYY-MM-DD HH:mm");
    const duration = end.diff(start, "minutes");
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    return `${hours}h ${mins}m`;
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    let yPos = 10;
    doc.setFontSize(16);
    doc.text("Activity Logs", 10, yPos);
    yPos += 15;
    doc.setFontSize(10);
    doc.text(`Date: ${moment().format("DD MMMM YYYY")}`, 10, yPos);
    yPos += 10;

    filteredLogs.forEach((log, index) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 10;
      }
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.text(log.caregiver_name, 10, yPos);
      yPos += 7;
      doc.setFont(undefined, "normal");
      doc.setFontSize(9);
      doc.text(`Date: ${moment(log.date).format("DD MMMM YYYY")}`, 10, yPos);
      yPos += 5;
      doc.text(`Time: ${log.check_in_time} - ${log.check_out_time}`, 10, yPos);
      yPos += 5;
      doc.text(
        `Duration: ${calculateDuration(log.check_in_time, log.check_out_time)}`,
        10,
        yPos
      );
      yPos += 5;
      doc.text(`Services: ${log.services_en.join(", ")}`, 10, yPos);
      yPos += 5;
      doc.text(
        `Rating: ${"★".repeat(log.rating)}${"☆".repeat(5 - log.rating)}`,
        10,
        yPos
      );
      yPos += 10;
    });

    doc.save(`activity-logs-${moment().format("YYYY-MM-DD")}.pdf`);
    toast.success("PDF exported!");
  };

  const StarRating = ({ rating, onRate }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <button
          key={i}
          onClick={() => onRate && onRate(i + 1)}
          className="text-xl cursor-pointer transition hover:scale-110"
        >
          {i < rating ? "★" : "☆"}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-text mb-2">Activity Logs</h1>
          <p className="text-gray-600">কার্যকলাপ লগ</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg p-6 shadow-sm mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Caregiver
              </label>
              <select
                value={selectedCaregiver}
                onChange={(e) => setSelectedCaregiver(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">All</option>
                {caregiverNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={exportPDF}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
              >
                <FiDownload size={18} />
                Export PDF
              </button>
            </div>
          </div>
        </motion.div>

        {filteredLogs.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={log.caregiver_photo}
                      alt={log.caregiver_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-text">
                        {log.caregiver_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        📅 {moment(log.date).format("dddd, DD MMMM YYYY")}
                      </p>
                      <p className="text-sm text-gray-600">
                        🕐 {log.check_in_time} - {log.check_out_time} (
                        {calculateDuration(
                          log.check_in_time,
                          log.check_out_time
                        )}
                        )
                      </p>
                    </div>
                    <div className="text-right">
                      <StarRating rating={log.rating} />
                      <p className="text-xs text-gray-500 mt-1">
                        {log.rating}/5
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-text mb-2">
                      Services:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {log.services.map((service, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                        >
                          ✓ {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-text mb-2">
                      Notes:
                    </p>
                    <p className="text-gray-700 text-sm">{log.notes}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold text-text mb-2">
                      Rate:
                    </p>
                    <StarRating
                      rating={log.rating}
                      onRate={(rating) => {
                        setLogs(
                          logs.map((l) =>
                            l.id === log.id ? { ...l, rating } : l
                          )
                        );
                        toast.success("Rating updated!");
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg"
          >
            <p className="text-gray-500 text-lg">No activity logs found.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
