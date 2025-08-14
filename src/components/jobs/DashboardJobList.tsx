'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Database } from '@/lib/types/database'
import { Eye, Edit, Trash2, Calendar, MapPin, Users, Briefcase, Plus } from 'lucide-react'

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
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getJobTypeVariant = (jobType: string) => {
    switch (jobType) {
      case 'Full-Time':
        return 'success'
      case 'Part-Time':
        return 'primary'
      case 'Contract':
        return 'secondary'
      default:
        return 'default'
    }
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
        <p className="text-gray-500 text-center mb-6 max-w-sm">
          Start attracting top talent by posting your first job opening.
        </p>
        <Link href="/jobs/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Post Your First Job
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Link 
                    href={`/jobs/${job.id}`} 
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {job.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Posted {formatDate(job.created_at)}
                    </span>
                  </div>
                </div>
                <Badge variant={getJobTypeVariant(job.job_type)} className="ml-4">
                  {job.job_type}
                </Badge>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {job.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>0 views</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>0 applications</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link href={`/jobs/${job.id}`}>
                <Button size="sm" variant="secondary">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </Link>
              <Link href={`/jobs/${job.id}/edit`}>
                <Button size="sm" variant="secondary">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(job.id)}
                disabled={deleting === job.id}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {deleting === job.id ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}