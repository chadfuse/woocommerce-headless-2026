'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Plus, Star, Eye } from 'lucide-react'
import { WooCommerceProduct } from '@/types/woocommerce'
import { useLocalCartStore } from '@/store/localCartStore'
import { toast } from 'sonner'

interface ProductCardProps {
  product: WooCommerceProduct
  viewMode?: 'grid' | 'list'
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart, isLoading } = useLocalCartStore()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    // Add a success toast
    toast.success(`${product.name} added to cart!`, {
      description: 'Item has been added to your shopping cart',
      action: {
        label: 'View Cart',
        onClick: () => {
          // Open cart drawer
          const { toggleCart } = useLocalCartStore.getState()
          toggleCart()
        },
      },
    })
    
    try {
      await addToCart(product, 1)
      // Keep the "Added!" state for a moment to show the animation
      setTimeout(() => {
        setIsAdding(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast.error('Failed to add item to cart')
      setIsAdding(false)
    }
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price || '0'))
  }

  const renderStars = (rating: string) => {
    const ratingValue = parseFloat(rating)
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= ratingValue ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      )
    }
    return stars
  }

  const cardClasses = viewMode === 'list' 
    ? 'flex flex-row' 
    : 'flex flex-col'

  const imageClasses = viewMode === 'list'
    ? 'w-32 h-32 flex-shrink-0'
    : 'aspect-square'

  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      isAdding ? 'ring-2 ring-green-500 ring-offset-2' : ''
    } ${cardClasses}`}>
      <div className={`relative ${imageClasses} overflow-hidden bg-gray-50`}>
        <Link href={`/products/${product.slug}`}>
          {product.images && product.images.length > 0 && product.images[0].src ? (
            <>
              <div className="relative w-full h-full">
                <img
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.name}
                  className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
                    viewMode === 'list' ? 'rounded-l-lg' : ''
                  }`}
                  onError={(e) => {
                    console.error('Image failed to load:', product.images[0].src)
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const placeholder = target.parentElement?.querySelector('.image-placeholder')
                    if (placeholder) {
                      placeholder.classList.remove('hidden')
                    }
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', product.images[0].src)
                  }}
                />
                {/* Overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="image-placeholder hidden absolute inset-0 flex h-full items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-gray-500 text-2xl">📦</span>
                  </div>
                  <span className="text-gray-500 text-sm">Product Image</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-gray-500 text-2xl">📦</span>
                </div>
                <span className="text-gray-500 text-sm">Product Image</span>
              </div>
            </div>
          )}
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {product.on_sale && (
            <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-md">
              Sale
            </Badge>
          )}
          {product.featured && (
            <Badge className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
              Featured
            </Badge>
          )}
        </div>

        {/* Quick view button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={(e) => {
              e.preventDefault()
              // Quick view functionality
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className={`flex-1 p-4 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
        <div className={viewMode === 'list' ? 'flex-1' : ''}>
          <div className="mb-2">
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2 leading-tight text-lg">
                {product.name}
              </h3>
            </Link>
          </div>
          
          {product.short_description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.short_description.replace(/<[^>]*>/g, '')}
            </p>
          )}
          
          <div className="flex items-center gap-2 mb-3">
            {renderStars(product.average_rating || '4')}
            <span className="text-xs text-gray-500">
              ({Math.floor(Math.random() * 50) + 10})
            </span>
          </div>
        </div>

        <div className={viewMode === 'list' ? 'flex items-center justify-between' : ''}>
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {product.regular_price && product.regular_price !== product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ${parseFloat(product.regular_price).toFixed(2)}
                </span>
              )}
            </div>
            {product.regular_price && product.regular_price !== product.price && (
              <div className="text-xs text-green-600 font-medium">
                Save ${parseFloat(String(Number(product.regular_price) - Number(product.price))).toFixed(2)}
              </div>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isAdding || isLoading || product.stock_status !== 'instock'}
            className={viewMode === 'list' ? 'ml-4' : 'w-full'}
            size={viewMode === 'list' ? 'sm' : 'default'}
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {viewMode === 'list' ? 'Add' : 'Add to Cart'}
              </>
            )}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {product.type === 'grouped' ? (
          <div className="w-full">
            <Badge variant="secondary" className="mb-2">Grouped Product</Badge>
            <Link href={`/products/${product.slug}`}>
              <Button className="w-full">
                View Product Details
              </Button>
            </Link>
          </div>
        ) : product.type === 'variable' ? (
          <div className="w-full">
            <Badge variant="secondary" className="mb-2">Variable Product</Badge>
            <Link href={`/products/${product.slug}`}>
              <Button className="w-full">
                Select Options
              </Button>
            </Link>
          </div>
        ) : product.stock_status === 'outofstock' ? (
          <div className="w-full">
            <Badge variant="destructive" className="mb-2">Out of Stock</Badge>
            <Button className="w-full" disabled>
              Out of Stock
            </Button>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  )
}
