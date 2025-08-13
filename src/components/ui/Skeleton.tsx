import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | false
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton',
  }

  return (
    <div
      className={`
        bg-gray-200
        ${variantClasses[variant]}
        ${animation ? animationClasses[animation] : ''}
        ${className}
      `}
      style={{
        width: width || '100%',
        height: height || (variant === 'text' ? '1em' : '100%'),
      }}
      {...props}
    />
  )
}

// Pre-configured skeleton components for common use cases
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '80%' : '100%'}
          height="1em"
        />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height="1.5em" className="mb-2" />
          <Skeleton variant="text" width="40%" height="1em" />
        </div>
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <SkeletonText lines={3} />
      <div className="flex gap-2 mt-4">
        <Skeleton variant="rectangular" width={80} height={24} />
        <Skeleton variant="rectangular" width={80} height={24} />
      </div>
    </div>
  )
}

export function SkeletonJobCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton variant="rectangular" width={64} height={64} className="rounded-lg" />
        <div className="flex-1">
          <Skeleton variant="text" width="70%" height="1.5em" className="mb-2" />
          <Skeleton variant="text" width="50%" height="1em" className="mb-2" />
          <div className="flex gap-2">
            <Skeleton variant="rectangular" width={60} height={20} className="rounded-full" />
            <Skeleton variant="rectangular" width={60} height={20} className="rounded-full" />
          </div>
        </div>
      </div>
      <SkeletonText lines={2} />
      <div className="flex items-center justify-between mt-4">
        <Skeleton variant="text" width={120} height="1em" />
        <Skeleton variant="rectangular" width={100} height={32} className="rounded-lg" />
      </div>
    </div>
  )
}