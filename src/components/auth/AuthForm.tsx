'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'
import { UserCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import type { UserType } from '@/lib/types/database'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<UserType>('job_seeker')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password, userType)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Welcome back' : 'Join Konexi'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === 'login' ? 'Sign in to access your account' : 'Create your free account'}
          </p>
        </div>

        {mode === 'signup' && (
          <div className="space-y-4">
            <p className="text-center text-sm font-medium text-gray-700">
              I want to:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Card
                interactive
                variant={userType === 'job_seeker' ? 'elevated' : 'default'}
                className={`cursor-pointer ${
                  userType === 'job_seeker' ? 'ring-2 ring-coral-500' : ''
                }`}
                onClick={() => setUserType('job_seeker')}
              >
                <CardContent className="flex flex-col items-center py-6">
                  <UserCircleIcon className="h-12 w-12 text-coral-500 mb-2" />
                  <h3 className="font-semibold">Find a Job</h3>
                  <p className="text-sm text-gray-600 text-center mt-1">
                    Browse and apply to jobs
                  </p>
                </CardContent>
              </Card>

              <Card
                interactive
                variant={userType === 'employer' ? 'elevated' : 'default'}
                className={`cursor-pointer ${
                  userType === 'employer' ? 'ring-2 ring-coral-500' : ''
                }`}
                onClick={() => setUserType('employer')}
              >
                <CardContent className="flex flex-col items-center py-6">
                  <BuildingOfficeIcon className="h-12 w-12 text-teal-500 mb-2" />
                  <h3 className="font-semibold">Hire Talent</h3>
                  <p className="text-sm text-gray-600 text-center mt-1">
                    Post jobs and find candidates
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <Input
              label="Password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              helperText={mode === 'signup' ? 'Must be at least 6 characters' : undefined}
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-coral-600 focus:ring-coral-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-coral-600 hover:text-coral-500"
                >
                  Forgot password?
                </Link>
              </div>
            )}
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <Link
              href={mode === 'login' ? '/signup' : '/login'}
              className="font-medium text-coral-600 hover:text-coral-500"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}