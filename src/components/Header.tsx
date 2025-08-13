'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/Button'
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  UserCircleIcon,
  BriefcaseIcon,
  PlusIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { Dropdown, DropdownItem, DropdownDivider } from '@/components/ui/Dropdown'
import { useRouter } from 'next/navigation'

export function Header() {
  const { user, userProfile, userType, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-coral-500 to-coral-600 rounded-lg flex items-center justify-center">
                <BriefcaseIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent">
                Konexi
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {userType === 'employer' ? (
              <>
                <Link href="/dashboard/employer" className="nav-link">
                  Dashboard
                </Link>
                <Link href="/dashboard/employer/jobs" className="nav-link">
                  My Jobs
                </Link>
                <Link href="/dashboard/employer/applications" className="nav-link">
                  Applications
                </Link>
                <Link href="/talent" className="nav-link">
                  Find Talent
                </Link>
              </>
            ) : (
              <>
                <Link href="/jobs" className="nav-link">
                  Find Jobs
                </Link>
                <Link href="/companies" className="nav-link">
                  Companies
                </Link>
                <Link href="/salary-guide" className="nav-link">
                  Salary Guide
                </Link>
              </>
            )}
          </div>

          {/* Search Bar - Desktop (Only for job seekers) */}
          {userType !== 'employer' && (
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="input-field pl-10 pr-4 py-2"
                  placeholder="Search jobs, companies, or skills..."
                />
              </div>
            </div>
          )}
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors relative">
                  <BellIcon className="h-6 w-6" />
                  {/* Notification badge */}
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Post Job Button (Only for employers) */}
                {userType === 'employer' && (
                  <Link href="/jobs/new">
                    <Button size="sm" leftIcon={<PlusIcon className="w-4 h-4" />}>
                      Post Job
                    </Button>
                  </Link>
                )}

                {/* User Menu */}
                <Dropdown
                  trigger={
                    <div className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      {userProfile?.avatar_url ? (
                        <img
                          src={userProfile.avatar_url}
                          alt={userProfile.first_name || 'User'}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  }
                  align="right"
                >
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">
                      {userProfile?.first_name} {userProfile?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{userProfile?.email}</p>
                  </div>
                  
                  {userType === 'employer' ? (
                    <>
                      <DropdownItem onClick={() => router.push('/dashboard/employer')}>
                        <BriefcaseIcon className="w-4 h-4" />
                        Dashboard
                      </DropdownItem>
                      <DropdownItem onClick={() => router.push('/dashboard/employer/company')}>
                        <BuildingOfficeIcon className="w-4 h-4" />
                        Company Profile
                      </DropdownItem>
                      <DropdownItem onClick={() => router.push('/dashboard/employer/jobs')}>
                        <BriefcaseIcon className="w-4 h-4" />
                        Manage Jobs
                      </DropdownItem>
                      <DropdownItem onClick={() => router.push('/dashboard/employer/applications')}>
                        <DocumentTextIcon className="w-4 h-4" />
                        Applications
                      </DropdownItem>
                    </>
                  ) : (
                    <>
                      <DropdownItem onClick={() => router.push('/dashboard')}>
                        <BriefcaseIcon className="w-4 h-4" />
                        Dashboard
                      </DropdownItem>
                      <DropdownItem onClick={() => router.push('/profile')}>
                        <UserCircleIcon className="w-4 h-4" />
                        My Profile
                      </DropdownItem>
                      <DropdownItem onClick={() => router.push('/applications')}>
                        <DocumentTextIcon className="w-4 h-4" />
                        Applications
                      </DropdownItem>
                      <DropdownItem onClick={() => router.push('/saved-jobs')}>
                        <BookmarkIcon className="w-4 h-4" />
                        Saved Jobs
                      </DropdownItem>
                    </>
                  )}
                  
                  <DropdownDivider />
                  <DropdownItem onClick={() => router.push('/settings')}>
                    <Cog6ToothIcon className="w-4 h-4" />
                    Settings
                  </DropdownItem>
                  <DropdownItem onClick={handleSignOut}>
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    Sign Out
                  </DropdownItem>
                </Dropdown>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar (Only for job seekers) */}
      {userType !== 'employer' && (
        <div className="lg:hidden px-4 pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10 pr-4 py-2 w-full"
              placeholder="Search jobs..."
            />
          </div>
        </div>
      )}
    </header>
  )
}