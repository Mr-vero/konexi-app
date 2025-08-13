-- Enhanced Job Portal Database Schema
-- This schema extends the existing mini job board with full-featured job portal capabilities

-- =======================
-- ENUMS
-- =======================

-- Enhanced job types
CREATE TYPE job_type AS ENUM (
  'full_time', 
  'part_time', 
  'contract', 
  'internship', 
  'freelance'
);

-- Experience levels
CREATE TYPE experience_level AS ENUM (
  'entry', 
  'mid', 
  'senior', 
  'executive'
);

-- Location types
CREATE TYPE location_type AS ENUM (
  'remote', 
  'onsite', 
  'hybrid'
);

-- User types
CREATE TYPE user_type AS ENUM (
  'job_seeker', 
  'employer', 
  'admin'
);

-- Application status
CREATE TYPE application_status AS ENUM (
  'pending', 
  'reviewing', 
  'interview', 
  'offer', 
  'rejected', 
  'withdrawn'
);

-- Company sizes
CREATE TYPE company_size AS ENUM (
  'startup', 
  'small', 
  'medium', 
  'large'
);

-- Notification types
CREATE TYPE notification_type AS ENUM (
  'application_update', 
  'new_job_alert', 
  'interview_scheduled', 
  'message'
);

-- Profile visibility
CREATE TYPE profile_visibility AS ENUM (
  'public', 
  'private', 
  'employers_only'
);

-- =======================
-- ENHANCED USER PROFILES
-- =======================

-- Drop existing profiles table (backup data first if needed)
-- DROP TABLE IF EXISTS profiles CASCADE;

-- Enhanced user profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  user_type user_type NOT NULL DEFAULT 'job_seeker',
  
  -- Basic Information
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  
  -- Profile Media
  avatar_url TEXT,
  resume_url TEXT,
  
  -- Professional Information
  linkedin_url TEXT,
  portfolio_url TEXT,
  bio TEXT,
  skills TEXT[],
  experience_level experience_level,
  
  -- Job Seeker Preferences
  desired_salary_min INTEGER,
  desired_salary_max INTEGER,
  is_open_to_work BOOLEAN DEFAULT false,
  profile_visibility profile_visibility DEFAULT 'public',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =======================
-- COMPANIES
-- =======================

CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  
  -- Company Details
  industry TEXT,
  size company_size,
  location TEXT,
  founded_year INTEGER,
  
  -- Culture & Benefits
  culture_images TEXT[],
  benefits TEXT[],
  
  -- Management
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =======================
-- ENHANCED JOBS
-- =======================

-- Drop existing jobs table (backup data first if needed)
-- DROP TABLE IF EXISTS jobs CASCADE;

CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  posted_by UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Job Information
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  
  -- Location & Work Type
  location TEXT NOT NULL,
  location_type location_type NOT NULL DEFAULT 'onsite',
  job_type job_type NOT NULL,
  experience_level experience_level,
  
  -- Compensation
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  
  -- Additional Details
  benefits TEXT[],
  skills_required TEXT[],
  education_required TEXT,
  
  -- Application Management
  application_deadline TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  application_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =======================
-- APPLICATIONS
-- =======================

CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Application Details
  cover_letter TEXT,
  resume_url TEXT,
  status application_status DEFAULT 'pending',
  notes TEXT,
  
  -- Timestamps
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Ensure one application per job per user
  UNIQUE(job_id, applicant_id)
);

-- =======================
-- SAVED JOBS
-- =======================

CREATE TABLE saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Ensure one save per job per user
  UNIQUE(user_id, job_id)
);

-- =======================
-- JOB ALERTS
-- =======================

CREATE TABLE job_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  search_query TEXT,
  filters JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_sent TIMESTAMP WITH TIME ZONE
);

-- =======================
-- NOTIFICATIONS
-- =======================

CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =======================
-- INDEXES
-- =======================

-- User Profiles indexes
CREATE INDEX user_profiles_user_id_idx ON user_profiles(user_id);
CREATE INDEX user_profiles_user_type_idx ON user_profiles(user_type);
CREATE INDEX user_profiles_location_idx ON user_profiles(location);
CREATE INDEX user_profiles_skills_idx ON user_profiles USING GIN(skills);

-- Companies indexes
CREATE INDEX companies_name_idx ON companies(name);
CREATE INDEX companies_industry_idx ON companies(industry);
CREATE INDEX companies_size_idx ON companies(size);
CREATE INDEX companies_location_idx ON companies(location);

-- Jobs indexes
CREATE INDEX jobs_company_id_idx ON jobs(company_id);
CREATE INDEX jobs_posted_by_idx ON jobs(posted_by);
CREATE INDEX jobs_title_idx ON jobs(title);
CREATE INDEX jobs_location_idx ON jobs(location);
CREATE INDEX jobs_location_type_idx ON jobs(location_type);
CREATE INDEX jobs_job_type_idx ON jobs(job_type);
CREATE INDEX jobs_experience_level_idx ON jobs(experience_level);
CREATE INDEX jobs_is_active_idx ON jobs(is_active);
CREATE INDEX jobs_created_at_idx ON jobs(created_at DESC);
CREATE INDEX jobs_salary_idx ON jobs(salary_min, salary_max);
CREATE INDEX jobs_skills_idx ON jobs USING GIN(skills_required);

-- Full-text search indexes
CREATE INDEX jobs_search_idx ON jobs USING GIN(to_tsvector('english', title || ' ' || description || ' ' || COALESCE(requirements, '')));

-- Applications indexes
CREATE INDEX applications_job_id_idx ON applications(job_id);
CREATE INDEX applications_applicant_id_idx ON applications(applicant_id);
CREATE INDEX applications_status_idx ON applications(status);
CREATE INDEX applications_applied_at_idx ON applications(applied_at DESC);

-- Saved jobs indexes
CREATE INDEX saved_jobs_user_id_idx ON saved_jobs(user_id);
CREATE INDEX saved_jobs_job_id_idx ON saved_jobs(job_id);

-- Job alerts indexes
CREATE INDEX job_alerts_user_id_idx ON job_alerts(user_id);
CREATE INDEX job_alerts_is_active_idx ON job_alerts(is_active);

-- Notifications indexes
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_is_read_idx ON notifications(is_read);
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);

-- =======================
-- ROW LEVEL SECURITY
-- =======================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- User Profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Employers can view job seeker profiles" ON user_profiles
  FOR SELECT USING (
    user_type = 'job_seeker' AND 
    profile_visibility IN ('public', 'employers_only') AND
    EXISTS (SELECT 1 FROM user_profiles up WHERE up.user_id = auth.uid() AND up.user_type = 'employer')
  );

CREATE POLICY "Public profiles are visible to everyone" ON user_profiles
  FOR SELECT USING (profile_visibility = 'public');

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Companies policies
CREATE POLICY "Anyone can view companies" ON companies
  FOR SELECT USING (true);

CREATE POLICY "Employers can create companies" ON companies
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND user_type = 'employer')
  );

CREATE POLICY "Company creators can update their companies" ON companies
  FOR UPDATE USING (created_by IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

-- Jobs policies
CREATE POLICY "Anyone can view active jobs" ON jobs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Job posters can view their own jobs" ON jobs
  FOR SELECT USING (posted_by IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Employers can create jobs" ON jobs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND user_type = 'employer')
  );

CREATE POLICY "Job posters can update their own jobs" ON jobs
  FOR UPDATE USING (posted_by IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Job posters can delete their own jobs" ON jobs
  FOR DELETE USING (posted_by IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

-- Applications policies
CREATE POLICY "Applicants can view their own applications" ON applications
  FOR SELECT USING (applicant_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Job posters can view applications for their jobs" ON applications
  FOR SELECT USING (
    job_id IN (SELECT id FROM jobs WHERE posted_by IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()))
  );

CREATE POLICY "Job seekers can create applications" ON applications
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND user_type = 'job_seeker')
  );

CREATE POLICY "Applicants can update their own applications" ON applications
  FOR UPDATE USING (applicant_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Job posters can update application status" ON applications
  FOR UPDATE USING (
    job_id IN (SELECT id FROM jobs WHERE posted_by IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()))
  );

-- Saved jobs policies
CREATE POLICY "Users can manage their own saved jobs" ON saved_jobs
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

-- Job alerts policies
CREATE POLICY "Users can manage their own job alerts" ON job_alerts
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

-- =======================
-- FUNCTIONS
-- =======================

-- Enhanced function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, user_type)
  VALUES (new.id, new.email, 'job_seeker');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to increment job view count
CREATE OR REPLACE FUNCTION increment_job_view_count(job_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE jobs SET view_count = view_count + 1 WHERE id = job_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment application count when application is created
CREATE OR REPLACE FUNCTION increment_application_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs SET application_count = application_count + 1 WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement application count when application is withdrawn
CREATE OR REPLACE FUNCTION decrement_application_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs SET application_count = application_count - 1 WHERE id = OLD.job_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- =======================
-- TRIGGERS
-- =======================

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Triggers for application count
CREATE TRIGGER increment_application_count_trigger
  AFTER INSERT ON applications
  FOR EACH ROW EXECUTE PROCEDURE increment_application_count();

CREATE TRIGGER decrement_application_count_trigger
  AFTER DELETE ON applications
  FOR EACH ROW EXECUTE PROCEDURE decrement_application_count();

-- =======================
-- SAMPLE DATA (Optional)
-- =======================

-- Insert sample industries
-- You can customize this list based on your needs
INSERT INTO companies (name, description, industry, size, location, benefits) VALUES
('TechStart Inc.', 'A fast-growing startup focused on innovative web solutions', 'Technology', 'startup', 'San Francisco, CA', ARRAY['Health Insurance', 'Remote Work', 'Stock Options']),
('Global Finance Corp', 'Leading financial services company', 'Finance', 'large', 'New York, NY', ARRAY['Health Insurance', '401k', 'Paid Time Off']),
('Creative Agency', 'Full-service digital marketing agency', 'Marketing', 'medium', 'Austin, TX', ARRAY['Flexible Schedule', 'Professional Development', 'Team Events']);

-- Note: This schema is designed to be backward compatible where possible
-- but includes significant enhancements for a full job portal experience.