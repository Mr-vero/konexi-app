'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { Container, PageHeader, Button, Input, Textarea, Select } from '@/components/ui'
import { Card, CardContent } from '@/components/ui/Card'
import type { CompanySize } from '@/lib/types/database'

const companySizes: { value: CompanySize; label: string }[] = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'small', label: 'Small (11-50 employees)' },
  { value: 'medium', label: 'Medium (51-200 employees)' },
  { value: 'large', label: 'Large (200+ employees)' },
]

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Marketing',
  'Real Estate',
  'Transportation',
  'Entertainment',
  'Other',
]

export default function EmployerOnboarding() {
  const router = useRouter()
  const { userProfile, refreshProfile } = useAuth()
  const supabase = createClient()
  
  const [step, setStep] = useState(1)
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
  })
  
  const [companyData, setCompanyData] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    size: 'startup' as CompanySize,
    location: '',
    founded_year: new Date().getFullYear(),
    benefits: [] as string[],
  })
  
  const [currentBenefit, setCurrentBenefit] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBenefitAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentBenefit.trim()) {
      e.preventDefault()
      setCompanyData(prev => ({
        ...prev,
        benefits: [...prev.benefits, currentBenefit.trim()]
      }))
      setCurrentBenefit('')
    }
  }

  const removeBenefit = (index: number) => {
    setCompanyData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', userProfile?.id)

      if (updateError) throw updateError

      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: companyError } = await supabase
        .from('companies')
        .insert({
          ...companyData,
          created_by: userProfile?.id,
        })

      if (companyError) throw companyError

      await refreshProfile()
      router.push('/dashboard/employer')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create company')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={step === 1 ? 'Your Information' : 'Company Information'}
        description={step === 1 ? 'Tell us about yourself' : 'Tell job seekers about your company'}
      />
      
      <Container className="py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-coral-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-24 h-1 ${step >= 2 ? 'bg-coral-500' : 'bg-gray-300'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-coral-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>

          <Card>
            <CardContent>
              {step === 1 ? (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      required
                      value={profileData.first_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                    />
                    <Input
                      label="Last Name"
                      required
                      value={profileData.last_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                    />
                  </div>

                  <Input
                    label="Phone Number"
                    type="tel"
                    required
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  />

                  <Input
                    label="Your Location"
                    placeholder="City, State or Country"
                    required
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
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
                      onClick={() => router.push('/dashboard/employer')}
                    >
                      Skip for now
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      disabled={loading}
                    >
                      Next
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCompanySubmit} className="space-y-6">
                  <Input
                    label="Company Name"
                    required
                    value={companyData.name}
                    onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                  />

                  <Textarea
                    label="Company Description"
                    placeholder="What does your company do?"
                    rows={4}
                    required
                    value={companyData.description}
                    onChange={(e) => setCompanyData(prev => ({ ...prev, description: e.target.value }))}
                    maxLength={1000}
                    showCount
                  />

                  <Input
                    label="Company Website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={companyData.website}
                    onChange={(e) => setCompanyData(prev => ({ ...prev, website: e.target.value }))}
                  />

                  <Select
                    label="Industry"
                    required
                    options={industries.map(i => ({ value: i, label: i }))}
                    value={companyData.industry}
                    onChange={(value) => setCompanyData(prev => ({ ...prev, industry: value }))}
                  />

                  <Select
                    label="Company Size"
                    options={companySizes}
                    value={companyData.size}
                    onChange={(value) => setCompanyData(prev => ({ ...prev, size: value as CompanySize }))}
                  />

                  <Input
                    label="Company Location"
                    placeholder="City, State or Country"
                    required
                    value={companyData.location}
                    onChange={(e) => setCompanyData(prev => ({ ...prev, location: e.target.value }))}
                  />

                  <Input
                    label="Founded Year"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={companyData.founded_year}
                    onChange={(e) => setCompanyData(prev => ({ ...prev, founded_year: parseInt(e.target.value) }))}
                  />

                  <div>
                    <Input
                      label="Benefits & Perks"
                      placeholder="Type a benefit and press Enter"
                      value={currentBenefit}
                      onChange={(e) => setCurrentBenefit(e.target.value)}
                      onKeyDown={handleBenefitAdd}
                      helperText="Press Enter to add each benefit"
                    />
                    {companyData.benefits.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {companyData.benefits.map((benefit, index) => (
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

                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      disabled={loading}
                    >
                      Complete Setup
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  )
}