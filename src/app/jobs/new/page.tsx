import { Header } from '@/components/Header'
import { JobForm } from '@/components/jobs/JobForm'

export default function NewJobPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Post a New Job</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <JobForm mode="create" />
        </div>
      </main>
    </>
  )
}