/**
 * Mock Data for Caregiver Account Creation & Testing
 * Use these datasets for testing the caregiver signup and dashboard features
 */

// ============================================================================
// CAREGIVER SIGNUP TEST DATA - Ready to copy/paste into signup form
// ============================================================================

export const CAREGIVER_SIGNUP_DATA = [
  {
    id: 1,
    name: "Begum Fatema",
    fullName: "Begum Fatema Akter",
    email: "fatema.caregiver@test.com",
    password: "SecurePass123!",
    confirmPassword: "SecurePass123!",
    phone: "+880171234567",
    nidNumber: "12345678901234",
    experienceYears: 5,
    services: [
      "Personal Care",
      "Medication",
      "Companionship",
      "Hygiene Support",
    ],
    location: "Dhaka",
    role: "caregiver",
    description: "Experienced caregiver with 5 years in elderly care",
  },
  {
    id: 2,
    name: "Nasrin Ahmed",
    fullName: "Nasrin Ahmed Khan",
    email: "nasrin.care@test.com",
    password: "NasrinCare456@",
    confirmPassword: "NasrinCare456@",
    phone: "+880181234567",
    nidNumber: "98765432109876",
    experienceYears: 3,
    services: ["Nursing", "Physiotherapy", "Medication"],
    location: "Chittagong",
    role: "caregiver",
    description: "Trained nurse with physiotherapy background",
  },
  {
    id: 3,
    name: "Rina Das",
    fullName: "Rina Das Sharma",
    email: "rina.das@test.com",
    password: "RinaDas789@",
    confirmPassword: "RinaDas789@",
    phone: "+880191234567",
    nidNumber: "55555555555555",
    experienceYears: 7,
    services: [
      "Palliative",
      "Companionship",
      "Hygiene Support",
      "Rehabilitation",
    ],
    location: "Khulna",
    role: "caregiver",
    description: "Palliative care specialist with 7 years experience",
  },
  {
    id: 4,
    name: "Mst. Anika",
    fullName: "Mst. Anika Rahman",
    email: "anika.rahman@test.com",
    password: "AnikaR2024@",
    confirmPassword: "AnikaR2024@",
    phone: "+880161234567",
    nidNumber: "77777777777777",
    experienceYears: 2,
    services: ["Personal Care", "Companionship", "Hygiene Support"],
    location: "Rajshahi",
    role: "caregiver",
    description: "New caregiver with basic training certificate",
  },
  {
    id: 5,
    name: "Begum Razia",
    fullName: "Begum Razia Sultana",
    email: "razia.sultana@test.com",
    password: "Razia2024Pass@",
    confirmPassword: "Razia2024Pass@",
    phone: "+880151234567",
    nidNumber: "33333333333333",
    experienceYears: 8,
    services: ["Nursing", "Medication", "Physiotherapy", "Rehabilitation"],
    location: "Sylhet",
    role: "caregiver",
    description: "Senior nurse with rehabilitation certification",
  },
];

// ============================================================================
// QUICK TEST ACCOUNTS - Single click copy data
// ============================================================================

export const QUICK_CAREGIVER_TEST = {
  BEGINNER: {
    fullName: "Begum Fatema Akter",
    email: "fatema.caregiver@test.com",
    password: "SecurePass123!",
    phone: "+880171234567",
    nidNumber: "12345678901234",
    experienceYears: 1,
    services: ["Personal Care", "Companionship"],
  },
  EXPERIENCED: {
    fullName: "Nasrin Ahmed Khan",
    email: "nasrin.care@test.com",
    password: "NasrinCare456@",
    phone: "+880181234567",
    nidNumber: "98765432109876",
    experienceYears: 5,
    services: ["Nursing", "Physiotherapy", "Medication", "Palliative"],
  },
  SPECIALIST: {
    fullName: "Rina Das Sharma",
    email: "rina.das@test.com",
    password: "RinaDas789@",
    phone: "+880191234567",
    nidNumber: "55555555555555",
    experienceYears: 8,
    services: ["Palliative", "Rehabilitation", "Nursing", "Physiotherapy"],
  },
};

// ============================================================================
// CAREGIVER PROFILE DATA - After signup/login
// ============================================================================

export const CAREGIVER_PROFILE_DATA = {
  id: "caregiver_001",
  userId: "user_123456",
  fullName: "Begum Fatema Akter",
  email: "fatema.caregiver@test.com",
  phone: "+880171234567",
  profilePhoto: "https://via.placeholder.com/150",
  nidNumber: "12345678901234",
  dateOfBirth: "1985-06-15",
  location: {
    district: "Dhaka",
    area: "Mirpur",
    address: "House 15, Street 5, Mirpur",
    latitude: 23.8136,
    longitude: 90.3659,
  },
  experience: {
    years: 5,
    startDate: "2019-01-15",
    specialization: "Elderly Care & Palliative",
  },
  services: [
    "Personal Care",
    "Medication",
    "Companionship",
    "Hygiene Support",
    "Physiotherapy",
  ],
  languages: ["Bangla", "English"],
  certifications: [
    {
      name: "Basic Nursing Certificate",
      issuer: "Bangladesh Health Ministry",
      date: "2019",
    },
    {
      name: "First Aid & CPR",
      issuer: "Red Crescent Society",
      date: "2021",
    },
    {
      name: "Elderly Care Specialist",
      issuer: "Sheba Institute",
      date: "2022",
    },
  ],
  verification: {
    nidVerified: true,
    backgroundCheckPassed: true,
    policeClearance: true,
    verificationDate: "2024-01-10",
  },
  ratings: {
    averageRating: 4.8,
    totalReviews: 127,
    fiveStarCount: 118,
    fourStarCount: 7,
    threeStarCount: 2,
  },
  availability: {
    currentlyAvailable: true,
    preferredHours: "8:00 AM - 8:00 PM",
    daysAvailable: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  earnings: {
    totalEarnings: 125000,
    monthlyEarnings: 25000,
    todaysEarnings: 2000,
    pendingPayment: 5000,
    currency: "BDT",
  },
};

// ============================================================================
// BOOKING & ASSIGNMENT MOCK DATA
// ============================================================================

export const CAREGIVER_BOOKINGS = [
  {
    id: "booking_001",
    bookingDate: "2025-11-14",
    status: "active",
    senior: {
      id: "senior_001",
      name: "রহিম আহমেদ",
      age: 75,
      photo: "https://via.placeholder.com/50",
      conditions: ["Diabetes", "Arthritis"],
    },
    location: {
      address: "House 12, Street 3, Mirpur",
      latitude: 23.8145,
      longitude: 90.3668,
    },
    timeSlot: {
      start: "10:00 AM",
      end: "2:00 PM",
      duration: 4,
    },
    services: ["Personal Care", "Medication", "Companionship"],
    payment: 800,
    checkinTime: "10:05 AM",
    checkoutTime: null,
    status: "checked_in",
  },
  {
    id: "booking_002",
    bookingDate: "2025-11-14",
    status: "completed",
    senior: {
      id: "senior_002",
      name: "ফাতিমা বেগম",
      age: 68,
      photo: "https://via.placeholder.com/50",
      conditions: ["Blood Pressure"],
    },
    location: {
      address: "Apartment 5C, Building B, Banani",
      latitude: 23.8241,
      longitude: 90.3742,
    },
    timeSlot: {
      start: "2:00 PM",
      end: "6:00 PM",
      duration: 4,
    },
    services: ["Personal Care", "Hygiene Support"],
    payment: 800,
    checkinTime: "2:03 PM",
    checkoutTime: "5:58 PM",
    status: "completed",
    activityReport: {
      servicesCompleted: ["Personal Care", "Hygiene Support", "Meal Prep"],
      seniorCondition: "good",
      notes: "সিনিয়র খুব ভাল অবস্থায় ছিলেন। সব কাজ সম্পন্ন করা হয়েছে।",
      photosUploaded: 3,
    },
  },
  {
    id: "booking_003",
    bookingDate: "2025-11-15",
    status: "upcoming",
    senior: {
      id: "senior_003",
      name: "করিম শেখ",
      age: 82,
      photo: "https://via.placeholder.com/50",
      conditions: ["Mobility Issues", "Memory Loss"],
    },
    location: {
      address: "House 8, Lane 2, Dhanmondi",
      latitude: 23.7642,
      longitude: 90.3688,
    },
    timeSlot: {
      start: "9:00 AM",
      end: "1:00 PM",
      duration: 4,
    },
    services: ["Physiotherapy", "Companionship", "Mobility Support"],
    payment: 1000,
    status: "pending",
  },
  {
    id: "booking_004",
    bookingDate: "2025-11-16",
    status: "upcoming",
    senior: {
      id: "senior_004",
      name: "সালমা আক্তার",
      age: 70,
      photo: "https://via.placeholder.com/50",
      conditions: ["Nursing Care Required"],
    },
    location: {
      address: "Care Home, Sector 15, Uttara",
      latitude: 23.8854,
      longitude: 90.3661,
    },
    timeSlot: {
      start: "2:00 PM",
      end: "8:00 PM",
      duration: 6,
    },
    services: ["Nursing", "Medication", "Personal Care"],
    payment: 1200,
    status: "pending",
  },
];

// ============================================================================
// EARNINGS & ACTIVITY LOG MOCK DATA
// ============================================================================

export const CAREGIVER_EARNINGS = [
  {
    date: "2025-11-14",
    bookingId: "booking_001",
    senior: "রহিম আহমেদ",
    amount: 800,
    status: "completed",
    serviceHours: 4,
  },
  {
    date: "2025-11-14",
    bookingId: "booking_002",
    senior: "ফাতিমা বেগম",
    amount: 800,
    status: "completed",
    serviceHours: 4,
  },
  {
    date: "2025-11-13",
    bookingId: "booking_005",
    senior: "আব্দুল মান্নান",
    amount: 900,
    status: "completed",
    serviceHours: 4.5,
  },
  {
    date: "2025-11-13",
    bookingId: "booking_006",
    senior: "নাজমা বিবি",
    amount: 600,
    status: "completed",
    serviceHours: 3,
  },
  {
    date: "2025-11-12",
    bookingId: "booking_007",
    senior: "করিম শেখ",
    amount: 800,
    status: "completed",
    serviceHours: 4,
  },
];

export const CAREGIVER_DAILY_EARNINGS = {
  today: 2000,
  thisWeek: 12500,
  thisMonth: 45000,
  allTime: 125000,
  pendingPayment: 5000,
  breakdown: {
    "2025-11-14": 1600,
    "2025-11-13": 1500,
    "2025-11-12": 800,
    "2025-11-11": 2100,
    "2025-11-10": 1800,
  },
};

// ============================================================================
// ACTIVITY LOGS - Post checkout reports
// ============================================================================

export const ACTIVITY_LOG_EXAMPLES = [
  {
    id: "log_001",
    bookingId: "booking_002",
    date: "2025-11-14",
    senior: "ফাতিমা বেগম",
    checkinTime: "2:03 PM",
    checkoutTime: "5:58 PM",
    servicesCompleted: ["Personal Care", "Hygiene Support", "Meal Preparation"],
    seniorCondition: "good",
    notes:
      "সিনিয়র সুস্থ ছিলেন। দুপুরের খাবার দিয়েছি। গোসল করিয়েছি। নিয়মিত ওষুধ দিয়েছি।",
    photosUploaded: 2,
    distanceFromHome: 2.3,
    accuracyRadius: 25,
  },
  {
    id: "log_002",
    bookingId: "booking_001",
    date: "2025-11-14",
    senior: "রহিম আহমেদ",
    checkinTime: "10:05 AM",
    checkoutTime: "active",
    servicesCompleted: ["Personal Care", "Medication", "Companionship"],
    seniorCondition: "excellent",
    notes:
      "অত্যন্ত ভালো অবস্থায়। সকালের ওষুধ দিয়েছি। একসাথে টেবিল খেলা খেলেছি।",
    photosUploaded: 1,
    distanceFromHome: 1.8,
    accuracyRadius: 20,
  },
  {
    id: "log_003",
    bookingId: "booking_008",
    date: "2025-11-13",
    senior: "আব্দুল মান্নান",
    checkinTime: "3:10 PM",
    checkoutTime: "7:45 PM",
    servicesCompleted: ["Physiotherapy", "Personal Care", "Mobility Support"],
    seniorCondition: "concerning",
    notes:
      "সিনিয়র পায়ে ব্যথা অনুভব করছেন। অতিরিক্ত যত্ন নেওয়া হয়েছে। পরিবারকে অবহিত করা হয়েছে।",
    photosUploaded: 3,
    distanceFromHome: 3.1,
    accuracyRadius: 30,
  },
];

// ============================================================================
// TRAINING COURSE DATA
// ============================================================================

export const CAREGIVER_TRAINING_COURSES = [
  {
    id: "course_001",
    title: "প্রাথমিক চিকিৎসা",
    titleEn: "First Aid Training",
    description: "জরুরি পরিস্থিতিতে প্রাথমিক চিকিৎসা",
    duration: "2 hours",
    level: "Beginner",
    lessons: 5,
    quizzes: 2,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    progress: 60,
    status: "in_progress",
  },
  {
    id: "course_002",
    title: "যোগাযোগ দক্ষতা",
    titleEn: "Communication Skills",
    description: "বয়স্কদের সাথে কার্যকর যোগাযোগ",
    duration: "3 hours",
    level: "Intermediate",
    lessons: 8,
    quizzes: 3,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    progress: 100,
    status: "completed",
    certificateDate: "2025-10-15",
  },
  {
    id: "course_003",
    title: "স্বাস্থ্যবিধি এবং পরিষ্কার পরিচ্ছন্নতা",
    titleEn: "Hygiene & Health Care",
    description: "বয়স্ক যত্নে স্বাস্থ্যবিধি নিয়ম",
    duration: "2.5 hours",
    level: "Beginner",
    lessons: 6,
    quizzes: 2,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    progress: 0,
    status: "not_started",
  },
];

// ============================================================================
// GPS CHECK-IN TEST DATA
// ============================================================================

export const GPS_CHECKIN_TEST_DATA = {
  SUCCESS: {
    bookingId: "booking_001",
    seniorLocation: {
      latitude: 23.8145,
      longitude: 90.3668,
      address: "House 12, Street 3, Mirpur",
    },
    caregiverLocation: {
      latitude: 23.81456,
      longitude: 90.36685,
      accuracy: 15,
    },
    distance: 0.008, // in km (8 meters)
    distanceMeters: 8,
    threshold: 100,
    result: "SUCCESS",
  },
  PARTIAL_SUCCESS: {
    bookingId: "booking_002",
    seniorLocation: {
      latitude: 23.8241,
      longitude: 90.3742,
      address: "Apartment 5C, Building B, Banani",
    },
    caregiverLocation: {
      latitude: 23.8245,
      longitude: 90.3748,
      accuracy: 20,
    },
    distance: 0.06, // in km (60 meters)
    distanceMeters: 60,
    threshold: 100,
    result: "SUCCESS",
  },
  FAIL_TOO_FAR: {
    bookingId: "booking_003",
    seniorLocation: {
      latitude: 23.7642,
      longitude: 90.3688,
      address: "House 8, Lane 2, Dhanmondi",
    },
    caregiverLocation: {
      latitude: 23.7742,
      longitude: 90.3688,
      accuracy: 25,
    },
    distance: 1.11, // in km (1110 meters)
    distanceMeters: 1110,
    threshold: 100,
    result: "FAIL - Too Far",
  },
  NO_GPS: {
    bookingId: "booking_004",
    error: "GPS_UNAVAILABLE",
    message: "Location services not enabled",
    result: "ERROR",
  },
};

// ============================================================================
// NOTIFICATION MOCK DATA
// ============================================================================

export const CAREGIVER_NOTIFICATIONS = [
  {
    id: "notif_001",
    type: "booking_accepted",
    title: "নতুন বুকিং গৃহীত",
    message: "আপনার বুকিং বিনোদ অনুমোদিত হয়েছে - রহিম আহমেদ",
    timestamp: "2025-11-14T08:30:00",
    read: false,
    actionUrl: "/my-bookings/booking_001",
  },
  {
    id: "notif_002",
    type: "payment_received",
    title: "পেমেন্ট প্রাপ্ত",
    message: "৳800 টাকা আপনার অ্যাকাউন্টে জমা হয়েছে",
    timestamp: "2025-11-13T18:15:00",
    read: true,
    actionUrl: "/earnings",
  },
  {
    id: "notif_003",
    type: "senior_alert",
    title: "সিনিয়র সতর্কতা",
    message: "ফাতিমা বেগম উদ্বেগজনক অবস্থায় রয়েছেন",
    timestamp: "2025-11-13T16:45:00",
    read: true,
    actionUrl: "/my-bookings/booking_002",
    severity: "high",
  },
  {
    id: "notif_004",
    type: "training_reminder",
    title: "প্রশিক্ষণ স্মরণীয়",
    message: "নতুন প্রশিক্ষণ কোর্স উপলব্ধ - প্যালিয়েটিভ কেয়ার",
    timestamp: "2025-11-12T10:00:00",
    read: true,
    actionUrl: "/training",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getCaregiverById = (id) => {
  return CAREGIVER_SIGNUP_DATA.find((c) => c.id === id);
};

export const getBookingById = (id) => {
  return CAREGIVER_BOOKINGS.find((b) => b.id === id);
};

export const getTodayEarnings = () => {
  return CAREGIVER_DAILY_EARNINGS.today;
};

export const getTodayBookings = () => {
  return CAREGIVER_BOOKINGS.filter((b) => b.bookingDate === "2025-11-14");
};

export const getActiveBooking = () => {
  return CAREGIVER_BOOKINGS.find((b) => b.status === "checked_in");
};

export const getUpcomingBookings = () => {
  return CAREGIVER_BOOKINGS.filter((b) => b.status === "pending");
};

export const getCompletedBookings = () => {
  return CAREGIVER_BOOKINGS.filter((b) => b.status === "completed");
};

/**
 * Format earnings for display
 * @param {number} amount - Amount in BDT
 * @returns {string} - Formatted string like "৳2,500"
 */
export const formatEarnings = (amount) => {
  return `৳${amount.toLocaleString("bn-BD")}`;
};

/**
 * Calculate distance using Haversine formula
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {number} - Distance in kilometers
 */
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default {
  CAREGIVER_SIGNUP_DATA,
  QUICK_CAREGIVER_TEST,
  CAREGIVER_PROFILE_DATA,
  CAREGIVER_BOOKINGS,
  CAREGIVER_EARNINGS,
  CAREGIVER_DAILY_EARNINGS,
  ACTIVITY_LOG_EXAMPLES,
  CAREGIVER_TRAINING_COURSES,
  GPS_CHECKIN_TEST_DATA,
  CAREGIVER_NOTIFICATIONS,
  getCaregiverById,
  getBookingById,
  getTodayEarnings,
  getTodayBookings,
  getActiveBooking,
  getUpcomingBookings,
  getCompletedBookings,
  formatEarnings,
  haversineDistance,
};
