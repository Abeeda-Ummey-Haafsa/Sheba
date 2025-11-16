# সেবা Mock Data Seeder

Complete mock data generation and seeding system for the সেবা platform.

## 📋 Overview

This directory contains scripts to:

1. **Generate** realistic, interconnected mock data with Bangladeshi context
2. **Seed** the data into your Supabase database

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Required packages
npm install @faker-js/faker @turf/turf moment @supabase/supabase-js dotenv
```

### Step 1: Configure Environment

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Add your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 2: Generate Mock Data

```bash
node mock/generate.js
```

This creates 8 JSON files in the `/mock` directory:

- `users.json` - Family members, caregivers, and admins
- `seniors.json` - Senior citizen profiles
- `caregivers.json` - Caregiver profiles with skills and ratings
- `bookings.json` - Service bookings
- `activity_logs.json` - Completed session logs
- `emergency_alerts.json` - Emergency incidents
- `training_courses.json` - Training curriculum
- `caregiver_progress.json` - Course completion tracking

### Step 3: Seed Database

```bash
node scripts/seedData.js
```

This populates your Supabase database with the generated data.

## 📊 Generated Data Specifications

### Volume

- **50** Family users (guardians abroad)
- **100** Caregivers (90% verified)
- **~100-150** Seniors (1-3 per family)
- **~400-750** Bookings (2-6 per senior)
- **~250-500** Activity logs (for completed bookings)
- **~20-30** Emergency alerts (20% active)
- **10** Training courses
- **~200-500** Progress records

### Data Quality

✅ **Realistic Bangladeshi Context**

- Bengali names (e.g., আবদুল করিম, ফাতেমা আক্তার)
- Dhaka neighborhoods (ধানমন্ডি, গুলশান, মিরপুর, etc.)
- Bangladesh phone format (+8801XXXXXXXXX)
- Bengali medical conditions and notes

✅ **Proper Relationships**

- Every senior belongs to one family user
- Every booking connects senior ↔ verified caregiver
- Activity logs only for completed bookings
- Emergency alerts reference actual seniors

✅ **PostGIS Locations**

- Real coordinates for Dhaka neighborhoods
- Random points within 1km radius
- Proper SRID=4326 format

✅ **Realistic Distributions**

- 90% caregivers verified
- Higher ratings for experienced caregivers
- Weighted booking statuses (90% completed for past bookings)
- 20% active emergency alerts

✅ **Time-based Logic**

- Bookings over last 6 months
- Realistic time slots (08:00-20:00)
- Future bookings: pending or confirmed
- Past bookings: completed or cancelled
- Activity logs match booking times

## 🔧 Scripts Reference

### `mock/generate.js`

Generates all mock data with proper relationships.

**Configuration** (edit at top of file):

```javascript
const COUNTS = {
  FAMILY_USERS: 50,
  CAREGIVERS: 100,
  ADMIN_USERS: 3,
  SENIORS_PER_FAMILY: [1, 2, 3],
  BOOKINGS_PER_SENIOR: [2, 3, 4, 5, 6],
  TRAINING_COURSES: 10,
};
```

**Output**: 8 JSON files in `/mock` directory

### `scripts/seedData.js`

Seeds database from generated JSON files.

**Features**:

- ✅ Checks if tables already have data (idempotent)
- ✅ Batch inserts (100 records per batch)
- ✅ Respects foreign key order
- ✅ Progress logging
- ✅ Error handling with individual retry
- ✅ Uses upsert with conflict resolution

## 🎯 Usage Scenarios

### Development Setup

```bash
# Fresh database setup
node mock/generate.js
node scripts/seedData.js
```

### Testing

```bash
# Generate new test data
node mock/generate.js
# Seed (will skip if data exists)
node scripts/seedData.js
```

### Reset Database

```bash
# 1. Delete all data in Supabase (SQL Editor):
DELETE FROM caregiver_progress;
DELETE FROM emergency_alerts;
DELETE FROM activity_logs;
DELETE FROM bookings;
DELETE FROM training_courses;
DELETE FROM caregivers;
DELETE FROM seniors;
DELETE FROM users;

# 2. Regenerate and seed
node mock/generate.js
node scripts/seedData.js
```

## 📝 Mock Data Examples

### Sample User (Family)

```json
{
  "id": "f1111111-1111-1111-1111-111111111111",
  "email": "guardian@example.com",
  "role": "family",
  "full_name": "John Smith",
  "phone": "+8801712345671"
}
```

### Sample Caregiver

```json
{
  "id": "cg111111-1111-1111-1111-111111111111",
  "user_id": "c1111111-1111-1111-1111-111111111111",
  "age": 28,
  "gender": "মহিলা",
  "skills": ["Personal Care", "Companionship", "Meal Preparation"],
  "rating": 4.5,
  "hourly_rate": 250,
  "location": "SRID=4326;POINT(90.3753 23.7465)",
  "verified_at": "2024-10-15T10:00:00Z",
  "bio": "অভিজ্ঞ পরিচর্যাকারী। ১ বছরের অভিজ্ঞতা।"
}
```

### Sample Senior

```json
{
  "id": "s1111111-1111-1111-1111-111111111111",
  "family_user_id": "f1111111-1111-1111-1111-111111111111",
  "name": "আবদুল করিম",
  "age": 75,
  "gender": "পুরুষ",
  "address": "১২/এ, ধানমন্ডি, ঢাকা-১২০৯",
  "medical_conditions": ["ডায়াবেটিস", "উচ্চ রক্তচাপ"],
  "emergency_contacts": [
    {
      "name": "ডা. রহমান",
      "relation": "পারিবারিক চিকিৎসক",
      "phone": "+8801711111111"
    }
  ]
}
```

### Sample Booking

```json
{
  "id": "b1111111-1111-1111-1111-111111111111",
  "senior_id": "s1111111-1111-1111-1111-111111111111",
  "caregiver_id": "cg111111-1111-1111-1111-111111111111",
  "booking_date": "2024-11-15",
  "start_time": "10:00:00",
  "duration_hrs": 4,
  "status": "confirmed",
  "hourly_rate": 250,
  "total_amount": 1150,
  "notes": "দয়া করে সময়মতো আসবেন। ওষুধের সময় মনে রাখবেন।"
}
```

## ⚠️ Important Notes

1. **Database Schema**: Run `DATABASE_SCHEMA.sql` before seeding
2. **Storage Buckets**: Run `POLICE_VERIFICATION_SETUP.sql` for file uploads
3. **Idempotent**: Safe to run multiple times (skips existing data)
4. **Foreign Keys**: Tables are seeded in correct order automatically
5. **Bengali Text**: All user-facing text uses correct Bengali (সেবা, not শেবা)

## 🐛 Troubleshooting

### "File not found" error

```bash
# Make sure you run generate.js first
node mock/generate.js
```

### "SUPABASE_URL not set" error

```bash
# Check your .env file exists and has correct values
cat backend/.env
```

### Foreign key constraint errors

```bash
# Tables must be empty before seeding
# Delete data in reverse order:
DELETE FROM caregiver_progress;
DELETE FROM emergency_alerts;
DELETE FROM activity_logs;
DELETE FROM bookings;
DELETE FROM training_courses;
DELETE FROM caregivers;
DELETE FROM seniors;
DELETE FROM users;
```

### Connection timeout

```bash
# Check Supabase URL and key are correct
# Verify your internet connection
# Check Supabase project is active
```

## 📚 Related Files

- `/mock/generate.js` - Data generator
- `/scripts/seedData.js` - Database seeder
- `/DATABASE_SCHEMA.sql` - Database schema
- `/MANUAL_SUPABASE_SETUP.sql` - Manual test data (alternative)
- `/POLICE_VERIFICATION_SETUP.sql` - Storage bucket setup

## 📄 License

Part of the সেবা platform - AI-powered senior care for Bangladesh
