# সেবা Platform - Mock Data Setup Guide

Complete guide for generating and seeding realistic mock data for the সেবা platform.

## 📋 Quick Setup (3 Steps)

### 1️⃣ Install Dependencies

```bash
cd backend
npm install
```

This installs:

- `@faker-js/faker` - Realistic fake data generation
- `@turf/turf` - Geospatial calculations
- `moment` - Date/time manipulation
- `@supabase/supabase-js` - Supabase client

### 2️⃣ Configure Environment

Create `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 3️⃣ Generate & Seed Data

```bash
# Option A: Run both steps at once
npm run setup:db

# Option B: Run separately
npm run generate:mock  # Generate JSON files
npm run seed:db        # Seed database
```

## 📊 What Gets Created

### Volume

- **50** Family users (guardians living abroad)
- **100** Caregivers (90% verified)
- **~100-150** Seniors (1-3 per family)
- **~400-750** Bookings (2-6 per senior, last 6 months)
- **~250-500** Activity logs (for completed bookings)
- **~20-30** Emergency alerts (20% still active)
- **10** Training courses (English + Bengali)
- **~200-500** Caregiver progress records

### Data Quality

✅ **Authentic Bangladeshi Context**

```
Names:    আবদুল করিম, ফাতেমা আক্তার, নাসরিন খান
Areas:    ধানমন্ডি, গুলশান, মিরপুর, উত্তরা
Phones:   +8801712345678 (proper BD format)
Conditions: ডায়াবেটিস, উচ্চ রক্তচাপ, হৃদরোগ
```

✅ **Proper Relationships**

- Every senior linked to a family user
- Only verified caregivers get bookings
- Activity logs only for completed bookings
- Realistic emergency alert resolution (80% resolved)

✅ **PostGIS Locations**

- Real Dhaka neighborhood coordinates
- Random points within 1km radius
- Proper `SRID=4326;POINT(lon lat)` format

✅ **Time-based Logic**

- Past bookings: 90% completed, 10% cancelled
- Today's bookings: confirmed or in_progress
- Future bookings: pending or confirmed
- Realistic time slots (08:00-20:00)

## 📁 Output Structure

```
mock/
├── users.json              ← All users (family, caregivers, admins)
├── caregivers.json        ← Caregiver profiles with skills
├── seniors.json           ← Senior profiles with medical info
├── bookings.json          ← Service bookings
├── activity_logs.json     ← Completed session logs
├── emergency_alerts.json  ← Emergency incidents
├── training_courses.json  ← Training curriculum
└── caregiver_progress.json ← Course completion tracking
```

## 🎯 Usage Scenarios

### Fresh Development Setup

```bash
# 1. Set up database schema
# (Run DATABASE_SCHEMA.sql in Supabase)

# 2. Generate and seed mock data
cd backend
npm run setup:db
```

### Testing Workflow

```bash
# Generate new test data
npm run generate:mock

# Seed (idempotent - won't duplicate)
npm run seed:db
```

### Reset Database

```sql
-- Run in Supabase SQL Editor
DELETE FROM caregiver_progress;
DELETE FROM emergency_alerts;
DELETE FROM activity_logs;
DELETE FROM bookings;
DELETE FROM training_courses;
DELETE FROM caregivers;
DELETE FROM seniors;
DELETE FROM users;
```

Then regenerate:

```bash
npm run setup:db
```

## 🔧 Customization

### Adjust Volume

Edit `mock/generate.js`:

```javascript
const COUNTS = {
  FAMILY_USERS: 50, // Change this
  CAREGIVERS: 100, // Change this
  ADMIN_USERS: 3,
  SENIORS_PER_FAMILY: [1, 2, 3], // 1-3 seniors per family
  BOOKINGS_PER_SENIOR: [2, 3, 4, 5, 6], // 2-6 bookings per senior
  TRAINING_COURSES: 10,
};
```

### Adjust Percentages

```javascript
const VERIFIED_PERCENTAGE = 0.9; // 90% caregivers verified
const ACTIVE_ALERTS_PERCENTAGE = 0.2; // 20% alerts active
```

## 📝 Sample Data Examples

### User (Family Member)

```json
{
  "id": "uuid-here",
  "email": "john.smith@example.com",
  "role": "family",
  "full_name": "John Smith",
  "phone": "+8801712345671"
}
```

### Caregiver

```json
{
  "id": "uuid-here",
  "user_id": "user-uuid",
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

### Senior

```json
{
  "id": "uuid-here",
  "family_user_id": "family-user-uuid",
  "name": "আবদুল করিম",
  "age": 75,
  "gender": "পুরুষ",
  "address": "১২/এ, ধানমন্ডি, ঢাকা-১২০৯",
  "location": "SRID=4326;POINT(90.3753 23.7465)",
  "medical_conditions": ["ডায়াবেটিস", "উচ্চ রক্তচাপ"],
  "medication_list": "মেটফরমিন ৫০০mg দিনে ২ বার...",
  "emergency_contacts": [
    {
      "name": "ডা. রহমান",
      "relation": "পারিবারিক চিকিৎসক",
      "phone": "+8801711111111"
    }
  ]
}
```

### Booking

```json
{
  "id": "uuid-here",
  "senior_id": "senior-uuid",
  "caregiver_id": "caregiver-uuid",
  "booking_date": "2024-11-15",
  "start_time": "10:00:00",
  "duration_hrs": 4,
  "status": "confirmed",
  "hourly_rate": 250,
  "total_amount": 1150,
  "notes": "দয়া করে সময়মতো আসবেন।"
}
```

## 🐛 Troubleshooting

### "Module not found" error

```bash
cd backend
npm install
```

### "SUPABASE_URL not set"

```bash
# Check .env file exists in backend/
cat backend/.env

# Should contain:
# SUPABASE_URL=...
# SUPABASE_ANON_KEY=...
```

### "File not found" error when seeding

```bash
# Generate the JSON files first
npm run generate:mock
```

### Foreign key constraint errors

```sql
-- Tables must be empty before seeding
-- Delete in reverse dependency order
DELETE FROM caregiver_progress;
DELETE FROM emergency_alerts;
DELETE FROM activity_logs;
DELETE FROM bookings;
DELETE FROM training_courses;
DELETE FROM caregivers;
DELETE FROM seniors;
DELETE FROM users;
```

### Data already exists

```bash
# The seeder is idempotent - it will skip existing data
# To force regeneration, delete data first (see above)
```

## 📚 Related Documentation

- **Database Schema**: `DATABASE_SCHEMA.sql`
- **Manual Test Data**: `MANUAL_SUPABASE_SETUP.sql` (alternative)
- **Storage Setup**: `POLICE_VERIFICATION_SETUP.sql`
- **Detailed Guide**: `backend/scripts/README.md`

## ⚙️ NPM Scripts

```bash
npm run generate:mock  # Generate JSON files
npm run seed:db       # Seed database from JSON
npm run setup:db      # Do both in sequence
```

## 🚀 Next Steps

After seeding:

1. ✅ Verify data in Supabase Dashboard
2. ✅ Test authentication with generated emails
3. ✅ Test caregiver search and filtering
4. ✅ Test booking creation and status updates
5. ✅ Test activity log submission
6. ✅ Test emergency alert system

## 📄 License

Part of the সেবা platform - AI-powered senior care for Bangladesh

---

**Note**: Never use "শেবা" or "Sheba" - always use "সেবা" and "Seba" ✅
