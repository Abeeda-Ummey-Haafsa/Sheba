import React from "react";
import { motion } from "framer-motion";

export const PasswordStrength = ({ password }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 1;
    if (/\d/.test(pwd)) strength += 1;
    if (/[^a-zA-Z\d]/.test(pwd)) strength += 1;
    return strength;
  };

  const strength = calculateStrength(password);
  const colors = [
    "bg-error",
    "bg-red-400",
    "bg-yellow-400",
    "bg-yellow-500",
    "bg-success",
  ];
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={`flex-1 rounded-full ${
              i < strength ? colors[strength - 1] : "bg-gray-200"
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
      </div>
      {password && (
        <p className="text-xs text-gray-600 mt-1">
          Password strength:{" "}
          <span className={strength >= 4 ? "text-success" : "text-gray-600"}>
            {labels[strength]}
          </span>
        </p>
      )}
    </div>
  );
};

export const FileUpload = ({
  onFileSelect,
  accept = "*",
  label,
  preview = null,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [fileName, setFileName] = React.useState("");
  const fileInputRef = React.useRef();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file
    const validExts = accept.split(",").map((ext) => ext.trim().toLowerCase());
    const fileExt = "." + file.name.split(".").pop().toLowerCase();
    const fileSizeMB = file.size / (1024 * 1024);

    // Check file extension
    const isValidExt = validExts.some(
      (ext) => fileExt === ext || file.type.includes(ext.replace(".", ""))
    );
    if (!isValidExt && accept !== "*") {
      alert(`Invalid file type. Please use one of: ${accept}`);
      return;
    }

    // Check file size (max 10MB)
    if (fileSizeMB > 10) {
      alert("File size must be less than 10MB");
      return;
    }

    setFileName(file.name);
    onFileSelect(file);
  };

  const handleInputChange = (e) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text mb-2">
        {label}
      </label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-primary font-semibold hover:underline"
        >
          {fileName ? (
            <>
              <div className="text-success">✓ {fileName}</div>
              <div className="text-xs text-gray-500 mt-1">Click to change</div>
            </>
          ) : (
            <>
              <div>Click to upload or drag and drop</div>
              <div className="text-xs text-gray-500 mt-1">
                Supported formats: {accept}
              </div>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export const ForgotPasswordModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [email, setEmail] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(email);
    setEmail("");
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-text mb-4">Reset Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="text-sm text-gray-600">
            We'll send you a link to reset your password.
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-text hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !email}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {isLoading ? "Sending..." : "Send Link"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
