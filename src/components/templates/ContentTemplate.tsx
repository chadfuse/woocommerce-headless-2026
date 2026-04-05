import React from 'react'
import { PageTemplate, PageTemplateProps } from './PageTemplate'
import { HeroSection } from '@/components/sections/HeroSection'
import { ContentSection } from '@/components/sections/ContentSection'

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

interface ContentSectionProps {
  title?: string
  subtitle?: string
  content: React.ReactNode
  background?: 'light' | 'dark' | 'gray' | 'white'
  padding?: 'small' | 'medium' | 'large'
  layout?: 'center' | 'left' | 'right'
}

interface ContentTemplateProps extends Omit<PageTemplateProps, 'children'> {
  hero?: HeroSectionProps
  sections?: ContentSectionProps[]
  children?: React.ReactNode
}

export function ContentTemplate({
  hero,
  sections,
  children,
  ...pageProps
}: ContentTemplateProps) {
  return (
    <PageTemplate {...pageProps}>
      {/* Hero Section */}
      {hero && <HeroSection {...hero} />}
      
      {/* Content Sections */}
      {sections && sections.length > 0 && (
        <div className="space-y-16">
          {sections.map((section, index) => (
            <ContentSection key={index} {...section} />
          ))}
        </div>
      )}
      
      {/* Main Content */}
      {children}
    </PageTemplate>
  )
}

// Default export for easier usage
export default ContentTemplate
