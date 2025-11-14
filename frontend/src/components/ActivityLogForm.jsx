import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import Confetti from "react-confetti";
import {
  FiX,
  FiCheck,
  FiImage,
  FiLoader,
  FiSend,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const activitySchema = yup.object().shape({
  services: yup
    .array()
    .min(1, "কমপক্ষে একটি সেবা নির্বাচন করুন / Select at least one service"),
  seniorCondition: yup
    .string()
    .required("সিনিয়রের অবস্থা নির্বাচন করুন / Select senior condition"),
  notes: yup.string().max(500, "নোট ৫০০ অক্ষরের মধ্যে থাকতে হবে"),
});

const SERVICES = [
  {
    id: "meal_prep",
    label_bn: "খাবার প্রস্তুতি",
    label_en: "Meal Prep",
    icon: "🍽️",
  },
  {
    id: "medication",
    label_bn: "ওষুধ সেবন",
    label_en: "Medication",
    icon: "💊",
  },
  {
    id: "hygiene",
    label_bn: "স্বাস্থ্যবিধি সহায়তা",
    label_en: "Hygiene Support",
    icon: "🚿",
  },
  {
    id: "mobility",
    label_bn: "গতিশীলতা সহায়তা",
    label_en: "Mobility Help",
    icon: "🚶",
  },
  {
    id: "companionship",
    label_bn: "সঙ্গ",
    label_en: "Companionship",
    icon: "💬",
  },
  {
    id: "physiotherapy",
    label_bn: "ফিজিওথেরাপি",
    label_en: "Physiotherapy",
    icon: "💪",
  },
  {
    id: "cleaning",
    label_bn: "পরিষ্কার করা",
    label_en: "Cleaning",
    icon: "🧹",
  },
  { id: "errands", label_bn: "কাজকর্ম", label_en: "Errands", icon: "🛒" },
];

const CONDITIONS = [
  {
    value: "excellent",
    label_bn: "অতি ভালো",
    label_en: "Excellent",
    emoji: "😊",
  },
  { value: "good", label_bn: "ভালো", label_en: "Good", emoji: "🙂" },
  { value: "normal", label_bn: "স্বাভাবিক", label_en: "Normal", emoji: "😐" },
  {
    value: "concerning",
    label_bn: "উদ্বেগজনক",
    label_en: "Concerning",
    emoji: "😟",
  },
];

/**
 * ActivityLogForm - Post check-out form for caregivers
 * Records activities, senior condition, photos, notes
 * Auto-saves draft to localStorage
 */
export default function ActivityLogForm({
  bookingId,
  seniorName = "Senior",
  onSubmitSuccess,
  onClose,
}) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [expandedService, setExpandedService] = useState(null);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(`activity-draft-${bookingId}`);
    return saved ? JSON.parse(saved) : null;
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(activitySchema),
    defaultValues: formData || {
      services: [],
      seniorCondition: "",
      notes: "",
    },
  });

  const watchedServices = watch("services");
  const watchedCondition = watch("seniorCondition");
  const watchedNotes = watch("notes");

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (watchedServices.length > 0 || watchedCondition || watchedNotes) {
        const draft = {
          services: watchedServices,
          seniorCondition: watchedCondition,
          notes: watchedNotes,
          photos: photos.map((p) => p.preview), // Only save preview URLs
        };
        localStorage.setItem(
          `activity-draft-${bookingId}`,
          JSON.stringify(draft)
        );
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [watchedServices, watchedCondition, watchedNotes, photos, bookingId]);

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 3) {
      toast.error("সর্বোচ্চ ৩টি ছবি আপলোড করা যায় / Maximum 3 photos allowed");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos((prev) => [
          ...prev,
          {
            file,
            preview: event.target.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Upload photos to Supabase Storage
      const uploadedPhotos = [];
      for (const photo of photos) {
        const timestamp = Date.now();
        const filename = `${bookingId}-${timestamp}-${Math.random()
          .toString(36)
          .substr(2, 9)}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("activity-photos")
          .upload(`${bookingId}/${filename}`, photo.file);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("activity-photos")
            .getPublicUrl(`${bookingId}/${filename}`);
          uploadedPhotos.push(urlData.publicUrl);
        }
      }

      // Determine if needs alert (concerning condition)
      const needsAlert = data.seniorCondition === "concerning";

      // Insert activity log
      const { error: insertError } = await supabase
        .from("activity_logs")
        .insert([
          {
            booking_id: bookingId,
            services: data.services,
            senior_condition: data.seniorCondition,
            notes: data.notes,
            photos: uploadedPhotos,
            needs_alert: needsAlert,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;

      // If concerning, alert family
      if (needsAlert) {
        await supabase.from("notifications").insert([
          {
            recipient_type: "family",
            subject: `${seniorName} এর অবস্থা উদ্বেগজনক / Concerning status update`,
            message: `${seniorName} এর অবস্থা উদ্বেগজনক বলে রিপোর্ট করা হয়েছে: ${data.notes}`,
            type: "alert",
            created_at: new Date().toISOString(),
          },
        ]);
      }

      // Clear draft
      localStorage.removeItem(`activity-draft-${bookingId}`);

      // Show confetti and success
      setShowConfetti(true);
      toast.success("✓ রিপোর্ট সফলভাবে জমা হয়েছে / Report submitted!");

      setTimeout(() => {
        setShowConfetti(false);
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error.message ||
          "রিপোর্ট জমা দিতে ব্যর্থ হয়েছে / Failed to submit report"
      );
    } finally {
      setLoading(false);
    }
  };

  // Service checkbox handler
  const handleServiceToggle = (serviceId) => {
    const current = watchedServices || [];
    const updated = current.includes(serviceId)
      ? current.filter((id) => id !== serviceId)
      : [...current, serviceId];
    setValue("services", updated);
  };

  return (
    <AnimatePresence>
      {showConfetti && <Confetti recycle={false} numberOfPieces={100} />}

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center p-4 z-50 md:overflow-y-auto"
      >
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">
                পরিদর্শন রিপোর্ট / Visit Report
              </h2>
              <p className="text-gray-600 text-lg">{seniorName}</p>
            </div>

            {/* Services Section */}
            <div>
              <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
                <span>সেবা / Services</span>
                <span className="text-sm font-normal text-gray-600">
                  ({watchedServices?.length || 0} নির্বাচিত)
                </span>
              </h3>

              <div className="space-y-3">
                {SERVICES.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleServiceToggle(service.id)}
                    className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      watchedServices?.includes(service.id)
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 bg-white hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 min-h-6 min-w-6 rounded border-2 flex items-center justify-center transition-all ${
                          watchedServices?.includes(service.id)
                            ? "bg-primary border-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {watchedServices?.includes(service.id) && (
                          <FiCheck className="text-white" size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-xl font-bold">{service.icon}</div>
                        <div className="font-bold text-lg text-text">
                          {service.label_bn}
                        </div>
                        <div className="text-sm text-gray-600">
                          {service.label_en}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {errors.services && (
                <p className="text-error text-sm mt-2 font-semibold">
                  {errors.services.message}
                </p>
              )}
            </div>

            {/* Senior Condition Section */}
            <div>
              <h3 className="text-xl font-bold text-text mb-4">
                সিনিয়রের অবস্থা / Senior's Condition
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {CONDITIONS.map((condition) => (
                  <motion.label
                    key={condition.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      watchedCondition === condition.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 bg-white hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      value={condition.value}
                      {...register("seniorCondition")}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-4xl mb-2">{condition.emoji}</div>
                      <div className="font-bold text-sm text-text">
                        {condition.label_bn}
                      </div>
                      <div className="text-xs text-gray-600">
                        {condition.label_en}
                      </div>
                    </div>
                    {watchedCondition === condition.value && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <FiCheck className="text-white" size={16} />
                        </div>
                      </div>
                    )}
                  </motion.label>
                ))}
              </div>

              {errors.seniorCondition && (
                <p className="text-error text-sm mt-2 font-semibold">
                  {errors.seniorCondition.message}
                </p>
              )}

              {watchedCondition === "concerning" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-error/10 border-l-4 border-error rounded text-error text-sm font-semibold"
                >
                  ⚠️ পরিবার এবং সাপোর্ট দল সতর্ক করা হবে / Family & support will
                  be alerted
                </motion.div>
              )}
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="text-xl font-bold text-text mb-4">
                বিস্তারিত / Details
              </h3>
              <textarea
                {...register("notes")}
                placeholder="আজকের পরিদর্শনের বিস্তারিত লিখুন... / Write details about today's visit..."
                className="input-lg h-32 resize-none"
              />
              {errors.notes && (
                <p className="text-error text-sm mt-2 font-semibold">
                  {errors.notes.message}
                </p>
              )}
            </div>

            {/* Photo Upload Section */}
            <div>
              <h3 className="text-xl font-bold text-text mb-4">
                ছবি যোগ করুন / Add Photos
              </h3>
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  disabled={photos.length >= 3}
                  className="sr-only"
                />
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                    photos.length >= 3
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                      : "border-primary hover:bg-primary/5"
                  }`}
                >
                  <FiImage className="mx-auto mb-3 text-primary" size={32} />
                  <p className="font-bold text-text text-lg">
                    ছবি যোগ করুন / Add Photos
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    সর্বোচ্চ ৩টি / Max 3 photos ({photos.length}/3)
                  </p>
                </div>
              </label>

              {/* Photo Previews */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {photos.map((photo, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative aspect-square"
                    >
                      <img
                        src={photo.preview}
                        alt={`Preview ${idx}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 bg-error rounded-full p-1 text-white hover:bg-error/80 transition"
                      >
                        <FiX size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPreviewModal(true)}
              className="w-full px-4 py-3 border-2 border-primary text-primary rounded-lg font-bold text-base transition"
            >
              রিভিউ / Preview
            </motion.button>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                  জমা দেওয়া হচ্ছে...
                </>
              ) : (
                <>
                  <FiSend size={24} />
                  রিপোর্ট জমা দিন / Submit Report
                </>
              )}
            </motion.button>
          </form>

          {/* Preview Modal */}
          <AnimatePresence>
            {previewModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]"
                onClick={() => setPreviewModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-xl max-w-md w-full p-6 max-h-[70vh] overflow-y-auto shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-text mb-4">
                    প্রিভিউ / Preview
                  </h3>

                  <div className="space-y-4 text-sm md:text-base">
                    <div>
                      <p className="font-bold text-gray-600">
                        সেবা / Services:
                      </p>
                      <p className="text-text">
                        {watchedServices?.length > 0
                          ? SERVICES.filter((s) =>
                              watchedServices.includes(s.id)
                            )
                              .map((s) => `${s.label_bn} (${s.label_en})`)
                              .join(", ")
                          : "কোনো সেবা নির্বাচিত হয়নি"}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-gray-600">
                        অবস্থা / Condition:
                      </p>
                      <p className="text-text">
                        {CONDITIONS.find((c) => c.value === watchedCondition)
                          ?.label_bn || "নির্বাচিত নয়"}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-gray-600">নোট / Notes:</p>
                      <p className="text-text whitespace-pre-wrap">
                        {watchedNotes || "কোনো নোট যোগ করা হয়নি"}
                      </p>
                    </div>

                    {photos.length > 0 && (
                      <div>
                        <p className="font-bold text-gray-600 mb-2">
                          ছবি / Photos:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {photos.map((photo, idx) => (
                            <img
                              key={idx}
                              src={photo.preview}
                              alt={`Preview ${idx}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setPreviewModal(false)}
                    className="w-full mt-6 btn-primary min-h-14 text-base font-bold"
                  >
                    বন্ধ করুন / Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
