'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { 
  Container, 
  PageHeader, 
  Button, 
  Input, 
  Textarea, 
  Select,
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
  UserCircleIcon,
  DocumentTextIcon,
  LinkIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'
import type { ExperienceLevel, ProfileVisibility } from '@/lib/types/database'

const experienceLevels: { value: ExperienceLevel; label: string }[] = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (2-5 years)' },
  { value: 'senior', label: 'Senior Level (5+ years)' },
  { value: 'executive', label: 'Executive Level' },
]

const visibilityOptions: { value: ProfileVisibility; label: string; description: string }[] = [
  { 
    value: 'public', 
    label: 'Public', 
    description: 'Anyone can view your profile' 
  },
  { 
    value: 'employers_only', 
    label: 'Employers Only', 
    description: 'Only employers can view your profile' 
  },
  { 
    value: 'private', 
    label: 'Private', 
    description: 'No one can view your profile' 
  },
]

export default function ProfileEditPage() {
  const router = useRouter()
  const { userProfile, userType, refreshProfile } = useAuth()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    bio: '',
    skills: [] as string[],
    experience_level: 'entry' as ExperienceLevel,
    linkedin_url: '',
    portfolio_url: '',
    desired_salary_min: null as number | null,
    desired_salary_max: null as number | null,
    is_open_to_work: false,
    profile_visibility: 'public' as ProfileVisibility,
    avatar_url: '',
    resume_url: '',
  })
  const [currentSkill, setCurrentSkill] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (userType === 'employer') {
      router.push('/dashboard/employer')
      return
    }
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        bio: userProfile.bio || '',
        skills: userProfile.skills || [],
        experience_level: userProfile.experience_level || 'entry',
        linkedin_url: userProfile.linkedin_url || '',
        portfolio_url: userProfile.portfolio_url || '',
        desired_salary_min: userProfile.desired_salary_min,
        desired_salary_max: userProfile.desired_salary_max,
        is_open_to_work: userProfile.is_open_to_work,
        profile_visibility: userProfile.profile_visibility,
        avatar_url: userProfile.avatar_url || '',
        resume_url: userProfile.resume_url || '',
      })
      setLoading(false)
    }
  }, [userProfile, userType, router])

  const handleSkillAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault()
      if (!formData.skills.includes(currentSkill.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, currentSkill.trim()]
        }))
      }
      setCurrentSkill('')
    }
  }

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userProfile) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userProfile.id}/avatar.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
      setSuccess('Avatar uploaded successfully')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setError('Failed to upload avatar')
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userProfile) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userProfile.id}/resume-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, resume_url: publicUrl }))
      setSuccess('Resume uploaded successfully')
    } catch (error) {
      console.error('Error uploading resume:', error)
      setError('Failed to upload resume')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userProfile?.id)

      if (updateError) throw updateError

      await refreshProfile()
      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Container className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Container>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Edit Profile"
        description="Keep your profile up to date to attract the right opportunities"
        action={
          <Button
            variant="outline"
            onClick={() => router.push('/profile')}
            leftIcon={<EyeIcon className="h-4 w-4" />}
          >
            View Profile
          </Button>
        }
      />

      <Container className="py-8">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo
                    </label>
                    <div className="flex items-center space-x-6">
                      {formData.avatar_url ? (
                        <img
                          src={formData.avatar_url}
                          alt="Avatar"
                          className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                          <UserCircleIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                        <label htmlFor="avatar-upload">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                          >
                            Change Photo
                          </Button>
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          JPG, GIF or PNG. Max size 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    />
                    <Input
                      label="Last Name"
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    />
                  </div>

                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />

                  <Input
                    label="Location"
                    placeholder="City, State or Country"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />

                  <Textarea
                    label="About Me"
                    placeholder="Tell employers about yourself..."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    maxLength={500}
                    showCount
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Select
                    label="Experience Level"
                    options={experienceLevels}
                    value={formData.experience_level}
                    onChange={(value) => setFormData(prev => ({ ...prev, experience_level: value as ExperienceLevel }))}
                  />

                  <div>
                    <Input
                      label="Skills"
                      placeholder="Type a skill and press Enter"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyDown={handleSkillAdd}
                      helperText="Press Enter to add each skill"
                    />
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.skills.map((skill, index) => (
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {formData.resume_url ? (
                        <div className="space-y-2">
                          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-600">Resume uploaded</p>
                          <div className="flex items-center justify-center gap-2">
                            <a
                              href={formData.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-coral-600 hover:text-coral-700"
                            >
                              View Resume
                            </a>
                            <span className="text-gray-400">•</span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, resume_url: '' }))}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <input
                            type="file"
                            id="resume-upload"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleResumeUpload}
                          />
                          <label htmlFor="resume-upload">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('resume-upload')?.click()}
                            >
                              Upload Resume
                            </Button>
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            PDF, DOC, or DOCX up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <Input
                    label="LinkedIn URL"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    leftIcon={<LinkIcon className="h-5 w-5 text-gray-400" />}
                  />

                  <Input
                    label="Portfolio/Website URL"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                    leftIcon={<LinkIcon className="h-5 w-5 text-gray-400" />}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Job Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.is_open_to_work}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_open_to_work: e.target.checked }))}
                        className="h-4 w-4 text-coral-600 focus:ring-coral-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">I'm open to work</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1 ml-7">
                      Let recruiters know you're open to opportunities
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desired Salary Range (Annual)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder="Minimum"
                        value={formData.desired_salary_min || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          desired_salary_min: e.target.value ? parseInt(e.target.value) : null 
                        }))}
                        leftIcon={<span className="text-gray-500">$</span>}
                      />
                      <Input
                        type="number"
                        placeholder="Maximum"
                        value={formData.desired_salary_max || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          desired_salary_max: e.target.value ? parseInt(e.target.value) : null 
                        }))}
                        leftIcon={<span className="text-gray-500">$</span>}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This information is private and helps match you with relevant opportunities
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Profile Visibility
                    </label>
                    <div className="space-y-3">
                      {visibilityOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-start space-x-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="visibility"
                            value={option.value}
                            checked={formData.profile_visibility === option.value}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              profile_visibility: e.target.value as ProfileVisibility 
                            }))}
                            className="mt-1 h-4 w-4 text-coral-600 focus:ring-coral-500 border-gray-300"
                          />
                          <div>
                            <p className="font-medium text-gray-700">{option.label}</p>
                            <p className="text-sm text-gray-500">{option.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
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

          {success && (
            <div className="mt-6 rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={saving}
              disabled={saving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Container>
    </div>
  )
}