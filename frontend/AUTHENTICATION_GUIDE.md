# Sheba Authentication & Dashboard Implementation Guide

This document provides a comprehensive guide to the secure, full-stack authentication flow and post-login family dashboard implemented in the Sheba eldercare platform.

## Overview

The implementation includes:

- **Supabase Auth**: Real authentication with email verification
- **React Context API**: Auth state management
- **Protected Routes**: Role-based access control
- **Forms & Validation**: react-hook-form + yup for robust validation
- **UI/UX**: Framer-motion animations, Tailwind CSS styling
- **Bilingual Support**: English and Bangla (Unicode)
- **Real-time Updates**: React Hot Toast notifications

## Project Structure

```
src/
├── supabaseClient.js              # Supabase client initialization
├── context/
│   └── AuthContext.jsx            # Auth provider & hooks
├── components/
│   ├── Navigation.jsx             # Header with auth-aware menu
│   ├── ProtectedRoute.jsx         # Route protection component
│   └── AuthComponents.jsx         # Reusable auth UI components
├── pages/
│   ├── Login.jsx                  # Login page with Supabase auth
│   ├── Signup.jsx                 # Role-based signup with validation
│   ├── Dashboard.jsx              # Post-login family dashboard
│   ├── FindCaregivers.jsx
│   ├── ActivityLogs.jsx
│   ├── LiveTracking.jsx
│   └── Home.jsx                   # Public landing page
├── App.jsx                        # Routes & auth wrapper
├── main.jsx
├── index.css
└── vite.config.jsx
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs all required packages:

- `@supabase/supabase-js` - Supabase client
- `react-hook-form` - Form handling
- `yup` - Schema validation
- `@hookform/resolvers/yup` - Form-validation bridge
- `react-hot-toast` - Notifications
- `framer-motion` - Animations

### 2. Configure Supabase

1. Create a Supabase project at https://app.supabase.com
2. Copy your **Project URL** and **Anon Key** from Settings → API
3. Create `.env.local` file in `frontend/` directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Supabase Database

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('guardian', 'caregiver', 'admin')),
  phone TEXT,
  location TEXT,
  avatar_url TEXT,

  -- Guardian-specific fields
  number_of_seniors TEXT,

  -- Caregiver-specific fields
  nid_number TEXT UNIQUE,
  experience_years INTEGER,
  skills TEXT[], -- Array of service types
  police_verification_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  availability JSONB, -- {day: boolean, times: []}

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create seniors table (for guardians to track)
CREATE TABLE public.seniors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  condition TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  senior_id UUID REFERENCES public.seniors(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  date_from TIMESTAMP NOT NULL,
  date_to TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity logs table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  log_type TEXT NOT NULL, -- 'check-in', 'check-out', 'activity', 'note'
  content TEXT,
  location POINT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seniors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for seniors
CREATE POLICY "Guardians can view their seniors"
  ON public.seniors FOR SELECT
  USING (guardian_id = auth.uid());

-- RLS Policies for bookings
CREATE POLICY "Users can view their bookings"
  ON public.bookings FOR SELECT
  USING (guardian_id = auth.uid() OR caregiver_id = auth.uid());

-- Set up storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('verifications', 'verifications', false);

-- Verification documents - private, only authenticated users
CREATE POLICY "Users can upload verification docs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'verifications' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view own verification docs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'verifications' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## Key Features

### Authentication Flow

1. **Sign Up** (`/signup`)

   - Role selection: Guardian or Caregiver
   - Email verification required (Supabase auto-sends)
   - Guardian form: Full name, email, password, phone, number of seniors, location
   - Caregiver form: + NID, experience, skills, police verification upload
   - Password strength indicator
   - Data stored in `profiles` table with metadata

2. **Email Verification**

   - Supabase automatically sends verification email after signup
   - User must verify before logging in
   - Verification link in email redirects to login page

3. **Login** (`/login`)

   - Email + password
   - Show/hide password toggle
   - Forgot password → sends reset link via email
   - Redirects to `/dashboard` after successful login
   - Real Supabase authentication (no mocks)

4. **Protected Routes**
   - `/dashboard` - Guardian family dashboard (role: guardian)
   - `/find-caregivers` - Browse caregivers
   - `/activity-logs` - View activity
   - Unauthenticated users redirected to `/login`
   - Role mismatch redirects to appropriate dashboard

### Dashboard Features

- **Hero Section**: Personalized greeting with user's name
- **Your Seniors**: Cards showing seniors under care
- **Feature Highlights**: Verified caregivers, real-time monitoring, AI matching
- **Recent Bookings**: Status and caregiver details
- **Statistics**: Trust metrics (50+ caregivers, 1000+ families, 24/7 support)
- **Call-to-action**: Browse caregivers button
- **Responsive Design**: Mobile, tablet, desktop layouts
- **Animations**: Framer-motion for smooth transitions

### Navigation

- **Authenticated Users**:
  - Logo → Dashboard
  - Menu: Dashboard, Find Caregivers, Activity Logs
  - User avatar dropdown → Profile, Activity, Logout
- **Public Users**:
  - Logo → Home
  - Menu: Home, Services, How It Works, Find Caregivers, Pricing, About, Contact
  - Links: Login, Sign Up

## Form Validation

### Login Schema

```javascript
{
  email: required, valid format
  password: required, min 8 chars
}
```

### Guardian Sign Up

```javascript
{
  full_name: required, min 2 chars
  email: required, valid format
  password: required, min 8 chars, strong indicator
  confirm_password: required, must match
  phone: +880 format, 9-10 digits
  number_of_seniors: required (1-5+)
  location: required, from Bangladesh districts
}
```

### Caregiver Sign Up

```javascript
{
  ... (same as guardian) ...
  nid_number: required, 10-17 digits, unique
  experience_years: required, numeric
  skills: multi-select from services list
  police_verification: required, file upload
}
```

## Supabase Integration

### Auth Methods Used

```javascript
// Sign up
supabase.auth.signUp({
  email,
  password,
  options: {
    data: { role, full_name, ... }, // User metadata
  }
})

// Sign in
supabase.auth.signInWithPassword({ email, password })

// Sign out
supabase.auth.signOut()

// Password reset
supabase.auth.resetPasswordForEmail(email)

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {...})
```

### Database Operations

```javascript
// Get user profile
supabase.from("profiles").select("*").eq("id", user.id).single();

// Create senior record
supabase.from("seniors").insert({ guardian_id, name, age, condition });

// Upload verification file
supabase.storage.from("verifications").upload(path, file);
```

## Color Scheme

- **Primary**: #14B8A6 (Teal)
- **Secondary**: #FB923C (Orange)
- **Accent**: #3B82F6 (Blue)
- **Success**: #10B981 (Green)
- **Error**: #EF4444 (Red)
- **Background**: #FFFFFF (White)
- **Text**: #1F2937 (Dark Gray)

## Bilingual Support

Text includes both English and Bangla:

```jsx
<h1>Login to Sheba / শেবায় লগইন করুন</h1>
<p>Welcome back, {name}! / স্বাগতম</p>
```

Bangla text uses Unicode (e.g., "শেবা", "লগইন", "নিবন্ধন").

## State Management

### useAuth Hook

```javascript
const {
  user, // Current user object
  session, // Supabase session
  loading, // Auth loading state
  userRole, // 'guardian' | 'caregiver' | 'admin'
  userMetadata, // Profile data from DB
  isAuthenticated, // Boolean
  signIn, // Login function
  signUp, // Register function
  signOut, // Logout function
  resetPassword, // Reset password function
} = useAuth();
```

## Error Handling

- Invalid credentials → Toast error
- Email not verified → Helpful message
- Network errors → Toast notification
- Form validation → Inline error messages
- File upload errors → User feedback

## Security Best Practices

1. **No Password Logging**: Passwords never logged or exposed
2. **HTTPS Only**: Supabase handles SSL
3. **Row Level Security**: Database policies protect user data
4. **Environment Variables**: Secrets in `.env.local` (never in code)
5. **Email Verification**: Required before login
6. **File Upload Validation**: Type and size checks
7. **Session Management**: Auto-logout on token expiry

## Future Enhancements

- [ ] Google OAuth integration
- [ ] SMS verification option
- [ ] Two-factor authentication
- [ ] Caregiver verification workflow (admin dashboard)
- [ ] Real-time chat/messaging
- [ ] GPS tracking implementation
- [ ] Payment integration
- [ ] Admin dashboard for approvals
- [ ] Mobile app version
- [ ] Multi-language support (more languages)

## Troubleshooting

### "Email not confirmed" error

- Check user's email for verification link
- Resend verification email (implement in modal)

### Supabase not connecting

- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Check project is active in Supabase dashboard
- Verify `.env.local` file exists

### Form validation not working

- Ensure yup schema matches field names
- Check react-hook-form register calls
- Verify @hookform/resolvers/yup is installed

### File upload fails

- Check storage bucket "verifications" exists
- Verify RLS policies allow authenticated uploads
- File size under 5MB
- Supported formats: .pdf, .jpg, .jpeg, .png

## Support

For issues or questions:

1. Check Supabase docs: https://supabase.com/docs
2. React Hook Form docs: https://react-hook-form.com
3. Framer Motion docs: https://www.framer.com/motion

---

**Last Updated**: November 2025
**Version**: 1.0.0
