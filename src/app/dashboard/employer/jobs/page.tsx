'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/AuthProvider'
import { 
  Container, 
  PageHeader, 
  Card, 
  CardContent, 
  Button, 
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui'
import { 
  PlusIcon,
  BriefcaseIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import type { Job } from '@/lib/types/database'

interface JobWithStats extends Job {
  company: {
    id: string
    name: string
    logo_url: string | null
  }
  _count?: {
    applications: number
  }
}

export default function EmployerJobsPage() {
  const router = useRouter()
  const { userProfile, userType } = useAuth()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<JobWithStats[]>([])
  const [activeTab, setActiveTab] = useState('active')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    archived: 0
  })

  useEffect(() => {
    if (userType !== 'employer') {
      router.push('/dashboard')
      return
    }
    fetchJobs()
  }, [userType, router])

  const fetchJobs = async () => {
    if (!userProfile) return

    try {
      // Get company first
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('created_by', userProfile.id)
        .single()

      if (!company) {
        router.push('/onboarding/employer')
        return
      }

      // Get jobs with application counts
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(id, name, logo_url),
          applications(count)
        `)
        .eq('company_id', company.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform the data to include application counts
      const transformedJobs = (jobsData || []).map(job => ({
        ...job,
        _count: {
          applications: job.applications?.[0]?.count || 0
        }
      }))

      setJobs(transformedJobs)

      // Calculate stats
      const activeJobs = transformedJobs.filter(job => job.is_active)
      const draftJobs = transformedJobs.filter(job => !job.is_active)
      
      setStats({
        total: transformedJobs.length,
        active: activeJobs.length,
        draft: draftJobs.length,
        archived: 0 // We'll implement archiving later
      })
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)

      if (error) throw error

      // Refresh jobs list
      fetchJobs()
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Failed to delete job')
    }
  }

  const handleDuplicateJob = async (job: JobWithStats) => {
    try {
      const { id, created_at, updated_at, ...jobData } = job
      
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          ...jobData,
          title: `${job.title} (Copy)`,
          is_active: false, // Always create as draft
          posted_by: userProfile?.id
        }])
        .select()
        .single()

      if (error) throw error

      // Redirect to edit the duplicated job
      router.push(`/jobs/${data.id}/edit`)
    } catch (error) {
      console.error('Error duplicating job:', error)
      alert('Failed to duplicate job')
    }
  }

  const jobTypeLabels = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    contract: 'Contract',
    internship: 'Internship',
    freelance: 'Freelance'
  }

  const getFilteredJobs = () => {
    switch (activeTab) {
      case 'active':
        return jobs.filter(job => job.is_active)
      case 'draft':
        return jobs.filter(job => !job.is_active)
      case 'all':
      default:
        return jobs
    }
  }

  if (loading) {
    return (
      <Container className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Container>
    )
  }

  const filteredJobs = getFilteredJobs()

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Manage Jobs"
        description="Create and manage your job postings"
        action={
          <Link href="/jobs/new">
            <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
              Post New Job
            </Button>
          </Link>
        }
      />

      <Container className="py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <BriefcaseIcon className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-teal-600">{stats.active}</p>
                </div>
                <EyeIcon className="h-8 w-8 text-teal-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.draft}</p>
                </div>
                <PencilIcon className="h-8 w-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Archived</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
                </div>
                <ArchiveBoxIcon className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <Card>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Jobs</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {filteredJobs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <div
                        key={job.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {job.title}
                                </h3>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                  <span>{job.location}</span>
                                  <span>•</span>
                                  <span>{jobTypeLabels[job.job_type]}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    Posted {new Date(job.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                  <Badge variant={job.is_active ? 'success' : 'warning'}>
                                    {job.is_active ? 'Active' : 'Draft'}
                                  </Badge>
                                  {job._count && job._count.applications > 0 && (
                                    <Badge variant="info">
                                      <UsersIcon className="h-3 w-3 mr-1" />
                                      {job._count.applications} applicants
                                    </Badge>
                                  )}
                                  {job.application_deadline && (
                                    <Badge variant="coral">
                                      Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            {job.is_active ? (
                              <>
                                <Link href={`/jobs/${job.id}`}>
                                  <Button size="sm" variant="ghost">
                                    <EyeIcon className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/jobs/${job.id}/edit`}>
                                  <Button size="sm" variant="ghost">
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </>
                            ) : (
                              <>
                                <Link href={`/jobs/${job.id}/preview`}>
                                  <Button size="sm" variant="ghost">
                                    <EyeIcon className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/jobs/${job.id}/edit`}>
                                  <Button size="sm" variant="ghost">
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDuplicateJob(job)}
                            >
                              <DocumentDuplicateIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteJob(job.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {activeTab === 'active' && 'No active jobs'}
                      {activeTab === 'draft' && 'No draft jobs'}
                      {activeTab === 'all' && 'No jobs yet'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {activeTab === 'all' && 'Get started by posting your first job'}
                      {activeTab === 'active' && 'Publish a draft or create a new job'}
                      {activeTab === 'draft' && 'Create a new job to save as draft'}
                    </p>
                    {activeTab === 'all' && (
                      <Link href="/jobs/new">
                        <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
                          Post Your First Job
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}