-- ============================================================================
-- Clear All Mock Data from Seba Database
-- ============================================================================
-- Run this in Supabase SQL Editor BEFORE running npm run seed:db
-- This ensures a clean slate for seeding fresh mock data
-- ============================================================================

-- Disable foreign key checks temporarily (not needed in PostgreSQL, cascade handles it)

-- Delete in reverse dependency order (respecting foreign keys)
DELETE FROM caregiver_progress;
DELETE FROM emergency_alerts;
DELETE FROM activity_logs;
DELETE FROM bookings;
DELETE FROM training_courses;
DELETE FROM caregivers;
DELETE FROM seniors;
DELETE FROM users;

-- Verify all tables are empty
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'seniors', COUNT(*) FROM seniors
UNION ALL
SELECT 'caregivers', COUNT(*) FROM caregivers
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'activity_logs', COUNT(*) FROM activity_logs
UNION ALL
SELECT 'emergency_alerts', COUNT(*) FROM emergency_alerts
UNION ALL
SELECT 'training_courses', COUNT(*) FROM training_courses
UNION ALL
SELECT 'caregiver_progress', COUNT(*) FROM caregiver_progress;

-- All counts should be 0
