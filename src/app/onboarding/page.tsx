'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { Container } from '@/components/ui'

export default function OnboardingPage() {
  const { userType, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && userType) {
      if (userType === 'job_seeker') {
        router.push('/onboarding/job-seeker')
      } else if (userType === 'employer') {
        router.push('/onboarding/employer')
      }
    }
  }, [userType, loading, router])

  return (
    <Container className="py-16">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-coral-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Setting up your account...</p>
      </div>
    </Container>
  )
}