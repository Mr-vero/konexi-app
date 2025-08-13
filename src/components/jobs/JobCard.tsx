import Link from 'next/link'
import { Job, JobType, LocationType } from '@/lib/types/database'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  BookmarkIcon,
  BuildingOfficeIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { 
  BookmarkIcon as BookmarkSolidIcon 
} from '@heroicons/react/24/solid'

interface JobCardProps {
  job: Job
  isSaved?: boolean
  onSave?: () => void
  showCompany?: boolean
}

export function JobCard({ job, isSaved = false, onSave, showCompany = true }: JobCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const formatSalary = (min?: number | null, max?: number | null, currency = 'USD') => {
    if (!min && !max) return null
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`
    }
    return formatter.format(min || max || 0)
  }

  const getJobTypeVariant = (jobType: JobType) => {
    switch (jobType) {
      case 'full_time': return 'success'
      case 'part_time': return 'info'
      case 'contract': return 'warning'
      case 'internship': return 'coral'
      case 'freelance': return 'teal'
      default: return 'default'
    }
  }

  const getLocationTypeIcon = (locationType: LocationType) => {
    switch (locationType) {
      case 'remote': return '🌍'
      case 'hybrid': return '🏢'
      case 'onsite': return '🏗️'
      default: return ''
    }
  }

  const formatJobType = (jobType: JobType) => {
    return jobType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency || 'USD')

  return (
    <div className="card hover group relative">
      {/* Save Button */}
      {onSave && (
        <button
          onClick={(e) => {
            e.preventDefault()
            onSave()
          }}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
        >
          {isSaved ? (
            <BookmarkSolidIcon className="w-5 h-5 text-coral-500" />
          ) : (
            <BookmarkIcon className="w-5 h-5 text-gray-400 hover:text-coral-500" />
          )}
        </button>
      )}

      <Link href={`/jobs/${job.id}`} className="block">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 pr-8">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 hover:text-coral-600 transition-colors group-hover:text-coral-600 mb-2">
              {job.title}
            </h3>
            
            {showCompany && (
              <div className="flex items-center text-gray-600 mb-2">
                <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                <span className="font-medium">Company Name</span>
                {/* TODO: Replace with actual company name when company table is linked */}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-1" />
                <span>{getLocationTypeIcon(job.location_type)} {job.location}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span>{formatDate(job.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Type and Salary */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant={getJobTypeVariant(job.job_type)}>
              {formatJobType(job.job_type)}
            </Badge>
            <Badge variant="default">
              {job.experience_level ? 
                job.experience_level.charAt(0).toUpperCase() + job.experience_level.slice(1) : 
                'Any Level'
              }
            </Badge>
          </div>
          
          {salary && (
            <div className="flex items-center text-sm font-semibold text-gray-900">
              <CurrencyDollarIcon className="w-4 h-4 mr-1 text-green-600" />
              {salary}
            </div>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-700 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Skills */}
        {job.skills_required && job.skills_required.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {job.skills_required.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                >
                  {skill}
                </span>
              ))}
              {job.skills_required.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                  +{job.skills_required.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <StarIcon className="w-4 h-4 mr-1" />
              <span>{job.view_count} views</span>
            </div>
            <div className="flex items-center">
              <span>{job.application_count} applications</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            View Details
          </Button>
        </div>
      </Link>
    </div>
  )
}