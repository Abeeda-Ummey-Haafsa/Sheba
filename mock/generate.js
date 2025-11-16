/**
 * সেবা Mock Data Generator
 * Generated on: November 15, 2025
 *
 * Creates realistic, interconnected mock data for the Seba platform
 * with proper foreign key relationships and Bangladeshi context.
 *
 * Install dependencies:
 *   npm install @faker-js/faker @turf/turf moment
 *
 * Run:
 *   node mock/generate.js
 */

import { faker } from "@faker-js/faker";
import * as turf from "@turf/turf";
import moment from "moment";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const COUNTS = {
  FAMILY_USERS: 50,
  CAREGIVERS: 100,
  ADMIN_USERS: 3,
  SENIORS_PER_FAMILY: [1, 2, 3], // weighted distribution
  BOOKINGS_PER_SENIOR: [2, 3, 4, 5, 6], // weighted
  TRAINING_COURSES: 10,
};

const VERIFIED_PERCENTAGE = 0.9; // 90% caregivers verified
const ACTIVE_ALERTS_PERCENTAGE = 0.2; // 20% alerts still active

// ============================================================================
// DHAKA LOCATION DATA
// ============================================================================

const DHAKA_LOCATIONS = [
  {
    area: "mirpur",
    area_bn: "মিরপুর",
    sub_areas: [
      "মিরপুর ১",
      "মিরপুর ২",
      "মিরপুর ১০",
      "মিরপুর ১১",
      "মিরপুর ১২",
      "পল্লবী",
    ],
  },
  {
    area: "mohammadpur",
    area_bn: "মহম্মদপুর",
    sub_areas: ["বশির উদ্দিন রোড", "জাপান গার্ডেন সিটি", "তাজমহল রোড"],
  },
  {
    area: "dhanmondi",
    area_bn: "ধানমন্ডি",
    sub_areas: ["ধানমন্ডি ২৭", "ধানমন্ডি ৩২", "সাত মসজিদ রোড"],
  },
  {
    area: "gulshan",
    area_bn: "গুলশান",
    sub_areas: ["গুলশান ১", "গুলশান ২", "বনানী", "বারিধারা"],
  },
  {
    area: "uttara",
    area_bn: "উত্তরা",
    sub_areas: ["উত্তরা সেক্টর ১", "উত্তরা সেক্টর ৪", "উত্তরা সেক্টর ১১"],
  },
  {
    area: "banani",
    area_bn: "বনানী",
    sub_areas: ["ব্লক এ", "ব্লক বি", "ব্লক সি", "রোড ১১"],
  },
];

// ============================================================================
// BANGLADESHI DATA
// ============================================================================

const BD_NAMES = {
  male_first: [
    "আবদুল",
    "মোহাম্মদ",
    "আহমেদ",
    "রফিক",
    "করিম",
    "রহমান",
    "আলী",
    "হাসান",
    "হোসেন",
    "ফারুক",
    "মাহমুদ",
    "জাহিদ",
    "রাশেদ",
    "নাসির",
    "সালাম",
    "শফিক",
    "তারেক",
    "নাজমুল",
    "আবুল",
    "শাহ",
  ],
  male_last: [
    "করিম",
    "রহমান",
    "আহমেদ",
    "খান",
    "চৌধুরী",
    "মিয়া",
    "হক",
    "আলী",
    "ইসলাম",
    "হোসেন",
    "মল্লিক",
    "বেপারী",
    "শিকদার",
    "তালুকদার",
  ],
  female_first: [
    "ফাতেমা",
    "আয়েশা",
    "রাবেয়া",
    "খাদিজা",
    "সালমা",
    "নাসরিন",
    "রোকেয়া",
    "পারভিন",
    "শাহনাজ",
    "তাসলিমা",
    "রেহানা",
    "শিরিন",
    "সুলতানা",
    "বেগম",
    "নূরজাহান",
    "জাহানারা",
    "আঞ্জুমান",
    "রুমানা",
    "সাবিনা",
    "মাহমুদা",
  ],
  female_last: [
    "খাতুন",
    "বেগম",
    "আক্তার",
    "পারভীন",
    "সুলতানা",
    "নাহার",
    "হক",
    "রহমান",
    "আহমেদ",
    "খান",
    "চৌধুরী",
    "দাস",
    "শর্মা",
    "রায়",
  ],
};

const DHAKA_NEIGHBORHOODS = [
  { name: "ধানমন্ডি", name_en: "Dhanmondi", lat: 23.7465, lon: 90.3753 },
  { name: "গুলশান", name_en: "Gulshan", lat: 23.7925, lon: 90.4152 },
  { name: "বনানী", name_en: "Banani", lat: 23.7937, lon: 90.4066 },
  { name: "মিরপুর", name_en: "Mirpur", lat: 23.8223, lon: 90.3654 },
  { name: "উত্তরা", name_en: "Uttara", lat: 23.8759, lon: 90.3795 },
  { name: "মতিঝিল", name_en: "Motijheel", lat: 23.7334, lon: 90.4176 },
  { name: "বাড্ডা", name_en: "Badda", lat: 23.7809, lon: 90.426 },
  { name: "মোহাম্মদপুর", name_en: "Mohammadpur", lat: 23.7656, lon: 90.3565 },
  { name: "শ্যামলী", name_en: "Shyamoli", lat: 23.7686, lon: 90.3686 },
  { name: "রামপুরা", name_en: "Rampura", lat: 23.7578, lon: 90.4259 },
  { name: "খিলগাঁও", name_en: "Khilgaon", lat: 23.7464, lon: 90.4283 },
  { name: "মগবাজার", name_en: "Mogbazar", lat: 23.7508, lon: 90.4032 },
  { name: "কল্যাণপুর", name_en: "Kalyanpur", lat: 23.7719, lon: 90.3658 },
  { name: "আগারগাঁও", name_en: "Agargaon", lat: 23.7794, lon: 90.3799 },
  { name: "তেজগাঁও", name_en: "Tejgaon", lat: 23.7644, lon: 90.3917 },
];

const SKILLS = [
  "Personal Care",
  "Companionship",
  "Meal Preparation",
  "Medication Management",
  "Diabetes Care",
  "Blood Pressure Monitoring",
  "Nursing",
  "Physiotherapy",
  "Wound Care",
  "Mobility Assistance",
  "Palliative Care",
  "Dementia Care",
  "Rehabilitation",
  "Respiratory Care",
  "Post-Surgery Care",
  "Mental Health Support",
];

const MEDICAL_CONDITIONS = [
  "ডায়াবেটিস",
  "উচ্চ রক্তচাপ",
  "হৃদরোগ",
  "আর্থ্রাইটিস",
  "হাঁপানি",
  "অস্টিওপরোসিস",
  "ডিমেনশিয়া",
  "পারকিনসন্স",
  "স্ট্রোক",
  "কিডনি রোগ",
  "দুর্বল দৃষ্টি",
  "শ্রবণশক্তি হ্রাস",
  "থাইরয়েড",
  "কোলেস্টেরল",
];

const SERVICES = [
  "Personal Care",
  "Medication Administration",
  "Vital Signs Monitoring",
  "Meal Preparation",
  "Feeding Assistance",
  "Bathing Assistance",
  "Mobility Exercises",
  "Physiotherapy Session",
  "Companionship",
  "Mental Stimulation",
  "Light Housekeeping",
  "Hygiene Support",
  "Wound Dressing",
  "Blood Sugar Check",
  "Blood Pressure Check",
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, min, max) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateBangladeshiPhone() {
  // Bangladesh format: +8801XXXXXXXXX (11 digits after +880)
  const prefix = ["7", "8", "9", "5", "6", "3", "4"];
  return `+8801${getRandomElement(prefix)}${faker.string.numeric(8)}`.slice(
    0,
    14
  );
}

function generateNID() {
  return faker.string.numeric(13); // Bangladesh NID is 13 or 17 digits
}

function generateUUID() {
  return faker.string.uuid();
}

function generateLocation(neighborhood) {
  // Generate point within 1km radius of neighborhood center
  const point = turf.point([neighborhood.lon, neighborhood.lat]);
  const radius = 1; // km
  const options = { steps: 64, units: "kilometers" };
  const circle = turf.circle(point, radius, options);
  const bbox = turf.bbox(circle);

  const randomLon = faker.number.float({
    min: bbox[0],
    max: bbox[2],
    fractionDigits: 6,
  });
  const randomLat = faker.number.float({
    min: bbox[1],
    max: bbox[3],
    fractionDigits: 6,
  });

  return { lat: randomLat, lon: randomLon };
}

function generateBangladeshiName(gender) {
  if (gender === "পুরুষ") {
    return `${getRandomElement(BD_NAMES.male_first)} ${getRandomElement(
      BD_NAMES.male_last
    )}`;
  } else {
    return `${getRandomElement(BD_NAMES.female_first)} ${getRandomElement(
      BD_NAMES.female_last
    )}`;
  }
}

function generateEnglishName(gender) {
  if (gender === "পুরুষ") {
    return faker.person.fullName({ sex: "male" });
  } else {
    return faker.person.fullName({ sex: "female" });
  }
}

function getWeightedRandom(array) {
  // Higher index = higher probability
  const weights = array.map((_, i) => i + 1);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < array.length; i++) {
    random -= weights[i];
    if (random <= 0) return array[i];
  }
  return array[array.length - 1];
}

function generateDateInRange(startDate, endDate) {
  const start = moment(startDate);
  const end = moment(endDate);
  const diffDays = end.diff(start, "days");
  const randomDays = Math.floor(Math.random() * diffDays);
  return start.add(randomDays, "days").format("YYYY-MM-DD");
}

function generateTimeSlot() {
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];
  const hour = getRandomElement(hours);
  return `${hour.toString().padStart(2, "0")}:00:00`;
}

// ============================================================================
// DATA GENERATORS
// ============================================================================

function generateUsers() {
  const users = [];

  // Generate family users (guardians abroad)
  for (let i = 0; i < COUNTS.FAMILY_USERS; i++) {
    const gender = Math.random() > 0.5 ? "পুরুষ" : "মহিলা";
    users.push({
      id: generateUUID(),
      email: faker.internet.email().toLowerCase(),
      password_hash:
        "$2a$10$rQ3qZ5Z5Z5Z5Z5Z5Z5Z5Z.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z", // hashed 'password123'
      role: "family",
      full_name: generateEnglishName(gender),
      phone: generateBangladeshiPhone(),
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(
        8
      )}`,
      created_at: moment()
        .subtract(Math.floor(Math.random() * 365), "days")
        .toISOString(),
      updated_at: moment().toISOString(),
    });
  }

  // Generate caregiver users
  for (let i = 0; i < COUNTS.CAREGIVERS; i++) {
    const gender = Math.random() > 0.7 ? "পুরুষ" : "মহিলা"; // 70% female caregivers
    users.push({
      id: generateUUID(),
      email: faker.internet.email().toLowerCase(),
      password_hash:
        "$2a$10$rQ3qZ5Z5Z5Z5Z5Z5Z5Z5Z.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
      role: "caregiver",
      full_name: generateBangladeshiName(gender),
      phone: generateBangladeshiPhone(),
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(
        8
      )}`,
      created_at: moment()
        .subtract(Math.floor(Math.random() * 365), "days")
        .toISOString(),
      updated_at: moment().toISOString(),
    });
  }

  // Generate admin users
  for (let i = 0; i < COUNTS.ADMIN_USERS; i++) {
    users.push({
      id: generateUUID(),
      email: `admin${i + 1}@seba.com`,
      password_hash:
        "$2a$10$rQ3qZ5Z5Z5Z5Z5Z5Z5Z5Z.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
      role: "admin",
      full_name: `Admin User ${i + 1}`,
      phone: generateBangladeshiPhone(),
      avatar_url: null,
      created_at: moment().subtract(365, "days").toISOString(),
      updated_at: moment().toISOString(),
    });
  }

  return users;
}

function generateCaregivers(users) {
  const caregiverUsers = users.filter((u) => u.role === "caregiver");
  const caregivers = [];

  caregiverUsers.forEach((user) => {
    const neighborhood = getRandomElement(DHAKA_NEIGHBORHOODS);
    const location = generateLocation(neighborhood);
    const experienceYears = Math.floor(Math.random() * 15) + 1;
    // All caregivers are verified
    const isVerified = true;

    // More experienced = more services
    const serviceCount =
      experienceYears < 3 ? [2, 3] : experienceYears < 7 ? [3, 5] : [5, 8];
    const services = getRandomElements(
      SKILLS,
      serviceCount[0],
      serviceCount[1]
    );

    // More experienced = higher rating (weighted)
    const baseRating =
      experienceYears < 3 ? 3.5 : experienceYears < 7 ? 4.0 : 4.5;
    const rating = Math.min(5, baseRating + Math.random() * 0.5);

    // Experience affects hourly rate
    const baseRate =
      experienceYears < 3 ? 200 : experienceYears < 7 ? 350 : 500;
    const hourlyRate = baseRate + Math.floor(Math.random() * 100);

    const gender =
      user.full_name.includes("বেগম") ||
      user.full_name.includes("ফাতেমা") ||
      user.full_name.includes("নাসরিন") ||
      user.full_name.includes("রিনা") ||
      user.full_name.includes("খাতুন") ||
      user.full_name.includes("আক্তার")
        ? "মহিলা"
        : "পুরুষ";

    // Generate NID number (14 digits)
    const nidNumber = faker.string.numeric(14);

    // Build location object for frontend
    const locationObj = {
      district: "Dhaka",
      area: neighborhood.name_en,
      address: `${Math.floor(Math.random() * 200) + 1}, ${
        neighborhood.name_en
      }`,
      latitude: location.lat,
      longitude: location.lon,
    };

    caregivers.push({
      id: generateUUID(),
      userId: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      nidNumber: nidNumber,
      experienceYears: experienceYears,
      services: services,
      location: locationObj,
      role: "caregiver",
      description: `অভিজ্ঞ পরিচর্যাকারী। ${experienceYears} বছরের অভিজ্ঞতা। ${services
        .slice(0, 2)
        .join(", ")} এ দক্ষ।`,
      gender: gender,
      profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(
        8
      )}`,
      verification: {
        nidVerified: true,
        backgroundCheckPassed: true,
        policeClearance: true,
        verificationDate: moment(user.created_at)
          .add(Math.floor(Math.random() * 30), "days")
          .toISOString(),
      },
      ratings: {
        averageRating: parseFloat(rating.toFixed(2)),
        totalReviews: Math.floor(Math.random() * 100) + 20,
        fiveStarCount: Math.floor(Math.random() * 80) + 20,
        fourStarCount: Math.floor(Math.random() * 10) + 5,
        threeStarCount: Math.floor(Math.random() * 5),
      },
      hourlyRate: hourlyRate,
      createdAt: user.created_at,
    });
  });

  return caregivers;
}

function generateSeniors(users) {
  const familyUsers = users.filter((u) => u.role === "family");
  const seniors = [];

  familyUsers.forEach((familyUser) => {
    const seniorCount = getWeightedRandom(COUNTS.SENIORS_PER_FAMILY);

    for (let i = 0; i < seniorCount; i++) {
      const gender = Math.random() > 0.5 ? "পুরুষ" : "মহিলা";
      const neighborhood = getRandomElement(DHAKA_NEIGHBORHOODS);
      const location = generateLocation(neighborhood);
      const age = Math.floor(Math.random() * 30) + 65; // 65-95

      const conditionCount = Math.floor(Math.random() * 4) + 1; // 1-4 conditions
      const conditions = getRandomElements(
        MEDICAL_CONDITIONS,
        conditionCount,
        conditionCount
      );

      const emergencyContacts = [
        {
          name: `ডা. ${getRandomElement(BD_NAMES.male_last)}`,
          relation: "পারিবারিক চিকিৎসক",
          phone: generateBangladeshiPhone(),
        },
      ];

      // Some have additional emergency contacts
      if (Math.random() > 0.5) {
        emergencyContacts.push({
          name: generateBangladeshiName(
            Math.random() > 0.5 ? "পুরুষ" : "মহিলা"
          ),
          relation: getRandomElement(["প্রতিবেশী", "আত্মীয়", "বন্ধু"]),
          phone: generateBangladeshiPhone(),
        });
      }

      // Select random area and sub_area
      const locationArea = getRandomElement(DHAKA_LOCATIONS);
      const subArea = getRandomElement(locationArea.sub_areas);
      const houseNumber = Math.floor(Math.random() * 200) + 1;
      const roadNumber = Math.floor(Math.random() * 20) + 1;
      const addressLine = `বাড়ি নং ${houseNumber}, রোড ${roadNumber}`;

      seniors.push({
        id: generateUUID(),
        family_user_id: familyUser.id,
        name: generateBangladeshiName(gender),
        age: age,
        gender: gender,
        area: locationArea.area,
        sub_area: subArea,
        address_line: addressLine,
        address: `${addressLine}, ${subArea}, ${locationArea.area_bn}, ঢাকা`,
        location: `SRID=4326;POINT(${location.lon} ${location.lat})`,
        medical_conditions: conditions,
        medication_list: `নিয়মিত ওষুধ সেবন করেন। ${
          conditions.includes("ডায়াবেটিস") ? "মেটফরমিন ৫০০mg দিনে ২ বার। " : ""
        }${
          conditions.includes("উচ্চ রক্তচাপ")
            ? "এমলোডিপিন ৫mg দিনে ১ বার। "
            : ""
        }`,
        emergency_contacts: emergencyContacts,
        created_at: moment(familyUser.created_at)
          .add(Math.floor(Math.random() * 10), "days")
          .toISOString(),
      });
    }
  });

  return seniors;
}

function generateBookings(seniors, caregivers) {
  const bookings = [];
  const now = moment();
  const sixMonthsAgo = moment().subtract(6, "months");

  seniors.forEach((senior) => {
    const bookingCount = getWeightedRandom(COUNTS.BOOKINGS_PER_SENIOR);

    // Filter verified caregivers only - all caregivers are verified now
    const verifiedCaregivers = caregivers.filter(
      (c) => c.verification?.nidVerified
    );

    for (let i = 0; i < bookingCount; i++) {
      const caregiver = getRandomElement(verifiedCaregivers);
      const bookingDate = generateDateInRange(sixMonthsAgo, now);
      const startTime = generateTimeSlot();
      const durationHrs = getRandomElement([2, 3, 4, 5, 6]);

      // Determine status based on date
      const isInPast = moment(bookingDate).isBefore(moment(), "day");
      const isToday = moment(bookingDate).isSame(moment(), "day");
      const isFuture = moment(bookingDate).isAfter(moment(), "day");

      let status;
      if (isFuture) {
        status = Math.random() > 0.3 ? "confirmed" : "pending";
      } else if (isToday) {
        status = getRandomElement(["confirmed", "in_progress"]);
      } else {
        // Past bookings: 90% completed, 10% cancelled
        status = Math.random() > 0.1 ? "completed" : "cancelled";
      }

      bookings.push({
        id: generateUUID(),
        senior_id: senior.id,
        caregiver_id: caregiver.id,
        booking_date: bookingDate,
        start_time: startTime,
        duration_hrs: durationHrs,
        status: status,
        hourly_rate: caregiver.hourlyRate, // Fixed: use hourlyRate instead of hourly_rate
        total_amount: Math.round(caregiver.hourlyRate * durationHrs * 1.15), // 15% platform fee
        notes: getRandomElement([
          "দয়া করে সময়মতো আসবেন। ওষুধের সময় মনে রাখবেন।",
          "সিনিয়রের বিশেষ যত্ন প্রয়োজন। ধৈর্য সহকারে কাজ করবেন।",
          "খাবারের সময় লক্ষ্য রাখবেন। হালকা খাবার পছন্দ করেন।",
          "গোসলের সময় সাহায্য করতে হবে। সাবধানে হ্যান্ডেল করবেন।",
          null,
          null, // Some bookings have no notes
        ]),
        created_at: moment(bookingDate)
          .subtract(Math.floor(Math.random() * 7) + 1, "days")
          .toISOString(),
        updated_at: moment().toISOString(),
      });
    }
  });

  return bookings;
}

function generateActivityLogs(bookings, seniors) {
  const activityLogs = [];
  const completedBookings = bookings.filter((b) => b.status === "completed");

  completedBookings.forEach((booking) => {
    const senior = seniors.find((s) => s.id === booking.senior_id);
    if (!senior) return;

    // Extract location from senior's location string
    const locationMatch = senior.location.match(
      /POINT\(([0-9.-]+) ([0-9.-]+)\)/
    );
    const lon = locationMatch ? parseFloat(locationMatch[1]) : 90.4;
    const lat = locationMatch ? parseFloat(locationMatch[2]) : 23.8;

    const checkInTime = moment(`${booking.booking_date} ${booking.start_time}`)
      .add(Math.floor(Math.random() * 10), "minutes")
      .toISOString();
    const checkOutTime = moment(checkInTime)
      .add(booking.duration_hrs, "hours")
      .add(Math.floor(Math.random() * 20) - 10, "minutes")
      .toISOString();

    const servicesCount = Math.floor(Math.random() * 4) + 2;
    const servicesProvided = getRandomElements(
      SERVICES,
      servicesCount,
      servicesCount
    );

    const rating = Math.random() < 0.8 ? 5 : Math.random() < 0.7 ? 4 : 3; // Mostly high ratings

    const noteTemplates = [
      `সিনিয়র আজ খুব ভালো ছিলেন। ${servicesProvided
        .slice(0, 2)
        .join(" এবং ")} করেছি। কোনো সমস্যা হয়নি।`,
      `দুর্দান্ত সেশন। সিনিয়র সহযোগিতা করেছেন। ${servicesProvided
        .slice(0, 2)
        .join(", ")} সম্পন্ন হয়েছে।`,
      `সব ওষুধ সময়মতো দেওয়া হয়েছে। রক্তচাপ স্বাভাবিক। সিনিয়র খুশি ছিলেন।`,
      `আজকের কাজ সফলভাবে সম্পন্ন। সিনিয়রের মেজাজ ভালো ছিল। খাবার ঠিকমতো খেয়েছেন।`,
      `সিনিয়র আজ একটু দুর্বল অনুভব করছিলেন। বিশ্রাম নিতে বলেছি। ওষুধ দিয়েছি।`,
    ];

    activityLogs.push({
      id: generateUUID(),
      booking_id: booking.id,
      check_in_time: checkInTime,
      check_out_time: checkOutTime,
      check_in_location: `SRID=4326;POINT(${
        lon + (Math.random() * 0.001 - 0.0005)
      } ${lat + (Math.random() * 0.001 - 0.0005)})`,
      services_provided: servicesProvided,
      notes: getRandomElement(noteTemplates),
      family_rating: rating,
      created_at: checkOutTime,
    });
  });

  return activityLogs;
}

function generateEmergencyAlerts(seniors, caregivers) {
  const alerts = [];
  const now = moment();
  const threeMonthsAgo = moment().subtract(3, "months");

  // Generate 1-2 alerts per 10 seniors
  const alertCount = Math.floor(seniors.length / 5);

  for (let i = 0; i < alertCount; i++) {
    const senior = getRandomElement(seniors);
    const timestamp = generateDateInRange(threeMonthsAgo, now);
    const isActive = Math.random() < ACTIVE_ALERTS_PERCENTAGE;
    const alertType = getRandomElement([
      "medical",
      "medical",
      "fall",
      "general",
    ]); // More medical alerts

    let notes;
    switch (alertType) {
      case "medical":
        notes = getRandomElement([
          "রক্তচাপ হঠাৎ বেড়ে গেছে। ডাক্তারের সাথে যোগাযোগ করা হয়েছে।",
          "রক্তে শর্করার মাত্রা কমে গিয়েছিল। গ্লুকোজ দেওয়া হয়েছে।",
          "বুকে ব্যথার অভিযোগ। অ্যাম্বুলেন্স ডাকা হয়েছে।",
          "শ্বাসকষ্ট হচ্ছিল। ইনহেলার ব্যবহার করানো হয়েছে।",
        ]);
        break;
      case "fall":
        notes = getRandomElement([
          "বাথরুমে পড়ে গিয়েছিলেন। ছোট আঘাত। প্রাথমিক চিকিৎসা করা হয়েছে।",
          "হাঁটার সময় ভারসাম্য হারিয়েছিলেন। সাবধানে শুইয়ে দেওয়া হয়েছে।",
          "সিঁড়িতে পড়ে গিয়েছিলেন। হাসপাতালে নেওয়া হয়েছে।",
        ]);
        break;
      default:
        notes = getRandomElement([
          "সিনিয়র ফোনে সাড়া দিচ্ছেন না। পরিবারকে জানানো হয়েছে।",
          "দরজা খুলছেন না। প্রতিবেশীর সাহায্য নেওয়া হয়েছে।",
          "সিনিয়র বিভ্রান্ত মনে হচ্ছে। পর্যবেক্ষণে রাখা হয়েছে।",
        ]);
    }

    const verifiedCaregivers = caregivers.filter(
      (c) => c.verification?.nidVerified
    );

    alerts.push({
      id: generateUUID(),
      senior_id: senior.id,
      alert_type: alertType,
      timestamp: moment(timestamp).toISOString(),
      resolved_at: isActive
        ? null
        : moment(timestamp)
            .add(Math.floor(Math.random() * 120) + 30, "minutes")
            .toISOString(),
      notes: notes,
      responder_id: isActive ? null : getRandomElement(verifiedCaregivers).id,
    });
  }

  return alerts;
}

function generateTrainingCourses() {
  const courses = [
    {
      id: generateUUID(),
      title_en: "Basic Senior Care",
      title_bn: "মৌলিক বয়স্ক যত্ন",
      modules: [
        {
          title: "Introduction to Senior Care",
          title_bn: "বয়স্ক যত্নের ভূমিকা",
          duration: 30,
        },
        {
          title: "Understanding Aging",
          title_bn: "বার্ধক্য বোঝা",
          duration: 45,
        },
        {
          title: "Safety and Fall Prevention",
          title_bn: "নিরাপত্তা এবং পতন প্রতিরোধ",
          duration: 40,
        },
      ],
      duration_min: 115,
      created_at: moment().subtract(365, "days").toISOString(),
    },
    {
      id: generateUUID(),
      title_en: "Diabetes Management",
      title_bn: "ডায়াবেটিস ব্যবস্থাপনা",
      modules: [
        {
          title: "Understanding Diabetes",
          title_bn: "ডায়াবেটিস বোঝা",
          duration: 40,
        },
        {
          title: "Blood Sugar Monitoring",
          title_bn: "রক্তে শর্করা পর্যবেক্ষণ",
          duration: 35,
        },
        { title: "Meal Planning", title_bn: "খাবার পরিকল্পনা", duration: 40 },
        {
          title: "Emergency Response",
          title_bn: "জরুরি প্রতিক্রিয়া",
          duration: 30,
        },
      ],
      duration_min: 145,
      created_at: moment().subtract(300, "days").toISOString(),
    },
    {
      id: generateUUID(),
      title_en: "Hypertension Care",
      title_bn: "উচ্চ রক্তচাপ যত্ন",
      modules: [
        {
          title: "Blood Pressure Basics",
          title_bn: "রক্তচাপের মূল বিষয়",
          duration: 30,
        },
        {
          title: "Medication Management",
          title_bn: "ওষুধ ব্যবস্থাপনা",
          duration: 40,
        },
        {
          title: "Diet and Lifestyle",
          title_bn: "খাদ্য এবং জীবনযাপন",
          duration: 35,
        },
      ],
      duration_min: 105,
      created_at: moment().subtract(280, "days").toISOString(),
    },
    {
      id: generateUUID(),
      title_en: "Dementia and Alzheimer's Care",
      title_bn: "ডিমেনশিয়া এবং আলঝেইমার যত্ন",
      modules: [
        {
          title: "Understanding Dementia",
          title_bn: "ডিমেনশিয়া বোঝা",
          duration: 50,
        },
        {
          title: "Communication Strategies",
          title_bn: "যোগাযোগ কৌশল",
          duration: 40,
        },
        {
          title: "Behavioral Management",
          title_bn: "আচরণ ব্যবস্থাপনা",
          duration: 45,
        },
        {
          title: "Daily Care Routines",
          title_bn: "দৈনিক যত্ন রুটিন",
          duration: 35,
        },
      ],
      duration_min: 170,
      created_at: moment().subtract(250, "days").toISOString(),
    },
    {
      id: generateUUID(),
      title_en: "First Aid and Emergency Response",
      title_bn: "প্রাথমিক চিকিৎসা এবং জরুরি প্রতিক্রিয়া",
      modules: [
        { title: "CPR Basics", title_bn: "সিপিআর মূল বিষয়", duration: 60 },
        {
          title: "Choking Response",
          title_bn: "শ্বাসরোধ প্রতিক্রিয়া",
          duration: 30,
        },
        { title: "Wound Care", title_bn: "ক্ষত যত্ন", duration: 40 },
        {
          title: "Emergency Protocols",
          title_bn: "জরুরি প্রোটোকল",
          duration: 30,
        },
      ],
      duration_min: 160,
      created_at: moment().subtract(220, "days").toISOString(),
    },
    {
      id: generateUUID(),
      title_en: "Mobility and Rehabilitation",
      title_bn: "গতিশীলতা এবং পুনর্বাসন",
      modules: [
        {
          title: "Safe Transfer Techniques",
          title_bn: "নিরাপদ স্থানান্তর কৌশল",
          duration: 45,
        },
        {
          title: "Walking Assistance",
          title_bn: "হাঁটার সহায়তা",
          duration: 35,
        },
        {
          title: "Exercise Programs",
          title_bn: "ব্যায়াম কর্মসূচি",
          duration: 50,
        },
      ],
      duration_min: 130,
      created_at: moment().subtract(200, "days").toISOString(),
    },
    {
      id: generateUUID(),
      title_en: "Nutrition for Seniors",
      title_bn: "বয়স্কদের জন্য পুষ্টি",
      modules: [
        {
          title: "Nutritional Needs",
          title_bn: "পুষ্টির প্রয়োজন",
          duration: 40,
        },
        {
          title: "Meal Preparation",
          title_bn: "খাবার প্রস্তুতি",
          duration: 50,
        },
        { title: "Special Diets", title_bn: "বিশেষ খাদ্য", duration: 45 },
      ],
      duration_min: 135,
      created_at: moment().subtract(180, "days").toISOString(),
    },
    {
      id: generateUUID(),
      title_en: "Personal Hygiene and Bathing",
      title_bn: "ব্যক্তিগত স্বাস্থ্যবিধি এবং স্নান",
      modules: [
        { title: "Bathing Techniques", title_bn: "স্নান কৌশল", duration: 40 },
        { title: "Skin Care", title_bn: "ত্বকের যত্ন", duration: 30 },
        {
          title: "Maintaining Dignity",
          title_bn: "মর্যাদা বজায় রাখা",
          duration: 25,
        },
      ],
      duration_min: 95,
      created_at: moment().subtract(160, "days").toISOString(),
    },
    {
      id: generateUUID(),
      title_en: "Mental Health and Emotional Support",
      title_bn: "মানসিক স্বাস্থ্য এবং আবেগিক সহায়তা",
      modules: [
        {
          title: "Understanding Depression",
          title_bn: "বিষণ্নতা বোঝা",
          duration: 40,
        },
        { title: "Active Listening", title_bn: "সক্রিয় শ্রবণ", duration: 35 },
        {
          title: "Companionship Skills",
          title_bn: "সঙ্গী দক্ষতা",
          duration: 30,
        },
        {
          title: "Stress Management",
          title_bn: "চাপ ব্যবস্থাপনা",
          duration: 35,
        },
      ],
      duration_min: 140,
      created_at: moment().subtract(140, "days").toISOString(),
    },
    {
      id: generateUUID(),
      title_en: "End-of-Life and Palliative Care",
      title_bn: "জীবনের শেষ এবং প্যালিয়েটিভ কেয়ার",
      modules: [
        {
          title: "Understanding Palliative Care",
          title_bn: "প্যালিয়েটিভ কেয়ার বোঝা",
          duration: 45,
        },
        {
          title: "Pain Management",
          title_bn: "ব্যথা ব্যবস্থাপনা",
          duration: 40,
        },
        {
          title: "Emotional Support",
          title_bn: "আবেগিক সহায়তা",
          duration: 35,
        },
        {
          title: "Family Communication",
          title_bn: "পরিবার যোগাযোগ",
          duration: 30,
        },
      ],
      duration_min: 150,
      created_at: moment().subtract(120, "days").toISOString(),
    },
  ];

  return courses;
}

function generateCaregiverProgress(caregivers, courses) {
  const progress = [];

  caregivers.forEach((caregiver) => {
    // Each caregiver enrolls in 1-5 courses
    const courseCount = Math.floor(Math.random() * 5) + 1;
    const enrolledCourses = getRandomElements(
      courses,
      courseCount,
      courseCount
    );

    enrolledCourses.forEach((course) => {
      const startedAt = moment(caregiver.created_at).add(
        Math.floor(Math.random() * 30),
        "days"
      );
      const progressPct = Math.floor(Math.random() * 100);
      const isCompleted = progressPct === 100 || Math.random() < 0.3; // 30% completion rate

      progress.push({
        caregiver_id: caregiver.id,
        course_id: course.id,
        progress_pct: isCompleted ? 100 : progressPct,
        completed_at: isCompleted
          ? startedAt.clone().add(course.duration_min, "minutes").toISOString()
          : null,
        started_at: startedAt.toISOString(),
      });
    });
  });

  return progress;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log("🚀 Starting সেবা Mock Data Generation...\n");

const outputDir = path.join(__dirname);

// Generate all data in correct order (respecting foreign keys)
console.log("📝 Generating users...");
const users = generateUsers();
console.log(
  `   ✅ ${users.length} users created (${
    users.filter((u) => u.role === "family").length
  } family, ${users.filter((u) => u.role === "caregiver").length} caregivers, ${
    users.filter((u) => u.role === "admin").length
  } admins)`
);

console.log("📝 Generating caregivers...");
const caregivers = generateCaregivers(users);
console.log(
  `   ✅ ${caregivers.length} caregivers created (${
    caregivers.filter((c) => c.verified_at !== null).length
  } verified)`
);

console.log("📝 Generating seniors...");
const seniors = generateSeniors(users);
console.log(`   ✅ ${seniors.length} seniors created`);

console.log("📝 Generating bookings...");
const bookings = generateBookings(seniors, caregivers);
console.log(
  `   ✅ ${bookings.length} bookings created (${
    bookings.filter((b) => b.status === "completed").length
  } completed, ${
    bookings.filter((b) => b.status === "confirmed").length
  } confirmed)`
);

console.log("📝 Generating activity logs...");
const activityLogs = generateActivityLogs(bookings, seniors);
console.log(`   ✅ ${activityLogs.length} activity logs created`);

console.log("📝 Generating emergency alerts...");
const emergencyAlerts = generateEmergencyAlerts(seniors, caregivers);
console.log(
  `   ✅ ${emergencyAlerts.length} emergency alerts created (${
    emergencyAlerts.filter((a) => a.resolved_at === null).length
  } active)`
);

console.log("📝 Generating training courses...");
const trainingCourses = generateTrainingCourses();
console.log(`   ✅ ${trainingCourses.length} training courses created`);

console.log("📝 Generating caregiver progress...");
const caregiverProgress = generateCaregiverProgress(
  caregivers,
  trainingCourses
);
console.log(`   ✅ ${caregiverProgress.length} progress records created`);

// Write to JSON files
console.log("\n💾 Writing JSON files...");

fs.writeFileSync(
  path.join(outputDir, "users.json"),
  JSON.stringify(users, null, 2)
);
console.log("   ✅ users.json");

fs.writeFileSync(
  path.join(outputDir, "caregivers.json"),
  JSON.stringify(caregivers, null, 2)
);
console.log("   ✅ caregivers.json");
fs.writeFileSync(
  path.join(outputDir, "caregivers.json"),
  JSON.stringify(caregivers, null, 2)
);
console.log("    caregivers.json (frontend format)");

fs.writeFileSync(
  path.join(outputDir, "seniors.json"),
  JSON.stringify(seniors, null, 2)
);
console.log("   ✅ seniors.json");

fs.writeFileSync(
  path.join(outputDir, "bookings.json"),
  JSON.stringify(bookings, null, 2)
);
console.log("   ✅ bookings.json");

fs.writeFileSync(
  path.join(outputDir, "activity_logs.json"),
  JSON.stringify(activityLogs, null, 2)
);
console.log("   ✅ activity_logs.json");

fs.writeFileSync(
  path.join(outputDir, "emergency_alerts.json"),
  JSON.stringify(emergencyAlerts, null, 2)
);
console.log("   ✅ emergency_alerts.json");

fs.writeFileSync(
  path.join(outputDir, "training_courses.json"),
  JSON.stringify(trainingCourses, null, 2)
);
console.log("   ✅ training_courses.json");

fs.writeFileSync(
  path.join(outputDir, "caregiver_progress.json"),
  JSON.stringify(caregiverProgress, null, 2)
);
console.log("   ✅ caregiver_progress.json");

// Summary report
console.log("\n📊 Generation Summary:");
console.log("═══════════════════════════════════════════════════════");
console.log(`Users:              ${users.length}`);
console.log(
  `  - Family:         ${users.filter((u) => u.role === "family").length}`
);
console.log(
  `  - Caregivers:     ${users.filter((u) => u.role === "caregiver").length}`
);
console.log(
  `  - Admins:         ${users.filter((u) => u.role === "admin").length}`
);
console.log(
  `Caregivers:         ${caregivers.length} (${
    caregivers.filter((c) => c.verified_at !== null).length
  } verified)`
);
console.log(`Seniors:            ${seniors.length}`);
console.log(`Bookings:           ${bookings.length}`);
console.log(
  `  - Completed:      ${
    bookings.filter((b) => b.status === "completed").length
  }`
);
console.log(
  `  - Confirmed:      ${
    bookings.filter((b) => b.status === "confirmed").length
  }`
);
console.log(
  `  - Pending:        ${bookings.filter((b) => b.status === "pending").length}`
);
console.log(
  `  - In Progress:    ${
    bookings.filter((b) => b.status === "in_progress").length
  }`
);
console.log(
  `  - Cancelled:      ${
    bookings.filter((b) => b.status === "cancelled").length
  }`
);
console.log(`Activity Logs:      ${activityLogs.length}`);
console.log(
  `Emergency Alerts:   ${emergencyAlerts.length} (${
    emergencyAlerts.filter((a) => a.resolved_at === null).length
  } active)`
);
console.log(`Training Courses:   ${trainingCourses.length}`);
console.log(`Progress Records:   ${caregiverProgress.length}`);
console.log("═══════════════════════════════════════════════════════");
console.log("\n✨ সেবা Mock Data Generation Complete!");
console.log("📁 Files saved in: mock/\n");
