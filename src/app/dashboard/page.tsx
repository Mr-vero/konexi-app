import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { DashboardJobList } from '@/components/jobs/DashboardJobList'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
            <p className="text-gray-600 mt-2">Manage your job listings</p>
          </div>
          <Link href="/jobs/new">
            <Button>Post New Job</Button>
          </Link>
        </div>

        {error ? (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">Error loading jobs: {error.message}</p>
          </div>
        ) : (
          <DashboardJobList jobs={jobs || []} />
        )}
      </main>
    </>
  )
}