import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Container, PageHeader, Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { BookmarkIcon, BriefcaseIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import type { UserProfile, Job, Application } from '@/lib/types/database'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Redirect employers to their dashboard
  if (profile?.user_type === 'employer') {
    redirect('/dashboard/employer')
  }

  // Get recent applications
  const { data: recentApplications } = await supabase
    .from('applications')
    .select(`
      *,
      job:jobs(
        id,
        title,
        location,
        company:companies(name)
      )
    `)
    .eq('applicant_id', profile?.id)
    .order('applied_at', { ascending: false })
    .limit(5)

  // Get saved jobs count
  const { count: savedJobsCount } = await supabase
    .from('saved_jobs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile?.id)

  // Get recommended jobs
  const { data: recommendedJobs } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies(name, logo_url)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = {
    applications: recentApplications?.length || 0,
    savedJobs: savedJobsCount || 0,
    profileViews: 0, // This would need to be tracked separately
    profileCompleteness: calculateProfileCompleteness(profile),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={`Welcome back, ${profile?.first_name || 'Job Seeker'}`}
        description="Your job search dashboard"
        action={
          <Link href="/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        }
      />

      <Container className="py-8">
        {/* Profile completion alert */}
        {stats.profileCompleteness < 100 && (
          <div className="mb-6 bg-warm-50 border border-warm-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Complete your profile</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your profile is {stats.profileCompleteness}% complete. Complete it to improve your chances of getting hired.
                </p>
              </div>
              <Link href="/profile/edit">
                <Button variant="secondary" size="sm">
                  Complete Profile
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <DocumentTextIcon className="h-12 w-12 text-coral-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.applications}</p>
                <p className="text-gray-600">Applications</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <BookmarkIcon className="h-12 w-12 text-teal-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.savedJobs}</p>
                <p className="text-gray-600">Saved Jobs</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <UserIcon className="h-12 w-12 text-ocean-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.profileViews}</p>
                <p className="text-gray-600">Profile Views</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <BriefcaseIcon className="h-12 w-12 text-warm-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.profileCompleteness}%</p>
                <p className="text-gray-600">Profile Complete</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {recentApplications && recentApplications.length > 0 ? (
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h4 className="font-medium">{application.job?.title}</h4>
                          <p className="text-sm text-gray-600">
                            {application.job?.company?.name} • {application.job?.location}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Applied {new Date(application.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                        <ApplicationStatusBadge status={application.status} />
                      </div>
                    ))}
                    <Link href="/applications" className="block text-center pt-2">
                      <Button variant="ghost" fullWidth>
                        View All Applications
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    You haven't applied to any jobs yet. Start browsing jobs to find your next opportunity!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recommended Jobs */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recommended Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {recommendedJobs && recommendedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {recommendedJobs.map((job) => (
                      <Link key={job.id} href={`/jobs/${job.id}`}>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-start gap-4">
                            {job.company?.logo_url ? (
                              <img
                                src={job.company.logo_url}
                                alt={job.company.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <BriefcaseIcon className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium">{job.title}</h4>
                              <p className="text-sm text-gray-600">
                                {job.company?.name} • {job.location}
                              </p>
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {job.job_type.replace('_', ' ')}
                                </span>
                                {job.salary_max && (
                                  <span className="text-xs text-gray-600">
                                    ${job.salary_min?.toLocaleString()} - ${job.salary_max.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No recommended jobs at the moment. Check back later!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/jobs">
                  <Button fullWidth variant="outline">
                    Browse Jobs
                  </Button>
                </Link>
                <Link href="/profile/edit">
                  <Button fullWidth variant="outline">
                    Edit Profile
                  </Button>
                </Link>
                <Link href="/profile/resume">
                  <Button fullWidth variant="outline">
                    Upload Resume
                  </Button>
                </Link>
                <Link href="/saved-jobs">
                  <Button fullWidth variant="outline">
                    View Saved Jobs
                  </Button>
                </Link>
                <Link href="/job-alerts">
                  <Button fullWidth variant="outline">
                    Set Job Alerts
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Search Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/help/resume-tips" className="block text-sm text-coral-600 hover:text-coral-700">
                  Resume Writing Tips →
                </Link>
                <Link href="/help/interview-prep" className="block text-sm text-coral-600 hover:text-coral-700">
                  Interview Preparation →
                </Link>
                <Link href="/help/salary-negotiation" className="block text-sm text-coral-600 hover:text-coral-700">
                  Salary Negotiation Guide →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}

function calculateProfileCompleteness(profile: UserProfile | null): number {
  if (!profile) return 0
  
  const fields = [
    profile.first_name,
    profile.last_name,
    profile.phone,
    profile.location,
    profile.bio,
    profile.skills && profile.skills.length > 0,
    profile.experience_level,
    profile.resume_url,
  ]
  
  const completed = fields.filter(Boolean).length
  return Math.round((completed / fields.length) * 100)
}

function ApplicationStatusBadge({ status }: { status: string }) {
  const styles = {
    pending: 'bg-yellow-50 text-yellow-700',
    reviewing: 'bg-blue-50 text-blue-700',
    interview: 'bg-purple-50 text-purple-700',
    offer: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700',
    withdrawn: 'bg-gray-50 text-gray-700',
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}