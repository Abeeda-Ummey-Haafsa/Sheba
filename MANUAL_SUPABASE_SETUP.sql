/**
 * MANUAL SETUP: Create Mock Caregiver Accounts in Supabase
 * 
 * ⚠️ IMPORTANT: This SQL should be run directly in Supabase SQL Editor
 * 
 * Steps:
 * 1. Go to Supabase Dashboard → Your Project
 * 2. Click "SQL Editor" in left sidebar
 * 3. Click "New Query"
 * 4. Copy-paste the SQL below
 * 5. Click "Run"
 * 
 * This will create test caregiver accounts with email verification pre-confirmed
 */

-- ============================================================================
-- CREATE MOCK CAREGIVER ACCOUNTS FOR TESTING
-- ============================================================================
-- Note: These accounts need to be created via Supabase Auth API, not SQL directly
-- However, you can manually create them in Supabase Dashboard or use the script below

-- ============================================================================
-- OPTION A: Create Profiles in Database (After Accounts Created)
-- ============================================================================

-- Profile 1: Begum Fatema Akter (Beginner)
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
  availability,
  verification_status,
  created_at
) VALUES (
  'caregiver_001_test',
  'fatema.caregiver@test.com',
  'Begum Fatema Akter',
  'caregiver',
  '+880171234567',
  'Dhaka',
  '12345678901234',
  1,
  '["Personal Care", "Companionship"]',
  '{"status": "available", "hours": "8:00 AM - 8:00 PM", "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}',
  'verified',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email;

-- Profile 2: Nasrin Ahmed Khan (Experienced)
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
  availability,
  verification_status,
  created_at
) VALUES (
  'caregiver_002_test',
  'nasrin.care@test.com',
  'Nasrin Ahmed Khan',
  'caregiver',
  '+880181234567',
  'Chittagong',
  '98765432109876',
  5,
  '["Nursing", "Physiotherapy", "Medication"]',
  '{"status": "available", "hours": "8:00 AM - 8:00 PM", "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}',
  'verified',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email;

-- Profile 3: Rina Das Sharma (Specialist)
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
  availability,
  verification_status,
  created_at
) VALUES (
  'caregiver_003_test',
  'rina.das@test.com',
  'Rina Das Sharma',
  'caregiver',
  '+880191234567',
  'Khulna',
  '55555555555555',
  8,
  '["Palliative", "Rehabilitation", "Nursing", "Physiotherapy"]',
  '{"status": "available", "hours": "8:00 AM - 8:00 PM", "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}',
  'verified',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email;

-- ============================================================================
-- CREATE TEST BOOKINGS
-- ============================================================================

-- Booking 1: Active (Today, checked in)
INSERT INTO public.bookings (
  id,
  caregiver_id,
  senior_id,
  booking_date,
  start_time,
  end_time,
  status,
  payment_amount,
  services,
  created_at
) VALUES (
  'booking_001_test',
  'caregiver_001_test',
  'senior_001_test',
  CURRENT_DATE,
  '10:00:00',
  '14:00:00',
  'confirmed',
  800,
  '["Personal Care", "Medication", "Companionship"]',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Booking 2: Completed (Today, with activity log)
INSERT INTO public.bookings (
  id,
  caregiver_id,
  senior_id,
  booking_date,
  start_time,
  end_time,
  status,
  payment_amount,
  services,
  created_at
) VALUES (
  'booking_002_test',
  'caregiver_001_test',
  'senior_002_test',
  CURRENT_DATE,
  '14:00:00',
  '18:00:00',
  'completed',
  800,
  '["Personal Care", "Hygiene Support"]',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- CREATE TEST CHECK-INS
-- ============================================================================

INSERT INTO public.checkins (
  id,
  booking_id,
  caregiver_id,
  latitude,
  longitude,
  accuracy,
  checkin_time,
  distance_from_location,
  status,
  created_at
) VALUES (
  'checkin_001_test',
  'booking_001_test',
  'caregiver_001_test',
  23.81456,
  90.36685,
  15,
  NOW() - INTERVAL '3 hours',
  8,
  'verified',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- CREATE TEST ACTIVITY LOGS
-- ============================================================================

INSERT INTO public.activity_logs (
  id,
  booking_id,
  caregiver_id,
  senior_id,
  services_completed,
  senior_condition,
  notes,
  photos_count,
  created_at
) VALUES (
  'activity_001_test',
  'booking_002_test',
  'caregiver_001_test',
  'senior_002_test',
  '["Personal Care", "Hygiene Support", "Meal Preparation"]',
  'good',
  'সিনিয়র সুস্থ ছিলেন। দুপুরের খাবার দিয়েছি। গোসল করিয়েছি। নিয়মিত ওষুধ দিয়েছি।',
  2,
  NOW() - INTERVAL '1 hour'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- CREATE TEST EARNINGS
-- ============================================================================

INSERT INTO public.earnings (
  id,
  caregiver_id,
  booking_id,
  amount,
  status,
  created_at
) VALUES
  ('earn_001_test', 'caregiver_001_test', 'booking_001_test', 800, 'pending', NOW() - INTERVAL '2 hours'),
  ('earn_002_test', 'caregiver_001_test', 'booking_002_test', 800, 'completed', NOW() - INTERVAL '1 hour');

-- ============================================================================
-- VERIFY INSERTS
-- ============================================================================

-- Check profiles created
SELECT 'Profiles Created:' as status;
SELECT email, full_name, role, experience_years FROM public.profiles WHERE email LIKE '%.caregiver@test.com' OR email LIKE '%.care@test.com' OR email LIKE '%.das@test.com';

-- Check bookings created
SELECT 'Bookings Created:' as status;
SELECT id, status, payment_amount, services FROM public.bookings WHERE id LIKE 'booking_%_test';

-- Check earnings
SELECT 'Earnings Created:' as status;
SELECT caregiver_id, amount, status FROM public.earnings WHERE id LIKE 'earn_%_test';

-- ============================================================================
-- END OF SETUP SCRIPT
-- ============================================================================
