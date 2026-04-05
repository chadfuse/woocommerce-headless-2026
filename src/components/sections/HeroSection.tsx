import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface HeroSectionProps {
  title: string
  subtitle?: string
  description?: string
  image?: string
  cta?: {
    children: React.ReactNode
    href?: string
    onClick?: () => void
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    className?: string
  }
  background?: 'light' | 'dark' | 'gradient'
  size?: 'small' | 'medium' | 'large'
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  alignment?: 'left' | 'center' | 'right'
}

export function HeroSection({
  title,
  subtitle,
  description,
  image,
  cta,
  background = 'light',
  size = 'medium',
  badge,
  alignment = 'left'
}: HeroSectionProps) {
  const bgClasses = {
    light: 'bg-white',
    dark: 'bg-gray-900',
    gradient: 'bg-gradient-to-r from-primary to-primary-600'
  }
  
  const sizeClasses = {
    small: 'py-12',
    medium: 'py-20',
    large: 'py-32'
  }
  
  const textClasses = {
    light: 'text-gray-900',
    dark: 'text-white',
    gradient: 'text-white'
  }
  
  const subTextClasses = {
    light: 'text-gray-600',
    dark: 'text-gray-300',
    gradient: 'text-gray-100'
  }
  
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }
  
  return (
    <section className={cn(
      "relative overflow-hidden",
      sizeClasses[size]
    )}>
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}
      
      {/* Gradient Background (when no image) */}
      {!image && (
        <div className={cn(
          "absolute inset-0 z-0",
          bgClasses[background]
        )} />
      )}
      
      {/* Background decoration for gradient */}
      {background === 'gradient' && !image && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={cn(
          "flex items-center gap-12 min-h-[60vh]",
          alignment === 'center' ? 'flex-col justify-center text-center' : 'flex-row',
          alignment === 'right' ? 'flex-row-reverse' : ''
        )}>
          {/* Content */}
          <div className={cn(
            "space-y-6 max-w-4xl",
            alignment === 'center' ? 'flex flex-col items-center' : '',
            image ? 'text-white' : ''
          )}>
            {/* Badge */}
            {badge && (
              <Badge variant={badge.variant} className="w-fit">
                {badge.text}
              </Badge>
            )}
            
            {/* Title */}
            <h1 className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight",
              image ? 'text-white' : textClasses[background]
            )}>
              {title}
            </h1>
            
            {/* Subtitle */}
            {subtitle && (
              <h2 className={cn(
                "text-xl md:text-2xl lg:text-3xl font-medium",
                image ? 'text-gray-200' : subTextClasses[background]
              )}>
                {subtitle}
              </h2>
            )}
            
            {/* Description */}
            {description && (
              <p className={cn(
                "text-lg md:text-xl max-w-2xl",
                image ? 'text-gray-300' : subTextClasses[background],
                alignment === 'center' ? 'mx-auto' : ''
              )}>
                {description}
              </p>
            )}
            
            {/* CTA Button */}
            {cta && (
              <div className={cn(
                "pt-4",
                alignment === 'center' ? 'flex justify-center' : ''
              )}>
                {cta.href ? (
                  <Link href={cta.href}>
                    <Button
                      variant={cta.variant}
                      size={cta.size}
                      onClick={cta.onClick}
                      className={cn(
                        "px-8 py-3 text-lg font-semibold",
                        image ? 'bg-white text-gray-900 hover:bg-gray-100' : '',
                        background === 'gradient' && !image ? 'bg-white text-primary hover:bg-gray-100' : ''
                      )}
                    >
                      {cta.children}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant={cta.variant}
                    size={cta.size}
                    onClick={cta.onClick}
                    className={cn(
                      "px-8 py-3 text-lg font-semibold",
                      image ? 'bg-white text-gray-900 hover:bg-gray-100' : '',
                      background === 'gradient' && !image ? 'bg-white text-primary hover:bg-gray-100' : ''
                    )}
                  >
                    {cta.children}
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Image (when not used as background) */}
          {image && !image && (
            <div className="flex-1">
              <div className={cn(
                "relative",
                alignment === 'center' ? 'flex justify-center' : ''
              )}>
                <img
                  src={image}
                  alt={title}
                  className={cn(
                    "w-full h-auto rounded-lg shadow-2xl",
                    alignment === 'center' ? 'max-w-lg' : ''
                  )}
                />
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Default export for easier usage
export default HeroSection
