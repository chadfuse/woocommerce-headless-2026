import React from 'react'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/ProductCard'
import { Loader2, Package } from 'lucide-react'
import { WooCommerceProduct } from '@/types/woocommerce'

interface ProductGridSectionProps {
  products: WooCommerceProduct[]
  title?: string
  subtitle?: string
  viewMode?: 'grid' | 'list'
  loading?: boolean
  error?: string
  className?: string
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
}

export function ProductGridSection({
  products,
  title,
  subtitle,
  viewMode = 'grid',
  loading = false,
  error,
  className,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 4
  }
}: ProductGridSectionProps) {
  const gridClasses = {
    grid: cn(
      'grid gap-6',
      `grid-cols-${columns.mobile}`,
      `md:grid-cols-${columns.tablet}`,
      `lg:grid-cols-${columns.desktop}`
    ),
    list: 'space-y-6'
  }

  if (loading) {
    return (
      <div className={cn("py-12", className)}>
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("py-12", className)}>
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading products</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <section className={cn("py-12", className)}>
      {/* Section Header */}
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Products */}
      <div className={gridClasses[viewMode]}>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or browse our featured products.
          </p>
        </div>
      )}
    </section>
  )
}

export default ProductGridSection
