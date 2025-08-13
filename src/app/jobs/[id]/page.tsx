import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !job) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const jobTypeColors = {
    'Full-Time': 'bg-green-100 text-green-800',
    'Part-Time': 'bg-blue-100 text-blue-800',
    'Contract': 'bg-purple-100 text-purple-800'
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Back to all jobs
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-xl text-gray-600">{job.company_name}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${jobTypeColors[job.job_type]}`}>
                {job.job_type}
              </span>
            </div>
            
            <div className="flex items-center text-gray-500 space-x-4">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
              <span>Posted on {formatDate(job.created_at)}</span>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {job.description}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Ready to apply?</h3>
              <p className="text-gray-600 mb-4">
                Contact {job.company_name} directly to express your interest in this position.
              </p>
              <Button>
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}