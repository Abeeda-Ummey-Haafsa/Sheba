import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

const schema = yup.object().shape({
  full_name: yup.string().required("নামের প্রয়োজন"),
  age: yup.number().required("বয়স প্রয়োজন"),
  gender: yup.string().required("লিঙ্গ নির্বাচন করুন"),
  address: yup.string().required("ঠিকানা প্রয়োজন"),
});

const CONDITIONS = [
  { key: "diabetes", label: "ডায়াবেটিস" },
  { key: "hypertension", label: "উচ্চ রক্তচাপ" },
  { key: "heart", label: "হৃদরোগ" },
  { key: "dementia", label: "ডিমেনশিয়া" },
  { key: "other", label: "অন্যান্য" },
];

export default function FamilySeniorOnboarding() {
  const { register, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  const [photo, setPhoto] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(false);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setPhoto(f);
  };

  const toggleCondition = (key) => {
    setConditions((c) =>
      c.includes(key) ? c.filter((x) => x !== key) : [...c, key]
    );
  };

  const onSubmit = async (vals) => {
    setLoading(true);
    try {
      // Upload photo if present
      let photoUrl = null;
      if (photo) {
        const fileName = `senior-${Date.now()}-${photo.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("senior_avatars")
          .upload(fileName, photo);
        if (uploadError) throw uploadError;
        photoUrl = uploadData.path;
      }

      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const seniorId = uuidv4();

      const record = {
        id: seniorId,
        full_name: vals.full_name,
        age: vals.age,
        gender: vals.gender,
        address: vals.address,
        medical_conditions: conditions,
        medication_list: vals.medication || null,
        photo_url: photoUrl,
        setup_pin: pin,
        family_id: vals.family_id || null,
        created_at: new Date(),
      };

      const { error } = await supabase.from("senior_profiles").insert([record]);
      if (error) throw error;

      toast.success("সফলভাবে সংযুক্ত হয়েছে — সেটআপ কোড: " + pin);
      // TODO: send email to family with instructions (mock)
    } catch (err) {
      console.error(err);
      toast.error("সিনিয়র যোগ করা ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-extrabold text-teal-600 mb-4">
          আপনার প্রিয়জন যোগ করুন
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            {...register("full_name")}
            placeholder="নাম (বাংলায়)"
            className="h-16 text-2xl p-4 border rounded"
          />
          <input
            {...register("age")}
            placeholder="বয়স"
            className="h-16 text-2xl p-4 border rounded"
            inputMode="numeric"
          />
          <select
            {...register("gender")}
            className="h-16 text-2xl p-4 border rounded"
          >
            <option value="">লিঙ্গ</option>
            <option value="male">পুরুষ</option>
            <option value="female">মহিলা</option>
            <option value="other">অন্যান্য</option>
          </select>
          <label className="text-lg font-semibold">ছবি আপলোড</label>
          <input type="file" accept="image/*" onChange={onFile} />

          <input
            {...register("address")}
            placeholder="ঠিকানা"
            className="h-16 text-2xl p-4 border rounded"
          />

          <div>
            <div className="font-semibold mb-2">চিকিৎসা অবস্থা</div>
            <div className="grid grid-cols-2 gap-2">
              {CONDITIONS.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  onClick={() => toggleCondition(c.key)}
                  className={`h-12 rounded-lg ${
                    conditions.includes(c.key) ? "bg-orange-200" : "bg-gray-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            {...register("medication")}
            placeholder="ঔষধের তালিকা"
            className="h-24 p-3 border rounded"
          />

          <div className="flex gap-2">
            <input
              {...register("device_id")}
              placeholder="ডিভাইস আইডি (ঐচ্ছিক)"
              className="flex-1 h-16 p-4 border rounded"
            />
            <button
              type="button"
              className="h-16 px-4 bg-teal-600 text-white rounded"
            >
              জেনারেট QR
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-16 bg-teal-600 text-white text-2xl rounded"
          >
            {loading ? "সংরক্ষণ করছি..." : "সিনিয়র যোগ করুন"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
