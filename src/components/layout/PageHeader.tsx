import React from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  action?: React.ReactNode
}

export function PageHeader({ 
  title, 
  description, 
  children, 
  action 
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div className="ml-4 flex-shrink-0">
              {action}
            </div>
          )}
        </div>
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}