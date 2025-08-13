import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader, Container } from '@/components/ui'
import { JobForm } from '@/components/jobs/JobForm'

export default async function NewJobPage() {
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

  // Check if they have a company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('created_by', profile.id)
    .single()

  if (!company) {
    redirect('/onboarding/employer')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Post a New Job"
        description="Find the perfect candidate for your open position"
      />
      <Container className="py-8">
        <JobForm mode="create" companyId={company.id} />
      </Container>
    </div>
  )
}