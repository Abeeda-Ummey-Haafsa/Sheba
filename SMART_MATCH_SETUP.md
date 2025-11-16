# Smart Matching Feature - Quick Setup

## ✅ Installation Complete

The AI-powered caregiver matching feature has been successfully integrated into your Sheba platform!

## 📦 What Was Added

### Backend (Express.js)

- ✅ `backend/src/controllers/matchingController.js` - Matching API logic
- ✅ `backend/src/routes/matching.js` - API endpoints
- ✅ `backend/server.js` - Updated with matching routes

### Frontend (React)

- ✅ `frontend/src/components/CaregiverMatcher.jsx` - Reusable matcher component
- ✅ `frontend/src/pages/SmartMatch.jsx` - Full matching page
- ✅ `frontend/src/App.jsx` - Added /smart-match route
- ✅ `frontend/src/components/Navigation.jsx` - Added Smart Match link

### ML/Algorithm

- ✅ `ml/matching_algorithm.py` - Updated with CLI & JSON support

### Documentation

- ✅ `SMART_MATCH_GUIDE.md` - Complete implementation guide

## 🚀 How to Use

### 1. Start Backend Server

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### 2. Start Frontend Dev Server

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Access Smart Match

1. Login as a guardian/family member
2. Navigate to **🎯 Smart Match** in the menu
3. Select a senior from your profile
4. Configure search parameters:
   - Service date
   - Start time
   - Duration (hours)
   - Required skills (optional)
5. Click **🔍 Find Caregivers**
6. View ranked matches with detailed scores
7. Book your preferred caregiver!

## 🎯 Key Features

### Intelligent Scoring (0-100)

- **30%** Distance (GPS proximity)
- **25%** Skill Match (service alignment)
- **20%** Rating (caregiver reviews)
- **15%** Experience (years)
- **5%** Gender Preference
- **5%** Language/Dialect

### Real-Time Features

- ✅ Availability checking (booking conflicts)
- ✅ Distance calculation (Haversine formula)
- ✅ Skill similarity (Cosine similarity)
- ✅ Bengali language support
- ✅ Visual score breakdown

## 📊 API Endpoints

### Find Matches

```
POST /api/matching/find-matches
Authorization: Bearer <token>

{
  "senior_id": "uuid" or "senior_lat": 23.7639, "senior_lon": 90.3709,
  "booking_date": "2025-11-20",
  "start_time": "10:00:00",
  "duration_hrs": 4,
  "required_skills": ["Diabetes Care"],
  "top_n": 5
}
```

### Get Statistics

```
GET /api/matching/stats
Authorization: Bearer <token>
```

## 🧪 Testing

### Test the Python Algorithm

```bash
cd ml
python matching_algorithm.py --json \
  --senior_lat 23.7639 \
  --senior_lon 90.3709 \
  --booking_date 2025-11-20 \
  --start_time 10:00:00 \
  --duration_hrs 4 \
  --required_skills "Personal Care"
```

### Test the API

```bash
curl -X POST http://localhost:5000/api/matching/find-matches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "senior_lat": 23.7639,
    "senior_lon": 90.3709,
    "booking_date": "2025-11-20",
    "start_time": "10:00:00",
    "duration_hrs": 4,
    "top_n": 5
  }'
```

## 🎨 UI Components

### CaregiverMatcher Component

Reusable component that can be embedded anywhere:

```jsx
<CaregiverMatcher
  seniorId="senior-123"
  seniorData={{
    location: { lat: 23.8103, lon: 90.4125 },
    gender: "মহিলা",
    area: "Dhaka",
  }}
  onBooking={(match) => handleBooking(match)}
/>
```

### SmartMatch Page

Full-featured page at `/smart-match`:

- Senior selection
- Parameter configuration
- Match results display
- Detailed score breakdown
- Booking integration

## 📱 Responsive Design

- ✅ Desktop optimized
- ✅ Mobile responsive
- ✅ Touch-friendly
- ✅ Bengali/English bilingual

## 🔒 Security

- ✅ JWT authentication required
- ✅ User-specific data isolation
- ✅ Input validation
- ✅ Error handling

## 🐛 Troubleshooting

### Python not found

```bash
# Install Python 3.8+
# Windows: python.org
# Mac: brew install python3
# Linux: sudo apt install python3
```

### Dependencies missing

```bash
cd ml
pip install pandas numpy scikit-learn
```

### No matches found

- Check if CSV files exist in `ml/data/mock/`
- Verify data loaded correctly
- Adjust search parameters (remove skill filters)

## 📚 Documentation

For detailed documentation, see:

- **`SMART_MATCH_GUIDE.md`** - Complete implementation guide
- **`ml/README.md`** - Algorithm documentation
- **`ml/IMPLEMENTATION_SUMMARY.md`** - ML implementation details

## 🎉 Success!

Your Smart Matching feature is ready to use! The system will:

1. Analyze 100+ caregivers instantly
2. Calculate precise distances using GPS
3. Match skills with AI algorithms
4. Check real-time availability
5. Provide ranked results with explanations

Enjoy intelligent caregiver matching! 🚀

---

**Need Help?** See `SMART_MATCH_GUIDE.md` for troubleshooting and advanced usage.
