'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { Container, PageHeader, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { BriefcaseIcon, UserGroupIcon, ChartBarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import type { Company, Job } from '@/lib/types/database'

export default function EmployerDashboard() {
  const { userProfile, userType } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [company, setCompany] = useState<Company | null>(null)
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    viewsThisWeek: 0,
    pendingReviews: 0,
  })
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userType !== 'employer') {
      router.push('/dashboard')
      return
    }

    fetchDashboardData()
  }, [userType, router])

  const fetchDashboardData = async () => {
    if (!userProfile) return

    try {
      // Fetch company
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('created_by', userProfile.id)
        .single()

      if (companyData) {
        setCompany(companyData)

        // Fetch stats
        const { data: jobs } = await supabase
          .from('jobs')
          .select('id, view_count, application_count, created_at')
          .eq('company_id', companyData.id)
          .eq('is_active', true)

        const activeJobs = jobs?.length || 0
        const totalApplications = jobs?.reduce((sum, job) => sum + job.application_count, 0) || 0
        
        // Calculate views this week
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        const viewsThisWeek = jobs?.reduce((sum, job) => sum + job.view_count, 0) || 0

        // Fetch pending applications
        const { count: pendingCount } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .in('job_id', jobs?.map(j => j.id) || [])
          .eq('status', 'pending')

        setStats({
          activeJobs,
          totalApplications,
          viewsThisWeek,
          pendingReviews: pendingCount || 0,
        })

        // Fetch recent jobs
        const { data: recentJobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('company_id', companyData.id)
          .order('created_at', { ascending: false })
          .limit(5)

        setRecentJobs(recentJobsData || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </Container>
    )
  }

  if (!company) {
    return (
      <Container className="py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="py-12">
            <BuildingOfficeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Company Profile</h2>
            <p className="text-gray-600 mb-6">
              You need to create a company profile to start posting jobs.
            </p>
            <Button onClick={() => router.push('/onboarding/employer')}>
              Create Company Profile
            </Button>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={`Welcome back, ${userProfile?.first_name || 'Employer'}`}
        description={company.name}
        action={
          <Button onClick={() => router.push('/jobs/new')}>
            Post New Job
          </Button>
        }
      />

      <Container className="py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <BriefcaseIcon className="h-12 w-12 text-coral-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.activeJobs}</p>
                <p className="text-gray-600">Active Jobs</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <UserGroupIcon className="h-12 w-12 text-teal-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.totalApplications}</p>
                <p className="text-gray-600">Total Applications</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <ChartBarIcon className="h-12 w-12 text-ocean-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.viewsThisWeek}</p>
                <p className="text-gray-600">Views This Week</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="relative">
                <UserGroupIcon className="h-12 w-12 text-warm-500 mr-4" />
                {stats.pendingReviews > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {stats.pendingReviews}
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingReviews}</p>
                <p className="text-gray-600">Pending Reviews</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Job Postings</CardTitle>
              </CardHeader>
              <CardContent>
                {recentJobs.length > 0 ? (
                  <div className="space-y-4">
                    {recentJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h4 className="font-medium">{job.title}</h4>
                          <p className="text-sm text-gray-600">
                            {job.location} • {job.application_count} applications
                          </p>
                        </div>
                        <Link href={`/jobs/${job.id}/applications`}>
                          <Button variant="outline" size="sm">
                            View Applications
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No jobs posted yet. Post your first job to start receiving applications!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => router.push('/jobs/new')}
                >
                  Post New Job
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => router.push('/dashboard/employer/jobs')}
                >
                  Manage Jobs
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => router.push('/dashboard/employer/company')}
                >
                  Edit Company Profile
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => router.push('/dashboard/employer/applications')}
                >
                  Review Applications
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/help/hiring-tips" className="block text-sm text-coral-600 hover:text-coral-700">
                  Hiring Best Practices →
                </Link>
                <Link href="/help/job-posting-guide" className="block text-sm text-coral-600 hover:text-coral-700">
                  How to Write Job Descriptions →
                </Link>
                <Link href="/help/employer-faq" className="block text-sm text-coral-600 hover:text-coral-700">
                  Employer FAQ →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}