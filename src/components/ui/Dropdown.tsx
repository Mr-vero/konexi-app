import { Menu, Transition } from '@headlessui/react'
import { Fragment, ReactNode } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
}

export function Dropdown({ trigger, children, align = 'right' }: DropdownProps) {
  const alignmentClasses = {
    left: 'origin-top-left left-0',
    right: 'origin-top-right right-0'
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5">
          {trigger}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className={`absolute ${alignmentClasses[align]} z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
          <div className="py-1">
            {children}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

// Dropdown Item component
interface DropdownItemProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  icon?: ReactNode
  className?: string
}

export function DropdownItem({ children, onClick, disabled = false, icon, className = '' }: DropdownItemProps) {
  return (
    <Menu.Item disabled={disabled}>
      {({ active }) => (
        <button
          onClick={onClick}
          className={`${
            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
          } ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } group flex w-full items-center px-4 py-2 text-sm ${className}`}
          disabled={disabled}
        >
          {icon && <span className="mr-3 flex items-center text-gray-400">{icon}</span>}
          {children}
        </button>
      )}
    </Menu.Item>
  )
}

// Dropdown Divider component
export function DropdownDivider() {
  return <div className="border-t border-gray-100 my-1" />
}

// Quick Dropdown Button component for common use case
interface DropdownButtonProps {
  label: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  align?: 'left' | 'right'
}

export function DropdownButton({ 
  label, 
  children, 
  variant = 'outline', 
  size = 'md',
  align = 'right' 
}: DropdownButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-coral-500 text-white hover:bg-coral-600 focus:ring-coral-500',
    secondary: 'bg-white text-coral-500 border-2 border-coral-500 hover:bg-coral-50 focus:ring-coral-500',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const trigger = (
    <div className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>
      {label}
      <ChevronDownIcon className="h-4 w-4" />
    </div>
  )

  return (
    <Dropdown trigger={trigger} align={align}>
      {children}
    </Dropdown>
  )
}