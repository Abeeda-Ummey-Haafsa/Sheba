# 🎉 সেবা Mock Data System - Complete Implementation

## ✅ What Was Created

### 1. **Mock Data Generator** (`mock/generate.js`)

A sophisticated ES6 module that generates **realistic, interconnected** mock data:

#### Features:

- ✅ **1,000+ records** generated with proper relationships
- ✅ **Bengali names & addresses** (আবদুল করিম, ফাতেমা আক্তার)
- ✅ **Real Dhaka locations** (ধানমন্ডি, গুলশান, মিরপুর with PostGIS coordinates)
- ✅ **Bangladesh phone format** (+8801XXXXXXXXX)
- ✅ **Time-based logic** (past/present/future bookings with correct statuses)
- ✅ **Weighted distributions** (90% verified caregivers, higher ratings for experienced)
- ✅ **Medical conditions in Bengali** (ডায়াবেটিস, উচ্চ রক্তচাপ)

#### Generates 8 JSON Files:

1. `users.json` - 153 users (50 family, 100 caregivers, 3 admins)
2. `caregivers.json` - 100 caregivers (90 verified)
3. `seniors.json` - ~125 seniors (1-3 per family)
4. `bookings.json` - ~500 bookings (various statuses)
5. `activity_logs.json` - ~300 logs (completed bookings only)
6. `emergency_alerts.json` - ~25 alerts (20% active)
7. `training_courses.json` - 10 courses (Bengali + English)
8. `caregiver_progress.json` - ~300 progress records

---

### 2. **Database Seeder** (`backend/scripts/seedData.js`)

Intelligent seeding script with error handling:

#### Features:

- ✅ **Idempotent** - Safe to run multiple times
- ✅ **Batch inserts** - 100 records per batch for performance
- ✅ **Foreign key order** - Respects dependencies automatically
- ✅ **Error recovery** - Individual retry on batch failure
- ✅ **Progress logging** - Real-time status updates
- ✅ **Connection testing** - Verifies Supabase before starting

---

### 3. **Documentation**

#### Created Files:

- ✅ `MOCK_DATA_SETUP.md` - Quick setup guide (root level)
- ✅ `backend/scripts/README.md` - Detailed technical guide
- ✅ Updated `backend/package.json` - Added npm scripts

#### NPM Scripts Added:

```json
{
  "generate:mock": "node mock/generate.js",
  "seed:db": "node scripts/seedData.js",
  "setup:db": "npm run generate:mock && npm run seed:db"
}
```

---

### 4. **Database Schema** (`DATABASE_SCHEMA.sql`)

Complete PostgreSQL schema with:

#### Tables (8):

1. **users** - Authentication for all user types
2. **seniors** - Senior profiles with medical info
3. **caregivers** - Caregiver profiles with skills/ratings
4. **bookings** - Service scheduling
5. **activity_logs** - Completed session logs
6. **emergency_alerts** - Emergency incidents
7. **training_courses** - Training curriculum
8. **caregiver_progress** - Course tracking

#### Advanced Features:

- ✅ UUID primary keys with auto-generation
- ✅ Foreign key constraints with CASCADE
- ✅ JSONB columns (skills, medical_conditions)
- ✅ PostGIS for location queries
- ✅ ENUMs for type safety
- ✅ Auto-updating triggers (ratings, totals, timestamps)
- ✅ Row Level Security (RLS) policies
- ✅ Comprehensive indexes
- ✅ Detailed column comments

---

### 5. **Test Data** (`MANUAL_SUPABASE_SETUP.sql`)

Updated manual setup with:

- ✅ Aligned with new schema
- ✅ 5 test users (2 family, 3 caregivers, 1 admin)
- ✅ 3 seniors with Bengali medical info
- ✅ 4 bookings (various statuses)
- ✅ 2 activity logs with ratings
- ✅ 2 emergency alerts
- ✅ Verification queries

---

## 📊 Data Specifications

### Volume Summary

```
Users:              153 (50 family, 100 caregivers, 3 admins)
Caregivers:         100 (90 verified, 10 pending)
Seniors:            ~125 (1-3 per family user)
Bookings:           ~500 (last 6 months)
  - Completed:      ~350 (70%)
  - Confirmed:      ~100 (20%)
  - Pending:        ~30 (6%)
  - In Progress:    ~10 (2%)
  - Cancelled:      ~10 (2%)
Activity Logs:      ~350 (one per completed booking)
Emergency Alerts:   ~25 (5 active, 20 resolved)
Training Courses:   10 (bilingual)
Progress Records:   ~300 (1-5 courses per caregiver)
```

### Realistic Distributions

#### Caregivers:

- **90%** verified (realistic approval rate)
- **70%** female (industry standard)
- **Experience-based ratings**: Beginners 3.5-4.0, Experienced 4.0-4.5, Experts 4.5-5.0
- **Skills**: 2-8 skills per caregiver (based on experience)
- **Hourly rates**: BDT 200-800 (experience-based)

#### Seniors:

- **Age**: 65-95 years
- **Conditions**: 1-4 medical conditions each
- **Bengali conditions**: ডায়াবেটিস, উচ্চ রক্তচাপ, হৃদরোগ, etc.
- **Emergency contacts**: 1-2 per senior

#### Bookings:

- **Duration**: 2-6 hours
- **Time slots**: 08:00-20:00 (business hours)
- **Platform fee**: 15% (auto-calculated)
- **Past bookings**: 90% completed, 10% cancelled
- **Future bookings**: 70% confirmed, 30% pending

---

## 🗺️ Geographic Data

### Dhaka Neighborhoods (15):

```
ধানমন্ডি (Dhanmondi)    - 23.7465°N, 90.3753°E
গুলশান (Gulshan)       - 23.7925°N, 90.4152°E
বনানী (Banani)         - 23.7937°N, 90.4066°E
মিরপুর (Mirpur)        - 23.8223°N, 90.3654°E
উত্তরা (Uttara)        - 23.8759°N, 90.3795°E
মতিঝিল (Motijheel)     - 23.7334°N, 90.4176°E
বাড্ডা (Badda)          - 23.7809°N, 90.4260°E
মোহাম্মদপুর (Mohammadpur) - 23.7656°N, 90.3565°E
শ্যামলী (Shyamoli)      - 23.7686°N, 90.3686°E
রামপুরা (Rampura)       - 23.7578°N, 90.4259°E
খিলগাঁও (Khilgaon)      - 23.7464°N, 90.4283°E
মগবাজার (Mogbazar)      - 23.7508°N, 90.4032°E
কল্যাণপুর (Kalyanpur)   - 23.7719°N, 90.3658°E
আগারগাঁও (Agargaon)     - 23.7794°N, 90.3799°E
তেজগাঁও (Tejgaon)       - 23.7644°N, 90.3917°E
```

**Location Generation**: Random points within 1km radius of center using Turf.js

---

## 🚀 Setup Instructions

### Prerequisites

```bash
# 1. PostgreSQL with PostGIS extension
# 2. Node.js 16+
# 3. Supabase account
```

### Installation

```bash
# Install dependencies
cd backend
npm install

# Dependencies added:
# - @faker-js/faker@^9.2.0
# - @turf/turf@^7.1.0
# - moment@^2.30.1
```

### Configuration

```bash
# Create backend/.env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### Execution Order

#### 1. Database Schema

```sql
-- Run in Supabase SQL Editor
-- Execute: DATABASE_SCHEMA.sql
```

#### 2. Storage Buckets

```sql
-- Run in Supabase SQL Editor
-- Execute: POLICE_VERIFICATION_SETUP.sql
```

#### 3. Mock Data

```bash
# Generate and seed in one command
npm run setup:db

# Or separately:
npm run generate:mock  # Creates JSON files
npm run seed:db        # Populates database
```

---

## 🎯 Key Features

### 1. **Relationship Integrity**

```
users (family)
  └─> seniors
        └─> bookings
              ├─> activity_logs
              └─> (connects to caregivers)

users (caregiver)
  └─> caregivers
        ├─> bookings
        ├─> emergency_alerts (responder)
        └─> caregiver_progress
              └─> training_courses
```

### 2. **Bengali Language Support**

- ✅ Names in Bengali script
- ✅ Medical conditions in Bengali
- ✅ Activity notes in Bengali
- ✅ Emergency alert descriptions in Bengali
- ✅ Training course titles (bilingual)

### 3. **PostGIS Integration**

```sql
-- Location format
SRID=4326;POINT(90.3753 23.7465)

-- Spatial queries enabled
CREATE INDEX idx_caregivers_location ON caregivers USING GIST(location);
CREATE INDEX idx_seniors_location ON seniors USING GIST(location);
```

### 4. **Auto-Calculations**

```sql
-- Booking total (with 15% platform fee)
total_amount = hourly_rate × duration_hrs × 1.15

-- Caregiver rating (auto-updated from activity logs)
rating = AVG(activity_logs.family_rating)
```

---

## 📝 Sample Data

### Bengali Names Generated

```
Males:   আবদুল করিম, মোহাম্মদ রহমান, আহমেদ খান
Females: ফাতেমা আক্তার, নাসরিন বেগম, রাবেয়া খাতুন
```

### Medical Conditions

```
ডায়াবেটিস (Diabetes)
উচ্চ রক্তচাপ (High Blood Pressure)
হৃদরোগ (Heart Disease)
আর্থ্রাইটিস (Arthritis)
হাঁপানি (Asthma)
```

### Activity Log Notes (Examples)

```
"সিনিয়র আজ খুব ভালো ছিলেন। Personal Care এবং Medication Administration করেছি। কোনো সমস্যা হয়নি।"

"সব ওষুধ সময়মতো দেওয়া হয়েছে। রক্তচাপ স্বাভাবিক। সিনিয়র খুশি ছিলেন।"

"আজকের কাজ সফলভাবে সম্পন্ন। সিনিয়রের মেজাজ ভালো ছিল। খাবার ঠিকমতো খেয়েছেন।"
```

---

## 🔍 Validation

### Verification Queries

```sql
-- Check users by role
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Check verified caregivers
SELECT
  COUNT(*) FILTER (WHERE verified_at IS NOT NULL) as verified,
  COUNT(*) FILTER (WHERE verified_at IS NULL) as pending
FROM caregivers;

-- Check booking statuses
SELECT status, COUNT(*) FROM bookings GROUP BY status;

-- Check activity log ratings
SELECT
  family_rating,
  COUNT(*) as count
FROM activity_logs
GROUP BY family_rating
ORDER BY family_rating DESC;

-- Check active alerts
SELECT
  alert_type,
  COUNT(*) FILTER (WHERE resolved_at IS NULL) as active,
  COUNT(*) FILTER (WHERE resolved_at IS NOT NULL) as resolved
FROM emergency_alerts
GROUP BY alert_type;
```

---

## 🎓 Training Courses Included

1. **মৌলিক বয়স্ক যত্ন** (Basic Senior Care) - 115 min
2. **ডায়াবেটিস ব্যবস্থাপনা** (Diabetes Management) - 145 min
3. **উচ্চ রক্তচাপ যত্ন** (Hypertension Care) - 105 min
4. **ডিমেনশিয়া এবং আলঝেইমার যত্ন** (Dementia Care) - 170 min
5. **প্রাথমিক চিকিৎসা এবং জরুরি প্রতিক্রিয়া** (First Aid) - 160 min
6. **গতিশীলতা এবং পুনর্বাসন** (Mobility & Rehabilitation) - 130 min
7. **বয়স্কদের জন্য পুষ্টি** (Nutrition for Seniors) - 135 min
8. **ব্যক্তিগত স্বাস্থ্যবিধি এবং স্নান** (Personal Hygiene) - 95 min
9. **মানসিক স্বাস্থ্য এবং আবেগিক সহায়তা** (Mental Health) - 140 min
10. **জীবনের শেষ এবং প্যালিয়েটিভ কেয়ার** (Palliative Care) - 150 min

---

## ⚠️ Important Notes

### Spelling Rules

- ❌ NEVER use "শেবা" or "Sheba"
- ✅ ALWAYS use "সেবা" and "Seba"

### Data Consistency

- All JSON keys use **snake_case** (matches column names exactly)
- All timestamps in **ISO 8601 format**
- All phone numbers in **Bangladesh format** (+880...)
- All locations in **PostGIS format** (SRID=4326;POINT...)

### Security

- Password hashes are **bcrypt** format (actual password: `password123`)
- For production, use **Supabase Auth API** to create real users
- RLS policies protect data access

---

## 📚 File Structure

```
Sheba_v3/
├── DATABASE_SCHEMA.sql              ← Main schema (run first)
├── MANUAL_SUPABASE_SETUP.sql        ← Manual test data (alternative)
├── POLICE_VERIFICATION_SETUP.sql    ← Storage buckets
├── MOCK_DATA_SETUP.md              ← This guide
│
├── backend/
│   ├── package.json                 ← Updated with scripts
│   ├── .env                         ← Supabase credentials
│   │
│   └── scripts/
│       ├── README.md                ← Detailed guide
│       └── seedData.js              ← Database seeder
│
└── mock/
    ├── generate.js                  ← Data generator
    │
    ├── users.json                   ← Generated files
    ├── caregivers.json              ← (Created by generate.js)
    ├── seniors.json
    ├── bookings.json
    ├── activity_logs.json
    ├── emergency_alerts.json
    ├── training_courses.json
    └── caregiver_progress.json
```

---

## ✨ Summary

### What You Can Do Now:

1. ✅ **Generate 1,000+ realistic mock records** with one command
2. ✅ **Test all features** with authentic Bangladeshi data
3. ✅ **Verify relationships** between all entities
4. ✅ **Query geospatial data** with PostGIS
5. ✅ **Test booking workflows** with various statuses
6. ✅ **Test emergency alerts** with active/resolved states
7. ✅ **Test training system** with courses and progress
8. ✅ **Validate RLS policies** with different user roles

### Next Steps:

1. Run `DATABASE_SCHEMA.sql` in Supabase
2. Run `POLICE_VERIFICATION_SETUP.sql` in Supabase
3. Run `npm run setup:db` in backend
4. Test the application with generated data
5. Customize counts/distributions as needed

---

**Generated on**: November 15, 2025  
**Platform**: সেবা - AI-powered senior care for Bangladesh 🇧🇩
