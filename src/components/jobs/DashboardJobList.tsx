'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Database } from '@/lib/types/database'

type Job = Database['public']['Tables']['jobs']['Row']

interface DashboardJobListProps {
  jobs: Job[]
}

export function DashboardJobList({ jobs: initialJobs }: DashboardJobListProps) {
  const [jobs, setJobs] = useState(initialJobs)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) {
      return
    }

    setDeleting(jobId)
    
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId)

    if (error) {
      alert('Error deleting job: ' + error.message)
    } else {
      setJobs(jobs.filter(job => job.id !== jobId))
    }
    
    setDeleting(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 mb-4">You haven&apos;t posted any jobs yet.</p>
        <Link href="/jobs/new">
          <Button>Post Your First Job</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {jobs.map((job) => (
          <li key={job.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Link href={`/jobs/${job.id}`} className="hover:underline">
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  </Link>
                  <p className="text-gray-600">{job.company_name} • {job.location}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Posted on {formatDate(job.created_at)}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link href={`/jobs/${job.id}/edit`}>
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(job.id)}
                    disabled={deleting === job.id}
                  >
                    {deleting === job.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}