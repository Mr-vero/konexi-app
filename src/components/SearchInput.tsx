'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Clock, TrendingUp } from 'lucide-react'

interface SearchInputProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  icon: 'search' | 'location'
  suggestions?: string[]
  recentSearches?: string[]
  trending?: string[]
}

export function SearchInput({ 
  placeholder, 
  value, 
  onChange, 
  icon,
  suggestions = [],
  recentSearches = [],
  trending = []
}: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (value) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions([])
    }
  }, [value, suggestions])

  const IconComponent = icon === 'search' ? Search : MapPin

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setIsOpen(false)
  }

  const showDropdown = isOpen && (
    filteredSuggestions.length > 0 || 
    (!value && (recentSearches.length > 0 || trending.length > 0))
  )

  return (
    <div className="relative flex-1">
      <IconComponent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className="w-full pl-10 pr-4 py-3 border-0 focus:ring-2 focus:ring-blue-500 rounded-lg bg-white"
      />
      
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 z-50 max-h-96 overflow-y-auto"
        >
          {value && filteredSuggestions.length > 0 && (
            <div className="p-2">
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
          
          {!value && recentSearches.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wider px-3 py-1">Recent Searches</p>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}
          
          {!value && trending.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider px-3 py-1">Trending</p>
              {trending.map((trend, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(trend)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{trend}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}