import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container, Card, CardContent, Button, Badge } from '@/components/ui'
import { 
  BuildingOfficeIcon, 
  MapPinIcon, 
  UsersIcon,
  GlobeAltIcon,
  CalendarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import type { Company, Job } from '@/lib/types/database'

export default async function CompanyProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  // Fetch company details
  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !company) {
    notFound()
  }

  // Fetch active jobs for this company
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', params.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Calculate some stats
  const totalJobs = jobs?.length || 0
  const jobsByType = jobs?.reduce((acc, job) => {
    acc[job.job_type] = (acc[job.job_type] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Company Header */}
      <div className="bg-white border-b">
        <Container className="py-8">
          <div className="flex items-start gap-6">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.name}
                className="w-24 h-24 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                {company.industry && (
                  <span className="flex items-center gap-1">
                    <BriefcaseIcon className="h-4 w-4" />
                    {company.industry}
                  </span>
                )}
                {company.location && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    {company.location}
                  </span>
                )}
                {company.size && (
                  <span className="flex items-center gap-1">
                    <UsersIcon className="h-4 w-4" />
                    {company.size.charAt(0).toUpperCase() + company.size.slice(1)} company
                  </span>
                )}
                {company.founded_year && (
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    Founded {company.founded_year}
                  </span>
                )}
              </div>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-coral-600 hover:text-coral-700"
                >
                  <GlobeAltIcon className="h-4 w-4" />
                  Visit Website
                </a>
              )}
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
              <p className="text-gray-600">Open Positions</p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardContent>
                <h2 className="text-xl font-semibold mb-4">About {company.name}</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {company.description}
                </p>
              </CardContent>
            </Card>

            {/* Culture Images */}
            {company.culture_images && company.culture_images.length > 0 && (
              <Card>
                <CardContent>
                  <h2 className="text-xl font-semibold mb-4">Company Culture</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {company.culture_images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${company.name} culture ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Open Positions */}
            <Card>
              <CardContent>
                <h2 className="text-xl font-semibold mb-4">Open Positions</h2>
                {jobs && jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <Link key={job.id} href={`/jobs/${job.id}`}>
                        <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {job.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <MapPinIcon className="h-4 w-4" />
                                  {job.location}
                                </span>
                                <Badge variant="default" size="sm">
                                  {job.job_type.replace('_', ' ')}
                                </Badge>
                                {job.salary_max && (
                                  <span>
                                    ${job.salary_min?.toLocaleString()} - ${job.salary_max.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              View Job
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No open positions at the moment. Check back later!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            {company.benefits && company.benefits.length > 0 && (
              <Card>
                <CardContent>
                  <h3 className="font-semibold mb-4">Benefits & Perks</h3>
                  <div className="space-y-2">
                    {company.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Job Types */}
            {Object.keys(jobsByType).length > 0 && (
              <Card>
                <CardContent>
                  <h3 className="font-semibold mb-4">Available Positions</h3>
                  <div className="space-y-2">
                    {Object.entries(jobsByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {count} {count === 1 ? 'position' : 'positions'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Follow Company */}
            <Card>
              <CardContent className="text-center">
                <h3 className="font-semibold mb-2">Stay Updated</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get notified when {company.name} posts new jobs
                </p>
                <Button fullWidth>
                  Follow Company
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}