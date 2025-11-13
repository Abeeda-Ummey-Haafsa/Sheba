# Sheba - Developer Reference Guide

Quick reference for developers working with the Sheba authentication system.

## Quick Links

- **Setup**: See `SETUP_GUIDE.md` for installation
- **Detailed Docs**: See `AUTHENTICATION_GUIDE.md` for full documentation
- **Overview**: See `IMPLEMENTATION_SUMMARY.md` for architecture

---

## useAuth() Hook - Complete Reference

### Import

```javascript
import { useAuth } from "../context/AuthContext";
```

### Hook Return Values

```javascript
const {
  // State
  user, // Supabase user object {id, email, ...}
  session, // Current session object
  loading, // true while auth state is loading
  userRole, // 'guardian' | 'caregiver' | 'admin' | null
  userMetadata, // Profile object from DB
  isAuthenticated, // true if logged in

  // Functions
  signIn, // async (email, password) -> {success, user}
  signUp, // async (email, password, metadata) -> {success, user}
  signOut, // async () -> {success}
  resetPassword, // async (email) -> {success}
} = useAuth();
```

### Example Usage

```javascript
function MyComponent() {
  const { user, userRole, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <p>Role: {userRole}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

---

## Protected Route - Complete Reference

### Import

```javascript
import ProtectedRoute from "../components/ProtectedRoute";
```

### Props

```javascript
<ProtectedRoute
  role="guardian"  // optional: enforce specific role
  children={...}   // JSX to render if authorized
/>
```

### Behaviors

- No auth → Redirect to `/login`
- Wrong role → Redirect to appropriate dashboard
- Correct role → Render children
- Loading → Show spinner

### Example

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

## Form Validation - Complete Reference

### Guardian Sign Up Schema

```javascript
const schema = yup.object().shape({
  full_name: yup
    .string()
    .min(2, "At least 2 characters")
    .required("Name required"),
  email: yup.string().email("Valid email required").required("Email required"),
  password: yup
    .string()
    .min(8, "Min 8 characters")
    .required("Password required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password"),
  phone: yup
    .string()
    .matches(/^\+880\d{9,10}$/, "Format: +880XXXXXXXXX")
    .required("Phone required"),
  number_of_seniors: yup.string().required("Select number of seniors"),
  location: yup.string().required("Select location"),
});
```

### Using with react-hook-form

```javascript
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

function Form() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      /* ... */
    },
  });

  const password = watch("password"); // For password strength

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

---

## Supabase Auth Methods - Quick Reference

### Sign Up

```javascript
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "securePassword123",
  options: {
    data: {
      role: "guardian",
      full_name: "John Doe",
    },
  },
});
```

### Sign In

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "securePassword123",
});
```

### Sign Out

```javascript
const { error } = await supabase.auth.signOut();
```

### Reset Password

```javascript
const { error } = await supabase.auth.resetPasswordForEmail(
  "user@example.com",
  { redirectTo: "https://example.com/reset-password" }
);
```

### Get Current User

```javascript
const {
  data: { user },
} = await supabase.auth.getUser();
```

### Auth State Listener

```javascript
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event); // 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED'
  console.log(session); // session object or null
});
```

---

## Database Operations - Quick Reference

### Fetch User Profile

```javascript
const { data: profile, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", userId)
  .single();
```

### Insert Senior

```javascript
const { data, error } = await supabase.from("seniors").insert({
  guardian_id: userId,
  name: "বাবা",
  age: 75,
  condition: "Diabetes",
});
```

### Fetch User's Seniors

```javascript
const { data: seniors, error } = await supabase
  .from("seniors")
  .select("*")
  .eq("guardian_id", userId);
```

### Upload File to Storage

```javascript
const { data, error } = await supabase.storage
  .from("verifications")
  .upload(`${userId}-verification.pdf`, file);
```

---

## Component Examples

### Creating a Protected Page

```javascript
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const { user, userMetadata, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div>
      <h1>Welcome, {userMetadata?.full_name}</h1>
      {/* page content */}
    </div>
  );
}
```

### Using Auth State in Navigation

```javascript
function Navigation() {
  const { isAuthenticated, user, signOut } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <button onClick={signOut}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
```

### Form with Validation

```javascript
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const result = await signIn(data.email, data.password);
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register("password")} type="password" placeholder="Password" />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Common Errors & Solutions

### "Email not confirmed"

**Error**: `Email not confirmed` when logging in
**Solution**: User must click verification link in email first

### "Invalid credentials"

**Error**: Login fails with generic error
**Solution**: Check email/password are correct

### Supabase not found

**Error**: Module not found: '@supabase/supabase-js'
**Solution**: `npm install @supabase/supabase-js`

### env variables not loading

**Error**: VITE_SUPABASE_URL is undefined
**Solution**:

1. Create `.env.local` file (not `.env`)
2. Restart dev server after creating file
3. Prefix with `VITE_` for Vite to expose it

### Form not submitting

**Error**: Form submit doesn't trigger onSubmit
**Solution**:

1. Ensure all required fields have `{...register('fieldName')}`
2. Check validation schema matches field names
3. Verify yup and @hookform/resolvers are installed

### File upload not working

**Error**: File upload fails silently
**Solution**:

1. Ensure 'verifications' bucket exists in Storage
2. Check RLS policies allow authenticated uploads
3. Verify file type (.pdf, .jpg, .jpeg, .png)

---

## Style Reference

### Colors (Tailwind Classes)

```javascript
bg - primary; // #14B8A6 (Teal)
bg - secondary; // #FB923C (Orange)
bg - accent; // #3B82F6 (Blue)
bg - success; // #10B981 (Green)
bg - error; // #EF4444 (Red)
bg - text; // #1F2937 (Dark Gray)
bg - bg; // #FFFFFF (White)
```

### Common Button Pattern

```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-6 py-3 bg-primary text-white rounded-lg hover:shadow-lg transition"
>
  Button Text
</motion.button>
```

### Form Input Pattern

```jsx
<div>
  <label className="block text-sm font-medium text-text mb-2">Label</label>
  <input
    {...register("fieldName")}
    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${
      errors.fieldName ? "border-error" : "border-gray-300"
    }`}
  />
  {errors.fieldName && (
    <p className="text-error text-xs mt-1">{errors.fieldName.message}</p>
  )}
</div>
```

---

## Environment Variables Template

```env
# Required for Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional
VITE_API_URL=http://localhost:5000
```

Get values from:

1. https://app.supabase.com
2. Project Settings → API
3. Copy "Project URL" and "anon public" key

---

## File Organization

```
src/
├── context/
│   └── AuthContext.jsx         # Auth provider
├── components/
│   ├── Navigation.jsx          # Header
│   ├── ProtectedRoute.jsx      # Route wrapper
│   └── AuthComponents.jsx      # Auth UI components
├── pages/
│   ├── Login.jsx               # Login page
│   ├── Signup.jsx              # Signup page
│   ├── Dashboard.jsx           # Guardian dashboard
│   ├── CaregiverDashboard.jsx # Caregiver dashboard
│   └── [other pages]
├── App.jsx                     # Main router
├── main.jsx                    # Entry point
├── index.css                   # Global styles
└── supabaseClient.js           # Supabase init
```

---

## Useful npm Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm install        # Install dependencies
npm list           # List installed packages
```

---

## Debugging Tips

### Check Auth State

```javascript
const { user, loading, isAuthenticated } = useAuth();
console.log("User:", user);
console.log("Loading:", loading);
console.log("Authenticated:", isAuthenticated);
```

### Check Supabase Connection

```javascript
import { supabase } from "../supabaseClient";
const { data, error } = await supabase.auth.getSession();
console.log("Session:", data);
console.log("Error:", error);
```

### Check Form Errors

```javascript
const { errors } = useForm(...)
console.log('Form Errors:', errors)
```

### Check Database

```javascript
const { data, error } = await supabase.from("profiles").select("*").limit(5);
console.log("Profiles:", data);
console.log("Error:", error);
```

---

## Performance Tips

1. **Lazy Load Routes**

   ```javascript
   const Dashboard = lazy(() => import("./pages/Dashboard"));
   ```

2. **Memoize Components**

   ```javascript
   export default memo(MyComponent);
   ```

3. **Use Loading State Wisely**

   - Only show spinner for long operations (>500ms)
   - Use disabled state for button clicks

4. **Optimize Images**
   - Use webp format
   - Resize appropriately
   - Use lazy loading

---

## Security Reminders

✅ Never commit `.env.local`
✅ Never log passwords
✅ Always validate on backend too
✅ Use HTTPS in production
✅ Keep Supabase keys private
✅ Update dependencies regularly
✅ Enable RLS on all tables

---

## Useful Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Hook Form**: https://react-hook-form.com/api
- **Yup Docs**: https://github.com/jquense/yup
- **Framer Motion**: https://www.framer.com/motion/animate-presence
- **Tailwind**: https://tailwindcss.com/docs
- **React Router**: https://reactrouter.com

---

## Quick Checklist for New Features

- [ ] Create component file
- [ ] Import necessary hooks (useAuth, useState, etc.)
- [ ] Wrap protected pages in `<ProtectedRoute>`
- [ ] Add form validation with yup
- [ ] Use `react-hot-toast` for notifications
- [ ] Add Framer Motion for animations
- [ ] Test with both Guardian and Caregiver roles
- [ ] Check mobile responsiveness
- [ ] Test error states
- [ ] Verify loading states
- [ ] Check Bangla text displays correctly
- [ ] Verify color contrast (a11y)

---

**Last Updated**: November 2025
**Version**: 1.0.0
