import { createClient } from '@/lib/supabase/server'
import { Container, PageHeader, Card, CardContent, Input } from '@/components/ui'
import { BuildingOfficeIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: { search?: string; industry?: string }
}) {
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from('companies')
    .select(`
      *,
      jobs:jobs(count)
    `)
    .order('name')

  // Apply filters
  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`)
  }
  if (searchParams.industry) {
    query = query.eq('industry', searchParams.industry)
  }

  const { data: companies, error } = await query

  // Get unique industries for filter
  const { data: industries } = await supabase
    .from('companies')
    .select('industry')
    .not('industry', 'is', null)
    .order('industry')

  const uniqueIndustries = [...new Set(industries?.map(i => i.industry) || [])]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Companies"
        description="Discover great companies and explore their open positions"
      />

      <Container className="py-8">
        {/* Search and Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <form>
              <Input
                type="search"
                name="search"
                placeholder="Search companies..."
                defaultValue={searchParams.search}
                leftIcon={
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </form>
          </div>
          <div>
            <form>
              <select
                name="industry"
                defaultValue={searchParams.industry}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral-500"
                onChange={(e) => e.target.form?.submit()}
              >
                <option value="">All Industries</option>
                {uniqueIndustries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </form>
          </div>
        </div>

        {/* Companies Grid */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading companies</p>
          </div>
        ) : companies && companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => {
              const jobCount = Array.isArray(company.jobs) ? company.jobs.length : company.jobs?.count || 0
              
              return (
                <Link key={company.id} href={`/companies/${company.id}`}>
                  <Card interactive className="h-full">
                    <CardContent>
                      <div className="flex items-start gap-4 mb-4">
                        {company.logo_url ? (
                          <img
                            src={company.logo_url}
                            alt={company.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                            <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {company.name}
                          </h3>
                          {company.industry && (
                            <p className="text-sm text-gray-600">
                              {company.industry}
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {company.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-3">
                          {company.location && (
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4" />
                              {company.location}
                            </span>
                          )}
                          {company.size && (
                            <span className="flex items-center gap-1">
                              <UsersIcon className="h-4 w-4" />
                              {company.size}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-coral-600">
                          {jobCount} {jobCount === 1 ? 'job' : 'jobs'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600">
              {searchParams.search || searchParams.industry
                ? 'Try adjusting your filters'
                : 'No companies have been added yet'}
            </p>
          </div>
        )}
      </Container>
    </div>
  )
}