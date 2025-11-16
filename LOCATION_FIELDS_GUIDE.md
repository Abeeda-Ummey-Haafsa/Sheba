# 🏘️ Location Fields Update - Setup Guide

## What Was Added

Added **hierarchical location fields** to the seniors data:

- **`area`** - Area name in English (e.g., `mirpur`, `dhanmondi`, `gulshan`)
- **`sub_area`** - Sub-area name in Bengali (e.g., `মিরপুর ১০`, `ধানমন্ডি ৩২`)
- **`address_line`** - House/road details in Bengali (e.g., `বাড়ি নং ১২৩, রোড ৫`)
- **`address`** - Full address (auto-generated from above fields)

---

## 📋 Setup Steps

### Step 1: Add Database Columns

Run this in **Supabase SQL Editor**:

```sql
-- Add new columns to seniors table
ALTER TABLE seniors
ADD COLUMN IF NOT EXISTS area TEXT,
ADD COLUMN IF NOT EXISTS sub_area TEXT,
ADD COLUMN IF NOT EXISTS address_line TEXT;

-- Add comments
COMMENT ON COLUMN seniors.area IS 'Area name in English (e.g., mirpur, dhanmondi)';
COMMENT ON COLUMN seniors.sub_area IS 'Sub-area name in Bengali (e.g., মিরপুর ১০)';
COMMENT ON COLUMN seniors.address_line IS 'House/road address in Bengali';
```

Or simply run: **`ADD_LOCATION_COLUMNS.sql`** from the SQL Editor.

---

### Step 2: Clear Old Seniors Data

Run in **Supabase SQL Editor**:

```sql
-- Delete old seniors data (cascade will handle related records)
DELETE FROM seniors;
```

Or use the full clear script: **`CLEAR_DATABASE.sql`** if you want to reset everything.

---

### Step 3: Reseed Database

```bash
cd backend
npm run seed:db
```

This will insert 121 seniors with the new location structure.

---

## 🎨 Frontend Changes

### Profile.jsx - Add Senior Modal

The modal now has **3 new fields**:

1. **Area Dropdown** (এলাকা)

   - Select from: মিরপুর, মহম্মদপুর, ধানমন্ডি, গুলশান, উত্তরা, বনানী

2. **Sub-Area Dropdown** (উপ-এলাকা)

   - Dynamically populated based on selected area
   - Example: If "মিরপুর" selected → shows মিরপুর ১, মিরপুর ২, etc.

3. **Address Line Input** (ঠিকানা)

   - Free text field for house/road details
   - Example: `বাড়ি নং ১২৩, রোড ৫`

4. **Full Address** (auto-generated or manual)
   - Auto-filled from: `address_line + sub_area + area + ঢাকা`
   - Can be manually edited if needed

---

## 📊 Mock Data Structure

### Before:

```json
{
  "name": "করিম তালুকদার",
  "address": "123, Mirpur, ঢাকা-১২০৫"
}
```

### After:

```json
{
  "name": "করিম তালুকদার",
  "area": "mirpur",
  "sub_area": "মিরপুর ১০",
  "address_line": "বাড়ি নং ১২৩, রোড ৫",
  "address": "বাড়ি নং ১২৩, রোড ৫, মিরপুর ১০, মিরপুর, ঢাকা"
}
```

---

## 🔍 Location Dataset

```javascript
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
```

---

## ✅ Verification

After seeding, verify in Supabase:

```sql
SELECT name, area, sub_area, address_line, address
FROM seniors
LIMIT 5;
```

You should see structured location data like:

| name          | area   | sub_area  | address_line        | address                                      |
| ------------- | ------ | --------- | ------------------- | -------------------------------------------- |
| করিম তালুকদার | mirpur | মিরপুর ১০ | বাড়ি নং ১২৩, রোড ৫ | বাড়ি নং ১২৩, রোড ৫, মিরপুর ১০, মিরপুর, ঢাকা |

---

## 🎯 Benefits

1. **Better Data Structure** - Hierarchical location data for advanced filtering
2. **Improved UX** - Cascading dropdowns instead of free-text input
3. **Data Consistency** - Standardized area names across the platform
4. **AI/ML Ready** - Structured location data for better model training
5. **Search/Filter Ready** - Easy to filter seniors by area or sub-area

---

## 📝 Files Modified

- ✅ `mock/generate.js` - Added DHAKA_LOCATIONS, updated generateSeniors()
- ✅ `DATABASE_SCHEMA.sql` - Added area, sub_area, address_line columns
- ✅ `frontend/src/pages/Profile.jsx` - Added combobox fields to Add Senior modal
- ✅ `backend/scripts/seedData.js` - transformSeniors() handles new fields automatically

---

## 🚀 Next Steps

1. Run `ADD_LOCATION_COLUMNS.sql` in Supabase SQL Editor
2. Delete old seniors: `DELETE FROM seniors;`
3. Run `npm run seed:db` in backend folder
4. Test adding a new senior in the frontend Profile page
5. Verify data structure in Supabase dashboard

---

**Status**: ✅ Implementation Complete  
**Last Updated**: November 15, 2025
