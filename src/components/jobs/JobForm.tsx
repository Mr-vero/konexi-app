'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/AuthProvider'
import { 
  Button, 
  Input, 
  Select, 
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui'
import { 
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import type { Job, JobInsert, JobType, ExperienceLevel, LocationType } from '@/lib/types/database'

interface JobFormProps {
  job?: Job
  mode: 'create' | 'edit'
  companyId?: string
}

const jobTypes: { value: JobType; label: string }[] = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
]

const experienceLevels: { value: ExperienceLevel; label: string }[] = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (2-5 years)' },
  { value: 'senior', label: 'Senior Level (5+ years)' },
  { value: 'executive', label: 'Executive Level' },
]

const locationTypes: { value: LocationType; label: string }[] = [
  { value: 'onsite', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
]

export function JobForm({ job, mode, companyId }: JobFormProps) {
  const router = useRouter()
  const { userProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [error, setError] = useState('')
  const [currentTab, setCurrentTab] = useState('basic')
  
  const [formData, setFormData] = useState({
    title: job?.title || '',
    description: job?.description || '',
    requirements: job?.requirements || '',
    responsibilities: job?.responsibilities || '',
    location: job?.location || '',
    location_type: job?.location_type || 'onsite' as LocationType,
    job_type: job?.job_type || 'full_time' as JobType,
    experience_level: job?.experience_level || 'entry' as ExperienceLevel,
    salary_min: job?.salary_min || null as number | null,
    salary_max: job?.salary_max || null as number | null,
    salary_currency: job?.salary_currency || 'USD',
    benefits: job?.benefits || [] as string[],
    skills_required: job?.skills_required || [] as string[],
    education_required: job?.education_required || '',
    application_deadline: job?.application_deadline ? 
      new Date(job.application_deadline).toISOString().split('T')[0] : '',
    is_active: job?.is_active ?? true,
  })

  const [currentBenefit, setCurrentBenefit] = useState('')
  const [currentSkill, setCurrentSkill] = useState('')

  const handleBenefitAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentBenefit.trim()) {
      e.preventDefault()
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, currentBenefit.trim()]
      }))
      setCurrentBenefit('')
    }
  }

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }))
  }

  const handleSkillAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault()
      setFormData(prev => ({
        ...prev,
        skills_required: [...prev.skills_required, currentSkill.trim()]
      }))
      setCurrentSkill('')
    }
  }

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills_required: prev.skills_required.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.location) {
      setError('Please fill in all required fields')
      setCurrentTab('basic')
      return false
    }

    if (formData.salary_min && formData.salary_max && formData.salary_min > formData.salary_max) {
      setError('Minimum salary cannot be greater than maximum salary')
      setCurrentTab('compensation')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault()
    
    if (!isDraft && !validateForm()) {
      return
    }

    setError('')
    isDraft ? setSavingDraft(true) : setSaving(true)

    const supabase = createClient()

    try {
      const jobData: JobInsert = {
        ...formData,
        company_id: companyId || job?.company_id,
        posted_by: userProfile?.id!,
        is_active: isDraft ? false : formData.is_active,
        application_deadline: formData.application_deadline || null,
        salary_min: formData.salary_min || null,
        salary_max: formData.salary_max || null,
      }

      if (mode === 'create') {
        const { data, error } = await supabase
          .from('jobs')
          .insert([jobData])
          .select()
          .single()

        if (error) throw error
        
        if (isDraft) {
          router.push(`/jobs/${data.id}/edit`)
        } else {
          router.push(`/jobs/${data.id}/preview`)
        }
      } else {
        const { error } = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', job!.id)

        if (error) throw error
        
        if (!isDraft) {
          router.push(`/jobs/${job!.id}`)
        } else {
          setError('Draft saved successfully')
          setTimeout(() => setError(''), 3000)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
      setSavingDraft(false)
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, false)}>
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="compensation">Compensation</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Job Title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                leftIcon={<BriefcaseIcon className="h-5 w-5 text-gray-400" />}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Job Type"
                  required
                  options={jobTypes}
                  value={formData.job_type}
                  onChange={(value) => setFormData({ ...formData, job_type: value as JobType })}
                />

                <Select
                  label="Experience Level"
                  options={experienceLevels}
                  value={formData.experience_level}
                  onChange={(value) => setFormData({ ...formData, experience_level: value as ExperienceLevel })}
                />
              </div>

              <Input
                label="Location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. San Francisco, CA"
                leftIcon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
              />

              <Select
                label="Work Location Type"
                required
                options={locationTypes}
                value={formData.location_type}
                onChange={(value) => setFormData({ ...formData, location_type: value as LocationType })}
              />

              <Input
                label="Application Deadline (Optional)"
                type="date"
                value={formData.application_deadline}
                onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                leftIcon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                label="Job Description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide a detailed description of the role..."
                rows={6}
                maxLength={3000}
                showCount
              />

              <Textarea
                label="Key Responsibilities"
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="List the main responsibilities of this role..."
                rows={4}
                maxLength={2000}
                showCount
              />

              <Textarea
                label="Requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="List the requirements and qualifications..."
                rows={4}
                maxLength={2000}
                showCount
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Requirements & Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Input
                  label="Required Skills"
                  placeholder="Type a skill and press Enter"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={handleSkillAdd}
                  helperText="Press Enter to add each skill"
                  leftIcon={<SparklesIcon className="h-5 w-5 text-gray-400" />}
                />
                {formData.skills_required.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.skills_required.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-coral-50 text-coral-700"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="ml-2 text-coral-600 hover:text-coral-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Input
                label="Education Required"
                value={formData.education_required}
                onChange={(e) => setFormData({ ...formData, education_required: e.target.value })}
                placeholder="e.g. Bachelor's degree in Computer Science or equivalent"
                leftIcon={<AcademicCapIcon className="h-5 w-5 text-gray-400" />}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compensation">
          <Card>
            <CardHeader>
              <CardTitle>Compensation & Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range (Annual)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <Select
                    options={[
                      { value: 'USD', label: 'USD' },
                      { value: 'EUR', label: 'EUR' },
                      { value: 'GBP', label: 'GBP' },
                      { value: 'CAD', label: 'CAD' },
                      { value: 'AUD', label: 'AUD' },
                    ]}
                    value={formData.salary_currency}
                    onChange={(value) => setFormData({ ...formData, salary_currency: value })}
                  />
                  <Input
                    type="number"
                    placeholder="Minimum"
                    value={formData.salary_min || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      salary_min: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    leftIcon={<CurrencyDollarIcon className="h-5 w-5 text-gray-400" />}
                  />
                  <Input
                    type="number"
                    placeholder="Maximum"
                    value={formData.salary_max || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      salary_max: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    leftIcon={<CurrencyDollarIcon className="h-5 w-5 text-gray-400" />}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to hide salary information
                </p>
              </div>

              <div>
                <Input
                  label="Benefits & Perks"
                  placeholder="Type a benefit and press Enter"
                  value={currentBenefit}
                  onChange={(e) => setCurrentBenefit(e.target.value)}
                  onKeyDown={handleBenefitAdd}
                  helperText="Press Enter to add each benefit"
                  leftIcon={<UserGroupIcon className="h-5 w-5 text-gray-400" />}
                />
                {formData.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-50 text-teal-700"
                      >
                        {benefit}
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="ml-2 text-teal-600 hover:text-teal-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="mt-6 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-2">
          {mode === 'create' && (
            <Button
              type="button"
              variant="outline"
              loading={savingDraft}
              disabled={saving || savingDraft}
              onClick={(e) => handleSubmit(e as any, true)}
            >
              Save as Draft
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="submit"
            variant="secondary"
            disabled={saving || savingDraft}
            leftIcon={<EyeIcon className="h-4 w-4" />}
          >
            Preview
          </Button>
          <Button
            type="submit"
            loading={saving}
            disabled={saving || savingDraft}
          >
            {mode === 'create' ? 'Post Job' : 'Update Job'}
          </Button>
        </div>
      </div>
    </form>
  )
}