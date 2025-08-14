# Konexi Job Portal

A comprehensive job board platform built with Next.js, Supabase, and Tailwind CSS. The platform connects job seekers with opportunities and allows companies to post positions across various industries.

## Live Demo

[View live deployment on Vercel](#) (URL will be added after deployment)

## Features

### Core Features
- **Authentication**: Secure user registration and login with Supabase Auth
- **Job Management**: Create, edit, and delete job postings
- **Advanced Search**: Dedicated job search page with real-time filtering
- **Smart Filtering**: Filter by location, job type, category, and experience level
- **Job Categories**: Browse jobs by industry categories with real-time counts
- **Company Directory**: Explore all hiring companies with job counts
- **Career Resources**: Comprehensive resource center with guides and articles
- **Real-time Statistics**: Live platform statistics showing jobs, companies, and seekers
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices

### Enhanced Features
- **Rich Job Data**: Salary ranges, benefits, requirements, and experience levels
- **Search Persistence**: URL parameters maintain search state
- **Professional UI**: Modern design with smooth animations and transitions
- **Loading States**: Skeleton loaders for better user experience
- **Error Handling**: Graceful error handling with user-friendly messages

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Backend**: Supabase (Database + Authentication)
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel
- **Language**: TypeScript

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── companies/         # Companies directory page
│   ├── dashboard/         # User dashboard (protected)
│   ├── jobs/              # Job-related pages
│   │   ├── [id]/          # Job detail page
│   │   │   └── edit/      # Edit job page (protected)
│   │   └── new/           # Create job page (protected)
│   ├── resources/         # Career resources page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── companies/         # Company-related components
│   ├── jobs/              # Job-related components
│   ├── resources/         # Resource page components
│   ├── ui/                # Reusable UI components
│   ├── Header.tsx         # Navigation header
│   ├── HeroSection.tsx    # Homepage hero
│   ├── JobCategories.tsx  # Category browser
│   ├── JobStatistics.tsx  # Platform statistics
│   └── FeaturedCompanies.tsx # Company showcase
└── lib/                   # Utility functions and types
    ├── supabase/          # Supabase client configuration
    └── types/             # TypeScript type definitions
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Supabase account

### 1. Clone the Repository

```bash
git clone [repository-url]
cd konexi-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In the SQL editor, execute the following files in order:
   - `supabase/migrations/supabase-schema.sql` - Creates the base schema
   - `supabase/add-job-fields-safe.sql` - Adds enhanced job fields
   - `supabase/seed-with-user.sql` - Populates with 100+ sample jobs (optional)
3. Get your project URL and anon key from the project settings

### 4. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and update with your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Architecture Overview

### Database Schema

**profiles**
- Stores user profile information
- Automatically created when a user signs up via trigger
- Links to Supabase Auth users

**jobs**
- Comprehensive job posting information:
  - Basic: title, company_name, description, location, job_type
  - Enhanced: salary_min, salary_max, experience_level, benefits[], requirements[]
  - Metadata: posted_date, application_deadline, is_remote_friendly
- References user who created the posting
- Indexed on company_name for performance

**Enums**
- `job_type`: 'Full-Time', 'Part-Time', 'Contract'
- `experience_level`: 'Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Executive'

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only edit/delete their own job postings
- Anyone can view job listings
- Authentication required for posting jobs

### Key Design Decisions

1. **Next.js App Router**: Utilized for better performance and simpler data fetching
2. **Supabase SSR**: Used the new @supabase/ssr package for secure server-side authentication
3. **Component Architecture**: 
   - Separated UI components from business logic
   - Client components for interactivity
   - Server components for data fetching
4. **TypeScript**: Full type safety with generated database types
5. **Tailwind CSS v4**: Modern styling with utility classes and animations
6. **Real-time Data**: Live statistics pulled from database
7. **SEO Friendly**: Server-side rendering for better search engine visibility

## Pages Overview

### Home Page (`/`)
- Hero section with job search
- Browse by categories with real counts
- Featured companies section
- Platform statistics

### Jobs Page (`/jobs`)
- Dedicated job search interface
- Advanced filtering sidebar
- Real-time search results
- Sort options
- URL parameter support for sharing searches

### Companies Page (`/companies`)
- Directory of all hiring companies
- Search functionality
- Job counts per company
- Quick stats overview

### Resources Page (`/resources`)
- Career development guides
- Industry insights
- Job search tips
- Downloadable resources

## Sample Data

The project includes comprehensive seed data with 100+ realistic job postings:
- Major tech companies (Google, Apple, Microsoft, Meta, etc.)
- Finance & FinTech positions
- Healthcare opportunities
- E-commerce & Retail jobs
- Marketing & Sales roles
- And many more across 15+ industries

## What Would I Improve Given More Time?

### Features
- **Application System**: Allow users to apply directly through the platform
- **Email Notifications**: Job alerts based on saved searches
- **Company Profiles**: Detailed company pages with culture info
- **Resume Builder**: Integrated resume creation tool
- **Salary Insights**: Aggregate salary data and trends
- **Job Recommendations**: ML-based job matching

### Technical Improvements
- **Testing**: Comprehensive test suite with Vitest and Playwright
- **Performance**: 
  - Implement virtual scrolling for large lists
  - Add Redis caching layer
  - Optimize bundle size
- **SEO**: 
  - Dynamic meta tags
  - Structured data for job postings
  - XML sitemap generation
- **Real-time Features**: 
  - Live job updates with Supabase subscriptions
  - Instant notifications for new matches
- **Internationalization**: Multi-language support

### UI/UX Enhancements
- **Dark Mode**: System-aware theme switching
- **Advanced Animations**: Framer Motion integration
- **Rich Text Editor**: Markdown support for job descriptions
- **File Uploads**: Resume uploads and company logos
- **Mobile App**: React Native companion app
- **Accessibility**: WCAG 2.1 AA compliance

## Contributing

Feel free to submit issues and enhancement requests!

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for future features)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Self-Hosting
1. Build: `npm run build`
2. Start: `npm start`
3. Use PM2 or similar for process management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT