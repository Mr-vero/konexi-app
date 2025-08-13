'use client'

import { Users, MapPin, Star } from 'lucide-react'
import Link from 'next/link'

interface Company {
  id: string
  name: string
  logo: string
  description: string
  employees: string
  location: string
  rating: number
  openPositions: number
  industry: string
  color: string
}

const featuredCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    logo: 'T',
    description: 'Leading software development company building innovative solutions',
    employees: '1000-5000',
    location: 'San Francisco, CA',
    rating: 4.8,
    openPositions: 45,
    industry: 'Technology',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'DataDrive Analytics',
    logo: 'D',
    description: 'Data science and machine learning consulting firm',
    employees: '200-500',
    location: 'New York, NY',
    rating: 4.6,
    openPositions: 23,
    industry: 'Analytics',
    color: 'bg-purple-500'
  },
  {
    id: '3',
    name: 'CloudFirst Inc',
    logo: 'C',
    description: 'Cloud infrastructure and DevOps solutions provider',
    employees: '500-1000',
    location: 'Seattle, WA',
    rating: 4.7,
    openPositions: 38,
    industry: 'Cloud Services',
    color: 'bg-green-500'
  },
  {
    id: '4',
    name: 'FinTech Innovations',
    logo: 'F',
    description: 'Revolutionary financial technology solutions',
    employees: '100-200',
    location: 'Austin, TX',
    rating: 4.5,
    openPositions: 15,
    industry: 'Finance',
    color: 'bg-orange-500'
  }
]

export function FeaturedCompanies() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Companies
          </h2>
          <p className="text-lg text-gray-600">
            Top employers actively hiring talented professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredCompanies.map((company) => (
            <Link 
              key={company.id} 
              href={`/companies/${company.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 ${company.color} rounded-xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}>
                    {company.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{company.industry}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{company.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {company.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{company.employees} employees</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{company.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">
                        {company.openPositions} open positions
                      </span>
                      <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                        View jobs →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link 
            href="/companies" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            View all companies
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}