import React from 'react'
import { cn } from '@/lib/utils'

interface ContentSectionProps {
  title?: string
  subtitle?: string
  content: React.ReactNode
  background?: 'light' | 'dark' | 'gray' | 'white'
  padding?: 'small' | 'medium' | 'large'
  layout?: 'center' | 'left' | 'right'
  className?: string
}

export function ContentSection({
  title,
  subtitle,
  content,
  background = 'light',
  padding = 'medium',
  layout = 'left',
  className
}: ContentSectionProps) {
  const bgClasses = {
    light: 'bg-white',
    dark: 'bg-gray-900',
    gray: 'bg-gray-50',
    white: 'bg-white'
  }
  
  const paddingClasses = {
    small: 'py-8',
    medium: 'py-16',
    large: 'py-24'
  }
  
  const textClasses = {
    light: 'text-gray-900',
    dark: 'text-white',
    gray: 'text-gray-900',
    white: 'text-gray-900'
  }
  
  const subTextClasses = {
    light: 'text-gray-600',
    dark: 'text-gray-300',
    gray: 'text-gray-600',
    white: 'text-gray-600'
  }
  
  const layoutClasses = {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right'
  }
  
  return (
    <section className={cn(
      bgClasses[background],
      paddingClasses[padding],
      className
    )}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className={cn("mb-12", layoutClasses[layout])}>
            {title && (
              <h2 className={cn(
                "text-3xl md:text-4xl font-bold mb-4",
                textClasses[background]
              )}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={cn(
                "text-lg md:text-xl max-w-3xl",
                subTextClasses[background],
                layout === 'center' ? 'mx-auto' : ''
              )}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className={cn(layoutClasses[layout])}>
          {content}
        </div>
      </div>
    </section>
  )
}

// Default export for easier usage
export default ContentSection
