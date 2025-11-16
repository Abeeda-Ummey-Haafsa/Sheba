# 🔐 সেবা Test Accounts - Login Guide

## How to Login with Mock Data

The mock data generates users with **hashed passwords**. To actually login, you need to either:

### Option 1: Manual Account Creation (Recommended)

Since Supabase Auth manages authentication, you need to create test accounts through:

1. **Supabase Dashboard** → Authentication → Users → Add User
2. **Or use the signup form** in your app to create new accounts

### Option 2: Seed Database with Supabase Auth

If you want to use the mock data emails, you need to:

1. Run the seeding script: `npm run seed:db` (in backend folder)
2. This will create users in your Supabase database
3. Then manually create matching auth users in Supabase Dashboard

---

## 📧 Test Account Examples from Mock Data

### Family Members (Guardians)

You can check `mock/users.json` for the generated emails. Here are example formats:

```
Email: john.smith@example.com (or any email from users.json with role: "family")
Password: password123 (you need to set this manually in Supabase)
Role: Family Member
```

### Caregivers

```
Email: fatema.caregiver@test.com (or any email from users.json with role: "caregiver")
Password: password123 (you need to set this manually in Supabase)
Role: Caregiver
```

### Admin

```
Email: admin1@seba.com
Password: password123 (you need to set this manually in Supabase)
Role: Admin
```

---

## 🚀 Quick Setup for Testing

### Step 1: Create Test Users in Supabase

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"**
3. Use these test credentials:

#### Test Family Account

- **Email**: `test.family@seba.com`
- **Password**: `TestFamily123!`
- **Confirm Password**: Yes
- **Auto Confirm User**: Yes

#### Test Caregiver Account

- **Email**: `test.caregiver@seba.com`
- **Password**: `TestCaregiver123!`
- **Confirm Password**: Yes
- **Auto Confirm User**: Yes

### Step 2: Login to Your App

1. Open http://localhost:5173/
2. Click **"Login"**
3. Use the credentials above
4. You should be logged in!

---

## 📝 Alternative: Use Signup Form

Instead of manually creating users, you can:

1. Click **"Sign Up"** in your app
2. Fill in the registration form
3. Create a new account with your own email/password
4. Login with those credentials

---

## 🔄 Syncing Mock Data with Auth

If you want the 100 caregivers from mock data to be loginable:

### Option A: Manual Seeding

1. Run database seeder:

   ```bash
   cd backend
   npm run seed:db
   ```

2. For each user in `mock/users.json`:
   - Go to Supabase Dashboard → Authentication → Add User
   - Use the email from the JSON
   - Set password to: `password123`
   - Check "Auto confirm user"

### Option B: Auth API Script (Advanced)

Create a script to bulk-create auth users:

```javascript
// backend/scripts/createAuthUsers.js
import { createClient } from "@supabase/supabase-js";
import users from "../mock/users.json" assert { type: "json" };

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Need service role key!
);

async function createAuthUsers() {
  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: "password123",
      email_confirm: true,
      user_metadata: {
        full_name: user.full_name,
        role: user.role,
      },
    });

    if (error) {
      console.error(`Failed to create ${user.email}:`, error.message);
    } else {
      console.log(`✓ Created auth user: ${user.email}`);
    }
  }
}

createAuthUsers();
```

Run with:

```bash
node backend/scripts/createAuthUsers.js
```

---

## 🎯 Current Status

Your app now shows **100 caregivers** from the mock data, but authentication is separate.

### What Works:

- ✅ 100 caregivers display on "Find Caregivers" page
- ✅ All mock data is loaded (users, seniors, bookings, etc.)
- ✅ Filtering and searching works

### What Needs Setup:

- 🔐 Authentication requires creating users in Supabase Auth
- 🔐 Mock data users are in the database but don't have auth credentials yet

---

## 💡 Recommended Flow for Testing

1. **Quick Test**: Use the signup form to create a new account
2. **Full Test**: Create 2-3 test accounts manually (1 family, 1 caregiver, 1 admin)
3. **Production**: Set up proper auth flow with email verification

---

## 🔍 Check Your Mock Data

To see all generated users:

```bash
# View first 10 users
cat mock/users.json | head -n 50

# Count users by role
cat mock/users.json | grep '"role"' | sort | uniq -c
```

You should see:

- 50 family users
- 100 caregiver users
- 3 admin users

---

**Note**: The default password for all mock users is `password123` (but you need to set it manually in Supabase Auth)
