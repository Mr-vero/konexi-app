'use client'

import { useEffect, useState, useCallback } from 'react'
import { Header } from '@/components/Header'
import { JobList } from '@/components/jobs/JobList'
import { JobFilters } from '@/components/jobs/JobFilters'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'

type Job = Database['public']['Tables']['jobs']['Row']

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [locationFilter, setLocationFilter] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('')

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

    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    if (jobTypeFilter) {
      filtered = filtered.filter(job => job.job_type === jobTypeFilter)
    }

    setFilteredJobs(filtered)
  }, [jobs, locationFilter, jobTypeFilter])

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, locationFilter, jobTypeFilter, filterJobs])

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-gray-600">
            Browse through our latest job postings
          </p>
        </div>

        <JobFilters
          location={locationFilter}
          jobType={jobTypeFilter}
          onLocationChange={setLocationFilter}
          onJobTypeChange={setJobTypeFilter}
        />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <JobList jobs={filteredJobs} />
        )}
      </main>
    </>
  )
}