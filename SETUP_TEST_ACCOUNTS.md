# 🚀 Quick Setup Guide: Create Test Caregiver Accounts

## ✅ What You Need to Do

The issue is that **mock caregiver accounts don't exist in Supabase** and **email verification is enabled**. Here's how to fix it:

---

## **Step 1: Disable Email Verification (1 minute)**

### In Supabase Dashboard:

1. Go to: **https://app.supabase.com** → Your Project
2. Click: **Authentication** (left sidebar)
3. Click: **Settings** (top menu)
4. Find: **Email Verification** section
5. Toggle: **OFF** (disable email verification)
6. Click: **Save**

### Result:

✅ Users can now login without email verification
✅ Users will NOT receive verification emails during signup

---

## **Step 2: Code Changes Already Applied ✅**

I've already updated `AuthContext.jsx` to:

- ✅ Skip email verification check (commented out for development)
- ✅ Disable email redirect on signup

**No action needed** - these changes are already in place.

---

## **Step 3: Create Test Accounts in Supabase**

### Option A: Manual Creation (Recommended for First Time)

1. Go to: **Supabase Dashboard** → **Authentication** → **Users**
2. Click: **Add User** button
3. Enter test account details:
   ```
   Email: fatema.caregiver@test.com
   Password: SecurePass123!
   Auto Confirm User: ✅ CHECK THIS BOX
   ```
4. Click: **Create User**
5. Repeat for 2nd and 3rd accounts:
   - `nasrin.care@test.com` / `NasrinCare456@`
   - `rina.das@test.com` / `RinaDas789@`

**Why "Auto Confirm User"?** - This marks the email as verified, allowing login without verification email.

### Option B: Use SQL Script (Advanced)

1. Open: `MANUAL_SUPABASE_SETUP.sql` (in project root)
2. Go to: **Supabase Dashboard** → **SQL Editor** → **New Query**
3. Copy-paste the SQL script
4. Click: **Run**
5. Check results at bottom (should see profiles, bookings, earnings created)

---

## **Step 4: Create User Profiles (If Using Option A)**

After creating the auth users, create their profiles:

1. Go to: **Supabase Dashboard** → **SQL Editor** → **New Query**
2. Copy-paste this for each user:

```sql
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  phone,
  location,
  nid_number,
  experience_years,
  skills,
  verification_status
) VALUES (
  '<USER_ID_FROM_AUTH>',
  'fatema.caregiver@test.com',
  'Begum Fatema Akter',
  'caregiver',
  '+880171234567',
  'Dhaka',
  '12345678901234',
  1,
  '["Personal Care", "Companionship"]',
  'verified'
);
```

3. Replace `<USER_ID_FROM_AUTH>` with the actual user ID from Supabase Auth Users table
4. Click: **Run**
5. Repeat for other users

---

## **Step 5: Test Login**

1. Go to: **http://localhost:5174** (or your dev server)
2. Click: **Login** button
3. Enter:
   ```
   Email: fatema.caregiver@test.com
   Password: SecurePass123!
   ```
4. Click: **Login**

### Expected Result:

✅ Dashboard loads
✅ Shows caregiver dashboard with:

- Today's earnings: ৳2,000
- Active bookings
- Quick links

---

## 🎯 Summary of Changes Made

| Item                    | Status    | What I Did                                  |
| ----------------------- | --------- | ------------------------------------------- |
| Email verification skip | ✅ Done   | Commented out email check in AuthContext    |
| Email redirect disable  | ✅ Done   | Removed emailRedirectTo from signup options |
| Mock data in Supabase   | ⏳ You Do | Create accounts manually or run SQL script  |
| Disable email feature   | ⏳ You Do | Turn off in Supabase Settings               |

---

## 📝 Complete Step-by-Step Walkthrough

### A. Disable Email Verification in Supabase

1. **Open** Supabase Dashboard
2. **Click** "Authentication" → "Settings"
3. **Find** "Email Verification" toggle
4. **Click** toggle to turn **OFF**
5. **Save** changes
   ⏱️ **Time: 1 minute**

### B. Create First Test Account

1. **Go to** Authentication → Users
2. **Click** "Add User"
3. **Enter:**
   - Email: `fatema.caregiver@test.com`
   - Password: `SecurePass123!`
   - ✅ Check "Auto confirm user"
4. **Click** "Create User"
5. **Copy** the User ID (you'll need it)
   ⏱️ **Time: 2 minutes**

### C. Create Profile for Test Account

1. **Go to** SQL Editor
2. **Click** "New Query"
3. **Paste** this (replace USER_ID):

```sql
INSERT INTO public.profiles (
  id, email, full_name, role, phone, location,
  nid_number, experience_years, skills, verification_status
) VALUES (
  'USER_ID_HERE',
  'fatema.caregiver@test.com',
  'Begum Fatema Akter',
  'caregiver',
  '+880171234567',
  'Dhaka',
  '12345678901234',
  1,
  '["Personal Care", "Companionship"]',
  'verified'
);
```

4. **Click** "Run"
   ⏱️ **Time: 2 minutes**

### D. Test Login

1. **Go to** http://localhost:5174
2. **Enter:**
   - Email: `fatema.caregiver@test.com`
   - Password: `SecurePass123!`
3. **Click** Login
4. ✅ Should see caregiver dashboard!
   ⏱️ **Time: 1 minute**

**Total Time: ~6 minutes**

---

## 🔧 Troubleshooting

### Problem: Still Getting "Email Not Confirmed"

- ✅ Make sure you:
  1. Disabled email verification in Supabase Settings
  2. Checked "Auto confirm user" when creating account
  3. Cleared browser cache (DevTools → Storage → Clear All)
  4. Restarted dev server (`npm run dev`)

### Problem: Login Shows "Wrong Credentials"

- ✅ Check:
  1. Email is exact: `fatema.caregiver@test.com` (with .com)
  2. Password is exact: `SecurePass123!` (with capital S, number, !)
  3. Account exists in Supabase Auth → Users
  4. Profile exists in Supabase → profiles table

### Problem: Dashboard Shows No Bookings

- ✅ You need to:
  1. Create test bookings in Supabase database
  2. OR run the SQL script: `MANUAL_SUPABASE_SETUP.sql`
  3. Link bookings to caregiver_id from auth user

### Problem: Can't See User ID in Supabase

- ✅ In Supabase Dashboard:
  1. Go to **Authentication** → **Users**
  2. Click on the user email
  3. Copy the **User ID** from the Details panel
  4. Paste it in the SQL insert statement

---

## 📋 Quick Checklist

- [ ] Opened Supabase Dashboard
- [ ] Went to Authentication → Settings
- [ ] Disabled Email Verification
- [ ] Created auth user: fatema.caregiver@test.com
- [ ] Checked "Auto confirm user"
- [ ] Copied User ID
- [ ] Created profile in database via SQL
- [ ] Tested login with test credentials
- [ ] ✅ Dashboard loaded!

---

## 🚀 Next: Create More Test Accounts (Optional)

Once the first account works, create the other two:

**Account 2:**

- Email: `nasrin.care@test.com`
- Password: `NasrinCare456@`
- Name: Nasrin Ahmed Khan
- Experience: 5 years

**Account 3:**

- Email: `rina.das@test.com`
- Password: `RinaDas789@`
- Name: Rina Das Sharma
- Experience: 8 years

---

## 💡 Pro Tips

1. **Save User IDs** - Copy all user IDs somewhere safe for creating profiles
2. **Test Bookings** - Use `MANUAL_SUPABASE_SETUP.sql` to create mock bookings
3. **Browser Cache** - If login still fails, clear cache and restart dev server
4. **Check Logs** - Look at browser console (F12) for error messages
5. **Email Verification** - Remember to re-enable for production!

---

## ✅ Verification Commands

After setup, run these in SQL Editor to verify:

```sql
-- Check profiles created
SELECT email, full_name, role FROM public.profiles
WHERE email LIKE '%.caregiver@test.com' OR email LIKE '%.care@test.com';

-- Check bookings
SELECT id, status, payment_amount FROM public.bookings
WHERE booking_date = CURRENT_DATE;

-- Check earnings
SELECT * FROM public.earnings
WHERE created_at > NOW() - INTERVAL '1 day';
```

---

**Total Setup Time: ~10-15 minutes**

Once done, you'll have:
✅ 3 test caregiver accounts
✅ Mock bookings for today
✅ Earnings data
✅ Check-in records
✅ Activity logs

Ready to test the full caregiver dashboard! 🎉

---

**Files Modified:**

- `frontend/src/context/AuthContext.jsx` - Email verification skipped (development mode)

**Files Created:**

- `MANUAL_SUPABASE_SETUP.sql` - SQL script to create all test data

**Next Steps:**

1. Go to Supabase Dashboard
2. Disable email verification
3. Create test accounts
4. Run SQL script (optional)
5. Test login

**Questions?** Check the MANUAL_SUPABASE_SETUP.sql file or Supabase documentation.
