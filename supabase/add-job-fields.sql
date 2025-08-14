-- Migration to add additional fields to the jobs table for richer data

-- Add salary range fields
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS salary_min INTEGER,
ADD COLUMN IF NOT EXISTS salary_max INTEGER,
ADD COLUMN IF NOT EXISTS salary_currency VARCHAR(3) DEFAULT 'USD';

-- Add experience level
CREATE TYPE experience_level AS ENUM ('Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Executive');
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS experience_level experience_level;

-- Add additional fields
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS benefits TEXT[],
ADD COLUMN IF NOT EXISTS requirements TEXT[],
ADD COLUMN IF NOT EXISTS posted_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS application_deadline DATE,
ADD COLUMN IF NOT EXISTS is_remote_friendly BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS company_logo_url VARCHAR(500);

-- Create an index on company_name for faster queries
CREATE INDEX IF NOT EXISTS idx_jobs_company_name ON jobs(company_name);

-- Update existing jobs with sample data
UPDATE jobs SET
  salary_min = CASE 
    WHEN title LIKE '%Senior%' OR title LIKE '%Lead%' OR title LIKE '%Manager%' THEN 120000
    WHEN title LIKE '%Mid%' OR title LIKE '%Specialist%' THEN 80000
    WHEN title LIKE '%Junior%' OR title LIKE '%Entry%' THEN 60000
    ELSE 90000
  END,
  salary_max = CASE 
    WHEN title LIKE '%Senior%' OR title LIKE '%Lead%' OR title LIKE '%Manager%' THEN 180000
    WHEN title LIKE '%Mid%' OR title LIKE '%Specialist%' THEN 120000
    WHEN title LIKE '%Junior%' OR title LIKE '%Entry%' THEN 80000
    ELSE 130000
  END,
  experience_level = CASE 
    WHEN title LIKE '%Senior%' OR title LIKE '%Lead%' THEN 'Senior Level'::experience_level
    WHEN title LIKE '%Manager%' OR title LIKE '%Director%' THEN 'Lead'::experience_level
    WHEN title LIKE '%Executive%' OR title LIKE '%VP%' THEN 'Executive'::experience_level
    WHEN title LIKE '%Junior%' OR title LIKE '%Entry%' THEN 'Entry Level'::experience_level
    ELSE 'Mid Level'::experience_level
  END,
  benefits = ARRAY[
    'Health Insurance',
    'Dental & Vision',
    '401(k) Matching',
    'Paid Time Off',
    'Remote Work Options',
    'Professional Development'
  ],
  requirements = ARRAY[
    'Bachelor''s degree or equivalent experience',
    'Strong communication skills',
    'Team collaboration abilities',
    'Problem-solving mindset'
  ],
  is_remote_friendly = CASE 
    WHEN location = 'Remote' THEN TRUE
    ELSE FALSE
  END,
  application_deadline = CURRENT_DATE + INTERVAL '30 days'
WHERE salary_min IS NULL;

-- Add some variety to posted dates to make data look more realistic
UPDATE jobs 
SET posted_date = CURRENT_DATE - (FLOOR(RANDOM() * 30) || ' days')::INTERVAL
WHERE posted_date = CURRENT_DATE;