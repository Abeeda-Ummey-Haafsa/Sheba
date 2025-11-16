-- ============================================================================
-- Add Location Columns to Seniors Table
-- ============================================================================
-- Run this in Supabase SQL Editor to add area, sub_area, address_line columns
-- ============================================================================

-- Add new columns to seniors table
ALTER TABLE seniors 
ADD COLUMN IF NOT EXISTS area TEXT,
ADD COLUMN IF NOT EXISTS sub_area TEXT,
ADD COLUMN IF NOT EXISTS address_line TEXT;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'seniors' 
ORDER BY ordinal_position;

-- Add comments for the new columns
COMMENT ON COLUMN seniors.area IS 'Area name in English (e.g., mirpur, dhanmondi, gulshan)';
COMMENT ON COLUMN seniors.sub_area IS 'Sub-area name in Bengali (e.g., মিরপুর ১০, ধানমন্ডি ৩২)';
COMMENT ON COLUMN seniors.address_line IS 'House/road/building address in Bengali (e.g., বাড়ি নং ১২৩, রোড ৫)';

-- Optional: Update existing records with placeholder data
-- UPDATE seniors SET 
--   area = 'mirpur',
--   sub_area = 'মিরপুর ১০',
--   address_line = 'বাড়ি নং ১, রোড ১'
-- WHERE area IS NULL;
