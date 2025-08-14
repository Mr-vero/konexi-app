'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    'Post unlimited job listings',
    'Access to top talent pool',
    'Advanced analytics dashboard',
    'Priority support'
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Briefcase className="w-8 h-8 text-blue-600" />
              JobPortal
            </Link>
          </div>

          <Card className="border shadow-lg">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-2xl text-center">
                {mode === 'login' ? 'Welcome back' : 'Get started'}
              </CardTitle>
              <CardDescription className="text-center">
                {mode === 'login' 
                  ? 'Sign in to access your dashboard' 
                  : 'Create an account to post jobs and find talent'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Email address"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                    />
                    <Lock className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </Link>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  className="h-11"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {mode === 'login' ? 'Sign in' : 'Create account'}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <div className="pt-4">
                  <p className="text-center text-sm text-gray-600">
                  {mode === 'login' ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up
                      </Link>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                      </Link>
                    </>
                  )}
                </p>
              </div>
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-12 items-center justify-center">
        <div className="max-w-lg">
          <h2 className="text-4xl font-bold mb-6">
            {mode === 'login' 
              ? 'Welcome back to JobPortal' 
              : 'Start hiring top talent today'}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {mode === 'login'
              ? 'Access your dashboard to manage job postings and review applications.'
              : 'Join thousands of companies finding their perfect candidates.'}
          </p>
          
          {mode === 'signup' && (
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          )}

          {mode === 'login' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-8">
              <p className="text-lg font-medium mb-2">New to JobPortal?</p>
              <p className="text-blue-100 mb-4">
                Create an account to start posting jobs and building your team.
              </p>
              <Link href="/signup">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get started free
                </Button>
              </Link>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center gap-6 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                <div>
                  <p className="font-medium text-white">5,000+</p>
                  <p>Companies</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                <div>
                  <p className="font-medium text-white">50,000+</p>
                  <p>Job Posts</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                <div>
                  <p className="font-medium text-white">100,000+</p>
                  <p>Candidates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}