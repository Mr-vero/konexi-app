import { HTMLAttributes, ReactNode } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'coral' | 'teal'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  className = '', 
  ...props 
}: BadgeProps) {
  const baseStyles = 'badge inline-flex items-center gap-1'
  
  const variants = {
    default: 'badge-info',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    coral: 'badge-coral',
    teal: 'badge-teal'
  }
  
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }
  
  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </span>
  )
}