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
  BuildingOfficeIcon, 
  PhotoIcon,
  GlobeAltIcon,
  MapPinIcon,
  UsersIcon,
  CalendarIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import type { Company, CompanySize } from '@/lib/types/database'

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
  'Hospitality',
  'Construction',
  'Legal',
  'Non-profit',
  'Government',
  'Other',
]

export default function CompanyProfilePage() {
  const router = useRouter()
  const { userProfile, userType } = useAuth()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [company, setCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    size: 'startup' as CompanySize,
    location: '',
    founded_year: new Date().getFullYear(),
    benefits: [] as string[],
    logo_url: '',
    culture_images: [] as string[],
  })
  const [currentBenefit, setCurrentBenefit] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (userType !== 'employer') {
      router.push('/dashboard')
      return
    }
    fetchCompany()
  }, [userType, router])

  const fetchCompany = async () => {
    if (!userProfile) return

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('created_by', userProfile.id)
        .single()

      if (data) {
        setCompany(data)
        setFormData({
          name: data.name,
          description: data.description || '',
          website: data.website || '',
          industry: data.industry || '',
          size: data.size || 'startup',
          location: data.location || '',
          founded_year: data.founded_year || new Date().getFullYear(),
          benefits: data.benefits || [],
          logo_url: data.logo_url || '',
          culture_images: data.culture_images || [],
        })
      }
    } catch (error) {
      console.error('Error fetching company:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !company) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${company.id}/logo.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('company-assets')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, logo_url: publicUrl }))
      setSuccess('Logo uploaded successfully')
    } catch (error) {
      console.error('Error uploading logo:', error)
      setError('Failed to upload logo')
    }
  }

  const handleCultureImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !company) return

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${company.id}/culture/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('company-assets')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('company-assets')
          .getPublicUrl(fileName)

        return publicUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setFormData(prev => ({ 
        ...prev, 
        culture_images: [...prev.culture_images, ...uploadedUrls]
      }))
      setSuccess('Images uploaded successfully')
    } catch (error) {
      console.error('Error uploading images:', error)
      setError('Failed to upload images')
    }
  }

  const removeCultureImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      culture_images: prev.culture_images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error: updateError } = await supabase
        .from('companies')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', company?.id)

      if (updateError) throw updateError

      setSuccess('Company profile updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update company profile')
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

  if (!company) {
    return (
      <Container className="py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="py-12">
            <BuildingOfficeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Company Profile</h2>
            <p className="text-gray-600 mb-6">
              Create a company profile to start posting jobs.
            </p>
            <Button onClick={() => router.push('/onboarding/employer')}>
              Create Company Profile
            </Button>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Company Profile"
        description="Manage your company information and branding"
        action={
          <Button
            variant="outline"
            onClick={() => router.push(`/companies/${company.id}`)}
          >
            View Public Profile
          </Button>
        }
      />

      <Container className="py-8">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Input
                    label="Company Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    leftIcon={<BuildingOfficeIcon className="h-5 w-5 text-gray-400" />}
                  />

                  <Textarea
                    label="Company Description"
                    placeholder="What does your company do?"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    maxLength={1000}
                    showCount
                  />

                  <Input
                    label="Company Website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    leftIcon={<GlobeAltIcon className="h-5 w-5 text-gray-400" />}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Industry"
                      required
                      options={industries.map(i => ({ value: i, label: i }))}
                      value={formData.industry}
                      onChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                    />

                    <Select
                      label="Company Size"
                      options={companySizes}
                      value={formData.size}
                      onChange={(value) => setFormData(prev => ({ ...prev, size: value as CompanySize }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Location"
                      placeholder="City, State or Country"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      leftIcon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
                    />

                    <Input
                      label="Founded Year"
                      type="number"
                      min="1800"
                      max={new Date().getFullYear()}
                      value={formData.founded_year}
                      onChange={(e) => setFormData(prev => ({ ...prev, founded_year: parseInt(e.target.value) }))}
                      leftIcon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding">
              <Card>
                <CardHeader>
                  <CardTitle>Company Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Logo
                    </label>
                    <div className="flex items-center space-x-6">
                      {formData.logo_url ? (
                        <img
                          src={formData.logo_url}
                          alt="Company logo"
                          className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <PhotoIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          id="logo-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                        <label htmlFor="logo-upload">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                          >
                            Upload Logo
                          </Button>
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          Recommended: 400x400px, PNG or JPG
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Benefits & Perks"
                      placeholder="Type a benefit and press Enter"
                      value={currentBenefit}
                      onChange={(e) => setCurrentBenefit(e.target.value)}
                      onKeyDown={handleBenefitAdd}
                      helperText="Press Enter to add each benefit"
                      leftIcon={<UsersIcon className="h-5 w-5 text-gray-400" />}
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

            <TabsContent value="culture">
              <Card>
                <CardHeader>
                  <CardTitle>Company Culture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Culture Images
                    </label>
                    <p className="text-sm text-gray-600 mb-4">
                      Share photos that showcase your company culture, office, and team
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {formData.culture_images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Culture ${index + 1}`}
                            className="h-32 w-full rounded-lg object-cover border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeCultureImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      
                      {formData.culture_images.length < 6 && (
                        <div>
                          <input
                            type="file"
                            id="culture-upload"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleCultureImageUpload}
                          />
                          <label
                            htmlFor="culture-upload"
                            className="h-32 w-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                          >
                            <div className="text-center">
                              <PlusIcon className="h-8 w-8 text-gray-400 mx-auto" />
                              <span className="text-sm text-gray-600">Add Images</span>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Maximum 6 images, 5MB each
                    </p>
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
              onClick={() => router.push('/dashboard/employer')}
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