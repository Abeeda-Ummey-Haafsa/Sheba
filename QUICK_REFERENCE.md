# Sheba Auth System - Quick Reference Card

## 🚀 Get Started in 3 Steps

```bash
# 1. Install
cd frontend && npm install

# 2. Configure
echo "VITE_SUPABASE_URL=https://your.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your-key" >> .env.local

# 3. Run
npm run dev
# → http://localhost:5173
```

---

## 📍 Where to Find Things

| What             | Where                                                |
| ---------------- | ---------------------------------------------------- |
| Auth setup       | `.env.local`                                         |
| Auth logic       | `src/context/AuthContext.jsx`                        |
| Login form       | `src/pages/Login.jsx`                                |
| Signup form      | `src/pages/Signup.jsx`                               |
| Dashboards       | `src/pages/Dashboard.jsx` & `CaregiverDashboard.jsx` |
| Protected routes | `src/components/ProtectedRoute.jsx`                  |
| Database schema  | `SUPABASE_SETUP.sql`                                 |

---

## 💻 Use Auth in Code

```javascript
import { useAuth } from "../context/AuthContext";

const {
  user, // Supabase user
  userRole, // 'guardian' | 'caregiver'
  isAuthenticated, // true/false
  loading, // loading state
  signIn, // async (email, password)
  signUp, // async (email, password, metadata)
  signOut, // async ()
  resetPassword, // async (email)
} = useAuth();
```

---

## 🔒 Protect Routes

```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute role="guardian">
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## ✅ Form Validation

```javascript
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const { register, handleSubmit, errors } = useForm({
  resolver: yupResolver(schema),
});

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input {...register("email")} />
    {errors.email && <span>{errors.email.message}</span>}
  </form>
);
```

---

## 🎨 Colors

```css
primary:   #14B8A6  (use bg-primary text-primary)
secondary: #FB923C  (use bg-secondary)
accent:    #3B82F6  (use bg-accent)
success:   #10B981  (use bg-success)
error:     #EF4444  (use bg-error)
```

---

## 📦 Key Libraries

```
@supabase/supabase-js  → Authentication
react-hook-form        → Form handling
yup                    → Validation
framer-motion          → Animations
react-hot-toast        → Notifications
```

Install: `npm install` (already in package.json)

---

## 🔐 Security Reminders

- Never commit `.env.local`
- Never log passwords
- Use HTTPS in production
- Enable RLS on all tables
- Validate on backend too

---

## 🐛 Common Issues & Fixes

| Issue                | Solution                            |
| -------------------- | ----------------------------------- |
| Env vars not loading | Restart dev server                  |
| Supabase not found   | `npm install @supabase/supabase-js` |
| Email not verified   | Click link in verification email    |
| Form not submitting  | Check all `{...register()}` calls   |
| File upload fails    | Check bucket exists & RLS policies  |

---

## 📚 Documentation

| Guide                   | Purpose              |
| ----------------------- | -------------------- |
| SETUP_GUIDE.md          | Installation & setup |
| DEVELOPER_REFERENCE.md  | Code examples        |
| AUTHENTICATION_GUIDE.md | Technical details    |
| DOCUMENTATION_INDEX.md  | All guides           |

**Start here**: SETUP_GUIDE.md

---

## 🚀 Build & Deploy

```bash
# Build for production
npm run build

# Preview build locally
npm run preview

# Deploy (e.g., Vercel)
# Just push to GitHub, Vercel auto-deploys
```

Set these env vars in production:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

---

## 🧪 Test Checklist

- [ ] Signup as Guardian
- [ ] Verify email
- [ ] Login successfully
- [ ] See Dashboard
- [ ] Signup as Caregiver
- [ ] Test password reset
- [ ] Test logout
- [ ] Protected routes redirect

---

## 📱 Key Routes

```
/                      Home (public)
/login                 Login page
/signup                Signup page
/dashboard             Guardian dashboard (protected)
/caregiver-dashboard   Caregiver dashboard (protected)
/find-caregivers       Browse caregivers (protected)
/activity-logs         Activity logs (protected)
```

---

## 💾 Database Tables

```sql
profiles          -- Users with roles
seniors           -- Senior profiles
bookings          -- Caregiver bookings
activity_logs     -- Activity tracking
reviews           -- Ratings & reviews
```

Run: `SUPABASE_SETUP.sql`

---

## 🎯 Common Tasks

### Add a form field

1. Add to signup form component
2. Add to yup schema
3. Add to Supabase profiles table
4. Update AuthContext to fetch it

### Create a protected page

1. Create component in `src/pages/`
2. Add route with `<ProtectedRoute>`
3. Use `useAuth()` for user data

### Style a component

1. Use Tailwind classes
2. Reference color variables
3. Add Framer Motion for animations

---

## 🔗 Useful Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm install              # Install dependencies
npm list                 # List installed packages
```

---

## 📞 Help

1. Check DOCUMENTATION_INDEX.md
2. Search DEVELOPER_REFERENCE.md
3. Review code comments
4. Check Supabase docs
5. Test locally first

---

## ✨ Next Steps

1. **Setup** (15 min)

   - Read SETUP_GUIDE.md
   - Create Supabase project
   - Configure .env.local
   - Run dev server

2. **Test** (10 min)

   - Signup & login
   - Verify email
   - Check dashboards

3. **Deploy** (20 min)

   - Build: `npm run build`
   - Deploy to Vercel/Netlify
   - Set env vars
   - Test in production

4. **Extend** (ongoing)
   - Add features
   - Implement booking system
   - Add payments
   - Scale system

---

## 🎉 You're Ready!

Everything you need is in place. Start with SETUP_GUIDE.md and you'll be live in under an hour.

**Status**: ✅ Production-Ready
**Version**: 1.0.0
**Support**: Check DOCUMENTATION_INDEX.md

---

Print this card or bookmark DOCUMENTATION_INDEX.md for quick reference!
