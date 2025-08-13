import { JobCard } from './JobCard'
import { Database } from '@/lib/types/database'

type Job = Database['public']['Tables']['jobs']['Row']

interface JobListProps {
  jobs: Job[]
}

export function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No jobs found</p>
        <p className="text-gray-400 mt-2">Be the first to post a job!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}