import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { PasswordStrength, FileUpload } from "../components/AuthComponents";
import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";

// Validation schemas
const guardianSchema = yup.object().shape({
  role: yup.string().oneOf(["guardian", "caregiver"]).required(),
  full_name: yup.string().min(2).required("Full name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .min(8)
    .required("Password must be at least 8 characters"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm password"),
  phone: yup
    .string()
    .matches(
      /^\+880\d{9,10}$/,
      "Phone must start with +880 and have 9-10 digits"
    ),
  number_of_seniors: yup.string().required("Please select number of seniors"),
  location: yup.string().required("Location is required"),
});

const caregiverSchema = yup.object().shape({
  role: yup.string().oneOf(["guardian", "caregiver"]).required(),
  full_name: yup.string().min(2).required("Full name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .min(8)
    .required("Password must be at least 8 characters"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm password"),
  phone: yup
    .string()
    .matches(
      /^\+880\d{9,10}$/,
      "Phone must start with +880 and have 9-10 digits"
    ),
  nid_number: yup
    .string()
    .matches(/^\d{10,17}$/, "NID must be 10-17 digits")
    .required("NID number is required"),
  experience_years: yup.number().min(0).required("Experience is required"),
  police_verification: yup
    .mixed()
    .required("Police verification document is required"),
});

const bangladeshDistricts = [
  "Dhaka",
  "Chittagong",
  "Khulna",
  "Rajshahi",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

const caregiverServices = [
  "Personal Care",
  "Medication",
  "Physiotherapy",
  "Companionship",
  "Nursing",
  "Palliative",
  "Hygiene Support",
  "Rehabilitation",
];

export default function Signup() {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [role, setRole] = useState("guardian");
  const [showPassword, setShowPassword] = useState(false);
  const [verificationFile, setVerificationFile] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const schema =
    role === "guardian"
      ? guardianSchema
      : role === "caregiver"
      ? caregiverSchema
      : yup.object().shape({});
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: "guardian" },
  });

  const password = watch("password");

  const handleFileSelect = (file) => {
    setVerificationFile(file);
    setValue("police_verification", file, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      let verificationUrl = null;

      // Prepare metadata without verification URL (we'll update it after upload)
      const metadata = {
        full_name: data.full_name,
        role,
        phone: data.phone,
        ...(role === "guardian" && {
          number_of_seniors: data.number_of_seniors,
          location: data.location,
        }),
        ...(role === "caregiver" && {
          nid_number: data.nid_number,
          experience_years: data.experience_years,
          skills: selectedSkills,
        }),
      };

      // First create the user account
      const result = await signUp(data.email, data.password, metadata);
      if (!result.success) {
        throw new Error(result.error || "Signup failed");
      }

      // If caregiver and a verification file was selected, try to upload it
      if (role === "caregiver" && verificationFile) {
        // Try to ensure we have an authenticated session for the new user.
        // Attempt to sign in immediately (works when the project allows sign-in post-signup).
        try {
          await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });
        } catch (signinErr) {
          // ignore - we'll try to read session below
        }

        const { data: sessionData } = await supabase.auth.getSession();
        const currentUser = sessionData?.session?.user || result.user;

        // If still no authenticated user, skip upload and ask user to upload after login
        if (!currentUser || !sessionData?.session) {
          toast.success(
            "Signup successful. Please log in to upload your verification document."
          );
          navigate("/login");
          return;
        }

        // Validate file client-side
        const validTypes = [".pdf", ".jpg", ".jpeg", ".png"];
        const fileExt =
          "." + verificationFile.name.split(".").pop().toLowerCase();
        const fileSizeMB = verificationFile.size / (1024 * 1024);

        if (!validTypes.includes(fileExt)) {
          throw new Error(
            `Invalid file type. Please upload PDF, JPG, or PNG. Received: ${fileExt}`
          );
        }
        if (fileSizeMB > 10) {
          throw new Error("File size must be less than 10MB");
        }

        // Upload to existing bucket (bucket must be created in Supabase setup)
        const fileName = `${data.email}-${Date.now()}-${verificationFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("verifications")
          .upload(fileName, verificationFile);

        if (uploadError) {
          console.error("Upload error details:", uploadError);
          throw new Error(
            `Failed to upload verification file: ${uploadError.message}. Make sure the verifications bucket exists in Supabase Storage.`
          );
        }

        verificationUrl = uploadData.path;

        // Update the profile row with the uploaded file path
        try {
          await supabase
            .from("profiles")
            .update({ police_verification_url: verificationUrl })
            .eq("id", currentUser.id);
        } catch (updateErr) {
          console.warn(
            "Failed to update profile with verification URL:",
            updateErr
          );
        }
      }

      toast.success(
        "Signup successful! Check your email to verify your account before logging in."
      );
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white mb-4">
            <span className="text-2xl font-bold">সে</span>
          </div>
          <h1 className="text-2xl font-bold text-text">Seba</h1>
          <p className="text-gray-500 text-sm">
            সেবা - Care for your loved ones
          </p>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text mb-2">Create Account</h2>
          <p className="text-gray-600">অ্যাকাউন্ট তৈরি করুন</p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-text mb-3">
            I am a...
          </label>
          <div className="flex gap-4">
            {["guardian", "caregiver", "senior"].map((r) => (
              <motion.label
                key={r}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={role === r}
                  onChange={() => setRole(r)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="font-medium text-text">
                  {r === "guardian"
                    ? "Guardian/Family / অভিভাবক/পরিবার"
                    : r === "caregiver"
                    ? "Caregiver / যত্নকারী"
                    : "Senior / সিনিয়র"}
                </span>
              </motion.label>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {role === "senior" && (
            <div className="space-y-6 text-center">
              <h3 className="text-xl font-semibold">
                Senior Setup / সিনিয়র সেটআপ
              </h3>
              <p className="text-gray-600">
                If you are a senior using a family-provided device, enter the
                6-digit setup code or scan the QR provided by your family.
                <br />
                যদি আপনি পরিবারের দেওয়া ডিভাইস ব্যবহার করেন, পরিবার থেকে পাওয়া
                ৬-অঙ্কের কোড লিখুন অথবা QR স্ক্যান করুন।
              </p>
              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                <a
                  href="/senior-setup"
                  className="inline-block py-3 px-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold"
                >
                  Enter Setup Code / কোড লিখুন
                </a>
                <a
                  href="/"
                  className="inline-block py-3 px-4 border rounded-lg text-primary font-semibold"
                >
                  Back to Home / হোম
                </a>
              </div>
            </div>
          )}

          {role !== "senior" && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Full Name
                </label>
                <input
                  {...register("full_name")}
                  placeholder="Your name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition ${
                    errors.full_name ? "border-error" : "border-gray-300"
                  }`}
                />
                {errors.full_name && (
                  <p className="text-error text-xs mt-1">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition ${
                    errors.email ? "border-error" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-error text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Phone (+880 format)
                </label>
                <input
                  {...register("phone")}
                  placeholder="+880XXXXXXXXX"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition ${
                    errors.phone ? "border-error" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="text-error text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition ${
                      errors.password ? "border-error" : "border-gray-300"
                    }`}
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </motion.button>
                </div>
                {errors.password && (
                  <p className="text-error text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
                <PasswordStrength password={password} />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register("confirm_password")}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition ${
                    errors.confirm_password ? "border-error" : "border-gray-300"
                  }`}
                />
                {errors.confirm_password && (
                  <p className="text-error text-xs mt-1">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>

              {/* Guardian-Specific Fields */}
              <AnimatePresence>
                {role === "guardian" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-5"
                  >
                    {/* Number of Seniors */}
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Number of Seniors to Care For
                      </label>
                      <select
                        {...register("number_of_seniors")}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition ${
                          errors.number_of_seniors
                            ? "border-error"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5+">5+</option>
                      </select>
                      {errors.number_of_seniors && (
                        <p className="text-error text-xs mt-1">
                          {errors.number_of_seniors.message}
                        </p>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Location (District)
                      </label>
                      <select
                        {...register("location")}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition ${
                          errors.location ? "border-error" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select a district...</option>
                        {bangladeshDistricts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      {errors.location && (
                        <p className="text-error text-xs mt-1">
                          {errors.location.message}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Caregiver-Specific Fields */}
              <AnimatePresence>
                {role === "caregiver" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-5"
                  >
                    {/* NID Number */}
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        NID Number
                      </label>
                      <input
                        {...register("nid_number")}
                        placeholder="10-17 digits"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition ${
                          errors.nid_number ? "border-error" : "border-gray-300"
                        }`}
                      />
                      {errors.nid_number && (
                        <p className="text-error text-xs mt-1">
                          {errors.nid_number.message}
                        </p>
                      )}
                    </div>

                    {/* Experience Years */}
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        {...register("experience_years")}
                        placeholder="0"
                        min="0"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition ${
                          errors.experience_years
                            ? "border-error"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.experience_years && (
                        <p className="text-error text-xs mt-1">
                          {errors.experience_years.message}
                        </p>
                      )}
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="block text-sm font-medium text-text mb-3">
                        Services You Provide
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {caregiverServices.map((service) => (
                          <motion.label
                            key={service}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSkills.includes(service)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSkills([
                                    ...selectedSkills,
                                    service,
                                  ]);
                                } else {
                                  setSelectedSkills(
                                    selectedSkills.filter((s) => s !== service)
                                  );
                                }
                              }}
                              className="w-4 h-4 accent-primary"
                            />
                            <span className="text-sm text-text">{service}</span>
                          </motion.label>
                        ))}
                      </div>
                    </div>

                    {/* Police Verification */}
                    <FileUpload
                      label="Police Verification Document (PDF, JPG, PNG)"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onFileSelect={handleFileSelect}
                    />
                    {errors.police_verification && (
                      <p className="text-error text-xs mt-1">
                        {errors.police_verification.message}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Creating Account...
                  </>
                ) : (
                  "Sign Up / নিবন্ধন করুন"
                )}
              </motion.button>
            </>
          )}
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
