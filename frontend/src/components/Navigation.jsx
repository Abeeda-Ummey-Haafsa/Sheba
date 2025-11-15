import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FiHome,
  FiCalendar,
  FiBook,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import "../styles/navigation.css";

const services = [
  "Personal Care",
  "Medication",
  "Physiotherapy",
  "Companionship",
  "Nursing",
  "Palliative",
  "Hygiene Support",
  "Rehabilitation",
];

export default function Navigation({ onOpenMobile }) {
  const { isAuthenticated, user, userRole, userMetadata, signOut, isMobile } =
    useAuth();
  // Hide nav for senior
  if (isAuthenticated && userRole === "senior") return null;
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState("EN");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      navigate("/");
    }
  };

  // Caregiver bottom nav for mobile
  const caregiverBottomNav = [
    {
      path: "/caregiver-dashboard",
      icon: FiHome,
      label_bn: "ড্যাশবোর্ড",
      label_en: "Dashboard",
    },
    {
      path: "/my-bookings",
      icon: FiCalendar,
      label_bn: "বুকিং",
      label_en: "Bookings",
    },
    {
      path: "/training",
      icon: FiBook,
      label_bn: "প্রশিক্ষণ",
      label_en: "Training",
    },
    {
      path: "/profile",
      icon: FiUser,
      label_bn: "প্রোফাইল",
      label_en: "Profile",
    },
  ];

  const isActive = (path) => location.pathname === path;

  // Mobile bottom nav for caregivers
  if (isMobile && isAuthenticated && userRole === "caregiver") {
    return (
      <>
        {/* Top navigation (minimal on mobile) */}
        <header
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
          }`}
        >
          <div className="px-4 flex items-center justify-between">
            <Link
              to="/caregiver-dashboard"
              className="flex items-center gap-2"
              title="Seba"
            >
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm">
                সে
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-semibold text-text">Seba</div>
                <div className="text-xs text-gray-500">CG</div>
              </div>
            </Link>

            {/* User Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                {userMetadata?.full_name?.charAt(0).toUpperCase() || "U"}
              </div>
            </motion.button>

            {/* User Dropdown */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-14 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-text">
                    {userMetadata?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-error hover:bg-red-50 transition border-t border-gray-100 font-semibold"
                >
                  Logout / লগআউট
                </button>
              </motion.div>
            )}
          </div>
        </header>

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="flex items-center justify-around max-w-6xl mx-auto">
            {caregiverBottomNav.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex-1 flex flex-col items-center justify-center py-4 transition-all ${
                    active
                      ? "text-primary border-t-2 border-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent size={24} />
                  </motion.div>
                  <span className="text-xs font-semibold mt-1">
                    {item.label_bn}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </>
    );
  }

  // Standard desktop navigation
  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            className="md:hidden p-2"
            onClick={onOpenMobile}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white font-bold">
              সে
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-semibold">Seba</div>
              <div className="text-xs text-gray-500">সেবা</div>
            </div>
          </Link>

          {/* Authenticated Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-4">
              {userRole === "caregiver" ? (
                <>
                  <NavLink
                    to="/caregiver-dashboard"
                    className={({ isActive }) =>
                      `px-3 py-2 text-base ${
                        isActive
                          ? "underline text-primary font-semibold"
                          : "hover:underline"
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/my-bookings"
                    className={({ isActive }) =>
                      `px-3 py-2 text-base ${
                        isActive
                          ? "underline text-primary font-semibold"
                          : "hover:underline"
                      }`
                    }
                  >
                    My Bookings
                  </NavLink>
                  <NavLink
                    to="/training"
                    className={({ isActive }) =>
                      `px-3 py-2 text-base ${
                        isActive
                          ? "underline text-primary font-semibold"
                          : "hover:underline"
                      }`
                    }
                  >
                    Training
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `px-3 py-2 text-base ${
                        isActive
                          ? "underline text-primary font-semibold"
                          : "hover:underline"
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/find-caregivers"
                    className={({ isActive }) =>
                      `px-3 py-2 text-base ${
                        isActive
                          ? "underline text-primary font-semibold"
                          : "hover:underline"
                      }`
                    }
                  >
                    Find Caregivers
                  </NavLink>
                  <NavLink
                    to="/activity-logs"
                    className={({ isActive }) =>
                      `px-3 py-2 text-base ${
                        isActive
                          ? "underline text-primary font-semibold"
                          : "hover:underline"
                      }`
                    }
                  >
                    Activity Logs
                  </NavLink>
                  <NavLink
                    to="/live-tracking"
                    className={({ isActive }) =>
                      `px-3 py-2 text-base ${
                        isActive
                          ? "underline text-primary font-semibold"
                          : "hover:underline"
                      }`
                    }
                  >
                    Live Tracking
                  </NavLink>
                </>
              )}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `px-3 py-2 text-base ${
                    isActive
                      ? "underline text-primary font-semibold"
                      : "hover:underline"
                  }`
                }
              >
                Profile
              </NavLink>
            </nav>
          )}

          {/* Public Navigation */}
          {!isAuthenticated && (
            <nav className="hidden md:flex items-center gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 text-base ${
                    isActive ? "underline" : "hover:underline"
                  }`
                }
              >
                Home
              </NavLink>
              <div className="relative group">
                <button className="px-3 py-2 flex items-center gap-2 text-base hover:underline">
                  Services <FiChevronDown size={16} />
                </button>
                <div className="absolute left-0 mt-2 bg-white border rounded-md p-4 shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto services-dropdown">
                  <div className="grid grid-cols-2 gap-3">
                    {services.map((s) => (
                      <a
                        key={s}
                        href="#"
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 text-sm"
                      >
                        <div className="w-9 h-9 bg-primary/10 text-primary rounded flex items-center justify-center text-xs">
                          ✓
                        </div>
                        <div>{s}</div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <NavLink
                to="#how"
                className="px-3 py-2 text-base hover:underline"
              >
                How It Works
              </NavLink>
              <NavLink
                to="/find-caregivers"
                className="px-3 py-2 text-base hover:underline"
              >
                Find Caregivers
              </NavLink>
              <NavLink
                to="#pricing"
                className="px-3 py-2 text-base hover:underline"
              >
                Pricing
              </NavLink>
              <NavLink
                to="#about"
                className="px-3 py-2 text-base hover:underline"
              >
                About
              </NavLink>
              <NavLink
                to="#contact"
                className="px-3 py-2 text-base hover:underline"
              >
                Contact
              </NavLink>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle language"
            onClick={() => setLang((l) => (l === "EN" ? "BN" : "EN"))}
            className="px-2 py-1 rounded border text-xs font-semibold text-base"
          >
            {lang === "EN" ? "EN" : "বাংলা"}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-base"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                  {userMetadata?.full_name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-text">
                  {userMetadata?.full_name?.split(" ")[0] || "User"}
                </span>
              </motion.button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-text">
                      {userMetadata?.full_name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-sm text-text hover:bg-gray-50 transition"
                  >
                    Profile Settings
                  </Link>
                  <Link
                    to="/activity-logs"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-sm text-text hover:bg-gray-50 transition"
                  >
                    Activity Logs
                  </Link>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-error hover:bg-red-50 transition border-t border-gray-100"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 border rounded hover:bg-gray-50 transition text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded text-white text-sm font-semibold transition hover:shadow-lg"
                style={{ background: "#14B8A6" }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
