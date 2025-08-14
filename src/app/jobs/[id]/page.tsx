import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { 
  MapPin, 
  Calendar, 
  Building2, 
  Briefcase, 
  ChevronLeft,
  Share2,
  Bookmark,
  ExternalLink,
  Mail,
  Globe,
  Users
} from 'lucide-react'

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !job) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const getJobTypeVariant = (jobType: string) => {
    switch (jobType) {
      case 'Full-Time':
        return 'success'
      case 'Part-Time':
        return 'primary'
      case 'Contract':
        return 'secondary'
      default:
        return 'default'
    }
  }

  // In a real app, you'd fetch this from the database
  const companyInfo = {
    size: '100-500 employees',
    industry: 'Technology',
    website: 'www.example.com',
    founded: '2015',
    description: 'We are a leading technology company focused on innovative solutions.'
  }

  const similarJobs = [] // In a real app, fetch similar jobs

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to all jobs
            </Link>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Job Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <p className="text-xl text-gray-600 mb-4">{job.company_name}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Posted {formatDate(job.created_at)}
                      </span>
                      <Badge variant={getJobTypeVariant(job.job_type)}>
                        {job.job_type}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <Button size="lg" className="flex-1 sm:flex-none">
                    <Mail className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                  <Button size="lg" variant="secondary">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button size="lg" variant="secondary">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Company Info Card */}
              <div className="lg:w-80">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About {job.company_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{companyInfo.description}</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{companyInfo.size}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{companyInfo.industry}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a href={`https://${companyInfo.website}`} className="text-blue-600 hover:underline">
                          {companyInfo.website}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Founded {companyInfo.founded}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Link href={`/companies/${job.company_name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Button variant="secondary" size="sm" className="w-full">
                          View Company Profile
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700">
                      {job.description}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Bachelor&apos;s degree in relevant field or equivalent experience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>3+ years of experience in similar role</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Strong communication and collaboration skills</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Problem-solving mindset and attention to detail</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      'Competitive salary',
                      'Health insurance',
                      'Remote work options',
                      'Professional development',
                      'Flexible hours',
                      'Team events'
                    ].map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
                <CardHeader>
                  <CardTitle>Ready to apply?</CardTitle>
                  <CardDescription>
                    Join our team and make an impact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button size="lg" className="w-full">
                    Apply for this position
                  </Button>
                  <p className="text-xs text-gray-600 text-center">
                    Application deadline: 30 days from posting
                  </p>
                </CardContent>
              </Card>

              {/* Job Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Views</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Applications</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Saved</span>
                    <span className="font-semibold">0</span>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Similar Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      No similar jobs found at this time.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}