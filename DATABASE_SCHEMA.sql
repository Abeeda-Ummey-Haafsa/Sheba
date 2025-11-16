-- ============================================================================
-- PROJECT SEBA - Complete Database Schema
-- ============================================================================
-- AI-powered platform for senior citizens in Bangladesh
-- Created: November 15, 2025
-- 
-- This schema includes:
--   • UUID primary keys with auto-generation
--   • Foreign key constraints with CASCADE behavior
--   • JSONB columns for flexible data storage
--   • PostGIS for location-based queries
--   • ENUMs for type safety
--   • Comprehensive indexes for performance
--   • Detailed column comments for documentation
-- ============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- User roles in the system
CREATE TYPE user_role AS ENUM (
    'family',     -- Family member/guardian living abroad
    'caregiver',  -- Professional caregiver
    'admin',      -- System administrator
    'senior'      -- Senior citizen (for future direct login)
);

-- Booking lifecycle states
CREATE TYPE booking_status AS ENUM (
    'pending',      -- Awaiting caregiver confirmation
    'confirmed',    -- Caregiver confirmed, scheduled
    'in_progress',  -- Service currently being provided
    'completed',    -- Service finished successfully
    'cancelled'     -- Booking was cancelled
);

-- Emergency alert categories
CREATE TYPE alert_type AS ENUM (
    'medical',      -- Medical emergency
    'fall',         -- Fall detection
    'general'       -- Other emergencies
);

-- ============================================================================
-- TABLE: users
-- ============================================================================
-- Central user authentication table for all user types
-- Supports family members, caregivers, admins, and seniors
-- ============================================================================

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         TEXT UNIQUE NOT NULL 
                  CONSTRAINT valid_email CHECK (email ~* '^.+@.+\..+$'),
    password_hash TEXT NOT NULL,
    role          user_role NOT NULL,
    full_name     TEXT NOT NULL,
    phone         TEXT 
                  CONSTRAINT valid_bd_phone CHECK (phone ~ '^(\+880|0)1[3-9]\d{8}$'),
    avatar_url    TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for filtering by user role
CREATE INDEX idx_users_role ON users(role);

-- Index for email lookups during authentication
CREATE INDEX idx_users_email ON users(email);

COMMENT ON TABLE users IS 'Central authentication table for all system users';
COMMENT ON COLUMN users.id IS 'Unique identifier for the user';
COMMENT ON COLUMN users.email IS 'User email address (unique, validated format)';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN users.role IS 'User role: family, caregiver, admin, or senior';
COMMENT ON COLUMN users.full_name IS 'Full name of the user';
COMMENT ON COLUMN users.phone IS 'Bangladesh phone number format: +880 or 0, followed by 1[3-9] and 8 digits';
COMMENT ON COLUMN users.avatar_url IS 'URL to user profile picture';
COMMENT ON COLUMN users.created_at IS 'Timestamp when user account was created';
COMMENT ON COLUMN users.updated_at IS 'Timestamp of last profile update';

-- ============================================================================
-- TABLE: seniors
-- ============================================================================
-- Senior citizens registered by family members
-- Includes medical info, location, and emergency contacts
-- ============================================================================

CREATE TABLE seniors (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_user_id    UUID NOT NULL 
                      REFERENCES users(id) ON DELETE CASCADE,
    name              TEXT NOT NULL,
    age               SMALLINT 
                      CONSTRAINT valid_senior_age CHECK (age BETWEEN 60 AND 120),
    gender            TEXT 
                      CONSTRAINT valid_gender CHECK (gender IN ('পুরুষ', 'মহিলা', 'অন্যান্য')),
    area              TEXT,
    sub_area          TEXT,
    address_line      TEXT,
    address           TEXT NOT NULL,
    location          GEOGRAPHY(Point, 4326),
    medical_conditions JSONB,
    medication_list   TEXT,
    emergency_contacts JSONB,
    created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Spatial index for location-based caregiver matching
CREATE INDEX idx_seniors_location ON seniors USING GIST(location);

-- Index for finding all seniors registered by a family member
CREATE INDEX idx_seniors_family ON seniors(family_user_id);

COMMENT ON TABLE seniors IS 'Senior citizens being cared for through the platform';
COMMENT ON COLUMN seniors.id IS 'Unique identifier for the senior';
COMMENT ON COLUMN seniors.family_user_id IS 'Reference to the family member who registered this senior';
COMMENT ON COLUMN seniors.name IS 'Full name of the senior citizen';
COMMENT ON COLUMN seniors.age IS 'Age of the senior (60-120 years)';
COMMENT ON COLUMN seniors.gender IS 'Gender in Bengali: পুরুষ (male), মহিলা (female), অন্যান্য (other)';
COMMENT ON COLUMN seniors.address IS 'Full residential address in Bangladesh';
COMMENT ON COLUMN seniors.location IS 'Geographic coordinates (latitude, longitude) for proximity matching';
COMMENT ON COLUMN seniors.medical_conditions IS 'Array of medical conditions in Bengali, e.g. ["ডায়াবেটিস", "উচ্চ রক্তচাপ"]';
COMMENT ON COLUMN seniors.medication_list IS 'Current medications and dosage information';
COMMENT ON COLUMN seniors.emergency_contacts IS 'Array of emergency contacts: [{name, relation, phone}]';
COMMENT ON COLUMN seniors.created_at IS 'Timestamp when senior was registered';

-- ============================================================================
-- TABLE: caregivers
-- ============================================================================
-- Professional caregivers offering services
-- Includes skills, ratings, location, and verification status
-- ============================================================================

CREATE TABLE caregivers (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID UNIQUE NOT NULL 
                  REFERENCES users(id) ON DELETE CASCADE,
    age           SMALLINT 
                  CONSTRAINT valid_caregiver_age CHECK (age BETWEEN 20 AND 70),
    gender        TEXT 
                  CONSTRAINT valid_caregiver_gender CHECK (gender IN ('পুরুষ', 'মহিলা', 'অন্যান্য')),
    skills        JSONB NOT NULL,
    rating        NUMERIC(3,2) DEFAULT 0.00 
                  CONSTRAINT valid_rating CHECK (rating BETWEEN 0 AND 5),
    hourly_rate   INTEGER 
                  CONSTRAINT valid_rate CHECK (hourly_rate BETWEEN 100 AND 1000),
    location      GEOGRAPHY(Point, 4326),
    verified_at   TIMESTAMPTZ,
    bio           TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Spatial index for location-based caregiver search
CREATE INDEX idx_caregivers_location ON caregivers USING GIST(location);

-- GIN index for efficient skill-based filtering
CREATE INDEX idx_caregivers_skills ON caregivers USING GIN(skills);

-- Index for verified caregivers
CREATE INDEX idx_caregivers_verified ON caregivers(verified_at) WHERE verified_at IS NOT NULL;

-- Index for top-rated caregivers
CREATE INDEX idx_caregivers_rating ON caregivers(rating DESC);

COMMENT ON TABLE caregivers IS 'Professional caregivers registered on the platform';
COMMENT ON COLUMN caregivers.id IS 'Unique identifier for the caregiver';
COMMENT ON COLUMN caregivers.user_id IS 'Reference to the user account (one-to-one relationship)';
COMMENT ON COLUMN caregivers.age IS 'Age of the caregiver (20-70 years)';
COMMENT ON COLUMN caregivers.gender IS 'Gender in Bengali: পুরুষ (male), মহিলা (female), অন্যান্য (other)';
COMMENT ON COLUMN caregivers.skills IS 'Array of skills, e.g. ["Meal Prep", "Diabetes Care", "Physical Therapy"]';
COMMENT ON COLUMN caregivers.rating IS 'Average rating from 0.00 to 5.00 based on family feedback';
COMMENT ON COLUMN caregivers.hourly_rate IS 'Hourly rate in BDT (100-1000 taka)';
COMMENT ON COLUMN caregivers.location IS 'Geographic coordinates for proximity-based matching';
COMMENT ON COLUMN caregivers.verified_at IS 'Timestamp when caregiver was verified (NULL if not verified)';
COMMENT ON COLUMN caregivers.bio IS 'Professional biography and background information';
COMMENT ON COLUMN caregivers.created_at IS 'Timestamp when caregiver profile was created';

-- ============================================================================
-- TABLE: bookings
-- ============================================================================
-- Service bookings between seniors and caregivers
-- Includes scheduling, pricing, and status tracking
-- ============================================================================

CREATE TABLE bookings (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    senior_id     UUID NOT NULL 
                  REFERENCES seniors(id) ON DELETE CASCADE,
    caregiver_id  UUID NOT NULL 
                  REFERENCES caregivers(id) ON DELETE CASCADE,
    booking_date  DATE NOT NULL,
    start_time    TIME NOT NULL,
    duration_hrs  SMALLINT NOT NULL 
                  CONSTRAINT valid_duration CHECK (duration_hrs BETWEEN 1 AND 8),
    status        booking_status DEFAULT 'pending' NOT NULL,
    hourly_rate   INTEGER NOT NULL,
    total_amount  INTEGER NOT NULL,
    notes         TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for date-based queries (upcoming bookings, calendar view)
CREATE INDEX idx_bookings_date ON bookings(booking_date);

-- Index for filtering by booking status
CREATE INDEX idx_bookings_status ON bookings(status);

-- Index for caregiver's booking history and availability
CREATE INDEX idx_bookings_caregiver ON bookings(caregiver_id);

-- Index for senior's booking history
CREATE INDEX idx_bookings_senior ON bookings(senior_id);

-- Composite index for caregiver availability checking
CREATE INDEX idx_bookings_caregiver_date ON bookings(caregiver_id, booking_date, status);

COMMENT ON TABLE bookings IS 'Service bookings connecting seniors with caregivers';
COMMENT ON COLUMN bookings.id IS 'Unique identifier for the booking';
COMMENT ON COLUMN bookings.senior_id IS 'Reference to the senior receiving care';
COMMENT ON COLUMN bookings.caregiver_id IS 'Reference to the caregiver providing service';
COMMENT ON COLUMN bookings.booking_date IS 'Date of the scheduled service';
COMMENT ON COLUMN bookings.start_time IS 'Start time of the service';
COMMENT ON COLUMN bookings.duration_hrs IS 'Duration in hours (1-8 hours)';
COMMENT ON COLUMN bookings.status IS 'Current status: pending, confirmed, in_progress, completed, cancelled';
COMMENT ON COLUMN bookings.hourly_rate IS 'Caregiver hourly rate at time of booking (BDT)';
COMMENT ON COLUMN bookings.total_amount IS 'Total cost including 15% platform fee (BDT)';
COMMENT ON COLUMN bookings.notes IS 'Special instructions or requirements from family';
COMMENT ON COLUMN bookings.created_at IS 'Timestamp when booking was created';
COMMENT ON COLUMN bookings.updated_at IS 'Timestamp of last booking update';

-- ============================================================================
-- TABLE: activity_logs
-- ============================================================================
-- Detailed logs of completed care sessions
-- Includes check-in/out, services provided, and family ratings
-- ============================================================================

CREATE TABLE activity_logs (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id        UUID NOT NULL 
                      REFERENCES bookings(id) ON DELETE CASCADE,
    check_in_time     TIMESTAMPTZ,
    check_out_time    TIMESTAMPTZ,
    check_in_location GEOGRAPHY(Point, 4326),
    services_provided JSONB,
    notes             TEXT,
    family_rating     SMALLINT 
                      CONSTRAINT valid_family_rating CHECK (family_rating BETWEEN 1 AND 5),
    created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for finding activity logs by booking
CREATE INDEX idx_activity_booking ON activity_logs(booking_id);

-- Index for check-in time queries
CREATE INDEX idx_activity_checkin ON activity_logs(check_in_time);

-- Ensure one activity log per booking
CREATE UNIQUE INDEX idx_activity_unique_booking ON activity_logs(booking_id);

COMMENT ON TABLE activity_logs IS 'Detailed logs of completed care sessions';
COMMENT ON COLUMN activity_logs.id IS 'Unique identifier for the activity log';
COMMENT ON COLUMN activity_logs.booking_id IS 'Reference to the associated booking';
COMMENT ON COLUMN activity_logs.check_in_time IS 'Timestamp when caregiver checked in';
COMMENT ON COLUMN activity_logs.check_out_time IS 'Timestamp when caregiver checked out';
COMMENT ON COLUMN activity_logs.check_in_location IS 'GPS coordinates at check-in for verification';
COMMENT ON COLUMN activity_logs.services_provided IS 'Array of services performed, e.g. ["Meal preparation", "Medication assistance"]';
COMMENT ON COLUMN activity_logs.notes IS 'Caregiver notes about the session and senior well-being';
COMMENT ON COLUMN activity_logs.family_rating IS 'Family satisfaction rating (1-5 stars)';
COMMENT ON COLUMN activity_logs.created_at IS 'Timestamp when log was created';

-- ============================================================================
-- TABLE: emergency_alerts
-- ============================================================================
-- Emergency alerts triggered by seniors or system
-- Tracks medical emergencies, falls, and other critical events
-- ============================================================================

CREATE TABLE emergency_alerts (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    senior_id     UUID NOT NULL 
                  REFERENCES seniors(id) ON DELETE CASCADE,
    alert_type    alert_type NOT NULL,
    timestamp     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    resolved_at   TIMESTAMPTZ,
    notes         TEXT,
    responder_id  UUID 
                  REFERENCES caregivers(id) ON DELETE SET NULL
);

-- Index for finding all alerts for a senior
CREATE INDEX idx_emergency_senior ON emergency_alerts(senior_id);

-- Index for finding unresolved alerts
CREATE INDEX idx_emergency_resolved ON emergency_alerts(resolved_at) WHERE resolved_at IS NULL;

-- Index for recent alerts
CREATE INDEX idx_emergency_timestamp ON emergency_alerts(timestamp DESC);

COMMENT ON TABLE emergency_alerts IS 'Emergency alerts and incident tracking';
COMMENT ON COLUMN emergency_alerts.id IS 'Unique identifier for the alert';
COMMENT ON COLUMN emergency_alerts.senior_id IS 'Reference to the senior who triggered the alert';
COMMENT ON COLUMN emergency_alerts.alert_type IS 'Type of emergency: medical, fall, or general';
COMMENT ON COLUMN emergency_alerts.timestamp IS 'When the alert was triggered';
COMMENT ON COLUMN emergency_alerts.resolved_at IS 'When the alert was resolved (NULL if still active)';
COMMENT ON COLUMN emergency_alerts.notes IS 'Details about the emergency and response';
COMMENT ON COLUMN emergency_alerts.responder_id IS 'Caregiver who responded to the alert';

-- ============================================================================
-- TABLE: training_courses
-- ============================================================================
-- Training curriculum for caregivers
-- Supports bilingual content (English and Bengali)
-- ============================================================================

CREATE TABLE training_courses (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en    TEXT NOT NULL,
    title_bn    TEXT NOT NULL,
    modules     JSONB NOT NULL,
    duration_min INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE training_courses IS 'Training courses for caregiver professional development';
COMMENT ON COLUMN training_courses.id IS 'Unique identifier for the course';
COMMENT ON COLUMN training_courses.title_en IS 'Course title in English';
COMMENT ON COLUMN training_courses.title_bn IS 'Course title in Bengali';
COMMENT ON COLUMN training_courses.modules IS 'Array of course modules with lessons and content';
COMMENT ON COLUMN training_courses.duration_min IS 'Total course duration in minutes';
COMMENT ON COLUMN training_courses.created_at IS 'Timestamp when course was created';

-- ============================================================================
-- TABLE: caregiver_progress
-- ============================================================================
-- Tracks caregiver progress through training courses
-- Many-to-many relationship between caregivers and courses
-- ============================================================================

CREATE TABLE caregiver_progress (
    caregiver_id UUID NOT NULL 
                 REFERENCES caregivers(id) ON DELETE CASCADE,
    course_id    UUID NOT NULL 
                 REFERENCES training_courses(id) ON DELETE CASCADE,
    progress_pct INTEGER DEFAULT 0 
                 CONSTRAINT valid_progress CHECK (progress_pct BETWEEN 0 AND 100),
    completed_at TIMESTAMPTZ,
    started_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (caregiver_id, course_id)
);

-- Index for finding all courses a caregiver is taking
CREATE INDEX idx_progress_caregiver ON caregiver_progress(caregiver_id);

-- Index for finding completed courses
CREATE INDEX idx_progress_completed ON caregiver_progress(completed_at) WHERE completed_at IS NOT NULL;

COMMENT ON TABLE caregiver_progress IS 'Tracks caregiver training progress';
COMMENT ON COLUMN caregiver_progress.caregiver_id IS 'Reference to the caregiver';
COMMENT ON COLUMN caregiver_progress.course_id IS 'Reference to the training course';
COMMENT ON COLUMN caregiver_progress.progress_pct IS 'Completion percentage (0-100)';
COMMENT ON COLUMN caregiver_progress.completed_at IS 'Timestamp when course was completed (NULL if in progress)';
COMMENT ON COLUMN caregiver_progress.started_at IS 'Timestamp when caregiver started the course';

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for bookings table
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate booking total with 15% platform fee
CREATE OR REPLACE FUNCTION calculate_booking_total()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_amount := ROUND(NEW.hourly_rate * NEW.duration_hrs * 1.15);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate total_amount on insert/update
CREATE TRIGGER calculate_booking_total_trigger 
    BEFORE INSERT OR UPDATE OF hourly_rate, duration_hrs ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION calculate_booking_total();

-- Function to update caregiver rating based on activity log ratings
CREATE OR REPLACE FUNCTION update_caregiver_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE caregivers
    SET rating = (
        SELECT ROUND(AVG(family_rating)::numeric, 2)
        FROM activity_logs al
        JOIN bookings b ON al.booking_id = b.id
        WHERE b.caregiver_id = (
            SELECT caregiver_id 
            FROM bookings 
            WHERE id = NEW.booking_id
        )
        AND al.family_rating IS NOT NULL
    )
    WHERE id = (
        SELECT caregiver_id 
        FROM bookings 
        WHERE id = NEW.booking_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update caregiver rating when activity log is rated
CREATE TRIGGER update_caregiver_rating_trigger 
    AFTER INSERT OR UPDATE OF family_rating ON activity_logs
    FOR EACH ROW
    WHEN (NEW.family_rating IS NOT NULL)
    EXECUTE FUNCTION update_caregiver_rating();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS on all tables for security

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seniors ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_progress ENABLE ROW LEVEL SECURITY;

-- Example policies (customize based on your auth setup)

-- Users can read their own profile
CREATE POLICY users_select_own ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY users_update_own ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Family members can view their registered seniors
CREATE POLICY seniors_select_family ON seniors
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.id = seniors.family_user_id
        )
    );

-- Caregivers can view their own profile
CREATE POLICY caregivers_select_own ON caregivers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.id = caregivers.user_id
        )
    );

-- All authenticated users can view verified caregivers (for browsing)
CREATE POLICY caregivers_select_verified ON caregivers
    FOR SELECT
    USING (verified_at IS NOT NULL);

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample training courses
INSERT INTO training_courses (title_en, title_bn, modules, duration_min) VALUES
(
    'Basic Senior Care',
    'মৌলিক বয়স্ক যত্ন',
    '[
        {"title": "Introduction to Senior Care", "duration": 30},
        {"title": "Understanding Common Health Issues", "duration": 45},
        {"title": "Safety and Fall Prevention", "duration": 30}
    ]'::jsonb,
    105
),
(
    'Diabetes Management',
    'ডায়াবেটিস ব্যবস্থাপনা',
    '[
        {"title": "Understanding Diabetes", "duration": 40},
        {"title": "Blood Sugar Monitoring", "duration": 35},
        {"title": "Meal Planning for Diabetics", "duration": 40}
    ]'::jsonb,
    115
);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Grant necessary permissions (adjust based on your setup)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
