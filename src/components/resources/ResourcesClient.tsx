'use client'

import Link from 'next/link'
import { 
  BookOpen, 
  FileText, 
  Video, 
  Users, 
  TrendingUp, 
  Lightbulb,
  Target,
  Briefcase,
  ChevronRight,
  Download,
  Clock,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ResourcesClient() {
  const categories = [
    {
      title: 'Career Development',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Advance your career with expert guidance',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      resources: [
        { title: 'Resume Writing Guide', type: 'Article', readTime: '10 min' },
        { title: 'Interview Preparation Tips', type: 'Guide', readTime: '15 min' },
        { title: 'Salary Negotiation Strategies', type: 'Article', readTime: '8 min' }
      ]
    },
    {
      title: 'Job Search Tips',
      icon: <Target className="w-6 h-6" />,
      description: 'Find your dream job faster',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      resources: [
        { title: 'How to Use Job Boards Effectively', type: 'Guide', readTime: '12 min' },
        { title: 'Networking for Job Seekers', type: 'Article', readTime: '10 min' },
        { title: 'Remote Job Search Strategies', type: 'Guide', readTime: '15 min' }
      ]
    },
    {
      title: 'Industry Insights',
      icon: <Lightbulb className="w-6 h-6" />,
      description: 'Stay updated with market trends',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      resources: [
        { title: 'Tech Industry Trends 2024', type: 'Report', readTime: '20 min' },
        { title: 'Future of Remote Work', type: 'Article', readTime: '12 min' },
        { title: 'In-Demand Skills Analysis', type: 'Report', readTime: '18 min' }
      ]
    },
    {
      title: 'For Employers',
      icon: <Briefcase className="w-6 h-6" />,
      description: 'Hire the best talent',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      resources: [
        { title: 'Writing Effective Job Descriptions', type: 'Guide', readTime: '10 min' },
        { title: 'Employer Branding Strategies', type: 'Article', readTime: '15 min' },
        { title: 'Interview Best Practices', type: 'Guide', readTime: '12 min' }
      ]
    }
  ]

  const featuredGuides = [
    {
      title: 'Complete Job Search Handbook',
      description: 'Everything you need to know about finding your next opportunity',
      image: '/api/placeholder/400/200',
      type: 'eBook',
      pages: 45,
      rating: 4.8,
      downloads: '10k+'
    },
    {
      title: 'Career Change Roadmap',
      description: 'Step-by-step guide to successfully transitioning careers',
      image: '/api/placeholder/400/200',
      type: 'Course',
      duration: '3 hours',
      rating: 4.9,
      enrolled: '5k+'
    },
    {
      title: 'Remote Work Success Guide',
      description: 'Master the art of working remotely and boost your productivity',
      image: '/api/placeholder/400/200',
      type: 'eBook',
      pages: 32,
      rating: 4.7,
      downloads: '8k+'
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Career Resources & Guides
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Free resources to help you succeed in your job search and career development
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse All Resources
              </Button>
              <Button variant="secondary" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
                <Video className="w-5 h-5 mr-2" />
                Watch Tutorials
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Guides */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredGuides.map((guide) => (
              <div key={guide.title} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-blue-600">{guide.type}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{guide.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {guide.pages && <span>{guide.pages} pages</span>}
                    {guide.duration && <span>{guide.duration}</span>}
                    <span>{guide.downloads || guide.enrolled}</span>
                  </div>
                  <Button className="w-full mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download Free
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <div key={category.title} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${category.bgColor} ${category.color}`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{category.title}</h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {category.resources.map((resource) => (
                    <Link 
                      key={resource.title}
                      href="#"
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-blue-600">
                            {resource.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {resource.type} • {resource.readTime}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                    </Link>
                  ))}
                </div>
                <Button variant="secondary" className="w-full mt-4">
                  View All {category.title} Resources
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Get Career Tips Delivered to Your Inbox
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join 50,000+ professionals receiving weekly career insights
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
            />
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article key={i} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Clock className="w-4 h-4" />
                  <span>5 min read</span>
                  <span>•</span>
                  <span>2 days ago</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                  <Link href="#">
                    10 Tips for Acing Your Next Video Interview
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">
                  Master the art of video interviews with these proven strategies...
                </p>
                <Link href="#" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  Read more
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </article>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="secondary" size="lg">
              View All Articles
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}