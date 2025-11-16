# Supabase Setup Guide for Sheba Platform

Your Supabase credentials are already configured in `frontend/.env.local`, but you need to run the database schema to create the required tables.

## Current Configuration

✅ **Supabase URL**: `https://zfpwuvzumfgchovcupxm.supabase.co`
✅ **Anon Key**: Already set in `.env.local`

## Step 1: Access Supabase SQL Editor

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Login to your account
3. Select your project: `zfpwuvzumfgchovcupxm`
4. Click on **SQL Editor** in the left sidebar

## Step 2: Run the Database Schema

Copy and paste the entire contents of `DATABASE_SCHEMA.sql` into the SQL Editor and click **Run**.

This will create:

- ✅ All required tables (`users`, `seniors`, `caregivers`, `bookings`, etc.)
- ✅ Proper indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for auto-updating timestamps

## Step 3: Configure Authentication

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Email** provider
3. Under **Email Templates**, you can customize signup/reset emails (optional)

## Step 4: Disable RLS for Testing (Optional)

If you want to test without authentication restrictions:

1. Go to **Authentication** → **Policies**
2. For the `seniors` table, temporarily disable RLS or add a policy:

```sql
-- Allow authenticated users to insert seniors
CREATE POLICY "Allow authenticated insert" ON seniors
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow users to select their own seniors
CREATE POLICY "Allow select own seniors" ON seniors
    FOR SELECT
    TO authenticated
    USING (family_user_id = auth.uid());

-- Allow users to update their own seniors
CREATE POLICY "Allow update own seniors" ON seniors
    FOR UPDATE
    TO authenticated
    USING (family_user_id = auth.uid());

-- Allow users to delete their own seniors
CREATE POLICY "Allow delete own seniors" ON seniors
    FOR DELETE
    TO authenticated
    USING (family_user_id = auth.uid());
```

## Step 5: Test the Application

1. **Stop the dev server** if it's running (Ctrl+C in the terminal)
2. **Restart the dev server**:
   ```bash
   cd /e/Projects/Sheba_v3/frontend
   npm run dev
   ```
3. **Open** [http://localhost:5173](http://localhost:5173)
4. **Sign up** or **login** with a test account
5. **Navigate to Profile** → **Seniors tab**
6. **Click "+ Add Senior"** and fill out the form
7. **Submit** - the senior should now appear in both:
   - Profile page (Seniors tab)
   - Dashboard page (Your Seniors section)

## Troubleshooting

### Issue: "Failed to save senior" error

**Check:**

1. Is the database schema created? Run the SQL from `DATABASE_SCHEMA.sql`
2. Are RLS policies configured correctly?
3. Is the user authenticated? Check browser console for auth errors

### Issue: Nothing appears after submitting

**Check browser console (F12)** for errors:

- If you see "relation 'seniors' does not exist" → Run the database schema
- If you see "new row violates row-level security" → Configure RLS policies
- If you see "permission denied" → Check authentication state

### Issue: "isSupabaseConfigured() returns false"

**Check:**

- `.env.local` file exists in `frontend/` folder
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
- Dev server was restarted after changing `.env.local`

## Verify Supabase Connection

Run this in browser console on the app:

```javascript
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log(
  "Configured:",
  import.meta.env.VITE_SUPABASE_URL !== "https://your-project.supabase.co"
);
```

## Database Tables Required

Your app needs these tables:

- ✅ `users` - User authentication
- ✅ `seniors` - Senior profiles (added by family users)
- ✅ `caregivers` - Caregiver profiles
- ✅ `bookings` - Service bookings
- ✅ `activity_logs` - Activity tracking
- ✅ `emergency_alerts` - Emergency notifications
- ✅ `training_courses` - Caregiver training
- ✅ `caregiver_progress` - Training progress

All these are created when you run `DATABASE_SCHEMA.sql`.

## Next Steps

After setting up the database:

1. ✅ Test adding a senior
2. ✅ Verify it appears on the dashboard
3. ✅ Test editing and deleting seniors
4. Configure other features (caregivers, bookings, etc.)

---

**Need help?** Check the Supabase documentation: https://supabase.com/docs
