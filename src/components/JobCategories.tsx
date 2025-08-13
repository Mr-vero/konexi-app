'use client'

import { Code, Briefcase, TrendingUp, Palette, Users, Heart, BarChart, Shield } from 'lucide-react'

interface JobCategory {
  name: string
  icon: React.ReactNode
  count: number
  color: string
  bgColor: string
}

const categories: JobCategory[] = [
  {
    name: 'Technology',
    icon: <Code className="w-6 h-6" />,
    count: 3456,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    name: 'Business',
    icon: <Briefcase className="w-6 h-6" />,
    count: 2341,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    name: 'Sales',
    icon: <TrendingUp className="w-6 h-6" />,
    count: 1876,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    name: 'Design',
    icon: <Palette className="w-6 h-6" />,
    count: 1234,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  {
    name: 'Marketing',
    icon: <BarChart className="w-6 h-6" />,
    count: 1654,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    name: 'HR',
    icon: <Users className="w-6 h-6" />,
    count: 987,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100'
  },
  {
    name: 'Healthcare',
    icon: <Heart className="w-6 h-6" />,
    count: 2109,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    name: 'Security',
    icon: <Shield className="w-6 h-6" />,
    count: 765,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  }
]

interface JobCategoriesProps {
  onCategoryClick?: (category: string) => void
}

export function JobCategories({ onCategoryClick }: JobCategoriesProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-lg text-gray-600">
            Find opportunities in your field of expertise
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => onCategoryClick?.(category.name)}
              className="group relative p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 rounded-lg ${category.bgColor} ${category.color} mb-4`}>
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count.toLocaleString()} jobs</p>
              
              <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-blue-200 transition-all duration-300"></div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}