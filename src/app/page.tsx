'use client'

import { useEffect, useState, useCallback } from 'react'
import { Header } from '@/components/Header'
import { JobList } from '@/components/jobs/JobList'
import { JobFilters } from '@/components/jobs/JobFilters'
import { HeroSection } from '@/components/HeroSection'
import { JobCategories } from '@/components/JobCategories'
import { FeaturedCompanies } from '@/components/FeaturedCompanies'
import { JobStatistics } from '@/components/JobStatistics'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'

type Job = Database['public']['Tables']['jobs']['Row']

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [locationFilter, setLocationFilter] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const fetchJobs = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching jobs:', error)
    } else {
      setJobs(data || [])
    }
    setLoading(false)
  }

  const filterJobs = useCallback(() => {
    let filtered = jobs

    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    if (jobTypeFilter) {
      filtered = filtered.filter(job => job.job_type === jobTypeFilter)
    }

    if (categoryFilter) {
      // For now, we'll filter by keywords in title/description
      // In a real app, you'd have a category field in the database
      const categoryKeywords: Record<string, string[]> = {
        'Technology': ['software', 'developer', 'engineer', 'tech', 'programming'],
        'Business': ['business', 'manager', 'analyst', 'consultant'],
        'Sales': ['sales', 'account', 'business development'],
        'Design': ['design', 'ui', 'ux', 'graphic', 'creative'],
        'Marketing': ['marketing', 'seo', 'content', 'social media'],
        'HR': ['hr', 'human resources', 'recruiter', 'talent'],
        'Healthcare': ['health', 'medical', 'nurse', 'doctor'],
        'Security': ['security', 'cyber', 'compliance']
      }
      
      const keywords = categoryKeywords[categoryFilter] || []
      filtered = filtered.filter(job => {
        const jobText = `${job.title} ${job.description}`.toLowerCase()
        return keywords.some(keyword => jobText.includes(keyword))
      })
    }

    setFilteredJobs(filtered)
  }, [jobs, locationFilter, jobTypeFilter, searchQuery, categoryFilter])

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, locationFilter, jobTypeFilter, searchQuery, categoryFilter, filterJobs])

  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query)
    setLocationFilter(location)
    setShowFilters(true)
  }

  const handleCategoryClick = (category: string) => {
    setCategoryFilter(category)
    setShowFilters(true)
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection onSearch={handleSearch} jobCount={jobs.length} />
        
        <JobCategories onCategoryClick={handleCategoryClick} />
        
        {showFilters && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {categoryFilter ? `${categoryFilter} Jobs` : 'Job Opportunities'}
              </h2>
              <p className="text-gray-600">
                {filteredJobs.length} positions found
                {searchQuery && ` for "${searchQuery}"`}
                {locationFilter && ` in ${locationFilter}`}
              </p>
            </div>

            <JobFilters
              location={locationFilter}
              jobType={jobTypeFilter}
              onLocationChange={setLocationFilter}
              onJobTypeChange={setJobTypeFilter}
            />

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
                    <div className="flex gap-4">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <JobList jobs={filteredJobs} />
            )}
          </section>
        )}
        
        <FeaturedCompanies />
        <JobStatistics />
      </main>
    </>
  )
}