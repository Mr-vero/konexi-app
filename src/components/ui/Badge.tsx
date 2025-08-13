import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        coral: 'bg-coral-50 text-coral-700',
        teal: 'bg-teal-50 text-teal-700',
        ocean: 'bg-ocean-50 text-ocean-700',
        warm: 'bg-warm-50 text-warm-700',
        success: 'bg-green-50 text-green-700',
        error: 'bg-red-50 text-red-700',
        warning: 'bg-yellow-50 text-yellow-700',
        info: 'bg-blue-50 text-blue-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

export function Badge({
  className,
  variant,
  size,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={badgeVariants({ variant, size, className })}
      {...props}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  )
}

// Specialized badge components for common use cases
export function JobTypeBadge({ type }: { type: string }) {
  const variants: Record<string, VariantProps<typeof badgeVariants>['variant']> = {
    full_time: 'coral',
    part_time: 'ocean',
    contract: 'warm',
    internship: 'teal',
    freelance: 'info',
  }

  return (
    <Badge variant={variants[type] || 'default'} size="sm">
      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </Badge>
  )
}

export function ExperienceLevelBadge({ level }: { level: string }) {
  const variants: Record<string, VariantProps<typeof badgeVariants>['variant']> = {
    entry: 'success',
    mid: 'info',
    senior: 'coral',
    executive: 'warm',
  }

  return (
    <Badge variant={variants[level] || 'default'} size="sm">
      {level.charAt(0).toUpperCase() + level.slice(1)} Level
    </Badge>
  )
}

export function LocationTypeBadge({ type }: { type: string }) {
  const variants: Record<string, VariantProps<typeof badgeVariants>['variant']> = {
    remote: 'teal',
    onsite: 'coral',
    hybrid: 'ocean',
  }

  return (
    <Badge variant={variants[type] || 'default'} size="sm">
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  )
}