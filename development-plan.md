# Mini Job Board Development Plan

## Project Overview
Build a simple "Mini Job Board" web application where companies can post jobs and users can browse them. Focus on clean code, usability, and fullstack functionality.

## Tech Stack
- **Frontend**: Next.js (App Router)
- **Backend**: Supabase (Database + Auth)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Core Features

### 1. Authentication (Supabase Auth)
- User registration
- User login
- Session management

### 2. Post a Job
- Authenticated users only
- Required fields:
  - Title
  - Company name
  - Description
  - Location
  - Job type (Full-Time, Part-Time, Contract)

### 3. Browse Jobs
- Public access
- List view of all job postings
- Filters:
  - By location
  - By job type

### 4. Job Detail Page
- Public access
- Display full job information
- Clean, readable layout

### 5. User Dashboard
- Authenticated users only
- View user's posted jobs
- Edit existing job posts
- Delete job posts

## Database Schema

### Tables

#### profiles
- id (UUID, primary key, references auth.users)
- email (text)
- created_at (timestamp)
- updated_at (timestamp)

#### jobs
- id (UUID, primary key)
- user_id (UUID, foreign key to profiles.id)
- title (text, required)
- company_name (text, required)
- description (text, required)
- location (text, required)
- job_type (enum: 'Full-Time', 'Part-Time', 'Contract')
- created_at (timestamp)
- updated_at (timestamp)

## Development Phases

### Phase 1: Project Setup
1. Initialize Next.js project with TypeScript
2. Set up Tailwind CSS
3. Configure Supabase project
4. Set up environment variables
5. Create basic project structure

### Phase 2: Database & Authentication
1. Create Supabase tables
2. Set up Row Level Security (RLS) policies
3. Implement authentication flow
4. Create auth context/provider
5. Build login/signup pages

### Phase 3: Core Functionality
1. Create job posting form
2. Implement job listing page
3. Add filtering functionality
4. Build job detail page
5. Develop user dashboard

### Phase 4: UI/UX Polish
1. Responsive design implementation
2. Loading states
3. Error handling
4. Form validation
5. Success notifications

### Phase 5: Deployment & Documentation
1. Deploy to Vercel
2. Configure environment variables
3. Write comprehensive README
4. Test production deployment
5. Create GitHub repository

## File Structure
```
konexi-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (protected)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── jobs/
│   │       ├── new/
│   │       │   └── page.tsx
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx
│   ├── jobs/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── AuthForm.tsx
│   │   └── AuthProvider.tsx
│   ├── jobs/
│   │   ├── JobCard.tsx
│   │   ├── JobForm.tsx
│   │   ├── JobList.tsx
│   │   └── JobFilters.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Select.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── types/
│       └── database.ts
├── .env.local
├── package.json
└── README.md
```

## Deliverables Checklist
- [ ] GitHub repository (public)
- [ ] Clear README with:
  - [ ] Setup instructions
  - [ ] Architecture overview
  - [ ] Approach explanation
  - [ ] "What would you improve?" section
- [ ] Live Vercel deployment
- [ ] Functional features:
  - [ ] Authentication
  - [ ] Job posting
  - [ ] Job browsing with filters
  - [ ] Job detail pages
  - [ ] User dashboard