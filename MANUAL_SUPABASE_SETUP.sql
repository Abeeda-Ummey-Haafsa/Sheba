-- ============================================================================
-- সেবা PLATFORM - TEST DATA SETUP
-- ============================================================================
-- Creates sample users, caregivers, seniors, and bookings for testing
-- 
-- ⚠️ IMPORTANT: Run this AFTER executing DATABASE_SCHEMA.sql
-- 
-- Steps:
-- 1. Go to Supabase Dashboard → Your Project
-- 2. Click "SQL Editor" in left sidebar
-- 3. Click "New Query"
-- 4. Copy-paste this SQL
-- 5. Click "Run"
-- 
-- This creates test data aligned with the new database schema
-- ============================================================================

-- ============================================================================
-- 1. CREATE TEST USERS
-- ============================================================================

-- Family User 1: Overseas guardian in USA
INSERT INTO users (id, email, password_hash, role, full_name, phone, created_at) VALUES (
  'f1111111-1111-1111-1111-111111111111'::uuid,
  'guardian1@test.com',
  '$2a$10$rQ3qZ5Z5Z5Z5Z5Z5Z5Z5Z.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z',  -- 'password123'
  'family',
  'আহমেদ করিম (Ahmed Karim)',
  '+8801712345671',
  NOW()
) ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Family User 2: Guardian in UK
INSERT INTO users (id, email, password_hash, role, full_name, phone, created_at) VALUES (
  'f2222222-2222-2222-2222-222222222222'::uuid,
  'guardian2@test.com',
  '$2a$10$rQ3qZ5Z5Z5Z5Z5Z5Z5Z5Z.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z',
  'family',
  'ফারিয়া রহমান (Faria Rahman)',
  '+8801812345672',
  NOW()
) ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Caregiver User 1: Beginner
INSERT INTO users (id, email, password_hash, role, full_name, phone, avatar_url, created_at) VALUES (
  'c1111111-1111-1111-1111-111111111111'::uuid,
  'fatema.caregiver@test.com',
  '$2a$10$rQ3qZ5Z5Z5Z5Z5Z5Z5Z5Z.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z',
  'caregiver',
  'বেগম ফাতেমা আক্তার (Begum Fatema Akter)',
  '+8801712345681',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatema',
  NOW()
) ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Caregiver User 2: Experienced
INSERT INTO users (id, email, password_hash, role, full_name, phone, avatar_url, created_at) VALUES (
  'c2222222-2222-2222-2222-222222222222'::uuid,
  'nasrin.care@test.com',
  '$2a$10$rQ3qZ5Z5Z5Z5Z5Z5Z5Z5Z.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z',
  'caregiver',
  'নাসরিন আহমেদ খান (Nasrin Ahmed Khan)',
  '+8801812345682',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Nasrin',
  NOW()
) ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Caregiver User 3: Specialist
INSERT INTO users (id, email, password_hash, role, full_name, phone, avatar_url, created_at) VALUES (
  'c3333333-3333-3333-3333-333333333333'::uuid,
  'rina.das@test.com',
  '$2a$10$rQ3qZ5Z5Z5Z5Z5Z5Z5Z5Z.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z',
  'caregiver',
  'রিনা দাস শর্মা (Rina Das Sharma)',
  '+8801912345683',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina',
  NOW()
) ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Admin User
INSERT INTO users (id, email, password_hash, role, full_name, phone, created_at) VALUES (
  'a1111111-1111-1111-1111-111111111111'::uuid,
  'admin@seba.com',
  '$2a$10$rQ3qZ5Z5Z5Z5Z5Z5Z5Z5Z.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z',
  'admin',
  'System Administrator',
  '+8801912345690',
  NOW()
) ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- ============================================================================
-- 2. CREATE TEST CAREGIVERS
-- ============================================================================

-- Caregiver 1: Begum Fatema Akter (Beginner, Dhaka)
INSERT INTO caregivers (
  id, user_id, age, gender, skills, rating, hourly_rate, 
  location, verified_at, bio, created_at
) VALUES (
  'cg111111-1111-1111-1111-111111111111'::uuid,
  'c1111111-1111-1111-1111-111111111111'::uuid,
  28,
  'মহিলা',
  '["Personal Care", "Companionship", "Meal Preparation"]'::jsonb,
  4.50,
  250,
  ST_SetSRID(ST_MakePoint(90.4125, 23.8103), 4326)::geography,  -- Dhaka
  NOW() - INTERVAL '30 days',
  'অভিজ্ঞ পরিচর্যাকারী। বয়স্কদের যত্ন নিতে পছন্দ করি। ১ বছরের অভিজ্ঞতা।',
  NOW()
) ON CONFLICT (id) DO UPDATE SET user_id = EXCLUDED.user_id;

-- Caregiver 2: Nasrin Ahmed Khan (Experienced, Chittagong)
INSERT INTO caregivers (
  id, user_id, age, gender, skills, rating, hourly_rate,
  location, verified_at, bio, created_at
) VALUES (
  'cg222222-2222-2222-2222-222222222222'::uuid,
  'c2222222-2222-2222-2222-222222222222'::uuid,
  35,
  'মহিলা',
  '["Nursing", "Physiotherapy", "Medication Management", "Diabetes Care"]'::jsonb,
  4.85,
  450,
  ST_SetSRID(ST_MakePoint(91.8315, 22.3569), 4326)::geography,  -- Chittagong
  NOW() - INTERVAL '60 days',
  'প্রশিক্ষিত নার্স। ৫ বছরের অভিজ্ঞতা। ডায়াবেটিস এবং হৃদরোগের রোগীদের যত্নে বিশেষজ্ঞ।',
  NOW()
) ON CONFLICT (id) DO UPDATE SET user_id = EXCLUDED.user_id;

-- Caregiver 3: Rina Das Sharma (Specialist, Khulna)
INSERT INTO caregivers (
  id, user_id, age, gender, skills, rating, hourly_rate,
  location, verified_at, bio, created_at
) VALUES (
  'cg333333-3333-3333-3333-333333333333'::uuid,
  'c3333333-3333-3333-3333-333333333333'::uuid,
  42,
  'মহিলা',
  '["Palliative Care", "Rehabilitation", "Nursing", "Physiotherapy", "Wound Care"]'::jsonb,
  4.95,
  600,
  ST_SetSRID(ST_MakePoint(89.5403, 22.8456), 4326)::geography,  -- Khulna
  NOW() - INTERVAL '90 days',
  'সিনিয়র কেয়ার স্পেশালিস্ট। ৮+ বছরের অভিজ্ঞতা। প্যালিয়েটিভ কেয়ার এবং পুনর্বাসনে দক্ষ।',
  NOW()
) ON CONFLICT (id) DO UPDATE SET user_id = EXCLUDED.user_id;

-- ============================================================================
-- 3. CREATE TEST SENIORS
-- ============================================================================

-- Senior 1: Registered by Guardian 1
INSERT INTO seniors (
  id, family_user_id, name, age, gender, address, location,
  medical_conditions, medication_list, emergency_contacts, created_at
) VALUES (
  's1111111-1111-1111-1111-111111111111'::uuid,
  'f1111111-1111-1111-1111-111111111111'::uuid,
  'আবদুল করিম (Abdul Karim)',
  75,
  'পুরুষ',
  '১২/এ, ধানমন্ডি, ঢাকা-১২০৯',
  ST_SetSRID(ST_MakePoint(90.3753, 23.7465), 4326)::geography,  -- Dhanmondi, Dhaka
  '["ডায়াবেটিস", "উচ্চ রক্তচাপ", "আর্থ্রাইটিস"]'::jsonb,
  'মেটফরমিন ৫০০mg (দিনে ২ বার), এমলোডিপিন ৫mg (দিনে ১ বার)',
  '[{"name": "ডা. রহমান", "relation": "পারিবারিক চিকিৎসক", "phone": "+8801711111111"}]'::jsonb,
  NOW()
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Senior 2: Registered by Guardian 1
INSERT INTO seniors (
  id, family_user_id, name, age, gender, address, location,
  medical_conditions, medication_list, emergency_contacts, created_at
) VALUES (
  's2222222-2222-2222-2222-222222222222'::uuid,
  'f1111111-1111-1111-1111-111111111111'::uuid,
  'রাবেয়া খাতুন (Rabeya Khatun)',
  72,
  'মহিলা',
  '৪৫, গুলশান-২, ঢাকা-১২১২',
  ST_SetSRID(ST_MakePoint(90.4152, 23.7925), 4326)::geography,  -- Gulshan, Dhaka
  '["হাঁপানি", "অস্টিওপরোসিস"]'::jsonb,
  'সালবিউটামল ইনহেলার (প্রয়োজন অনুযায়ী), ক্যালসিয়াম ট্যাবলেট (দিনে ১ বার)',
  '[{"name": "নার্স সুমি", "relation": "হোম নার্স", "phone": "+8801722222222"}]'::jsonb,
  NOW()
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Senior 3: Registered by Guardian 2
INSERT INTO seniors (
  id, family_user_id, name, age, gender, address, location,
  medical_conditions, medication_list, emergency_contacts, created_at
) VALUES (
  's3333333-3333-3333-3333-333333333333'::uuid,
  'f2222222-2222-2222-2222-222222222222'::uuid,
  'মোহাম্মদ আলী (Mohammad Ali)',
  80,
  'পুরুষ',
  '২৩, আগ্রাবাদ, চট্টগ্রাম-৪১০০',
  ST_SetSRID(ST_MakePoint(91.8075, 22.3384), 4326)::geography,  -- Agrabad, Chittagong
  '["হৃদরোগ", "ডায়াবেটিস", "দুর্বল দৃষ্টি"]'::jsonb,
  'এসপিরিন ৭৫mg, মেটফরমিন ৮৫০mg, এটোরভাস্ট্যাটিন ২০mg (সব দিনে ১ বার)',
  '[{"name": "ডা. চৌধুরী", "relation": "হৃদরোগ বিশেষজ্ঞ", "phone": "+8801833333333"}]'::jsonb,
  NOW()
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- ============================================================================
-- 4. CREATE TEST BOOKINGS
-- ============================================================================

-- Booking 1: Today - Confirmed (Fatema → Abdul Karim)
INSERT INTO bookings (
  id, senior_id, caregiver_id, booking_date, start_time, 
  duration_hrs, status, hourly_rate, notes, created_at
) VALUES (
  'b1111111-1111-1111-1111-111111111111'::uuid,
  's1111111-1111-1111-1111-111111111111'::uuid,
  'cg111111-1111-1111-1111-111111111111'::uuid,
  CURRENT_DATE,
  '10:00:00',
  4,
  'confirmed',
  250,
  'দয়া করে ওষুধ দেওয়ার সময় লক্ষ্য রাখবেন। দুপুরের খাবার হালকা হতে হবে।',
  NOW() - INTERVAL '2 days'
) ON CONFLICT (id) DO NOTHING;

-- Booking 2: Yesterday - Completed (Nasrin → Mohammad Ali)
INSERT INTO bookings (
  id, senior_id, caregiver_id, booking_date, start_time,
  duration_hrs, status, hourly_rate, notes, created_at
) VALUES (
  'b2222222-2222-2222-2222-222222222222'::uuid,
  's3333333-3333-3333-3333-333333333333'::uuid,
  'cg222222-2222-2222-2222-222222222222'::uuid,
  CURRENT_DATE - INTERVAL '1 day',
  '14:00:00',
  5,
  'completed',
  450,
  'ফিজিওথেরাপি সেশন প্রয়োজন। হাঁটার অনুশীলন করাবেন।',
  NOW() - INTERVAL '3 days'
) ON CONFLICT (id) DO NOTHING;

-- Booking 3: Tomorrow - Pending (Rina → Rabeya Khatun)
INSERT INTO bookings (
  id, senior_id, caregiver_id, booking_date, start_time,
  duration_hrs, status, hourly_rate, notes, created_at
) VALUES (
  'b3333333-3333-3333-3333-333333333333'::uuid,
  's2222222-2222-2222-2222-222222222222'::uuid,
  'cg333333-3333-3333-3333-333333333333'::uuid,
  CURRENT_DATE + INTERVAL '1 day',
  '09:00:00',
  6,
  'pending',
  600,
  'রেসপিরেটরি কেয়ার প্রয়োজন। ইনহেলার ব্যবহার করাতে হবে।',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Booking 4: Last week - Completed (Fatema → Rabeya Khatun)
INSERT INTO bookings (
  id, senior_id, caregiver_id, booking_date, start_time,
  duration_hrs, status, hourly_rate, notes, created_at
) VALUES (
  'b4444444-4444-4444-4444-444444444444'::uuid,
  's2222222-2222-2222-2222-222222222222'::uuid,
  'cg111111-1111-1111-1111-111111111111'::uuid,
  CURRENT_DATE - INTERVAL '7 days',
  '11:00:00',
  3,
  'completed',
  250,
  'সাধারণ যত্ন এবং সঙ্গ প্রদান।',
  NOW() - INTERVAL '10 days'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. CREATE TEST ACTIVITY LOGS
-- ============================================================================

-- Activity Log 1: For completed booking 2
INSERT INTO activity_logs (
  id, booking_id, check_in_time, check_out_time, check_in_location,
  services_provided, notes, family_rating, created_at
) VALUES (
  'al111111-1111-1111-1111-111111111111'::uuid,
  'b2222222-2222-2222-2222-222222222222'::uuid,
  (CURRENT_DATE - INTERVAL '1 day') + TIME '14:05:00',
  (CURRENT_DATE - INTERVAL '1 day') + TIME '19:10:00',
  ST_SetSRID(ST_MakePoint(91.8075, 22.3384), 4326)::geography,
  '["Physiotherapy Session", "Medication Management", "Vital Signs Monitoring", "Mobility Exercises"]'::jsonb,
  'সিনিয়রের অবস্থা ভালো। রক্তচাপ ১৩০/৮৫। ফিজিওথেরাপি সেশন সফল। হাঁটার ক্ষমতা উন্নত হয়েছে। সব ওষুধ সময়মতো দেওয়া হয়েছে।',
  5,
  NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;

-- Activity Log 2: For completed booking 4
INSERT INTO activity_logs (
  id, booking_id, check_in_time, check_out_time, check_in_location,
  services_provided, notes, family_rating, created_at
) VALUES (
  'al222222-2222-2222-2222-222222222222'::uuid,
  'b4444444-4444-4444-4444-444444444444'::uuid,
  (CURRENT_DATE - INTERVAL '7 days') + TIME '11:02:00',
  (CURRENT_DATE - INTERVAL '7 days') + TIME '14:08:00',
  ST_SetSRID(ST_MakePoint(90.4152, 23.7925), 4326)::geography,
  '["Personal Care", "Meal Preparation", "Companionship"]'::jsonb,
  'সিনিয়রের সাথে সময় কাটিয়েছি। হালকা খাবার তৈরি করেছি। গল্প করেছি। মানসিক অবস্থা ভালো।',
  4,
  NOW() - INTERVAL '7 days'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. CREATE TEST EMERGENCY ALERTS
-- ============================================================================

-- Resolved medical alert
INSERT INTO emergency_alerts (
  id, senior_id, alert_type, timestamp, resolved_at, notes, responder_id
) VALUES (
  'ea111111-1111-1111-1111-111111111111'::uuid,
  's1111111-1111-1111-1111-111111111111'::uuid,
  'medical',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days' + INTERVAL '30 minutes',
  'রক্তে শর্করার মাত্রা কমে গিয়েছিল। গ্লুকোজ দেওয়া হয়েছে। ডাক্তারের সাথে যোগাযোগ করা হয়েছে।',
  'cg111111-1111-1111-1111-111111111111'::uuid
) ON CONFLICT (id) DO NOTHING;

-- Unresolved general alert
INSERT INTO emergency_alerts (
  id, senior_id, alert_type, timestamp, notes
) VALUES (
  'ea222222-2222-2222-2222-222222222222'::uuid,
  's3333333-3333-3333-3333-333333333333'::uuid,
  'general',
  NOW() - INTERVAL '2 hours',
  'সিনিয়র ফোনে সাড়া দিচ্ছেন না। পরিবারকে জানানো হয়েছে।'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 7. VERIFICATION QUERIES
-- ============================================================================

-- Check users created
SELECT 
  '--- USERS CREATED ---' as section,
  role,
  COUNT(*) as count
FROM users
GROUP BY role
ORDER BY role;

-- Check caregivers with ratings
SELECT 
  '--- CAREGIVERS ---' as section,
  u.full_name,
  c.rating,
  c.hourly_rate,
  c.verified_at IS NOT NULL as verified
FROM caregivers c
JOIN users u ON c.user_id = u.id
ORDER BY c.rating DESC;

-- Check seniors by family
SELECT 
  '--- SENIORS ---' as section,
  u.full_name as family_member,
  s.name as senior_name,
  s.age,
  jsonb_array_length(s.medical_conditions) as condition_count
FROM seniors s
JOIN users u ON s.family_user_id = u.id
ORDER BY u.full_name;

-- Check bookings summary
SELECT 
  '--- BOOKINGS SUMMARY ---' as section,
  status,
  COUNT(*) as count,
  SUM(total_amount) as total_revenue
FROM bookings
GROUP BY status
ORDER BY status;

-- Check activity logs with ratings
SELECT 
  '--- ACTIVITY LOGS ---' as section,
  al.id,
  b.booking_date,
  al.family_rating,
  LEFT(al.notes, 50) || '...' as notes_preview
FROM activity_logs al
JOIN bookings b ON al.booking_id = b.id
ORDER BY al.created_at DESC;

-- Check emergency alerts
SELECT 
  '--- EMERGENCY ALERTS ---' as section,
  alert_type,
  CASE WHEN resolved_at IS NULL THEN 'Active' ELSE 'Resolved' END as status,
  COUNT(*) as count
FROM emergency_alerts
GROUP BY alert_type, resolved_at IS NULL
ORDER BY alert_type;

-- ============================================================================
-- END OF TEST DATA SETUP
-- ============================================================================

/*
SUMMARY OF TEST DATA CREATED:
✅ 5 Users (2 family, 3 caregivers, 1 admin)
✅ 3 Caregivers (with different experience levels and locations)
✅ 3 Seniors (with medical conditions and emergency contacts)
✅ 4 Bookings (pending, confirmed, completed statuses)
✅ 2 Activity Logs (with ratings and detailed notes in Bengali)
✅ 2 Emergency Alerts (one resolved, one active)

TEST ACCOUNTS:
Family:    guardian1@test.com / password123
           guardian2@test.com / password123
Caregivers: fatema.caregiver@test.com / password123
           nasrin.care@test.com / password123
           rina.das@test.com / password123
Admin:     admin@seba.com / password123

LOCATIONS:
- Dhaka (Dhanmondi, Gulshan)
- Chittagong (Agrabad)
- Khulna

All passwords are hashed with bcrypt (actual hash: test only)
For production, create real accounts via Supabase Auth API
*/
