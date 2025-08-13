import { createClient } from '@/lib/supabase/server'
import { Container, PageHeader, Card, CardContent, Input, Select, Badge, Button } from '@/components/ui'
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import type { JobType, ExperienceLevel, LocationType } from '@/lib/types/database'

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { 
    search?: string
    location?: string
    type?: JobType
    experience?: ExperienceLevel
    locationType?: LocationType
    sort?: string
  }
}) {
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from('jobs')
    .select(`
      *,
      company:companies(id, name, logo_url, industry)
    `)
    .eq('is_active', true)

  // Apply filters
  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }
  if (searchParams.location) {
    query = query.ilike('location', `%${searchParams.location}%`)
  }
  if (searchParams.type) {
    query = query.eq('job_type', searchParams.type)
  }
  if (searchParams.experience) {
    query = query.eq('experience_level', searchParams.experience)
  }
  if (searchParams.locationType) {
    query = query.eq('location_type', searchParams.locationType)
  }

  // Apply sorting
  switch (searchParams.sort) {
    case 'salary':
      query = query.order('salary_max', { ascending: false, nullsFirst: false })
      break
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data: jobs, error } = await query

  const jobTypeLabels = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    contract: 'Contract',
    internship: 'Internship',
    freelance: 'Freelance'
  }

  const experienceLevelLabels = {
    entry: 'Entry Level',
    mid: 'Mid Level',
    senior: 'Senior Level',
    executive: 'Executive'
  }

  const locationTypeLabels = {
    onsite: 'On-site',
    remote: 'Remote',
    hybrid: 'Hybrid'
  }

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return null
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    })
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`
    } else if (min) {
      return `From ${formatter.format(min)}`
    } else if (max) {
      return `Up to ${formatter.format(max)}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Find Your Next Opportunity"
        description="Browse thousands of jobs from top companies"
      />

      <Container className="py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="search"
                  name="search"
                  placeholder="Search jobs by title or description..."
                  defaultValue={searchParams.search}
                  leftIcon={
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
                <Input
                  type="text"
                  name="location"
                  placeholder="Location (city, state, or country)"
                  defaultValue={searchParams.location}
                  leftIcon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  name="type"
                  defaultValue={searchParams.type || ''}
                  options={[
                    { value: '', label: 'All Job Types' },
                    { value: 'full_time', label: 'Full Time' },
                    { value: 'part_time', label: 'Part Time' },
                    { value: 'contract', label: 'Contract' },
                    { value: 'internship', label: 'Internship' },
                    { value: 'freelance', label: 'Freelance' }
                  ]}
                />
                <Select
                  name="experience"
                  defaultValue={searchParams.experience || ''}
                  options={[
                    { value: '', label: 'All Experience Levels' },
                    { value: 'entry', label: 'Entry Level' },
                    { value: 'mid', label: 'Mid Level' },
                    { value: 'senior', label: 'Senior Level' },
                    { value: 'executive', label: 'Executive' }
                  ]}
                />
                <Select
                  name="locationType"
                  defaultValue={searchParams.locationType || ''}
                  options={[
                    { value: '', label: 'All Locations' },
                    { value: 'onsite', label: 'On-site' },
                    { value: 'remote', label: 'Remote' },
                    { value: 'hybrid', label: 'Hybrid' }
                  ]}
                />
                <Select
                  name="sort"
                  defaultValue={searchParams.sort || ''}
                  options={[
                    { value: '', label: 'Newest First' },
                    { value: 'oldest', label: 'Oldest First' },
                    { value: 'salary', label: 'Highest Salary' }
                  ]}
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {jobs ? `${jobs.length} jobs found` : 'Loading...'}
                </p>
                <Button type="submit" variant="primary">
                  Apply Filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Jobs List */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading jobs</p>
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => {
              const daysAgo = Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24))
              const postedText = daysAgo === 0 ? 'Posted today' : daysAgo === 1 ? 'Posted yesterday' : `Posted ${daysAgo} days ago`
              
              return (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <Card interactive>
                    <CardContent>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {job.company.logo_url ? (
                            <img
                              src={job.company.logo_url}
                              alt={job.company.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                              <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-coral-600 transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span className="font-medium">{job.company.name}</span>
                              <span className="flex items-center gap-1">
                                <MapPinIcon className="h-4 w-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <ClockIcon className="h-4 w-4" />
                                {postedText}
                              </span>
                            </div>
                            
                            <p className="mt-2 text-gray-600 line-clamp-2">
                              {job.description}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="coral" size="sm">{jobTypeLabels[job.job_type]}</Badge>
                                <Badge variant="teal" size="sm">{experienceLevelLabels[job.experience_level]}</Badge>
                                <Badge variant="info" size="sm">{locationTypeLabels[job.location_type]}</Badge>
                              </div>
                              
                              {formatSalary(job.salary_min, job.salary_max, job.salary_currency) && (
                                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                  <CurrencyDollarIcon className="h-4 w-4" />
                                  {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                                </div>
                              )}
                            </div>

                            {job.skills_required && job.skills_required.length > 0 && (
                              <div className="flex items-center gap-2 mt-3">
                                <SparklesIcon className="h-4 w-4 text-gray-400" />
                                <div className="flex flex-wrap gap-1">
                                  {job.skills_required.slice(0, 3).map((skill, index) => (
                                    <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                      {skill}
                                    </span>
                                  ))}
                                  {job.skills_required.length > 3 && (
                                    <span className="text-xs text-gray-500">
                                      +{job.skills_required.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {job.application_deadline && new Date(job.application_deadline) > new Date() && (
                          <Badge variant="warning" size="sm">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            Deadline {new Date(job.application_deadline).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              {searchParams.search || searchParams.location || searchParams.type || searchParams.experience || searchParams.locationType
                ? 'Try adjusting your filters to see more results'
                : 'Check back later for new opportunities'}
            </p>
          </div>
        )}
      </Container>
    </div>
  )
}