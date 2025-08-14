'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, MapPin, Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Company {
  name: string
  logo: string | null
  jobCount: number
}

interface CompaniesClientProps {
  companies: Company[]
}

export function CompaniesClient({ companies }: CompaniesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCompanies, setFilteredCompanies] = useState(companies)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredCompanies(filtered)
  }

  const topCompanies = companies.sort((a, b) => b.jobCount - a.jobCount).slice(0, 6)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Great Companies
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Explore companies that are hiring and find your perfect workplace culture
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{companies.length}</div>
                <div className="text-gray-600 mt-1">Companies Hiring</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {companies.reduce((sum, c) => sum + c.jobCount, 0)}
                </div>
                <div className="text-gray-600 mt-1">Open Positions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">50+</div>
                <div className="text-gray-600 mt-1">Industries</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Companies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Top Hiring Companies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCompanies.map((company) => (
              <Link
                key={company.name}
                href={`/jobs?company=${encodeURIComponent(company.name)}`}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <Badge variant="primary" size="sm">
                    {company.jobCount} Jobs
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  {company.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Multiple Locations
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    500+ Employees
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Companies */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              All Companies ({filteredCompanies.length})
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm">
                A-Z
              </Button>
              <Button variant="secondary" size="sm">
                Most Jobs
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((company) => (
              <Link
                key={company.name}
                href={`/jobs?company=${encodeURIComponent(company.name)}`}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <Building2 className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900">{company.name}</span>
                </div>
                <span className="text-sm text-gray-600">{company.jobCount} jobs</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Want to see your company here?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Post your job openings and reach thousands of qualified candidates
          </p>
          <Link href="/jobs/new">
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Post a Job
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'sm' | 'md'
  className?: string
}

function Badge({ children, variant = 'primary', size = 'md', className = '' }: BadgeProps) {
  const variants = {
    primary: 'bg-blue-100 text-blue-600',
    secondary: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-600',
    danger: 'bg-red-100 text-red-600'
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}