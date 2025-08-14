import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/Header'
import { JobSearchClient } from '@/components/jobs/JobSearchClient'

export default async function JobsPage() {
  const supabase = await createClient()
  
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <>
      <Header />
      <JobSearchClient initialJobs={jobs || []} />
    </>
  )
}