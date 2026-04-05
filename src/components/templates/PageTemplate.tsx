import React from 'react'
import { cn } from '@/lib/utils'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'

interface BreadcrumbItem {
  label: string
  href: string
}

interface PageTemplateProps {
  children: React.ReactNode
  header?: React.ReactNode
  sidebar?: React.ReactNode
  footer?: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  description?: string
  className?: string
  showHeader?: boolean
  showFooter?: boolean
}

export { type PageTemplateProps }

export function PageTemplate({
  children,
  header,
  sidebar,
  footer,
  breadcrumbs,
  title,
  description,
  className,
  showHeader = true,
  showFooter = true
}: PageTemplateProps) {
  return (
    <div className={cn("min-h-screen bg-white", className)}>
      {/* Header */}
      {showHeader && (header || <Header />)}
      
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb items={breadcrumbs} />
          </div>
        </nav>
      )}
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          {(title || description) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-lg text-gray-600 max-w-3xl">
                  {description}
                </p>
              )}
            </div>
          )}
          
          {/* Content Layout */}
          <div className={cn("flex gap-8", sidebar ? "flex-row" : "flex-col")}>
            {/* Sidebar */}
            {sidebar && (
              <aside className="w-64 flex-shrink-0">
                <div className="sticky top-24 space-y-6">
                  {sidebar}
                </div>
              </aside>
            )}
            
            {/* Main Content */}
            <div className={cn(
              "flex-1",
              sidebar && "max-w-4xl"
            )}>
              {children}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      {showFooter && (footer || <Footer />)}
    </div>
  )
}

// Default export for easier usage
export default PageTemplate
