'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { JobList } from '@/components/jobs/JobList'
import { Database } from '@/lib/types/database'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Filter,
  X,
  ChevronDown,
  Calendar,
  DollarSign,
  Building2,
  Sparkles
} from 'lucide-react'

type Job = Database['public']['Tables']['jobs']['Row']

interface JobSearchClientProps {
  initialJobs: Job[]
}

export function JobSearchClient({ initialJobs }: JobSearchClientProps) {
  const searchParams = useSearchParams()
  const [jobs] = useState<Job[]>(initialJobs)
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '')
  const [jobTypeFilter, setJobTypeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '')
  const [showFilters, setShowFilters] = useState(true)
  const [sortBy, setSortBy] = useState('newest')

  const jobTypes = ['Full-Time', 'Part-Time', 'Contract']
  const locations = [...new Set(jobs.map(job => job.location))].sort()

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

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredJobs(filtered)
  }, [jobs, searchQuery, locationFilter, jobTypeFilter, categoryFilter, sortBy])

  useEffect(() => {
    filterJobs()
  }, [filterJobs])

  const activeFiltersCount = [searchQuery, locationFilter, jobTypeFilter, categoryFilter].filter(Boolean).length

  const clearAllFilters = () => {
    setSearchQuery('')
    setLocationFilter('')
    setJobTypeFilter('')
    setCategoryFilter('')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search job title, company, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Location Input */}
            <div className="sm:w-64 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
              className="px-6"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="danger" size="sm" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <Badge variant="primary" className="gap-1">
                  {searchQuery}
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {locationFilter && (
                <Badge variant="primary" className="gap-1">
                  <MapPin className="w-3 h-3" />
                  {locationFilter}
                  <button onClick={() => setLocationFilter('')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {jobTypeFilter && (
                <Badge variant="primary" className="gap-1">
                  <Briefcase className="w-3 h-3" />
                  {jobTypeFilter}
                  <button onClick={() => setJobTypeFilter('')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {categoryFilter && (
                <Badge variant="primary" className="gap-1">
                  {categoryFilter}
                  <button onClick={() => setCategoryFilter('')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-700 ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0">
              <Card className="sticky top-32">
                <div className="p-6 space-y-6">
                  {/* Job Type */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Job Type
                    </h3>
                    <div className="space-y-2">
                      {jobTypes.map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="jobType"
                            value={type}
                            checked={jobTypeFilter === type}
                            onChange={(e) => setJobTypeFilter(e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                      <button
                        onClick={() => setJobTypeFilter('')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </h3>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All locations</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Experience Level
                    </h3>
                    <div className="space-y-2">
                      {['Entry Level', 'Mid Level', 'Senior Level', 'Executive'].map((level) => (
                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="text-blue-600 focus:ring-blue-500 rounded"
                          />
                          <span className="text-sm text-gray-700">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Posted Date */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date Posted
                    </h3>
                    <div className="space-y-2">
                      {['Last 24 hours', 'Last 3 days', 'Last 7 days', 'Last 30 days'].map((range) => (
                        <label key={range} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="dateRange"
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </aside>
          )}

          {/* Job Listings */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {categoryFilter ? `${categoryFilter} Jobs` : (searchQuery || locationFilter ? 'Search Results' : 'All Jobs')}
                </h1>
                <p className="text-gray-600 mt-1">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                  {searchQuery && ` for "${searchQuery}"`}
                  {locationFilter && ` in ${locationFilter}`}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <Button variant="secondary" size="sm" className="gap-2">
                  Sort by
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Job List */}
            <JobList jobs={filteredJobs} />
          </div>
        </div>
      </div>
    </main>
  )
}