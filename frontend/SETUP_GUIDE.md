# Sheba Authentication Implementation - Quick Start Guide

## What's Been Implemented

### ✅ Complete Authentication System

- **Real Supabase Auth** - Email/password signup & login with verification
- **Role-Based Access** - Guardian vs Caregiver with different dashboards
- **Protected Routes** - Automatic redirection based on auth state
- **Auth Context Provider** - Global state management with `useAuth()` hook

### ✅ Authentication Pages

1. **Login.jsx** - Email/password with:

   - Show/hide password toggle
   - Forgot password modal (resets via Supabase)
   - Form validation (react-hook-form + yup)
   - Loading states and error toasts
   - Google OAuth placeholder

2. **Signup.jsx** - Role-based signup with:
   - Role selection (Guardian/Family or Caregiver)
   - Guardian fields: Full name, email, password, phone, number of seniors, location
   - Caregiver fields: + NID, experience, skills (multi-select), police verification upload
   - Conditional field rendering based on role
   - Password strength indicator
   - File upload with drag-drop support
   - Yup schema validation

### ✅ Post-Login Dashboards

1. **Dashboard.jsx** - Family Guardian Dashboard:

   - Personalized hero with user greeting
   - Your Seniors section with senior profiles
   - Feature highlights cards
   - Recent bookings with status
   - Statistics section
   - Call-to-action buttons
   - Responsive layout with animations

2. **CaregiverDashboard.jsx** - Caregiver Dashboard:
   - Experience & verification stats
   - Upcoming bookings list
   - Service skills display
   - Pending verification status banner

### ✅ Components & Utils

- **AuthContext.jsx** - Full auth state management with:

  - `signIn()`, `signUp()`, `signOut()`, `resetPassword()`
  - User profile fetching from Supabase
  - Auth state listener
  - Error handling & notifications

- **ProtectedRoute.jsx** - Route wrapper with:

  - Role-based access control
  - Loading spinner
  - Auto-redirect to login if unauthenticated
  - Redirect to appropriate dashboard if role mismatch

- **Navigation.jsx** - Updated with:

  - Auth-aware menu switching
  - User avatar dropdown with logout
  - Conditional menu items (authenticated vs public)
  - Responsive design

- **AuthComponents.jsx** - Reusable UI components:
  - `PasswordStrength` - Visual indicator with 5 levels
  - `FileUpload` - Drag-drop file uploader with preview
  - `ForgotPasswordModal` - Password reset dialog

### ✅ Styling & UX

- **Tailwind CSS** with custom color scheme:
  - Primary: #14B8A6 (Teal)
  - Secondary: #FB923C (Orange)
  - Accent: #3B82F6 (Blue)
  - Success: #10B981, Error: #EF4444
- **Framer Motion** animations:

  - Page fade-in transitions
  - Button hover/tap effects
  - Staggered children animations
  - Rotating loading spinners

- **Bilingual Support**:
  - English + Bangla (Bengali)
  - Unicode support for proper Bangla rendering
  - Example: "Login to Sheba / শেবায় লগইন করুন"

### ✅ Form Validation

- **react-hook-form** - Efficient form handling
- **yup** - Schema validation with error messages
- **@hookform/resolvers** - Integration bridge
- Inline error messages
- Password confirmation matching
- Email format validation
- NID number validation (10-17 digits)
- Phone format validation (+880 format)

### ✅ Real Supabase Integration

- **supabaseClient.js** - Client initialization with env vars
- **Email Verification** - Required before login
- **Profile Table** - Stores user metadata (role, skills, etc.)
- **Secure API Calls** - All auth operations via Supabase
- **Row Level Security** - Ready for database policies

### ✅ Notifications & UX

- **react-hot-toast** - Toast notifications for:
  - Successful login/signup
  - Error messages
  - Form validation feedback
  - Password reset confirmation

---

## File Structure Created

```
frontend/src/
├── supabaseClient.js              # Supabase client with env config
├── context/
│   └── AuthContext.jsx            # Auth provider + useAuth hook
├── components/
│   ├── Navigation.jsx             # Updated with auth support
│   ├── ProtectedRoute.jsx         # Role-based route wrapper
│   └── AuthComponents.jsx         # Reusable UI components
├── pages/
│   ├── Login.jsx                  # Login page (new)
│   ├── Signup.jsx                 # Signup page (new)
│   ├── Dashboard.jsx              # Guardian dashboard (new)
│   ├── CaregiverDashboard.jsx    # Caregiver dashboard (new)
│   └── [others unchanged]
├── App.jsx                        # Updated with AuthProvider & routes
└── [other files]
```

---

## Setup Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

Installs: @supabase/supabase-js, react-hook-form, yup, @hookform/resolvers, react-hot-toast, framer-motion

### 2. Create Supabase Project

1. Go to https://app.supabase.com
2. Create new project
3. Copy Project URL and Anon Key from Settings → API

### 3. Configure Environment

Create `frontend/.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Database Tables

Run SQL in Supabase SQL Editor (see AUTHENTICATION_GUIDE.md for full SQL)

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:5173

---

## How to Use

### For Guardians/Families

1. Click "Sign Up" → Select "Guardian/Family"
2. Fill form with senior care details
3. Check email for verification link
4. Login with email/password
5. Access Family Dashboard at `/dashboard`

### For Caregivers

1. Click "Sign Up" → Select "Caregiver"
2. Fill form with NID, experience, services, upload verification doc
3. Check email for verification
4. Login and view verification status on `/caregiver-dashboard`
5. Admin reviews and approves profile

### Protected Routes

- `/dashboard` - Guardian only
- `/caregiver-dashboard` - Caregiver only
- `/find-caregivers`, `/activity-logs` - Both authenticated users
- `/login`, `/signup` - Public (redirects to dashboard if already logged in)
- `/` (Home) - Shows landing page if public, redirects to dashboard if logged in

---

## Key Features

### Security

✓ Supabase handles password hashing & SSL
✓ Email verification required
✓ No password logging
✓ Row Level Security ready
✓ Environment variables for secrets

### Validation

✓ Client-side with yup schemas
✓ Email format checking
✓ Password strength indicator
✓ Confirm password matching
✓ NID 10-17 digit validation
✓ Phone +880 format validation

### UX/DX

✓ Loading spinners during async operations
✓ Toast notifications for feedback
✓ Smooth animations with Framer Motion
✓ Responsive design (mobile first)
✓ Error handling on all forms
✓ Bilingual interface

---

## What's NOT Implemented Yet

The following are placeholders for future development:

- Google OAuth button (structure ready)
- Caregiver verification admin workflow
- Real GPS tracking
- Chat/messaging
- Payment processing
- File storage (structure ready in Supabase)

---

## Common Tasks

### To Add a New Protected Route

```jsx
<Route
  path="/new-page"
  element={
    <ProtectedRoute role="guardian">
      {" "}
      {/* role is optional */}
      <NewPage />
    </ProtectedRoute>
  }
/>
```

### To Use Auth in a Component

```jsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, userRole, userMetadata, signOut } = useAuth();
  // use auth data...
}
```

### To Create a Form with Validation

```jsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  name: yup.string().required(),
});

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}
    </form>
  );
}
```

---

## Database Schema

### profiles table

- `id` (uuid) - FK to auth.users
- `email`, `full_name`, `phone`, `avatar_url`
- `role` - 'guardian' | 'caregiver' | 'admin'
- `location` (district), `number_of_seniors`
- `nid_number`, `experience_years`, `skills` (array), `police_verification_url`
- `verification_status` - 'pending' | 'verified' | 'rejected'
- `created_at`, `updated_at`

### Additional tables (ready for implementation)

- `seniors` - Senior profiles per guardian
- `bookings` - Booking records
- `activity_logs` - Location and activity tracking

---

## Troubleshooting

**"Email not confirmed" error**
→ Check email for Supabase verification link, click it, then login

**Supabase connection failed**
→ Verify `.env.local` has correct URL & key
→ Check project is active in Supabase dashboard

**Form not validating**
→ Ensure yup schema field names match input register names
→ Check @hookform/resolvers/yup is imported

**File upload not working**
→ Ensure "verifications" bucket exists in Supabase Storage
→ Check RLS policies allow uploads
→ File must be .pdf, .jpg, .jpeg, or .png

---

## Next Steps

1. **Deploy to Vercel/Netlify**: Add env vars to deployment settings
2. **Implement Caregiver Approval**: Build admin dashboard to verify caregivers
3. **Add Booking System**: Connect booking form to database
4. **Real-time Updates**: Add Supabase Realtime subscriptions
5. **Payment Integration**: Stripe/bKash for Indian/Bangladesh

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Hook Form**: https://react-hook-form.com
- **Yup Validation**: https://github.com/jquense/yup
- **Framer Motion**: https://www.framer.com/motion
- **Tailwind CSS**: https://tailwindcss.com

---

**Implementation Date**: November 2025
**Status**: Production-Ready Frontend
**Next Review**: When backend integration begins
