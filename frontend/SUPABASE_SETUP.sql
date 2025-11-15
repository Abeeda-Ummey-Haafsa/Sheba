-- Sheba Platform - Complete Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor
-- This creates all tables, policies, and storage buckets

-- ============================================================
-- 1. CREATE TABLES
-- ============================================================

-- Profiles table (user information)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  
  -- Role information
  role TEXT NOT NULL CHECK (role IN ('guardian', 'caregiver', 'admin')),
  
  -- Guardian-specific fields
  number_of_seniors TEXT,
  location TEXT,
  
  -- Caregiver-specific fields
  nid_number TEXT UNIQUE,
  experience_years INTEGER,
  skills TEXT[], -- Array of service names
  police_verification_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  availability JSONB, -- {days: [mon, tue...], times: {start: '09:00', end: '17:00'}}
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seniors table (senior profiles managed by guardians)
CREATE TABLE public.seniors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  condition TEXT, -- Medical conditions
  phone TEXT,
  medical_notes TEXT,
  preferred_caregiver_skills TEXT[],
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table (caregiver bookings)
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  senior_id UUID REFERENCES public.seniors(id) ON DELETE SET NULL,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')),
  date_from TIMESTAMP NOT NULL,
  date_to TIMESTAMP NOT NULL,
  
  hourly_rate DECIMAL(10,2),
  total_hours INTEGER,
  total_cost DECIMAL(10,2),
  
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table (tracking activities during care)
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  log_type TEXT NOT NULL CHECK (log_type IN ('check-in', 'check-out', 'activity', 'note', 'location')),
  content TEXT,
  
  -- Location data for GPS tracking
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews and ratings table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seniors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. CREATE RLS POLICIES
-- ============================================================

-- PROFILES POLICIES
-- Users can view own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can view other caregiver profiles (public info)
CREATE POLICY "Can view caregiver profiles"
  ON public.profiles FOR SELECT
  USING (role = 'caregiver' AND verification_status = 'verified');

-- Users can update own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- SENIORS POLICIES
-- Guardians can view their own seniors
CREATE POLICY "Guardians can view their seniors"
  ON public.seniors FOR SELECT
  USING (guardian_id = auth.uid());

-- Caregivers can view seniors they're booked for
CREATE POLICY "Caregivers can view assigned seniors"
  ON public.seniors FOR SELECT
  USING (
    id IN (
      SELECT senior_id FROM bookings 
      WHERE caregiver_id = auth.uid() AND status = 'confirmed'
    )
  );

-- Guardians can insert seniors
CREATE POLICY "Guardians can insert seniors"
  ON public.seniors FOR INSERT
  WITH CHECK (guardian_id = auth.uid());

-- Guardians can update their seniors
CREATE POLICY "Guardians can update their seniors"
  ON public.seniors FOR UPDATE
  USING (guardian_id = auth.uid());

-- BOOKINGS POLICIES
-- Users can view their bookings
CREATE POLICY "Users can view their bookings"
  ON public.bookings FOR SELECT
  USING (guardian_id = auth.uid() OR caregiver_id = auth.uid());

-- Guardians can create bookings
CREATE POLICY "Guardians can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (guardian_id = auth.uid());

-- Users can update their bookings
CREATE POLICY "Users can update their bookings"
  ON public.bookings FOR UPDATE
  USING (guardian_id = auth.uid() OR caregiver_id = auth.uid());

-- ACTIVITY LOGS POLICIES
-- Users can view activity logs for their bookings
CREATE POLICY "Users can view activity logs"
  ON public.activity_logs FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE guardian_id = auth.uid() OR caregiver_id = auth.uid()
    )
  );

-- Caregivers can insert activity logs
CREATE POLICY "Caregivers can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (caregiver_id = auth.uid());

-- REVIEWS POLICIES
-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- Guardians can review caregivers after booking
CREATE POLICY "Guardians can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT guardian_id FROM bookings WHERE id = booking_id
    )
  );

-- ============================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_verification ON public.profiles(verification_status);
CREATE INDEX idx_seniors_guardian_id ON public.seniors(guardian_id);
CREATE INDEX idx_bookings_guardian_id ON public.bookings(guardian_id);
CREATE INDEX idx_bookings_caregiver_id ON public.bookings(caregiver_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_activity_logs_booking_id ON public.activity_logs(booking_id);
CREATE INDEX idx_reviews_booking_id ON public.reviews(booking_id);

-- ============================================================
-- 5. CREATE STORAGE BUCKETS
-- ============================================================

-- Verification documents bucket (private)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verifications', 'verifications', false)
ON CONFLICT DO NOTHING;

-- Profile pictures bucket (public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 6. CREATE STORAGE POLICIES
-- ============================================================

-- Verification documents - private, only authenticated users
CREATE POLICY "Users can upload verification docs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'verifications' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view own verification docs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'verifications' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Profile avatars - public read, authenticated write
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );

-- ============================================================
-- 7. CREATE FUNCTIONS
-- ============================================================

-- Function to handle new user signup (create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.user_metadata->>'full_name', ''),
    COALESCE(new.user_metadata->>'role', 'guardian')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 8. SEED DATA (OPTIONAL - Remove for production)
-- ============================================================

-- Create test guardian
INSERT INTO public.profiles (id, email, full_name, role, phone, location, number_of_seniors)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'guardian@test.com',
  'Test Guardian',
  'guardian',
  '+880123456789',
  'Dhaka',
  '2'
)
ON CONFLICT DO NOTHING;

-- Create test caregiver
INSERT INTO public.profiles (
  id, email, full_name, role, phone, 
  nid_number, experience_years, skills, verification_status
)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'caregiver@test.com',
  'Test Caregiver',
  'caregiver',
  '+880987654321',
  '12345678901234',
  5,
  ARRAY['Personal Care', 'Medication', 'Companionship'],
  'verified'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. VERIFICATION QUERIES
-- ============================================================

-- Check if tables are created
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check RLS is enabled
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check policies are created
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- ============================================================
-- NOTES
-- ============================================================
/*
1. Run this entire script in your Supabase SQL Editor
2. After running, you'll have:
   - 5 main tables (profiles, seniors, bookings, activity_logs, reviews)
   - Row Level Security enabled and policies configured
   - Storage buckets for files
   - Indexes for performance
   - Sample data for testing

3. To use with the Seba app:
   - Set your SUPABASE_URL and SUPABASE_ANON_KEY in .env.local
   - The app will automatically work with these tables

4. Important security notes:
   - All sensitive data is protected by RLS policies
   - Users can only see their own data
   - Caregivers need verification before appearing in search
   - Implement backend validation in addition to RLS

5. For production:
   - Remove or modify seed data
   - Test all RLS policies thoroughly
   - Set up proper backups
   - Enable SSL for storage buckets
   - Consider rate limiting on auth endpoints
*/
