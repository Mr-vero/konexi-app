'use client'

import { useState } from 'react'
import { Briefcase, TrendingUp } from 'lucide-react'
import { SearchInput } from '@/components/SearchInput'
import { Button } from '@/components/ui/Button'

interface HeroSectionProps {
  onSearch: (query: string, location: string) => void
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery, locationQuery)
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dream Job</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connect with top companies and discover opportunities that match your skills and aspirations. 
            Your next career move is just a search away.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl shadow-xl">
              <SearchInput
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={setSearchQuery}
                icon="search"
                suggestions={[
                  'Software Engineer',
                  'Product Manager',
                  'Data Scientist',
                  'UX Designer',
                  'Marketing Manager',
                  'Sales Representative',
                  'Project Manager',
                  'Business Analyst'
                ]}
                trending={[
                  'Remote Software Engineer',
                  'AI/ML Engineer',
                  'Full Stack Developer'
                ]}
              />
              <SearchInput
                placeholder="City, state, or remote"
                value={locationQuery}
                onChange={setLocationQuery}
                icon="location"
                suggestions={[
                  'Remote',
                  'San Francisco, CA',
                  'New York, NY',
                  'Austin, TX',
                  'Seattle, WA',
                  'Boston, MA',
                  'Los Angeles, CA',
                  'Chicago, IL'
                ]}
                recentSearches={[
                  'Remote',
                  'San Francisco, CA'
                ]}
              />
              <Button type="submit" size="lg" className="px-8">
                Search Jobs
              </Button>
            </div>
          </form>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">
                <strong className="text-gray-900">12,000+</strong> Active Jobs
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">
                <strong className="text-gray-900">500+</strong> Companies Hiring
              </span>
            </div>
          </div>

          {/* Popular searches */}
          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Remote', 'Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm hover:bg-gray-50 transition-colors shadow-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}