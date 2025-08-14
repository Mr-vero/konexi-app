-- Seed data script that works with existing users
-- Run this after you have at least one user in your database

-- This script will:
-- 1. Find the first user in the profiles table
-- 2. Use that user's ID to create all the job postings

DO $$
DECLARE
  seed_user_id UUID;
BEGIN
  -- Get the first user from profiles table
  SELECT id INTO seed_user_id FROM profiles LIMIT 1;
  
  -- Check if we found a user
  IF seed_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found in profiles table. Please create a user first.';
  END IF;

  -- Now insert all the jobs using the found user ID
  INSERT INTO jobs (user_id, title, company_name, description, location, job_type) VALUES
  -- Technology Jobs
  (seed_user_id, 'Senior Software Engineer', 'Google', 'We are looking for a Senior Software Engineer to join our Cloud Platform team. You will be responsible for designing and implementing large-scale distributed systems that power Google Cloud services. Required: 5+ years of experience with Java, Python, or Go, strong knowledge of distributed systems, and experience with cloud technologies.', 'Mountain View, CA', 'Full-Time'),
  (seed_user_id, 'Frontend Developer', 'Netflix', 'Join our UI Engineering team to build the next generation of Netflix experiences. You will work with React, TypeScript, and Node.js to create performant and accessible web applications used by millions. Required: 3+ years of frontend development experience, expertise in React and modern JavaScript.', 'Los Gatos, CA', 'Full-Time'),
  (seed_user_id, 'DevOps Engineer', 'Amazon Web Services', 'AWS is seeking a DevOps Engineer to help build and maintain our cloud infrastructure. You will work with Kubernetes, Terraform, and AWS services to ensure high availability and scalability. Required: Experience with CI/CD pipelines, containerization, and infrastructure as code.', 'Seattle, WA', 'Full-Time'),
  (seed_user_id, 'Data Scientist', 'Meta', 'Join our Data Science team to analyze user behavior and improve our products. You will work with large datasets, build ML models, and provide insights that drive product decisions. Required: MS/PhD in Computer Science or related field, experience with Python, SQL, and machine learning frameworks.', 'Menlo Park, CA', 'Full-Time'),
  (seed_user_id, 'iOS Developer', 'Apple', 'Be part of the team that creates amazing iOS experiences. You will work on core iOS frameworks and applications used by billions. Required: 3+ years of iOS development, expertise in Swift and Objective-C, understanding of iOS design patterns.', 'Cupertino, CA', 'Full-Time'),
  (seed_user_id, 'Backend Engineer', 'Stripe', 'Help build the economic infrastructure of the internet. You will work on payment processing systems, APIs, and distributed systems that handle billions in transactions. Required: Experience with Ruby, Go, or Java, understanding of payment systems, and distributed computing.', 'San Francisco, CA', 'Full-Time'),
  (seed_user_id, 'Machine Learning Engineer', 'OpenAI', 'Join us in developing cutting-edge AI systems. You will work on large language models, reinforcement learning, and novel AI applications. Required: Strong background in ML/AI, experience with PyTorch or TensorFlow, and publications in top conferences.', 'San Francisco, CA', 'Full-Time'),
  (seed_user_id, 'Full Stack Developer', 'Microsoft', 'Work on Microsoft Teams to build collaborative experiences. You will use React, C#, and Azure services to create features used by millions of users worldwide. Required: 3+ years full-stack experience, proficiency in JavaScript and C#.', 'Redmond, WA', 'Full-Time'),
  (seed_user_id, 'Site Reliability Engineer', 'LinkedIn', 'Ensure the reliability and performance of LinkedIn''s platform. You will work on monitoring, incident response, and infrastructure automation. Required: Experience with SRE practices, knowledge of Linux systems, and scripting skills.', 'Sunnyvale, CA', 'Full-Time'),
  (seed_user_id, 'Android Developer', 'Spotify', 'Build the future of music streaming on Android. You will work with Kotlin, Android SDK, and create features that delight millions of users. Required: 3+ years Android development, expertise in Kotlin, understanding of Android architecture components.', 'New York, NY', 'Full-Time');

  RAISE NOTICE 'Successfully inserted sample jobs for user %', seed_user_id;
END $$;