import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Container, PageHeader, Card, CardContent, Button, Badge } from '@/components/ui'
import { 
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CheckCircleIcon,
  PencilIcon,
  ArrowLeftIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default async function JobPreviewPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get job with company details
  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies(*),
      posted_by:user_profiles(*)
    `)
    .eq('id', params.id)
    .single()

  if (error || !job) {
    notFound()
  }

  // Check if user is the job poster or from the same company
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const isAuthorized = 
    job.posted_by.user_id === user.id || 
    (userProfile && job.company_id === job.company.created_by)

  if (!isAuthorized) {
    redirect('/jobs')
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

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Preview Job Posting"
        description="Review your job posting before publishing"
        action={
          <div className="flex items-center gap-3">
            <Link href={`/jobs/${job.id}/edit`}>
              <Button variant="outline" leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
                Back to Edit
              </Button>
            </Link>
          </div>
        }
      />

      <Container className="py-8">
        {/* Preview Notice */}
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800">
              This is a preview
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              {job.is_active 
                ? "This job is currently active but you're viewing it in preview mode. Click 'View Live' to see the public version."
                : "This job is saved as a draft. Review the details below and click 'Publish Job' when you're ready to make it live."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                {/* Job Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {job.title}
                      </h1>
                      <div className="flex items-center gap-4 text-gray-600">
                        <span className="flex items-center gap-1">
                          <BuildingOfficeIcon className="h-5 w-5" />
                          {job.company.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-5 w-5" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="coral">{jobTypeLabels[job.job_type]}</Badge>
                    <Badge variant="teal">{experienceLevelLabels[job.experience_level]}</Badge>
                    <Badge variant="info">{locationTypeLabels[job.location_type]}</Badge>
                    {job.application_deadline && (
                      <Badge variant="warning">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        Apply by {new Date(job.application_deadline).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Salary */}
                {formatSalary(job.salary_min, job.salary_max, job.salary_currency) && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-600" />
                      {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                    </div>
                  </div>
                )}

                {/* Job Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">About the Role</h2>
                  <div className="prose prose-sm max-w-none text-gray-600">
                    <p className="whitespace-pre-wrap">{job.description}</p>
                  </div>
                </div>

                {/* Responsibilities */}
                {job.responsibilities && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Responsibilities</h2>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <p className="whitespace-pre-wrap">{job.responsibilities}</p>
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {job.requirements && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <p className="whitespace-pre-wrap">{job.requirements}</p>
                    </div>
                  </div>
                )}

                {/* Required Skills */}
                {job.skills_required && job.skills_required.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h2>
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
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
                    <p className="text-gray-600">{job.education_required}</p>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Benefits & Perks</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            {/* Actions */}
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-4">Actions</h3>
                <div className="space-y-3">
                  {!job.is_active ? (
                    <>
                      <form action={`/api/jobs/${job.id}/publish`} method="POST">
                        <Button 
                          type="submit"
                          fullWidth 
                          variant="primary"
                          leftIcon={<RocketLaunchIcon className="h-4 w-4" />}
                        >
                          Publish Job
                        </Button>
                      </form>
                      <Link href={`/jobs/${job.id}/edit`}>
                        <Button 
                          fullWidth 
                          variant="outline"
                          leftIcon={<PencilIcon className="h-4 w-4" />}
                        >
                          Edit Draft
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href={`/jobs/${job.id}`}>
                        <Button 
                          fullWidth 
                          variant="primary"
                        >
                          View Live Job
                        </Button>
                      </Link>
                      <Link href={`/jobs/${job.id}/edit`}>
                        <Button 
                          fullWidth 
                          variant="outline"
                          leftIcon={<PencilIcon className="h-4 w-4" />}
                        >
                          Edit Job
                        </Button>
                      </Link>
                    </>
                  )}
                  <Link href="/dashboard/employer/jobs">
                    <Button fullWidth variant="ghost">
                      Back to Jobs
                    </Button>
                  </Link>
                </div>
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
                    <p className="text-sm text-gray-600 line-clamp-3">
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

            {/* Job Status */}
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-4">Job Status</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge variant={job.is_active ? 'success' : 'warning'}>
                      {job.is_active ? 'Active' : 'Draft'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created</span>
                    <span className="text-gray-900">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {job.updated_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="text-gray-900">
                        {new Date(job.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted By</span>
                    <span className="text-gray-900">
                      {job.posted_by.first_name} {job.posted_by.last_name}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}