'use client'

import { useEffect, useState } from 'react'
import { Code, Briefcase, TrendingUp, Palette, Users, Heart, BarChart, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface JobCategory {
  name: string
  icon: React.ReactNode
  count: number
  color: string
  bgColor: string
  keywords: string[]
}

const categoryDefinitions = [
  {
    name: 'Technology',
    icon: <Code className="w-6 h-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    keywords: ['software', 'developer', 'engineer', 'tech', 'programming', 'IT', 'data', 'cloud', 'devops']
  },
  {
    name: 'Business',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    keywords: ['business', 'manager', 'analyst', 'consultant', 'strategy', 'operations']
  },
  {
    name: 'Sales',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    keywords: ['sales', 'account', 'business development', 'revenue', 'customer success']
  },
  {
    name: 'Design',
    icon: <Palette className="w-6 h-6" />,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    keywords: ['design', 'ui', 'ux', 'graphic', 'creative', 'visual', 'product design']
  },
  {
    name: 'Marketing',
    icon: <BarChart className="w-6 h-6" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    keywords: ['marketing', 'seo', 'content', 'social media', 'digital', 'brand', 'growth']
  },
  {
    name: 'HR',
    icon: <Users className="w-6 h-6" />,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    keywords: ['hr', 'human resources', 'recruiter', 'talent', 'people', 'culture']
  },
  {
    name: 'Healthcare',
    icon: <Heart className="w-6 h-6" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    keywords: ['health', 'medical', 'nurse', 'doctor', 'clinical', 'patient', 'healthcare']
  },
  {
    name: 'Security',
    icon: <Shield className="w-6 h-6" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    keywords: ['security', 'cyber', 'compliance', 'risk', 'information security', 'infosec']
  }
]

interface JobCategoriesProps {
  onCategoryClick?: (category: string) => void
}

export function JobCategories({ onCategoryClick }: JobCategoriesProps) {
  const [categories, setCategories] = useState<JobCategory[]>([]) 
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      const supabase = createClient()
      const { data: jobs } = await supabase
        .from('jobs')
        .select('title, description')

      if (jobs) {
        const categoriesWithCounts = categoryDefinitions.map(category => {
          const count = jobs.filter(job => {
            const jobText = `${job.title} ${job.description}`.toLowerCase()
            return category.keywords.some(keyword => jobText.includes(keyword.toLowerCase()))
          }).length

          return {
            ...category,
            count
          }
        })

        setCategories(categoriesWithCounts)
      }
      setLoading(false)
    }

    fetchCategoryCounts()
  }, [])
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
          {loading ? (
            // Loading skeletons
            [...Array(8)].map((_, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-md animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))
          ) : (
            categories.map((category) => (
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
            ))
          )}
        </div>
      </div>
    </section>
  )
}