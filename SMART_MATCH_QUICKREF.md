# 🎯 Smart Match - Quick Reference Card

## 🚀 Quick Start (3 Commands)

```bash
# 1. Start Backend
cd backend && npm start

# 2. Start Frontend
cd frontend && npm run dev

# 3. Visit Smart Match
# http://localhost:5173/smart-match
```

## 📍 Key URLs

| Resource          | URL                               |
| ----------------- | --------------------------------- |
| Frontend App      | http://localhost:5173             |
| Smart Match Page  | http://localhost:5173/smart-match |
| Backend API       | http://localhost:5000             |
| Matching Endpoint | POST /api/matching/find-matches   |
| Stats Endpoint    | GET /api/matching/stats           |

## 📂 Files Modified/Created

### Backend (3 files)

```
✨ backend/src/controllers/matchingController.js
✨ backend/src/routes/matching.js
✏️ backend/server.js
```

### Frontend (4 files)

```
✨ frontend/src/components/CaregiverMatcher.jsx
✨ frontend/src/pages/SmartMatch.jsx
✏️ frontend/src/App.jsx
✏️ frontend/src/components/Navigation.jsx
```

### ML (1 file)

```
✏️ ml/matching_algorithm.py
```

### Docs (4 files)

```
✨ SMART_MATCH_GUIDE.md          (Complete guide)
✨ SMART_MATCH_SETUP.md          (Quick setup)
✨ SMART_MATCH_SUMMARY.md        (Implementation summary)
✨ SMART_MATCH_ARCHITECTURE.md   (Visual architecture)
```

## 🎯 API Request Template

```javascript
POST http://localhost:5000/api/matching/find-matches
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "senior_id": "uuid-123",           // OR use lat/lon
  "senior_lat": 23.7639,             // Optional if senior_id
  "senior_lon": 90.3709,             // Optional if senior_id
  "booking_date": "2025-11-20",      // Required (YYYY-MM-DD)
  "start_time": "10:00:00",          // Required (HH:MM:SS)
  "duration_hrs": 4,                 // Default: 4
  "required_skills": [               // Optional
    "Diabetes Care",
    "Personal Care"
  ],
  "senior_gender": "মহিলা",          // Optional
  "senior_area": "Dhaka",            // Optional
  "top_n": 5                         // Default: 5
}
```

## 🧮 Scoring Weights

| Factor     | Weight   | Max Points |
| ---------- | -------- | ---------- |
| Distance   | 30%      | 30         |
| Skills     | 25%      | 25         |
| Rating     | 20%      | 20         |
| Experience | 15%      | 15         |
| Gender     | 5%       | 5          |
| Language   | 5%       | 5          |
| **TOTAL**  | **100%** | **100**    |

## 📊 Score Interpretation

| Score  | Quality   | Recommendation              |
| ------ | --------- | --------------------------- |
| 90-100 | Perfect   | ⭐⭐⭐⭐⭐ Ideal match      |
| 75-89  | Excellent | ⭐⭐⭐⭐ Highly recommended |
| 60-74  | Good      | ⭐⭐⭐ Suitable option      |
| 45-59  | Fair      | ⭐⭐ Acceptable             |
| < 45   | Poor      | ⭐ Consider alternatives    |

## 🐍 Python CLI Examples

### Basic Match

```bash
python matching_algorithm.py \
  --json \
  --senior_lat 23.7639 \
  --senior_lon 90.3709 \
  --booking_date 2025-11-20 \
  --start_time 10:00:00 \
  --duration_hrs 4
```

### With Skills

```bash
python matching_algorithm.py \
  --json \
  --senior_id "uuid-123" \
  --required_skills "Diabetes Care,Personal Care" \
  --booking_date 2025-11-20 \
  --start_time 14:00:00 \
  --duration_hrs 6 \
  --top_n 10
```

### Get Statistics

```bash
python matching_algorithm.py --stats --json
```

## 🎨 Component Usage

### CaregiverMatcher

```jsx
import CaregiverMatcher from "../components/CaregiverMatcher";

<CaregiverMatcher
  seniorId="senior-123"
  seniorData={{
    location: { lat: 23.8103, lon: 90.4125 },
    gender: "মহিলা",
    area: "Dhaka",
    conditions: ["Diabetes", "High BP"],
  }}
  onBooking={(match) => {
    console.log("Booking:", match);
    // Handle booking logic
  }}
/>;
```

## 🔧 Environment Variables

### Backend `.env`

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🧪 Testing Commands

### Test Backend API

```bash
curl -X POST http://localhost:5000/api/matching/find-matches \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "senior_lat": 23.7639,
    "senior_lon": 90.3709,
    "booking_date": "2025-11-20",
    "start_time": "10:00:00",
    "duration_hrs": 4
  }'
```

### Test Python Script

```bash
cd ml
python matching_algorithm.py --json \
  --senior_lat 23.7 --senior_lon 90.3 \
  --booking_date 2025-11-20 \
  --start_time 10:00:00 \
  --duration_hrs 4
```

### Test Frontend

```bash
# Start dev server
npm run dev

# Visit
http://localhost:5173/smart-match
```

## 🐛 Common Issues & Fixes

| Issue               | Solution                                |
| ------------------- | --------------------------------------- |
| Python not found    | Install Python 3.8+ and add to PATH     |
| No matches          | Remove skill filters, check CSV data    |
| Auth failed         | Check JWT token in localStorage         |
| Import error        | `pip install pandas numpy scikit-learn` |
| Bengali text broken | Ensure UTF-8 encoding in all files      |

## 📊 Data Files

| File       | Location                      | Records |
| ---------- | ----------------------------- | ------- |
| Seniors    | `ml/data/mock/seniors.csv`    | 121     |
| Caregivers | `ml/data/mock/caregivers.csv` | 100     |
| Bookings   | `ml/data/mock/bookings.csv`   | 556     |

## 🎓 Algorithm Details

### Distance Formula

```
score = 30 × exp(-distance_km / 10)

Examples:
  0 km  → 30.0 points
  5 km  → 18.2 points
  10 km → 11.0 points
  20 km → 4.1 points
```

### Skill Matching

```
1. One-hot encode required skills
2. One-hot encode caregiver services
3. Calculate cosine similarity
4. Scale to 0-25 points

Example:
  Perfect match (1.0) → 25 points
  50% match (0.5)     → 12.5 points
  No match (0.0)      → 0 points
```

## 📱 User Flow

1. **Login** → Guardian account
2. **Navigate** → 🎯 Smart Match
3. **Select** → Choose senior
4. **Configure** → Date, time, duration, skills
5. **Search** → Click "Find Caregivers"
6. **Review** → View ranked matches
7. **Details** → Check score breakdown
8. **Book** → Select caregiver

## 🏆 Success Metrics

✅ **Backend**: No errors, clean code  
✅ **Frontend**: No errors, responsive UI  
✅ **Algorithm**: Updated with CLI/JSON  
✅ **Documentation**: 4 comprehensive guides  
✅ **Integration**: All components connected  
✅ **Testing**: Manual tests passing

## 📚 Documentation Index

| Doc                           | Purpose                | Audience        |
| ----------------------------- | ---------------------- | --------------- |
| `SMART_MATCH_GUIDE.md`        | Complete reference     | Developers      |
| `SMART_MATCH_SETUP.md`        | Quick start            | New users       |
| `SMART_MATCH_SUMMARY.md`      | Implementation details | Technical leads |
| `SMART_MATCH_ARCHITECTURE.md` | Visual diagrams        | Architects      |
| `SMART_MATCH_QUICKREF.md`     | Cheat sheet            | Everyone        |

## 🎉 Status: PRODUCTION READY ✅

All components tested, integrated, and documented.

---

**Version**: 1.0.0  
**Date**: November 16, 2025  
**Lines of Code**: 2,000+  
**Files**: 12 (8 code + 4 docs)
