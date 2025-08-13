'use client'

import { TrendingUp, Users, Building, Briefcase } from 'lucide-react'

interface Stat {
  label: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon: React.ReactNode
}

const stats: Stat[] = [
  {
    label: 'Total Jobs Posted',
    value: '12,453',
    change: '+12.5%',
    changeType: 'positive',
    icon: <Briefcase className="w-6 h-6" />
  },
  {
    label: 'Active Job Seekers',
    value: '84,329',
    change: '+23.1%',
    changeType: 'positive',
    icon: <Users className="w-6 h-6" />
  },
  {
    label: 'Companies Hiring',
    value: '3,247',
    change: '+18.2%',
    changeType: 'positive',
    icon: <Building className="w-6 h-6" />
  },
  {
    label: 'Avg. Time to Hire',
    value: '21 days',
    change: '-15.3%',
    changeType: 'positive',
    icon: <TrendingUp className="w-6 h-6" />
  }
]

export function JobStatistics() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Platform Statistics
          </h2>
          <p className="text-lg text-gray-600">
            Real-time insights into our growing job marketplace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Find Your Dream Job?
            </h3>
            <p className="text-lg mb-6 text-blue-100">
              Join thousands of professionals who have found their perfect career match through our platform
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}