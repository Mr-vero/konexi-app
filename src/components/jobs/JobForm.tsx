'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Database } from '@/lib/types/database'

type JobInsert = Database['public']['Tables']['jobs']['Insert']
type JobUpdate = Database['public']['Tables']['jobs']['Update']

interface JobFormProps {
  job?: Database['public']['Tables']['jobs']['Row']
  mode: 'create' | 'edit'
}

export function JobForm({ job, mode }: JobFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: job?.title || '',
    company_name: job?.company_name || '',
    description: job?.description || '',
    location: job?.location || '',
    job_type: job?.job_type || 'Full-Time' as 'Full-Time' | 'Part-Time' | 'Contract'
  })

  const jobTypeOptions = [
    { value: 'Full-Time', label: 'Full-Time' },
    { value: 'Part-Time', label: 'Part-Time' },
    { value: 'Contract', label: 'Contract' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in to post a job')
      setLoading(false)
      return
    }

    try {
      if (mode === 'create') {
        const jobData: JobInsert = {
          ...formData,
          user_id: user.id
        }

        const { error } = await supabase
          .from('jobs')
          .insert([jobData])

        if (error) throw error
        router.push('/dashboard')
      } else {
        const jobData: JobUpdate = formData

        const { error } = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', job!.id)

        if (error) throw error
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Job Title"
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="e.g. Senior Software Engineer"
      />

      <Input
        label="Company Name"
        required
        value={formData.company_name}
        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
        placeholder="e.g. Acme Corp"
      />

      <Input
        label="Location"
        required
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        placeholder="e.g. San Francisco, CA or Remote"
      />

      <Select
        label="Job Type"
        required
        value={formData.job_type}
        onChange={(e) => setFormData({ ...formData, job_type: e.target.value as 'Full-Time' | 'Part-Time' | 'Contract' })}
        options={jobTypeOptions}
      />

      <Textarea
        label="Job Description"
        required
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Describe the role, responsibilities, requirements, and benefits..."
        rows={8}
      />

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : mode === 'create' ? 'Post Job' : 'Update Job'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}