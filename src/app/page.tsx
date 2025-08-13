'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { JobList } from '@/components/jobs/JobList'
import { JobFilters } from '@/components/jobs/JobFilters'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { Job } from '@/lib/types/database'
import { 
  MagnifyingGlassIcon, 
  MapPinIcon,   
  BriefcaseIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [locationFilter, setLocationFilter] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchJobs = async () => {
    const supabase = createClient()
    
    try {
      // Try to fetch from the new jobs table first
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching jobs:', error)
        // If there's an error (table doesn't exist or no data), create some sample data
        setJobs([])
      } else {
        setJobs(data || [])
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
      setJobs([])
    }
    setLoading(false)
  }

  const filterJobs = useCallback(() => {
    let filtered = jobs

    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
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

    setFilteredJobs(filtered)
  }, [jobs, locationFilter, jobTypeFilter, searchQuery])

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, locationFilter, jobTypeFilter, searchQuery, filterJobs])

  const stats = [
    { label: 'Active Jobs', value: jobs.length, icon: BriefcaseIcon },
    { label: 'Companies', value: '50+', icon: BuildingOfficeIcon },
    { label: 'Job Seekers', value: '1.2k+', icon: UsersIcon },
    { label: 'Success Rate', value: '94%', icon: ArrowTrendingUpIcon },
  ]

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-coral-50 via-white to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="heading-1 mb-6 max-w-4xl mx-auto">
              Find Your Dream Job with 
              <span className="bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text text-transparent"> Konexi</span>
            </h1>
            <p className="body-large mb-12 max-w-2xl mx-auto">
              Connect with top employers and discover opportunities that match your skills. 
              Join thousands of professionals who found their perfect role through our platform.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Job Title Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Job title, keywords, or company"
                        className="input-field pl-12 pr-4 py-3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Location Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="City, state, or remote"
                        className="input-field pl-12 pr-4 py-3"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <Button size="lg" className="px-8">
                    Search Jobs
                  </Button>
                </div>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <span className="text-sm text-gray-500 mr-2">Popular:</span>
              {['React Developer', 'Product Manager', 'Data Scientist', 'UX Designer', 'Remote Work'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:text-coral-600 hover:bg-coral-50 transition-colors border border-gray-200 hover:border-coral-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-coral-500 to-teal-500 rounded-xl mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="heading-2 text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="heading-2 mb-2">
              Latest Opportunities
            </h2>
            <p className="body-normal text-gray-600">
              {filteredJobs.length} jobs found
            </p>
          </div>
          <Link href="/jobs">
            <Button variant="outline">
              View All Jobs
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <JobFilters
                location={locationFilter}
                jobType={jobTypeFilter}
                onLocationChange={setLocationFilter}
                onJobTypeChange={setJobTypeFilter}
              />
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="spinner" />
              </div>
            ) : filteredJobs.length > 0 ? (
              <JobList jobs={filteredJobs.slice(0, 10)} />
            ) : (
              <div className="text-center py-20">
                <BriefcaseIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || locationFilter || jobTypeFilter 
                    ? "Try adjusting your filters to see more results." 
                    : "Be the first to post a job on our platform!"}
                </p>
                {!searchQuery && !locationFilter && !jobTypeFilter && (
                  <Link href="/jobs/new">
                    <Button>Post a Job</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-coral-500 to-teal-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-2 text-white mb-4">
            Ready to find your next opportunity?
          </h2>
          <p className="body-large text-coral-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who trust Konexi to find their perfect role. 
            Create your profile today and get discovered by top employers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button variant="secondary" size="lg">
                Create Free Account
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-coral-600">
                Browse All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}