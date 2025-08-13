import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const textareaVariants = cva(
  'w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus:border-coral-500 focus:ring-coral-500',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
      },
      size: {
        sm: 'text-sm py-1.5',
        md: 'text-base py-2',
        lg: 'text-lg py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  label?: string
  error?: string
  helperText?: string
  showCount?: boolean
  maxLength?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className,
    variant,
    size,
    label,
    error,
    helperText,
    showCount,
    maxLength,
    value,
    id,
    ...props 
  }, ref) => {
    const textareaId = id || props.name
    const currentLength = value ? String(value).length : 0

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={textareaVariants({ 
            variant: error ? 'error' : variant, 
            size, 
            className 
          })}
          {...props}
        />
        <div className="mt-1 flex justify-between">
          {(error || helperText) && (
            <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
              {error || helperText}
            </p>
          )}
          {showCount && maxLength && (
            <span className="text-sm text-gray-500">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'