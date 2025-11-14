/**
 * Example: Using Mock Data in Components
 * Copy these patterns into your components for testing
 */

import React, { useState } from "react";
import {
  QUICK_CAREGIVER_TEST,
  getTodayEarnings,
  getTodayBookings,
  getActiveBooking,
  formatEarnings,
  CAREGIVER_TRAINING_COURSES,
  GPS_CHECKIN_TEST_DATA,
} from "../mockData/caregiverMockData";

// ============================================================================
// EXAMPLE 1: Pre-fill Signup Form with Mock Data
// ============================================================================

export function SignupWithMockData() {
  const [useTestData, setUseTestData] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    nidNumber: "",
    experienceYears: "",
    services: [],
  });

  // Load beginner test account
  const handleLoadBeginner = () => {
    const testAccount = QUICK_CAREGIVER_TEST.BEGINNER;
    setFormData({
      fullName: testAccount.fullName,
      email: testAccount.email,
      password: testAccount.password,
      phone: testAccount.phone,
      nidNumber: testAccount.nidNumber,
      experienceYears: testAccount.experienceYears,
      services: testAccount.services,
    });
    setUseTestData(true);
  };

  // Load experienced test account
  const handleLoadExperienced = () => {
    const testAccount = QUICK_CAREGIVER_TEST.EXPERIENCED;
    setFormData({
      fullName: testAccount.fullName,
      email: testAccount.email,
      password: testAccount.password,
      phone: testAccount.phone,
      nidNumber: testAccount.nidNumber,
      experienceYears: testAccount.experienceYears,
      services: testAccount.services,
    });
    setUseTestData(true);
  };

  // Load specialist test account
  const handleLoadSpecialist = () => {
    const testAccount = QUICK_CAREGIVER_TEST.SPECIALIST;
    setFormData({
      fullName: testAccount.fullName,
      email: testAccount.email,
      password: testAccount.password,
      phone: testAccount.phone,
      nidNumber: testAccount.nidNumber,
      experienceYears: testAccount.experienceYears,
      services: testAccount.services,
    });
    setUseTestData(true);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Caregiver Signup</h2>

      {/* Quick Load Buttons (Only in Development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold mb-2">🧪 Dev: Load Test Data</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleLoadBeginner}
              className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Beginner
            </button>
            <button
              onClick={handleLoadExperienced}
              className="px-3 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
            >
              Experienced
            </button>
            <button
              onClick={handleLoadSpecialist}
              className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Specialist
            </button>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90"
        >
          Sign Up
        </button>
      </form>

      {useTestData && (
        <p className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          ✅ Test data loaded. Click "Sign Up" to proceed.
        </p>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Dashboard Earnings Display
// ============================================================================

export function DashboardEarnings() {
  const todayEarnings = getTodayEarnings();
  const formattedEarnings = formatEarnings(todayEarnings);

  return (
    <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-2">Today's Earnings</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold">{formattedEarnings}</span>
        <span className="text-sm opacity-90">Bangla Taka</span>
      </div>
      <p className="text-sm mt-2 opacity-75">
        Updated: {new Date().toLocaleString("bn-BD")}
      </p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Today's Bookings List
// ============================================================================

export function TodayBookingsList() {
  const todayBookings = getTodayBookings();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">
        Today's Bookings ({todayBookings.length})
      </h3>

      {todayBookings.length === 0 ? (
        <p className="text-gray-500">No bookings for today</p>
      ) : (
        todayBookings.map((booking) => (
          <div
            key={booking.id}
            className="p-4 border rounded-lg hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold">{booking.senior.name}</h4>
                <p className="text-sm text-gray-600">
                  Age: {booking.senior.age}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  booking.status === "checked_in"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {booking.status === "checked_in" ? "✓ Checked In" : "Active"}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-3">
              <p>📍 {booking.location.address}</p>
              <p>
                ⏰ {booking.timeSlot.start} - {booking.timeSlot.end} (
                {booking.timeSlot.duration}h)
              </p>
              <p>
                💰 Payment:{" "}
                <span className="font-semibold">৳{booking.payment}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition text-sm">
                Check In
              </button>
              <button className="flex-1 px-3 py-2 bg-secondary text-white rounded hover:bg-secondary/90 transition text-sm">
                Details
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: GPS Check-in Test
// ============================================================================

export function GPSCheckInTest() {
  const [selectedTest, setSelectedTest] = useState("SUCCESS");

  const testCases = {
    SUCCESS: GPS_CHECKIN_TEST_DATA.SUCCESS,
    PARTIAL: GPS_CHECKIN_TEST_DATA.PARTIAL_SUCCESS,
    FAIL: GPS_CHECKIN_TEST_DATA.FAIL_TOO_FAR,
    ERROR: GPS_CHECKIN_TEST_DATA.NO_GPS,
  };

  const currentTest = testCases[selectedTest];

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">🧪 GPS Check-in Test</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Select Test Case:
        </label>
        <select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="SUCCESS">✅ Success (8m)</option>
          <option value="PARTIAL">✅ Partial Success (60m)</option>
          <option value="FAIL">❌ Fail - Too Far (1110m)</option>
          <option value="ERROR">❌ GPS Error</option>
        </select>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm space-y-2">
        {currentTest.error ? (
          <>
            <p>
              <strong>Error:</strong> {currentTest.error}
            </p>
            <p>
              <strong>Message:</strong> {currentTest.message}
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>Senior Location:</strong>{" "}
              {currentTest.seniorLocation.address}
            </p>
            <p>
              <strong>Your Location:</strong>{" "}
              {currentTest.caregiverLocation.latitude.toFixed(4)},
              {currentTest.caregiverLocation.longitude.toFixed(4)}
            </p>
            <p>
              <strong>Distance:</strong> {currentTest.distanceMeters}m (
              {currentTest.distance.toFixed(2)}km)
            </p>
            <p>
              <strong>Threshold:</strong> {currentTest.threshold}m
            </p>
          </>
        )}
        <p
          className={`font-bold ${
            currentTest.result.includes("SUCCESS")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          Result: {currentTest.result}
        </p>
      </div>

      <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold">
        Simulate Check-in
      </button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Training Courses
// ============================================================================

export function TrainingCoursesList() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Training Courses</h3>

      {CAREGIVER_TRAINING_COURSES.map((course) => (
        <div key={course.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold">{course.title}</h4>
              <p className="text-sm text-gray-600">{course.titleEn}</p>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                course.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : course.status === "in_progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {course.status === "completed"
                ? "✓ Completed"
                : course.status === "in_progress"
                ? "In Progress"
                : "Not Started"}
            </span>
          </div>

          <div className="mb-3 space-y-1 text-sm text-gray-600">
            <p>Duration: {course.duration}</p>
            <p>
              Lessons: {course.lessons} | Quizzes: {course.quizzes}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          <button
            className={`w-full px-3 py-2 rounded text-sm font-semibold transition ${
              course.status === "completed"
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            {course.status === "completed"
              ? "Download Certificate"
              : "Continue"}
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Complete Dashboard Component
// ============================================================================

export function CompleteDashboard() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Caregiver Dashboard</h1>

      {/* Earnings Card */}
      <section>
        <DashboardEarnings />
      </section>

      {/* Today's Bookings */}
      <section>
        <TodayBookingsList />
      </section>

      {/* Training */}
      <section>
        <TrainingCoursesList />
      </section>

      {/* GPS Test (Dev Only) */}
      {process.env.NODE_ENV === "development" && (
        <section className="mt-8 pt-8 border-t">
          <GPSCheckInTest />
        </section>
      )}
    </div>
  );
}

export default CompleteDashboard;
