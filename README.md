# Mini Job Board

A simple job board web application built with Next.js, Supabase, and Tailwind CSS. Companies can post jobs and users can browse them with filtering capabilities.

## Live Demo

[View live deployment on Vercel](#) (URL will be added after deployment)

## Features

- **Authentication**: User registration and login with Supabase Auth
- **Job Posting**: Authenticated users can create job posts
- **Browse Jobs**: Public page showing all job listings
- **Filtering**: Filter jobs by location and job type
- **Job Details**: View full details of specific jobs
- **User Dashboard**: Manage posted jobs (view, edit, delete)
- **Responsive Design**: Works on desktop and mobile devices

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
│   ├── dashboard/         # User dashboard (protected)
│   ├── jobs/              # Job-related pages
│   │   ├── [id]/          # Job detail page
│   │   │   └── edit/      # Edit job page (protected)
│   │   └── new/           # Create job page (protected)
│   └── page.tsx           # Home page with job listings
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── jobs/              # Job-related components
│   └── ui/                # Reusable UI components
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
2. In the SQL editor, execute the schema from `supabase-schema.sql`
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
- Automatically created when a user signs up
- Links to Supabase Auth users

**jobs**
- Stores job postings
- Contains: title, company name, description, location, job type
- References user who created the posting

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only edit/delete their own job postings
- Anyone can view job listings
- Authentication required for posting jobs

### Key Design Decisions

1. **Next.js App Router**: Utilized for better performance and simpler data fetching
2. **Supabase SSR**: Used the new @supabase/ssr package for secure server-side authentication
3. **Component Structure**: Separated UI components from business logic for reusability
4. **TypeScript**: Full type safety with generated database types
5. **Tailwind CSS**: Rapid styling with utility classes

## What Would I Improve Given More Time?

### Features
- **Search Functionality**: Add full-text search for job titles and descriptions
- **Advanced Filters**: Salary ranges, experience levels, remote/on-site options
- **Email Notifications**: Notify users when jobs matching their criteria are posted
- **Company Profiles**: Dedicated pages for companies with all their listings
- **Application Tracking**: Allow users to apply through the platform and track applications
- **Saved Jobs**: Let users bookmark jobs for later viewing

### Technical Improvements
- **Testing**: Add comprehensive unit and integration tests
- **Performance**: Implement pagination for job listings, optimize images
- **SEO**: Add meta tags, structured data, and sitemap generation
- **Accessibility**: Enhanced keyboard navigation and screen reader support
- **Error Boundaries**: Better error handling with user-friendly messages
- **Analytics**: Track user behavior to improve the platform
- **Caching**: Implement caching strategies for frequently accessed data
- **Real-time Updates**: Use Supabase real-time subscriptions for live job updates

### UI/UX Enhancements
- **Dark Mode**: Add theme switching capability
- **Animations**: Smooth transitions and micro-interactions
- **Rich Text Editor**: For job descriptions with formatting options
- **Image Uploads**: Company logos and job-related images
- **Mobile App**: Progressive Web App or React Native version

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT