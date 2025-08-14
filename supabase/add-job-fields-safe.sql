-- Migration to add additional fields to the jobs table for richer data
-- This version safely checks for existing types and columns

-- Create experience level enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_level') THEN
    CREATE TYPE experience_level AS ENUM ('Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Executive');
  END IF;
END$$;

-- Add columns if they don't exist
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS salary_min INTEGER,
ADD COLUMN IF NOT EXISTS salary_max INTEGER,
ADD COLUMN IF NOT EXISTS salary_currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS experience_level experience_level,
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS benefits TEXT[],
ADD COLUMN IF NOT EXISTS requirements TEXT[],
ADD COLUMN IF NOT EXISTS posted_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS application_deadline DATE,
ADD COLUMN IF NOT EXISTS is_remote_friendly BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS company_logo_url VARCHAR(500);

-- Create an index on company_name for faster queries
CREATE INDEX IF NOT EXISTS idx_jobs_company_name ON jobs(company_name);

-- Update existing jobs with sample data only if columns are empty
UPDATE jobs SET
  salary_min = COALESCE(salary_min, CASE 
    WHEN title ILIKE '%Senior%' OR title ILIKE '%Lead%' OR title ILIKE '%Manager%' THEN 120000
    WHEN title ILIKE '%Mid%' OR title ILIKE '%Specialist%' THEN 80000
    WHEN title ILIKE '%Junior%' OR title ILIKE '%Entry%' THEN 60000
    ELSE 90000
  END),
  salary_max = COALESCE(salary_max, CASE 
    WHEN title ILIKE '%Senior%' OR title ILIKE '%Lead%' OR title ILIKE '%Manager%' THEN 180000
    WHEN title ILIKE '%Mid%' OR title ILIKE '%Specialist%' THEN 120000
    WHEN title ILIKE '%Junior%' OR title ILIKE '%Entry%' THEN 80000
    ELSE 130000
  END),
  experience_level = COALESCE(experience_level, CASE 
    WHEN title ILIKE '%Senior%' OR title ILIKE '%Lead%' THEN 'Senior Level'::experience_level
    WHEN title ILIKE '%Manager%' OR title ILIKE '%Director%' THEN 'Lead'::experience_level
    WHEN title ILIKE '%Executive%' OR title ILIKE '%VP%' THEN 'Executive'::experience_level
    WHEN title ILIKE '%Junior%' OR title ILIKE '%Entry%' THEN 'Entry Level'::experience_level
    ELSE 'Mid Level'::experience_level
  END),
  benefits = COALESCE(benefits, ARRAY[
    'Health Insurance',
    'Dental & Vision',
    '401(k) Matching',
    'Paid Time Off',
    'Remote Work Options',
    'Professional Development'
  ]),
  requirements = COALESCE(requirements, ARRAY[
    'Bachelor''s degree or equivalent experience',
    'Strong communication skills',
    'Team collaboration abilities',
    'Problem-solving mindset'
  ]),
  is_remote_friendly = COALESCE(is_remote_friendly, CASE 
    WHEN location = 'Remote' THEN TRUE
    ELSE FALSE
  END),
  application_deadline = COALESCE(application_deadline, CURRENT_DATE + INTERVAL '30 days'),
  posted_date = COALESCE(posted_date, CURRENT_DATE - (FLOOR(RANDOM() * 30) || ' days')::INTERVAL)
WHERE salary_min IS NULL OR experience_level IS NULL;