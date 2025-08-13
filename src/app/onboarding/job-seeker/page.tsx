'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { Container, PageHeader, Button, Input, Textarea, Select } from '@/components/ui'
import { Card, CardContent } from '@/components/ui/Card'
import type { ExperienceLevel } from '@/lib/types/database'

const experienceLevels: { value: ExperienceLevel; label: string }[] = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (2-5 years)' },
  { value: 'senior', label: 'Senior Level (5+ years)' },
  { value: 'executive', label: 'Executive Level' },
]

export default function JobSeekerOnboarding() {
  const router = useRouter()
  const { userProfile, refreshProfile } = useAuth()
  const supabase = createClient()
  
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
  })
  const [currentSkill, setCurrentSkill] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSkillAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault()
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }))
      setCurrentSkill('')
    }
  }

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          ...formData,
          is_open_to_work: true,
        })
        .eq('id', userProfile?.id)

      if (updateError) throw updateError

      await refreshProfile()
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Complete Your Profile"
        description="Help employers find you by completing your profile"
      />
      
      <Container className="py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <Select
                label="Experience Level"
                options={experienceLevels}
                value={formData.experience_level}
                onChange={(value) => setFormData(prev => ({ ...prev, experience_level: value as ExperienceLevel }))}
              />

              <Textarea
                label="Professional Summary"
                placeholder="Tell employers about yourself..."
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                maxLength={500}
                showCount
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
                  <div className="flex flex-wrap gap-2 mt-2">
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

              <Input
                label="LinkedIn URL"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedin_url}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
              />

              <Input
                label="Portfolio/Website URL"
                type="url"
                placeholder="https://yourportfolio.com"
                value={formData.portfolio_url}
                onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
              />

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                >
                  Skip for now
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                >
                  Complete Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}