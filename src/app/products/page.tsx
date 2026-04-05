'use client'

import { useState } from 'react'
import { CommerceTemplate } from '@/components/templates/CommerceTemplate'
import { ProductGridSection } from '@/components/sections/ProductGridSection'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Grid, List, Search, Filter, X } from 'lucide-react'
import { useProducts } from '@/hooks/useWooCommerce'
import { useCategories } from '@/hooks/useWooCommerce'

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState('date_desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  const { products, loading, error } = useProducts({
    search: searchTerm || undefined,
    category: selectedCategory ? parseInt(selectedCategory) : undefined,
    page: currentPage,
    per_page: 12
  })

  const { categories } = useCategories({ hide_empty: true })

  // Mock pagination - in real app, this would come from API
  const totalPages = Math.ceil((products.length || 0) / 12)

  const Filters = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value || '')}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <div className="space-y-2">
          <Input
            placeholder="Min price"
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            type="number"
          />
          <Input
            placeholder="Max price"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            type="number"
          />
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm || selectedCategory || priceRange.min || priceRange.max) && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Active Filters</label>
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm('')}>
                <X className="h-3 w-3 mr-1" />
                {searchTerm}
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('')}>
                <X className="h-3 w-3 mr-1" />
                {categories?.find(c => c.id.toString() === selectedCategory)?.name}
              </Badge>
            )}
            {priceRange.min && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceRange(prev => ({ ...prev, min: '' }))}>
                <X className="h-3 w-3 mr-1" />
                Min: ${priceRange.min}
              </Badge>
            )}
            {priceRange.max && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceRange(prev => ({ ...prev, max: '' }))}>
                <X className="h-3 w-3 mr-1" />
                Max: ${priceRange.max}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSearchTerm('')
          setSelectedCategory('')
          setPriceRange({ min: '', max: '' })
        }}
      >
        Clear All Filters
      </Button>
    </div>
  )

  const SortBy = (
    <Select value={sortBy} onValueChange={(value) => setSortBy(value || 'date_desc')}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date_desc">Newest First</SelectItem>
        <SelectItem value="date_asc">Oldest First</SelectItem>
        <SelectItem value="price_asc">Price: Low to High</SelectItem>
        <SelectItem value="price_desc">Price: High to Low</SelectItem>
        <SelectItem value="name_asc">Name: A to Z</SelectItem>
        <SelectItem value="name_desc">Name: Z to A</SelectItem>
      </SelectContent>
    </Select>
  )

  const ViewModeToggle = (
    <div className="flex border border-gray-300 rounded-lg">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('grid')}
        className="rounded-r-none"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('list')}
        className="rounded-l-none"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )

  const ActionBar = (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-600">
        {products.length} products found
      </div>
      {searchTerm && (
        <Badge variant="secondary">
          Search: {searchTerm}
        </Badge>
      )}
      {selectedCategory && (
        <Badge variant="secondary">
          {categories?.find(c => c.id.toString() === selectedCategory)?.name}
        </Badge>
      )}
    </div>
  )

  return (
    <CommerceTemplate
      title="All Products"
      description="Browse our complete product catalog"
      filters={Filters}
      pagination={{
        currentPage,
        totalPages,
        onPageChange: setCurrentPage
      }}
      sortBy={SortBy}
      viewMode={ViewModeToggle}
      actionBar={ActionBar}
    >
      <ProductGridSection
        products={products}
        loading={loading}
        error={error || undefined}
        viewMode={viewMode}
        columns={{
          mobile: 1,
          tablet: viewMode === 'list' ? 1 : 2,
          desktop: viewMode === 'list' ? 1 : 3
        }}
      />
    </CommerceTemplate>
  )
}
