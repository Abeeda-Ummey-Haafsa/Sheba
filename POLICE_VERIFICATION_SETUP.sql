-- ============================================================
-- POLICE VERIFICATION BUCKET SETUP
-- Run this in Supabase SQL Editor to fix police verification uploads
-- ============================================================

-- 1. Create the verifications bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verifications', 'verifications', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Remove existing policies (if any)
DROP POLICY IF EXISTS "Users can upload verification docs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own verification docs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all verifications" ON storage.objects;

-- 3. Create new RLS policies for verifications bucket

-- Allow authenticated users to upload verification documents
CREATE POLICY "Users can upload verification docs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'verifications' 
    AND auth.role() = 'authenticated'
  );

-- Allow users to view their own verification documents
CREATE POLICY "Users can view own verification docs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'verifications' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- (Optional) Allow service role to view all verification documents for admin purposes
CREATE POLICY "Admins can view all verifications"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'verifications' 
    AND auth.role() = 'service_role'
  );

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Run this SELECT to verify everything is set up correctly:
SELECT 
  id, 
  name, 
  public,
  created_at
FROM storage.buckets 
WHERE id = 'verifications';

-- Expected output: Should show one row with:
-- id: verifications
-- name: verifications  
-- public: false (private bucket)
-- created_at: (timestamp)
