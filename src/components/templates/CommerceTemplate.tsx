import React from 'react'
import { cn } from '@/lib/utils'
import { PageTemplate, PageTemplateProps } from './PageTemplate'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPrevNext?: boolean
  showFirstLast?: boolean
}

interface CommerceTemplateProps extends Omit<PageTemplateProps, 'children'> {
  children: React.ReactNode
  filters?: React.ReactNode
  pagination?: PaginationProps
  actionBar?: React.ReactNode
  sortBy?: React.ReactNode
  viewMode?: React.ReactNode
}

export function CommerceTemplate({
  children,
  filters,
  pagination,
  actionBar,
  sortBy,
  viewMode,
  ...pageProps
}: CommerceTemplateProps) {
  return (
    <PageTemplate {...pageProps}>
      {/* Action Bar */}
      {(actionBar || sortBy || viewMode) && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {actionBar}
            {sortBy}
          </div>
          {viewMode}
        </div>
      )}
      
      <div className={cn("flex gap-8", filters ? "flex-row" : "flex-col")}>
        {/* Filters Sidebar */}
        {filters && (
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
                {filters}
              </div>
            </div>
          </aside>
        )}
        
        {/* Main Content */}
        <div className="flex-1">
          {children}
          
          {/* Pagination */}
          {pagination && (
            <div className="mt-12 flex justify-center">
              <Pagination {...pagination} />
            </div>
          )}
        </div>
      </div>
    </PageTemplate>
  )
}

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPrevNext = true,
  showFirstLast = false
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  return (
    <div className="flex items-center gap-2">
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          First
        </button>
      )}
      
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "px-3 py-1 text-sm border rounded-md",
            page === currentPage
              ? "bg-primary text-primary-foreground border-primary"
              : "border-gray-300 hover:bg-gray-50"
          )}
        >
          {page}
        </button>
      ))}
      
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      )}
      
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Last
        </button>
      )}
    </div>
  )
}

// Default export for easier usage
export default CommerceTemplate
