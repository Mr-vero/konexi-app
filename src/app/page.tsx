'use client'

import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { JobCategories } from '@/components/JobCategories'
import { FeaturedCompanies } from '@/components/FeaturedCompanies'
import { JobStatistics } from '@/components/JobStatistics'

export default function Home() {
  const handleSearch = (query: string, location: string) => {
    // Redirect to jobs page with search params
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (location) params.set('location', location)
    window.location.href = `/jobs?${params.toString()}`
  }

  const handleCategoryClick = (category: string) => {
    // Redirect to jobs page with category filter
    window.location.href = `/jobs?category=${encodeURIComponent(category)}`
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection onSearch={handleSearch} />
        
        <JobCategories onCategoryClick={handleCategoryClick} />
        
        <FeaturedCompanies />
        <JobStatistics />
      </main>
    </>
  )
}