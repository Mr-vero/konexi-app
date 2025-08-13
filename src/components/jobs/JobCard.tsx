import Link from 'next/link'
import { Database } from '@/lib/types/database'

type Job = Database['public']['Tables']['jobs']['Row']

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
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
    <Link href={`/jobs/${job.id}`}>
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
              {job.title}
            </h3>
            <p className="text-gray-600">{job.company_name}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${jobTypeColors[job.job_type]}`}>
            {job.job_type}
          </span>
        </div>
        
        <p className="text-gray-700 line-clamp-2 mb-3">
          {job.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
          <span>Posted {formatDate(job.created_at)}</span>
        </div>
      </div>
    </Link>
  )
}