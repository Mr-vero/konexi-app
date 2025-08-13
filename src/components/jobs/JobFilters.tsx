'use client'

import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface JobFiltersProps {
  location: string
  jobType: string
  onLocationChange: (value: string) => void
  onJobTypeChange: (value: string) => void
}

export function JobFilters({ location, jobType, onLocationChange, onJobTypeChange }: JobFiltersProps) {
  const jobTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Full-Time', label: 'Full-Time' },
    { value: 'Part-Time', label: 'Part-Time' },
    { value: 'Contract', label: 'Contract' }
  ]

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Filter by location..."
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
        />
        <Select
          value={jobType}
          onChange={(e) => onJobTypeChange(e.target.value)}
          options={jobTypeOptions}
        />
      </div>
    </div>
  )
}