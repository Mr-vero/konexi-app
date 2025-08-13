'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  MapPinIcon, 
  BriefcaseIcon, 
  CurrencyDollarIcon,
  AcademicCapIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'

interface JobFiltersProps {
  location: string
  jobType: string
  onLocationChange: (value: string) => void
  onJobTypeChange: (value: string) => void
}

export function JobFilters({ location, jobType, onLocationChange, onJobTypeChange }: JobFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [salaryRange, setSalaryRange] = useState({ min: '', max: '' })
  const [experienceLevel, setExperienceLevel] = useState('')
  const [locationType, setLocationType] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')

  const jobTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'full_time', label: 'Full-Time' },
    { value: 'part_time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' }
  ]

  const experienceLevelOptions = [
    { value: '', label: 'All Levels' },
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive' }
  ]

  const locationTypeOptions = [
    { value: '', label: 'All Locations' },
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' }
  ]

  const popularSkills = [
    'React', 'JavaScript', 'TypeScript', 'Python', 'Node.js', 
    'AWS', 'SQL', 'Git', 'Docker', 'GraphQL'
  ]

  const addSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill))
  }

  const clearAllFilters = () => {
    onLocationChange('')
    onJobTypeChange('')
    setSalaryRange({ min: '', max: '' })
    setExperienceLevel('')
    setLocationType('')
    setSelectedSkills([])
  }

  const hasActiveFilters = location || jobType || salaryRange.min || salaryRange.max || 
    experienceLevel || locationType || selectedSkills.length > 0

  return (
    <Card>
      <CardHeader 
        title="Filters"
        action={
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                leftIcon={<XMarkIcon className="w-4 h-4" />}
              >
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              leftIcon={<AdjustmentsHorizontalIcon className="w-4 h-4" />}
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        }
      />
      
      <CardContent>
        {/* Basic Filters */}
        <div className="space-y-4 mb-6">
          <div>
            <Input
              label="Location"
              placeholder="City, state, or country"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              leftIcon={<MapPinIcon className="w-5 h-5" />}
            />
          </div>
          
          <div>
            <Select
              label="Job Type"
              value={jobType}
              onChange={(e) => onJobTypeChange(e.target.value)}
              options={jobTypeOptions}
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-4 border-t border-gray-100 pt-6">
            {/* Location Type */}
            <div>
              <Select
                label="Work Style"
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                options={locationTypeOptions}
              />
            </div>

            {/* Experience Level */}
            <div>
              <Select
                label="Experience Level"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                options={experienceLevelOptions}
                leftIcon={<AcademicCapIcon className="w-5 h-5" />}
              />
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <CurrencyDollarIcon className="w-4 h-4 inline mr-1" />
                Salary Range (USD)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Min"
                  type="number"
                  value={salaryRange.min}
                  onChange={(e) => setSalaryRange(prev => ({ ...prev, min: e.target.value }))}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={salaryRange.max}
                  onChange={(e) => setSalaryRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Skills
              </label>
              <Input
                placeholder="Add a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSkill(skillInput.trim())
                  }
                }}
              />
              
              {/* Popular Skills */}
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-2">Popular skills:</p>
                <div className="flex flex-wrap gap-1">
                  {popularSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="px-2 py-1 bg-gray-100 hover:bg-coral-50 hover:text-coral-600 text-gray-600 text-xs rounded-md transition-colors"
                      disabled={selectedSkills.includes(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Skills */}
              {selectedSkills.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Selected skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="coral"
                        className="flex items-center gap-1"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-coral-700"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Active filters
              </span>
              <Badge variant="coral">
                {[location, jobType, experienceLevel, locationType].filter(Boolean).length + 
                 (salaryRange.min || salaryRange.max ? 1 : 0) + 
                 selectedSkills.length} applied
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}