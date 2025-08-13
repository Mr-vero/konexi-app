-- Fix RLS Policies for user_profiles table
-- This fixes the infinite recursion issue

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Employers can view job seeker profiles" ON user_profiles;
DROP POLICY IF EXISTS "Public profiles are visible to everyone" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- Create fixed policies that avoid recursion

-- Policy 1: Users can view their own profile (simplified)
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy 2: Public profiles are visible to all authenticated users
CREATE POLICY "Public profiles are visible to authenticated users" ON user_profiles
  FOR SELECT USING (
    profile_visibility = 'public' AND 
    auth.uid() IS NOT NULL
  );

-- Policy 3: Employers can view job seeker profiles (without recursive check)
CREATE POLICY "Employers can view job seeker profiles" ON user_profiles
  FOR SELECT USING (
    user_type = 'job_seeker' AND 
    profile_visibility IN ('public', 'employers_only') AND
    auth.uid() IS NOT NULL AND
    -- Check if the current user is an employer by looking at their user_id directly
    EXISTS (
      SELECT 1 FROM user_profiles employer 
      WHERE employer.user_id = auth.uid() 
      AND employer.user_type = 'employer'
      AND employer.id != user_profiles.id  -- Prevent self-reference
    )
  );

-- Policy 4: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy 5: Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Also fix the jobs policies to avoid similar issues
DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Job posters can view their own jobs" ON jobs;

-- Simplified jobs policies
CREATE POLICY "Anyone can view active jobs" ON jobs
  FOR SELECT USING (is_active = true);

-- For authenticated users to see their own jobs (including inactive)
CREATE POLICY "Users can view their own jobs" ON jobs
  FOR SELECT USING (
    posted_by IN (
      SELECT id FROM user_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- If you're not logged in, allow viewing active jobs
CREATE POLICY "Public can view active jobs" ON jobs
  FOR SELECT USING (
    is_active = true AND 
    auth.uid() IS NULL
  );

-- Also, let's add a policy for anon users to view jobs
DROP POLICY IF EXISTS "Public can view active jobs" ON jobs;

-- Recreate with better logic
CREATE POLICY "Anyone including anon can view active jobs" ON jobs
  FOR SELECT USING (is_active = true);