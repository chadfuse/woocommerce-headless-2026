import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

export function Breadcrumb({ items, className, showHome = true }: BreadcrumbProps) {
  const allItems = showHome 
    ? [{ label: 'Home', href: '/' }, ...items]
    : items

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)} aria-label="Breadcrumb">
      {allItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          {index === allItems.length - 1 ? (
            <span className="font-medium text-gray-900">
              {item.label}
            </span>
          ) : (
            <a
              href={item.href}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {index === 0 && showHome ? (
                <Home className="h-4 w-4" />
              ) : (
                item.label
              )}
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb
