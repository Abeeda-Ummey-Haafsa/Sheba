import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiEdit2, FiX, FiLogOut } from "react-icons/fi";

const profileSchema = yup.object().shape({
  full_name: yup.string().min(2).required("Full name is required"),
  phone: yup
    .string()
    .matches(/^\+880\d{9,10}$/, "Valid Bangladesh phone required"),
  location: yup.string().required("Location is required"),
});

const passwordSchema = yup.object().shape({
  old_password: yup.string().min(8).required("Old password required"),
  new_password: yup.string().min(8).required("New password required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match")
    .required(),
});

const seniorSchema = yup.object().shape({
  name: yup.string().min(2).required("Senior name is required"),
  age: yup.number().min(50).max(120).required("Age is required"),
  conditions: yup.array().min(1, "Select at least one condition"),
  location: yup.string().required("Location is required"),
});

const mockSeniors = [
  {
    id: 1,
    name: "মা (Mom)",
    name_en: "Mother",
    age: 78,
    conditions: ["ডায়াবেটিস", "উচ্চ রক্তচাপ"],
    location: "Dhaka",
  },
  {
    id: 2,
    name: "বাবা (Dad)",
    name_en: "Father",
    age: 82,
    conditions: ["আর্থারিটিস", "হার্ট ডিজিজ"],
    location: "Dhaka",
  },
];

export default function Profile() {
  const { user, userMetadata, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [seniors, setSeniors] = useState(mockSeniors);
  const [showAddSenior, setShowAddSenior] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingSenior, setEditingSenior] = useState(null);

  const personalForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      full_name: userMetadata?.full_name || "",
      phone: userMetadata?.phone || "",
      location: userMetadata?.location || "",
    },
  });
  const passwordForm = useForm({ resolver: yupResolver(passwordSchema) });
  const seniorForm = useForm({ resolver: yupResolver(seniorSchema) });

  const onPersonalSubmit = async (data) => {
    try {
      toast.loading("Updating profile...");
      // await supabase.from('profiles').update(data).eq('id', user.id);
      toast.dismiss();
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      toast.loading("Changing password...");
      // await supabase.auth.updateUser({ password: data.new_password });
      toast.dismiss();
      toast.success("Password updated!");
      passwordForm.reset();
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  const onSeniorSubmit = async (data) => {
    if (editingSenior) {
      setSeniors(
        seniors.map((s) => (s.id === editingSenior.id ? { ...s, ...data } : s))
      );
      setEditingSenior(null);
    } else {
      setSeniors([...seniors, { id: Date.now(), ...data }]);
    }
    setShowAddSenior(false);
    seniorForm.reset();
    toast.success(editingSenior ? "Senior updated!" : "Senior added!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-text mb-2">Your Profile</h1>
          <p className="text-gray-600">আপনার প্রোফাইল</p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8 flex gap-4 p-4 border-b overflow-x-auto">
          {[
            { id: "personal", label: "Personal Info" },
            { id: "password", label: "Password" },
            { id: "seniors", label: "Seniors" },
            { id: "subscription", label: "Subscription" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={activeTab}
        >
          {/* Personal Info */}
          {activeTab === "personal" && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-text mb-6">
                Personal Information
              </h2>
              <form
                onSubmit={personalForm.handleSubmit(onPersonalSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Full Name
                  </label>
                  <input
                    {...personalForm.register("full_name")}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {personalForm.formState.errors.full_name && (
                    <p className="text-error text-sm mt-1">
                      {personalForm.formState.errors.full_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Phone
                  </label>
                  <input
                    {...personalForm.register("phone")}
                    placeholder="+880..."
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {personalForm.formState.errors.phone && (
                    <p className="text-error text-sm mt-1">
                      {personalForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Location
                  </label>
                  <input
                    {...personalForm.register("location")}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {personalForm.formState.errors.location && (
                    <p className="text-error text-sm mt-1">
                      {personalForm.formState.errors.location.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Password */}
          {activeTab === "password" && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-text mb-6">
                Change Password
              </h2>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Old Password
                  </label>
                  <input
                    type="password"
                    {...passwordForm.register("old_password")}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {passwordForm.formState.errors.old_password && (
                    <p className="text-error text-sm mt-1">
                      {passwordForm.formState.errors.old_password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...passwordForm.register("new_password")}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {passwordForm.formState.errors.new_password && (
                    <p className="text-error text-sm mt-1">
                      {passwordForm.formState.errors.new_password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...passwordForm.register("confirm_password")}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {passwordForm.formState.errors.confirm_password && (
                    <p className="text-error text-sm mt-1">
                      {passwordForm.formState.errors.confirm_password.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* Seniors */}
          {activeTab === "seniors" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-text">Manage Seniors</h2>
                <button
                  onClick={() => {
                    setShowAddSenior(true);
                    setEditingSenior(null);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  + Add Senior
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {seniors.map((senior) => (
                  <div
                    key={senior.id}
                    className="bg-white rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-text">
                          {senior.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {senior.age} years old
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingSenior(senior);
                            setShowAddSenior(true);
                          }}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingSenior(senior);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 bg-error/10 text-error rounded-lg hover:bg-error/20"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      📍 {senior.location}
                    </p>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Conditions:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {senior.conditions.map((cond, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-error/10 text-error rounded-full text-xs"
                          >
                            {cond}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subscription */}
          {activeTab === "subscription" && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-text mb-6">
                Subscription
              </h2>
              <div className="mb-6 p-4 bg-primary/5 border border-primary rounded-lg">
                <p className="font-semibold text-text mb-2">
                  Current Plan: Free
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Unlimited access to our care services
                </p>
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
                  Upgrade to Premium
                </button>
              </div>
              <h3 className="font-bold text-lg text-text mb-4">
                Premium Benefits
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  ✓ Priority caregiver matching
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  ✓ 24/7 support
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  ✓ Advanced analytics
                </li>
              </ul>
            </div>
          )}
        </motion.div>

        {/* Danger Zone */}
        <div className="mt-12 bg-red-50 border border-error rounded-lg p-6">
          <h3 className="font-bold text-lg text-error mb-4">Danger Zone</h3>
          <button
            onClick={signOut}
            className="px-6 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition flex items-center gap-2"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Add/Edit Senior Modal */}
      <AnimatePresence>
        {showAddSenior && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddSenior(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-md w-full p-6"
            >
              <h2 className="text-2xl font-bold text-text mb-4">
                {editingSenior ? "Edit Senior" : "Add Senior"}
              </h2>
              <form
                onSubmit={seniorForm.handleSubmit(onSeniorSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Name
                  </label>
                  <input
                    {...seniorForm.register("name")}
                    defaultValue={editingSenior?.name}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    {...seniorForm.register("age")}
                    defaultValue={editingSenior?.age}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Location
                  </label>
                  <input
                    {...seniorForm.register("location")}
                    defaultValue={editingSenior?.location}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddSenior(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    {editingSenior ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-sm w-full p-6"
            >
              <h2 className="text-2xl font-bold text-error mb-4">
                Delete Senior?
              </h2>
              <p className="text-gray-700 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setSeniors(
                      seniors.filter((s) => s.id !== editingSenior.id)
                    );
                    setShowDeleteConfirm(false);
                    toast.success("Senior deleted");
                  }}
                  className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
