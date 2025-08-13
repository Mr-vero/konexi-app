import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
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

  if (profile?.user_type !== 'employer') {
    redirect('/dashboard')
  }

  // Get the job to check permissions
  const { data: job } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies(*)
    `)
    .eq('id', params.id)
    .single()

  if (!job) {
    redirect('/dashboard/employer/jobs')
  }

  // Check if user has permission to publish this job
  const isAuthorized = 
    job.posted_by === profile.id || 
    (job.company && job.company.created_by === profile.id)

  if (!isAuthorized) {
    redirect('/dashboard/employer/jobs')
  }

  // Update job to active status
  const { error } = await supabase
    .from('jobs')
    .update({ 
      is_active: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', params.id)

  if (error) {
    console.error('Error publishing job:', error)
    redirect(`/jobs/${params.id}/preview?error=publish`)
  }

  // Redirect to the live job page
  redirect(`/jobs/${params.id}`)
}