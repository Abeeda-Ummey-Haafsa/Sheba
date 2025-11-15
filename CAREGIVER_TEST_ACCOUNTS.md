# Caregiver Test Accounts - Quick Reference Cards

## 🟢 Account 1: Beginner Caregiver (Entry Level)

```
Full Name:        Begum Fatema Akter
Email:            fatema.caregiver@test.com
Password:         SecurePass123!
Confirm Password: SecurePass123!
Phone:            +880171234567
NID Number:       12345678901234
Experience:       1 year
Location:         Dhaka
Services:         Personal Care, Companionship
Skills:           Basic Care
Verification:     ✅ Verified
Rating:           4.8/5 (127 reviews)
Today's Earnings: ৳2,000
Total Earnings:   ৳125,000
```

**Profile Key Features:**

- 1 year experience
- Certified in Basic Care
- Available: Mon-Fri, 8 AM - 8 PM
- Speaks: Bangla, English
- Active bookings: 1
- Pending payment: ৳5,000

---

## 🟡 Account 2: Intermediate Caregiver (Experienced)

```
Full Name:        Nasrin Ahmed Khan
Email:            nasrin.care@test.com
Password:         NasrinCare456@
Confirm Password: NasrinCare456@
Phone:            +880181234567
NID Number:       98765432109876
Experience:       5 years
Location:         Chittagong
Services:         Nursing, Physiotherapy, Medication
Skills:           Medical Care, Rehabilitation
Verification:     ✅ Verified
Rating:           4.8/5 (127 reviews)
Today's Earnings: ৳2,000
Total Earnings:   ৳125,000
```

**Profile Key Features:**

- 5 years experience
- Trained Nurse with Physiotherapy cert
- Specialization: Elderly Care & Palliative
- Available: Mon-Fri, 8 AM - 8 PM
- Speaks: Bangla, English
- Active bookings: 1
- Certifications: 3

---

## 🔴 Account 3: Specialist Caregiver (Expert)

```
Full Name:        Rina Das Sharma
Email:            rina.das@test.com
Password:         RinaDas789@
Confirm Password: RinaDas789@
Phone:            +880191234567
NID Number:       55555555555555
Experience:       8 years
Location:         Khulna
Services:         Palliative, Rehabilitation, Nursing, Physiotherapy
Skills:           Advanced Medical Care, Palliative Specialist
Verification:     ✅ Verified
Rating:           4.8/5 (127 reviews)
Today's Earnings: ৳2,000
Total Earnings:   ৳125,000
```

**Profile Key Features:**

- 8 years experience
- Palliative Care Specialist
- Certifications: Nursing, Physiotherapy, First Aid & CPR
- Available: Mon-Fri, 8 AM - 8 PM
- Speaks: Bangla, English
- Active bookings: 1
- Senior rating: Excellent

---

## 📋 Additional Test Accounts

### Account 4: Mst. Anika (New Caregiver)

```
Full Name:     Mst. Anika Rahman
Email:         anika.rahman@test.com
Password:      AnikaR2024@
Phone:         +880161234567
NID:           77777777777777
Experience:    2 years
Location:      Rajshahi
Services:      Personal Care, Companionship, Hygiene Support
```

### Account 5: Begum Razia (Senior Caregiver)

```
Full Name:     Begum Razia Sultana
Email:         razia.sultana@test.com
Password:      Razia2024Pass@
Phone:         +880151234567
NID:           33333333333333
Experience:    8 years
Location:      Sylhet
Services:      Nursing, Medication, Physiotherapy, Rehabilitation
```

---

## 📌 Today's Bookings (For Testing Dashboard)

### Active Booking 🔵

```
Booking ID:    booking_001
Senior:        রহিম আহমেদ (75 years old)
Address:       House 12, Street 3, Mirpur
Time:          10:00 AM - 2:00 PM (4 hours)
Payment:       ৳800
Status:        🟢 CHECKED IN (10:05 AM)
Services:      Personal Care, Medication, Companionship
GPS:           8 meters from location ✅
```

### Completed Booking ✅

```
Booking ID:    booking_002
Senior:        ফাতিমা বেগম (68 years old)
Address:       Apartment 5C, Building B, Banani
Time:          2:00 PM - 6:00 PM (4 hours)
Payment:       ৳800
Status:        ✅ COMPLETED (5:58 PM)
Services:      Personal Care, Hygiene Support
Activity Log:  Submitted (3 photos)
Senior Health: Good 🙂
```

### Upcoming Bookings 📅

```
Booking #3: করিম শেখ (82 years old)
Time: Tomorrow 9:00 AM - 1:00 PM | Payment: ৳1,000

Booking #4: সালমা আক্তার (70 years old)
Time: Nov 16, 2:00 PM - 8:00 PM | Payment: ৳1,200
```

---

## 💰 Today's Earnings Breakdown

```
Total Today:        ৳2,000
  Booking 1:        ৳800
  Booking 2:        ৳800
  Other:            ৳400

Weekly:             ৳12,500
Monthly:            ৳45,000
All Time:           ৳125,000

Pending Payment:    ৳5,000 (Will be credited in 3 days)
```

---

## 📍 GPS Check-in Test Cases

### ✅ Success Case (8 meters away)

```
Senior Location:     Mirpur (23.8145, 90.3668)
Your Location:       23.81456, 90.36685
Distance:            8 meters
Status:              ✅ CHECK-IN SUCCESSFUL
Accuracy Radius:     ±20 meters
```

### ✅ Pass Case (60 meters away)

```
Senior Location:     Banani (23.8241, 90.3742)
Your Location:       23.8245, 90.3748
Distance:            60 meters
Status:              ✅ CHECK-IN SUCCESSFUL
Accuracy Radius:     ±25 meters
Threshold:           100 meters
```

### ❌ Fail Case (1110 meters away)

```
Senior Location:     Dhanmondi (23.7642, 90.3688)
Your Location:       23.7742, 90.3688
Distance:            1,110 meters (1.11 km)
Status:              ❌ TOO FAR
Error Message:       "You are not at the correct location"
Required Distance:   Within 100 meters
```

### ❌ GPS Error

```
Error Type:          GPS_UNAVAILABLE
Message:             "Location services not enabled"
Action:              Enable location in phone settings
Status:              ❌ Cannot check in
```

---

## 🎯 Activity Log Examples

### Example 1: Completed Visit (Good Condition)

```
Booking:           booking_002
Senior:            ফাতিমা বেগম
Check-in:          2:03 PM
Check-out:         5:58 PM
Duration:          3h 55m

Services Completed:
  ✅ Personal Care
  ✅ Hygiene Support
  ✅ Meal Preparation

Senior Condition:  😊 Good

Notes (Bangla):
"সিনিয়র সুস্থ ছিলেন। দুপুরের খাবার দিয়েছি।
গোসল করিয়েছি। নিয়মিত ওষুধ দিয়েছি।"

Photos Uploaded:   2 photos
Distance from Home: 2.3 km
GPS Accuracy:      ±25 meters
```

### Example 2: Current Visit (In Progress)

```
Booking:           booking_001
Senior:            রহিম আহমেদ
Check-in:          10:05 AM
Check-out:         (In Progress)
Duration:          3h 15m so far

Services Completed:
  ✅ Personal Care
  ✅ Medication
  ✅ Companionship (ongoing)

Senior Condition:  😊 Excellent

Notes (Bangla):
"অত্যন্ত ভালো অবস্থায়। সকালের ওষুধ দিয়েছি।
একসাথে টেবিল খেলা খেলছি।"

Photos Uploaded:   1 photo (in progress)
```

### Example 3: Concerning Health Status

```
Booking:           booking_008
Senior:            আব্দুল মান্নান
Check-in:          3:10 PM
Check-out:         7:45 PM
Duration:          4h 35m

Services Completed:
  ✅ Physiotherapy
  ✅ Personal Care
  ✅ Mobility Support

Senior Condition:  😟 Concerning ⚠️

Notes (Bangla):
"সিনিয়র পায়ে ব্যথা অনুভব করছেন।
অতিরিক্ত যত্ন নেওয়া হয়েছে।
পরিবারকে অবহিত করা হয়েছে।"

Photos Uploaded:   3 photos
FAMILY ALERT:      ✅ Sent
Follow-up Needed:  Yes
```

---

## 📚 Training Courses Status

### Course 1: প্রাথমিক চিকিৎসা (First Aid)

```
Status:        🟡 IN PROGRESS
Progress:      60% (3 of 5 lessons completed)
Duration:      2 hours
Level:         Beginner
Quizzes:       2 available (1 completed)
Next:          Complete lesson 4
```

### Course 2: যোগাযোগ দক্ষতা (Communication Skills)

```
Status:        ✅ COMPLETED
Progress:      100%
Duration:      3 hours
Level:         Intermediate
Certificate:   ✅ Earned on Oct 15, 2025
```

### Course 3: স্বাস্থ্যবিধি (Hygiene & Health Care)

```
Status:        ⚪ NOT STARTED
Progress:      0%
Duration:      2.5 hours
Level:         Beginner
Action:        Click "Start Course" to begin
```

---

## 🔔 Notifications (Sample)

### Unread (1)

```
New Booking Accepted ✨
"আপনার বুকিং বিনোদ অনুমোদিত হয়েছে - রহিম আহমেদ"
Time: Today 8:30 AM
```

### Recent Notifications

```
✅ Payment Received (Yesterday)
   "৳800 টাকা আপনার অ্যাকাউন্টে জমা হয়েছে"

⚠️ Senior Alert (2 days ago)
   "ফাতিমা বেগম উদ্বেগজনক অবস্থায় রয়েছেন"

📚 Training Reminder (3 days ago)
   "নতুন প্রশিক্ষণ কোর্স উপলব্ধ - প্যালিয়েটিভ কেয়ার"
```

---

## 🎬 Common Test Flows

### Flow 1: Complete Booking Cycle (5 minutes)

1. **Login** with `fatema.caregiver@test.com` / `SecurePass123!`
2. **Dashboard** shows today's bookings
3. **Click Active Booking** (booking_001)
4. **GPS Check-in** using test case `SUCCESS`
5. **View Booking Details** (2 hours)
6. **Check-out** button appears
7. **Submit Activity Log** from booking_002 example
8. **View Updated Earnings** (now shows ৳2,000+)

### Flow 2: Training Course (3 minutes)

1. **Navigate** to Training Portal
2. **View 3 Courses** (not started, in progress, completed)
3. **Click "Start"** on Course 1
4. **Watch Video** (mock YouTube player)
5. **Take Quiz** (multiple choice)
6. **See Progress** update to 100%
7. **Download Certificate** (if completed)

### Flow 3: GPS Scenarios (2 minutes)

1. **Click Check-in** button
2. **Permission popup** appears
3. **Allow Location**
4. **Use Test Cases:**
   - `SUCCESS` → Check-in works ✅
   - `FAIL_TOO_FAR` → Show error "Too far away"
   - `NO_GPS` → Show error "GPS unavailable"

---

## 📞 Support Contact (For Testing)

```
Email Support:     support@seba.health
Phone:            +880 1XXX XXXXXX
Available:        9 AM - 6 PM (Bangladesh Time)
```

---

## 💡 Tips for Effective Testing

1. **Copy Credentials Exactly**: Include the `+880` country code in phone
2. **NID Format**: Use exactly 10-17 digits (no dashes or spaces)
3. **Password**: Must be 8+ chars, include number and special character
4. **GPS Test**: Use mobile device for real testing, DevTools for emulation
5. **Bangla Text**: All text displays correctly (✅ No encoding issues)
6. **Responsive**: Test on mobile view (DevTools Ctrl+Shift+M)
7. **Offline Mode**: Disable network to test service worker caching

---

**Last Updated**: November 14, 2025
**Version**: 1.0
**Status**: ✅ Ready for Testing
