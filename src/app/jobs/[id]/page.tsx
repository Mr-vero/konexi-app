import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Container, Card, CardContent, Button, Badge } from '@/components/ui'
import { 
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CheckCircleIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default async function JobDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = await createClient()
  
  // Get job with company details
  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies(*),
      posted_by:user_profiles(first_name, last_name)
    `)
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  if (error || !job) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()
  
  // Check if user has already applied
  let hasApplied = false
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()
    
    if (profile) {
      const { data: application } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', job.id)
        .eq('applicant_id', profile.id)
        .single()
      
      hasApplied = !!application
    }
  }

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
      return `${formatter.format(min)} - ${formatter.format(max)} per year`
    } else if (min) {
      return `From ${formatter.format(min)} per year`
    } else if (max) {
      return `Up to ${formatter.format(max)} per year`
    }
  }

  const daysAgo = Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24))
  const postedText = daysAgo === 0 ? 'Posted today' : daysAgo === 1 ? 'Posted 1 day ago' : `Posted ${daysAgo} days ago`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <Container className="py-6">
          <Link href="/jobs" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to jobs
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-6 text-gray-600">
                <Link href={`/companies/${job.company.id}`} className="flex items-center gap-2 hover:text-coral-600">
                  <BuildingOfficeIcon className="h-5 w-5" />
                  {job.company.name}
                </Link>
                <span className="flex items-center gap-1">
                  <MapPinIcon className="h-5 w-5" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-5 w-5" />
                  {postedText}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="coral">{jobTypeLabels[job.job_type]}</Badge>
                <Badge variant="teal">{experienceLevelLabels[job.experience_level]}</Badge>
                <Badge variant="info">{locationTypeLabels[job.location_type]}</Badge>
                {job.application_deadline && new Date(job.application_deadline) > new Date() && (
                  <Badge variant="warning">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Apply by {new Date(job.application_deadline).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>

            {job.company.logo_url && (
              <img
                src={job.company.logo_url}
                alt={job.company.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
            )}
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                {/* Salary */}
                {formatSalary(job.salary_min, job.salary_max, job.salary_currency) && (
                  <div className="mb-6 p-4 bg-teal-50 rounded-lg">
                    <div className="flex items-center gap-2 text-teal-900 font-medium text-lg">
                      <CurrencyDollarIcon className="h-6 w-6" />
                      {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                    </div>
                  </div>
                )}

                {/* Job Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Role</h2>
                  <div className="prose prose-sm max-w-none text-gray-600">
                    <p className="whitespace-pre-wrap">{job.description}</p>
                  </div>
                </div>

                {/* Responsibilities */}
                {job.responsibilities && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Responsibilities</h2>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <p className="whitespace-pre-wrap">{job.responsibilities}</p>
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {job.requirements && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <p className="whitespace-pre-wrap">{job.requirements}</p>
                    </div>
                  </div>
                )}

                {/* Required Skills */}
                {job.skills_required && job.skills_required.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_required.map((skill, index) => (
                        <Badge key={index} variant="coral" size="lg">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {job.education_required && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
                    <p className="text-gray-600">{job.education_required}</p>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {job.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-600">
                          <CheckCircleIcon className="h-5 w-5 text-teal-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-4">Ready to Apply?</h3>
                {hasApplied ? (
                  <div className="text-center py-6">
                    <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">You've already applied to this job</p>
                    <Link href="/applications">
                      <Button variant="outline" fullWidth>
                        View Your Applications
                      </Button>
                    </Link>
                  </div>
                ) : user ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Show {job.company.name} you're the right fit for this role.
                    </p>
                    <Link href={`/jobs/${job.id}/apply`}>
                      <Button fullWidth variant="primary">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Sign in to apply for this position
                    </p>
                    <Link href="/login">
                      <Button fullWidth variant="primary">
                        Sign In to Apply
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-500 text-center">
                      Don't have an account?{' '}
                      <Link href="/signup" className="text-coral-600 hover:text-coral-700">
                        Sign up
                      </Link>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-4">About {job.company.name}</h3>
                <div className="space-y-4">
                  {job.company.logo_url && (
                    <img
                      src={job.company.logo_url}
                      alt={job.company.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}
                  {job.company.description && (
                    <p className="text-sm text-gray-600 line-clamp-4">
                      {job.company.description}
                    </p>
                  )}
                  <div className="space-y-2 text-sm text-gray-600">
                    {job.company.industry && (
                      <div className="flex items-center gap-2">
                        <BriefcaseIcon className="h-4 w-4" />
                        {job.company.industry}
                      </div>
                    )}
                    {job.company.size && (
                      <div className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4" />
                        {job.company.size} employees
                      </div>
                    )}
                    {job.company.location && (
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4" />
                        {job.company.location}
                      </div>
                    )}
                  </div>
                  <Link href={`/companies/${job.company.id}`}>
                    <Button size="sm" variant="outline" fullWidth>
                      View Company Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Job Info */}
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-4">Job Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Job Type</p>
                    <p className="font-medium text-gray-900">{jobTypeLabels[job.job_type]}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Experience Level</p>
                    <p className="font-medium text-gray-900">{experienceLevelLabels[job.experience_level]}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Work Location</p>
                    <p className="font-medium text-gray-900">{locationTypeLabels[job.location_type]}</p>
                  </div>
                  {job.application_deadline && (
                    <div>
                      <p className="text-gray-500">Application Deadline</p>
                      <p className="font-medium text-gray-900">
                        {new Date(job.application_deadline).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500">Posted</p>
                    <p className="font-medium text-gray-900">
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Jobs (Optional - for later) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Jobs</h2>
          <p className="text-gray-600">Check back later for similar opportunities</p>
        </div>
      </Container>
    </div>
  )
}