'use client'

import { useState } from 'react'
import { JobCard } from './JobCard'
import { Database } from '@/lib/types/database'

type Job = Database['public']['Tables']['jobs']['Row']

interface JobListProps {
  jobs: Job[]
}

export function JobList({ jobs }: JobListProps) {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium mb-2">No jobs found</p>
          <p className="text-gray-500">Try adjusting your filters or search criteria</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard 
          key={job.id} 
          job={job} 
          onSave={handleSaveJob}
          isSaved={savedJobs.has(job.id)}
        />
      ))}
    </div>
  )
}