-- Add columns to track professional terms acceptance
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS pro_terms_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pro_terms_version TEXT,
ADD COLUMN IF NOT EXISTS pro_terms_accepted_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_pro_terms ON profiles(pro_terms_accepted);
