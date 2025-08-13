'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { Container, Card, CardContent, Button, Badge } from '@/components/ui'
import { 
  UserCircleIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const { userProfile, userType } = useAuth()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    if (userType === 'employer') {
      router.push('/dashboard/employer')
      return
    }
    fetchApplications()
  }, [userType, router])

  const fetchApplications = async () => {
    if (!userProfile) return

    try {
      const { data } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(
            id,
            title,
            company:companies(name)
          )
        `)
        .eq('applicant_id', userProfile.id)
        .order('applied_at', { ascending: false })
        .limit(3)

      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !userProfile) {
    return (
      <Container className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Container>
    )
  }

  const completenessScore = calculateProfileCompleteness(userProfile)
  const isProfilePublic = userProfile.profile_visibility === 'public'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <Container className="py-8">
          <div className="flex items-start gap-6">
            {userProfile.avatar_url ? (
              <img
                src={userProfile.avatar_url}
                alt={`${userProfile.first_name} ${userProfile.last_name}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                <UserCircleIcon className="h-16 w-16 text-gray-400" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {userProfile.first_name} {userProfile.last_name}
                  </h1>
                  {userProfile.bio && (
                    <p className="mt-2 text-gray-600 max-w-2xl">
                      {userProfile.bio}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-600">
                    {userProfile.location && (
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        {userProfile.location}
                      </span>
                    )}
                    {userProfile.email && (
                      <span className="flex items-center gap-1">
                        <EnvelopeIcon className="h-4 w-4" />
                        {userProfile.email}
                      </span>
                    )}
                    {userProfile.phone && (
                      <span className="flex items-center gap-1">
                        <PhoneIcon className="h-4 w-4" />
                        {userProfile.phone}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    {userProfile.is_open_to_work && (
                      <Badge variant="success">Open to Work</Badge>
                    )}
                    {userProfile.experience_level && (
                      <Badge variant="default">
                        {userProfile.experience_level.charAt(0).toUpperCase() + userProfile.experience_level.slice(1)} Level
                      </Badge>
                    )}
                    <Badge variant={isProfilePublic ? 'info' : 'warning'}>
                      <span className="flex items-center gap-1">
                        {isProfilePublic ? <EyeIcon className="h-3 w-3" /> : <EyeSlashIcon className="h-3 w-3" />}
                        {userProfile.profile_visibility.replace('_', ' ')}
                      </span>
                    </Badge>
                  </div>
                </div>

                <Link href="/profile/edit">
                  <Button leftIcon={<PencilIcon className="h-4 w-4" />}>
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            {userProfile.skills && userProfile.skills.length > 0 && (
              <Card>
                <CardContent>
                  <h2 className="text-xl font-semibold mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="coral" size="lg">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Applications */}
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recent Applications</h2>
                  <Link href="/applications">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                {applications.length > 0 ? (
                  <div className="space-y-3">
                    {applications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{application.job?.title}</h4>
                          <p className="text-sm text-gray-600">
                            {application.job?.company?.name} • Applied {new Date(application.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            application.status === 'pending' ? 'warning' :
                            application.status === 'reviewing' ? 'info' :
                            application.status === 'interview' ? 'coral' :
                            application.status === 'offer' ? 'success' :
                            application.status === 'rejected' ? 'error' :
                            'default'
                          }
                          size="sm"
                        >
                          {application.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No applications yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Desired Salary (Private - only visible to the user) */}
            {(userProfile.desired_salary_min || userProfile.desired_salary_max) && (
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold">Salary Expectations</h2>
                    <Badge variant="warning" size="sm">
                      <EyeSlashIcon className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Only visible to you
                  </p>
                  <p className="text-lg font-medium">
                    ${userProfile.desired_salary_min?.toLocaleString() || '0'} - ${userProfile.desired_salary_max?.toLocaleString() || '0'} per year
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completeness */}
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-4">Profile Strength</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Profile Completeness</span>
                      <span className="font-medium">{completenessScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-coral-500 h-2 rounded-full transition-all"
                        style={{ width: `${completenessScore}%` }}
                      />
                    </div>
                  </div>
                  {completenessScore < 100 && (
                    <p className="text-sm text-gray-600">
                      Complete your profile to improve visibility to employers
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-4">Links</h3>
                <div className="space-y-3">
                  {userProfile.resume_url && (
                    <a
                      href={userProfile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-coral-600 hover:text-coral-700"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                      View Resume
                    </a>
                  )}
                  {userProfile.linkedin_url && (
                    <a
                      href={userProfile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-coral-600 hover:text-coral-700"
                    >
                      <LinkIcon className="h-5 w-5" />
                      LinkedIn Profile
                    </a>
                  )}
                  {userProfile.portfolio_url && (
                    <a
                      href={userProfile.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-coral-600 hover:text-coral-700"
                    >
                      <LinkIcon className="h-5 w-5" />
                      Portfolio
                    </a>
                  )}
                  {!userProfile.resume_url && !userProfile.linkedin_url && !userProfile.portfolio_url && (
                    <p className="text-sm text-gray-600">
                      No links added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/jobs">
                    <Button fullWidth variant="outline" size="sm">
                      <BriefcaseIcon className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </Button>
                  </Link>
                  <Link href="/profile/resume">
                    <Button fullWidth variant="outline" size="sm">
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Upload New Resume
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button fullWidth variant="outline" size="sm">
                      Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}

function calculateProfileCompleteness(profile: any): number {
  const fields = [
    profile.first_name,
    profile.last_name,
    profile.phone,
    profile.location,
    profile.bio,
    profile.skills && profile.skills.length > 0,
    profile.experience_level,
    profile.resume_url,
    profile.avatar_url,
  ]
  
  const completed = fields.filter(Boolean).length
  return Math.round((completed / fields.length) * 100)
}