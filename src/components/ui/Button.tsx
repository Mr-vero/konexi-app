import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false, 
    isLoading = false,
    leftIcon,
    rightIcon,
    className = '', 
    disabled, 
    ...props 
  }, ref) => {
    const baseStyles = 'font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
    
    const variants = {
      primary: 'bg-gradient-to-r from-coral-500 to-coral-600 text-white hover:from-coral-600 hover:to-coral-700 focus:ring-coral-500 shadow-coral-500/20',
      secondary: 'bg-white text-coral-500 border-2 border-coral-500 hover:bg-coral-50 hover:border-coral-600 hover:text-coral-600 focus:ring-coral-500',
      outline: 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 focus:ring-gray-500',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-800 focus:ring-gray-500',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-red-500/20'
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    }
    
    const widthClass = fullWidth ? 'w-full' : ''
    const isDisabled = disabled || isLoading
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <div className="spinner w-4 h-4" />
        ) : (
          leftIcon && <span className="flex items-center">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="flex items-center">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'