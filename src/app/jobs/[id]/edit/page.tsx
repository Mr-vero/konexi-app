import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { PageHeader, Container } from '@/components/ui'
import { JobForm } from '@/components/jobs/JobForm'

export default async function EditJobPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user profile to check if they're an employer
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (profile?.user_type !== 'employer') {
    redirect('/dashboard')
  }

  // Get the job to edit
  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies(*)
    `)
    .eq('id', params.id)
    .single()

  if (error || !job) {
    notFound()
  }

  // Check if user has permission to edit this job
  const isAuthorized = 
    job.posted_by === profile.id || 
    job.company.created_by === profile.id

  if (!isAuthorized) {
    redirect('/dashboard/employer/jobs')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Edit Job Posting"
        description={`Editing "${job.title}"`}
      />
      <Container className="py-8">
        <JobForm mode="edit" job={job} companyId={job.company_id} />
      </Container>
    </div>
  )
}