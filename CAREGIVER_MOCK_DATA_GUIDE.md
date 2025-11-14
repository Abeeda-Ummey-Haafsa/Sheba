# Caregiver Mock Data Testing Guide

## Overview

Complete mock dataset for testing caregiver account creation, booking workflows, GPS check-in, activity logging, and earnings dashboard.

---

## 📝 Quick Start - Copy/Paste Test Data

### Option 1: Pre-configured Beginner Account

```javascript
Full Name: Begum Fatema Akter
Email: fatema.caregiver@test.com
Password: SecurePass123!
Phone: +880171234567
NID: 12345678901234
Experience: 1 year
Services: Personal Care, Companionship
```

### Option 2: Pre-configured Experienced Account

```javascript
Full Name: Nasrin Ahmed Khan
Email: nasrin.care@test.com
Password: NasrinCare456@
Phone: +880181234567
NID: 98765432109876
Experience: 5 years
Services: Nursing, Physiotherapy, Medication, Palliative
```

### Option 3: Pre-configured Specialist Account

```javascript
Full Name: Rina Das Sharma
Email: rina.das@test.com
Password: RinaDas789@
Phone: +880191234567
NID: 55555555555555
Experience: 8 years
Services: Palliative, Rehabilitation, Nursing, Physiotherapy
```

---

## 🎯 Import & Use in Components

### In React Components:

```javascript
import {
  QUICK_CAREGIVER_TEST,
  CAREGIVER_BOOKINGS,
  CAREGIVER_PROFILE_DATA,
} from "../mockData/caregiverMockData";

// In a component:
const handleSignup = () => {
  const testData = QUICK_CAREGIVER_TEST.BEGINNER;
  setFormData(testData);
};

// Get mock bookings
const bookings = CAREGIVER_BOOKINGS;

// Get profile data
const profile = CAREGIVER_PROFILE_DATA;
```

---

## 📦 Available Mock Data Collections

### 1. CAREGIVER_SIGNUP_DATA

5 different caregiver profiles ready for signup testing.

**Usage:**

```javascript
import { CAREGIVER_SIGNUP_DATA } from "../mockData/caregiverMockData";

// Get a specific caregiver
const caregiver = CAREGIVER_SIGNUP_DATA[0];

// Extract for form pre-fill
const {
  fullName,
  email,
  password,
  phone,
  nidNumber,
  experienceYears,
  services,
} = caregiver;
```

**Test Cases:**

- Beginner (1 year experience)
- Intermediate (3 years)
- Experienced (5 years)
- Senior (7 years)
- Specialist (8 years)

---

### 2. QUICK_CAREGIVER_TEST

Fast access to 3 pre-configured accounts.

**Available Profiles:**

- `QUICK_CAREGIVER_TEST.BEGINNER` - New caregiver
- `QUICK_CAREGIVER_TEST.EXPERIENCED` - 5 years experience
- `QUICK_CAREGIVER_TEST.SPECIALIST` - 8 years, specialized

**Usage:**

```javascript
import { QUICK_CAREGIVER_TEST } from "../mockData/caregiverMockData";

const testAccount = QUICK_CAREGIVER_TEST.EXPERIENCED;
// { fullName, email, password, phone, nidNumber, experienceYears, services }
```

---

### 3. CAREGIVER_PROFILE_DATA

Complete profile after signup/login.

**Includes:**

- Personal info (name, email, phone, photo)
- NID and verification status
- Services & languages
- Certifications
- Ratings & reviews (4.8/5 stars)
- Availability status
- **Today's Earnings**: ৳2,000
- **Total Earnings**: ৳125,000

**Usage:**

```javascript
import { CAREGIVER_PROFILE_DATA } from "../mockData/caregiverMockData";

// Display in dashboard
console.log(CAREGIVER_PROFILE_DATA.earnings.todaysEarnings); // ৳2,000
console.log(CAREGIVER_PROFILE_DATA.ratings.averageRating); // 4.8
```

---

### 4. CAREGIVER_BOOKINGS

4 sample bookings with different statuses.

**Booking Statuses:**

- `active` - Currently being served
- `completed` - Finished with activity report
- `pending` - Upcoming/not started
- `checked_in` - Caregiver has checked in

**Sample Data:**

```javascript
{
  id: "booking_001",
  senior: { name: "রহিম আহমেদ", age: 75, conditions: ["Diabetes", "Arthritis"] },
  timeSlot: { start: "10:00 AM", end: "2:00 PM", duration: 4 },
  services: ["Personal Care", "Medication", "Companionship"],
  payment: 800,
  checkinTime: "10:05 AM",
  checkoutTime: null,
  status: "checked_in"
}
```

**Usage:**

```javascript
import {
  CAREGIVER_BOOKINGS,
  getTodayBookings,
  getActiveBooking,
} from "../mockData/caregiverMockData";

// Get today's bookings
const todayBookings = getTodayBookings();

// Get currently active booking
const activeBooking = getActiveBooking();

// Get completed bookings
const completed = CAREGIVER_BOOKINGS.filter((b) => b.status === "completed");
```

---

### 5. CAREGIVER_EARNINGS

Daily earnings breakdown.

**Structure:**

- Today: ৳2,000
- This Week: ৳12,500
- This Month: ৳45,000
- All Time: ৳125,000
- Pending Payment: ৳5,000

**Usage:**

```javascript
import {
  CAREGIVER_DAILY_EARNINGS,
  formatEarnings,
} from "../mockData/caregiverMockData";

const todayEarnings = CAREGIVER_DAILY_EARNINGS.today;
const formatted = formatEarnings(todayEarnings); // "৳2,000"

// Show breakdown
console.log(CAREGIVER_DAILY_EARNINGS.breakdown);
// { "2025-11-14": 1600, "2025-11-13": 1500, ... }
```

---

### 6. ACTIVITY_LOG_EXAMPLES

3 completed visit reports.

**Includes:**

- Services completed (checkboxes)
- Senior condition assessment (good/concerning)
- Notes in Bangla
- Photos uploaded count
- GPS distance from senior's home

**Usage:**

```javascript
import { ACTIVITY_LOG_EXAMPLES } from "../mockData/caregiverMockData";

// Get a specific activity log
const log = ACTIVITY_LOG_EXAMPLES[0];
console.log(log.servicesCompleted); // ["Personal Care", "Hygiene Support", ...]
console.log(log.seniorCondition); // "good"
console.log(log.notes); // Bangla text
```

---

### 7. CAREGIVER_TRAINING_COURSES

3 training courses with progress.

**Statuses:**

- `not_started` - 0% progress
- `in_progress` - Partial progress
- `completed` - 100% + certificate

**Sample:**

```javascript
{
  id: "course_001",
  title: "প্রাথমিক চিকিৎসা",
  titleEn: "First Aid Training",
  duration: "2 hours",
  level: "Beginner",
  lessons: 5,
  quizzes: 2,
  progress: 60,
  status: "in_progress"
}
```

**Usage:**

```javascript
import { CAREGIVER_TRAINING_COURSES } from "../mockData/caregiverMockData";

// Filter by status
const completed = CAREGIVER_TRAINING_COURSES.filter(
  (c) => c.status === "completed"
);
const inProgress = CAREGIVER_TRAINING_COURSES.filter(
  (c) => c.status === "in_progress"
);
```

---

### 8. GPS_CHECKIN_TEST_DATA

GPS location test scenarios.

**Test Cases:**

- `SUCCESS` - 8 meters away (✅ Pass)
- `PARTIAL_SUCCESS` - 60 meters away (✅ Pass)
- `FAIL_TOO_FAR` - 1110 meters away (❌ Fail)
- `NO_GPS` - GPS unavailable (❌ Error)

**Usage:**

```javascript
import {
  GPS_CHECKIN_TEST_DATA,
  haversineDistance,
} from "../mockData/caregiverMockData";

// Get test case
const testCase = GPS_CHECKIN_TEST_DATA.SUCCESS;
console.log(testCase.distance); // 0.008 km (8 meters)
console.log(testCase.result); // "SUCCESS"

// Calculate distance
const distance = haversineDistance(23.8145, 90.3668, 23.81456, 90.36685);
console.log(distance); // ~0.008 km
```

---

### 9. CAREGIVER_NOTIFICATIONS

4 sample notifications.

**Types:**

- `booking_accepted` - New booking approved
- `payment_received` - Earnings credited
- `senior_alert` - Senior health concern
- `training_reminder` - New courses available

**Usage:**

```javascript
import { CAREGIVER_NOTIFICATIONS } from "../mockData/caregiverMockData";

// Get unread notifications
const unread = CAREGIVER_NOTIFICATIONS.filter((n) => !n.read);

// Get high-severity alerts
const alerts = CAREGIVER_NOTIFICATIONS.filter((n) => n.severity === "high");
```

---

## 🧪 Testing Workflows

### Test Workflow 1: Complete Caregiver Journey

```javascript
import {
  QUICK_CAREGIVER_TEST,
  CAREGIVER_PROFILE_DATA,
  getTodayBookings,
  getActiveBooking,
  ACTIVITY_LOG_EXAMPLES,
  CAREGIVER_DAILY_EARNINGS,
} from "../mockData/caregiverMockData";

// Step 1: Sign up
const signupData = QUICK_CAREGIVER_TEST.EXPERIENCED;
// Fill form with signupData

// Step 2: View profile after login
console.log(CAREGIVER_PROFILE_DATA.fullName);
console.log(CAREGIVER_PROFILE_DATA.ratings);

// Step 3: View today's bookings
const bookings = getTodayBookings();
console.log(bookings.length); // 2 bookings

// Step 4: Check in to booking
const activeBooking = getActiveBooking();
console.log(activeBooking.checkinTime); // "10:05 AM"

// Step 5: Submit activity log after checkout
const activityLog = ACTIVITY_LOG_EXAMPLES[0];
console.log(activityLog.servicesCompleted);

// Step 6: View earnings
console.log(CAREGIVER_DAILY_EARNINGS.today); // ৳2,000
```

### Test Workflow 2: GPS Check-in

```javascript
import { GPS_CHECKIN_TEST_DATA } from "../mockData/caregiverMockData";

// Test successful check-in
const successTest = GPS_CHECKIN_TEST_DATA.SUCCESS;
console.log(`Distance: ${successTest.distanceMeters}m - ${successTest.result}`);
// Output: Distance: 8m - SUCCESS

// Test failed check-in (too far)
const failTest = GPS_CHECKIN_TEST_DATA.FAIL_TOO_FAR;
console.log(`Distance: ${failTest.distanceMeters}m - ${failTest.result}`);
// Output: Distance: 1110m - FAIL - Too Far

// Test GPS error
const errorTest = GPS_CHECKIN_TEST_DATA.NO_GPS;
console.log(`Error: ${errorTest.message}`);
// Output: Error: Location services not enabled
```

---

## 📋 All Available Helper Functions

```javascript
import {
  getCaregiverById, // Get caregiver by ID
  getBookingById, // Get booking by ID
  getTodayEarnings, // Get today's earnings amount
  getTodayBookings, // Get all bookings for today
  getActiveBooking, // Get currently active booking
  getUpcomingBookings, // Get pending future bookings
  getCompletedBookings, // Get finished bookings
  formatEarnings, // Format amount to "৳X,XXX"
  haversineDistance, // Calculate GPS distance
} from "../mockData/caregiverMockData";

// Examples
const earnings = getTodayEarnings(); // ৳2,000
const active = getActiveBooking(); // booking currently being served
const upcoming = getUpcomingBookings(); // future bookings not started
const formatted = formatEarnings(1500); // "৳1,500"
```

---

## 🎬 Real Testing Scenarios

### Scenario 1: Sign up & View Dashboard

1. Use `QUICK_CAREGIVER_TEST.BEGINNER` to sign up
2. Login with provided credentials
3. Dashboard should show `CAREGIVER_PROFILE_DATA.earnings`
4. Display today's bookings from `getTodayBookings()`

### Scenario 2: Check In & Check Out

1. Get active booking: `getActiveBooking()`
2. Use GPS test case: `GPS_CHECKIN_TEST_DATA.SUCCESS`
3. Show check-in confirmation
4. After checkout, display `ACTIVITY_LOG_EXAMPLES[0]` form

### Scenario 3: View Earnings

1. Display `CAREGIVER_DAILY_EARNINGS.today` as counter
2. Show breakdown: `CAREGIVER_DAILY_EARNINGS.breakdown`
3. Use helper: `formatEarnings(amount)` for display

### Scenario 4: Training Progress

1. Load `CAREGIVER_TRAINING_COURSES`
2. Filter by status for tabs
3. Show progress bar with `progress` field
4. Display certificate for `completed` courses

### Scenario 5: GPS Check-in Failure

1. Use `GPS_CHECKIN_TEST_DATA.FAIL_TOO_FAR`
2. Show error message: "Not at correct location"
3. Display distance: "1110m away"
4. Show retry button

---

## 📱 Using with Component State

### CaregiverDashboard Example:

```javascript
import { useState } from "react";
import {
  getTodayEarnings,
  getTodayBookings,
} from "../mockData/caregiverMockData";

export default function CaregiverDashboard() {
  const [earnings] = useState(getTodayEarnings());
  const [bookings] = useState(getTodayBookings());

  return (
    <div>
      <h1>Today's Earnings: ৳{earnings}</h1>
      <div>
        {bookings.map((booking) => (
          <div key={booking.id}>
            <h3>{booking.senior.name}</h3>
            <p>
              {booking.timeSlot.start} - {booking.timeSlot.end}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔄 Combining Mock Data with Real Supabase

```javascript
// Hybrid approach: Use mock data for development, Supabase for production
import { CAREGIVER_PROFILE_DATA } from "../mockData/caregiverMockData";

const useCaregiver = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Use mock data in dev
      setProfile(CAREGIVER_PROFILE_DATA);
    } else {
      // Fetch from Supabase in production
      fetchFromSupabase();
    }
  }, []);

  return profile;
};
```

---

## ✅ Testing Checklist

- [ ] Sign up with `QUICK_CAREGIVER_TEST.BEGINNER`
- [ ] Login and view dashboard
- [ ] Display earnings: `getTodayEarnings()`
- [ ] Show today's bookings: `getTodayBookings()`
- [ ] Click active booking: `getActiveBooking()`
- [ ] GPS check-in with `GPS_CHECKIN_TEST_DATA.SUCCESS`
- [ ] Submit activity log from `ACTIVITY_LOG_EXAMPLES`
- [ ] View training courses: `CAREGIVER_TRAINING_COURSES`
- [ ] Test earnings formatting: `formatEarnings()`
- [ ] Check notifications: `CAREGIVER_NOTIFICATIONS`
- [ ] View GPS error: `GPS_CHECKIN_TEST_DATA.NO_GPS`

---

## 💡 Tips

1. **Use in Development Only**: Mock data is for testing. Always connect to real Supabase in production.

2. **Fast Testing**: Copy test credentials from `QUICK_CAREGIVER_TEST` into signup form directly.

3. **GPS Testing**: Use `GPS_CHECKIN_TEST_DATA` to simulate different GPS scenarios without a real device.

4. **Bangla Support**: All mock data includes Bangla text for testing bilingual UI.

5. **Helper Functions**: Use provided functions like `getTodayBookings()` instead of filtering manually.

---

**File Location**: `src/mockData/caregiverMockData.js`

**Import Example**: `import { QUICK_CAREGIVER_TEST } from '../mockData/caregiverMockData';`

Happy Testing! 🎉
