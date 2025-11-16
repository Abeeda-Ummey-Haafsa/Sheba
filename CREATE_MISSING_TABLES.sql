-- ============================================================================
-- Create Missing Tables for Sheba Platform
-- ============================================================================
-- Run this in Supabase SQL Editor to fix 404/406 errors
-- ============================================================================

-- Create profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('guardian', 'family', 'caregiver', 'senior', 'admin')),
    full_name TEXT,
    phone TEXT,
    location TEXT,
    skills JSONB,
    availability JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create senior_devices table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS senior_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id TEXT UNIQUE NOT NULL,
    senior_id UUID REFERENCES seniors(id) ON DELETE CASCADE,
    paired_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    device_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create senior_profiles table (alternative name used in some queries)
CREATE TABLE IF NOT EXISTS senior_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    age SMALLINT,
    gender TEXT,
    relation TEXT,
    area TEXT,
    sub_area TEXT,
    address_line TEXT,
    address TEXT,
    medical_conditions JSONB,
    medication_list TEXT,
    emergency_contacts JSONB,
    device_id TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_senior_devices_device_id ON senior_devices(device_id);
CREATE INDEX IF NOT EXISTS idx_senior_devices_senior_id ON senior_devices(senior_id);
CREATE INDEX IF NOT EXISTS idx_senior_profiles_family ON senior_profiles(family_id);
CREATE INDEX IF NOT EXISTS idx_senior_profiles_device ON senior_profiles(device_id);

-- Add comments
COMMENT ON TABLE profiles IS 'User profiles linked to auth.users';
COMMENT ON TABLE senior_devices IS 'Device pairing for senior tablets/phones';
COMMENT ON TABLE senior_profiles IS 'Senior citizen profiles managed by family members';

-- Verify tables exist
SELECT 
    table_name, 
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_name IN ('profiles', 'senior_devices', 'senior_profiles')
ORDER BY table_name;
