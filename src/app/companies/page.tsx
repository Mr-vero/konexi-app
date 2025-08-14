import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/Header'
import { CompaniesClient } from '@/components/companies/CompaniesClient'

export default async function CompaniesPage() {
  const supabase = await createClient()
  
  // Get unique companies from jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('company_name')
    .order('company_name')

  // Create unique companies list with job count
  const companiesMap = new Map<string, { name: string; logo: string | null; jobCount: number }>()
  
  jobs?.forEach(job => {
    if (companiesMap.has(job.company_name)) {
      const company = companiesMap.get(job.company_name)!
      company.jobCount++
    } else {
      companiesMap.set(job.company_name, {
        name: job.company_name,
        logo: null,
        jobCount: 1
      })
    }
  })

  const companies = Array.from(companiesMap.values())

  return (
    <>
      <Header />
      <CompaniesClient companies={companies} />
    </>
  )
}