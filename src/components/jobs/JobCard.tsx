'use client'

import Link from 'next/link'
import { MapPin, Clock, Building2, Bookmark } from 'lucide-react'
import { Database } from '@/lib/types/database'

type Job = Database['public']['Tables']['jobs']['Row']

interface JobCardProps {
  job: Job
  onSave?: (jobId: string) => void
  isSaved?: boolean
}

export function JobCard({ job, onSave, isSaved = false }: JobCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const jobTypeColors = {
    'Full-Time': 'bg-green-50 text-green-700 border-green-200',
    'Part-Time': 'bg-blue-50 text-blue-700 border-blue-200',
    'Contract': 'bg-purple-50 text-purple-700 border-purple-200'
  }

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSave?.(job.id)
  }

  return (
    <div className="relative group">
      <Link href={`/jobs/${job.id}`}>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 relative overflow-hidden">
          {/* Hover effect gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{job.company_name}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSaveClick}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Save job"
              >
                <Bookmark 
                  className={`w-5 h-5 transition-colors ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`} 
                />
              </button>
            </div>
            
            <p className="text-gray-600 line-clamp-2 mb-4 text-sm leading-relaxed">
              {job.description}
            </p>
            
            {/* Job details */}
            <div className="flex flex-wrap gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${jobTypeColors[job.job_type]}`}>
                {job.job_type}
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatDate(job.created_at)}</span>
              </div>
              <span className="text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View details →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}