import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { DashboardJobList } from '@/components/jobs/DashboardJobList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Briefcase, Eye, Clock, TrendingUp, Plus, BarChart3, Users, Calendar } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Calculate statistics
  const activeJobs = jobs?.length || 0
  const totalViews = 0 // In a real app, you'd track this
  const recentApplications = 0 // In a real app, you'd track this
  const avgTimeToHire = '21 days' // In a real app, you'd calculate this

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
                <p className="text-blue-100 text-lg">Manage your job postings and track performance</p>
              </div>
              <Link href="/jobs/new">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Plus className="w-5 h-5 mr-2" />
                  Post New Job
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
                    <p className="text-3xl font-bold text-gray-900">{activeJobs}</p>
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12% from last month
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900">{totalViews}</p>
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +23% from last week
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Applications</p>
                    <p className="text-3xl font-bold text-gray-900">{recentApplications}</p>
                    <p className="text-sm text-gray-500 mt-2">This week</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg. Time to Hire</p>
                    <p className="text-3xl font-bold text-gray-900">{avgTimeToHire}</p>
                    <p className="text-sm text-orange-600 mt-2 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      -3 days from average
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Calendar className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/jobs/new" className="group">
              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Create New Job</h3>
                  <p className="text-sm text-gray-600">Post a new job opening to attract candidates</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/analytics" className="group">
              <Card className="border-2 border-dashed border-gray-300 hover:border-purple-500 transition-colors cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">View Analytics</h3>
                  <p className="text-sm text-gray-600">Track performance and insights</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/applications" className="group">
              <Card className="border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Review Applications</h3>
                  <p className="text-sm text-gray-600">Manage candidate applications</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Job Listings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Job Postings</CardTitle>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">Filter</Button>
                  <Button variant="secondary" size="sm">Sort</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-800">Error loading jobs: {error.message}</p>
                </div>
              ) : (
                <DashboardJobList jobs={jobs || []} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}