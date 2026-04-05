'use client'

import { use } from 'react'
import { PageTemplate } from '@/components/templates/PageTemplate'
import { ProductGridSection } from '@/components/sections/ProductGridSection'
import { useProductBySlug, useProducts } from '@/hooks/useWooCommerce'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Star, Truck, Shield, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useLocalCartStore } from '@/store/localCartStore'
import { toast } from 'sonner'

export default function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug
  const { product, loading, error } = useProductBySlug(slug)
  const { addToCart, isLoading } = useLocalCartStore()
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const { products: relatedProducts } = useProducts({
    category: product?.categories[0]?.id,
    per_page: 4
  })

  const handleAddToCart = async () => {
    if (!product) return
    
    setIsAdding(true)
    try {
      await addToCart(product, quantity)
      toast.success(`${product.name} added to cart!`, {
        description: `${quantity} item(s) added to your cart`,
      })
    } catch (error) {
      toast.error('Failed to add to cart', {
        description: 'Please try again later',
      })
    } finally {
      setIsAdding(false)
    }
  }

  if (loading) {
    return (
      <PageTemplate title="Loading...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageTemplate>
    )
  }

  if (error) {
    return (
      <PageTemplate title="Error">
        <div className="text-center py-12">
          <p className="text-red-600 mb-2">Error loading product</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </PageTemplate>
    )
  }

  if (!product) {
    return (
      <PageTemplate title="Product Not Found">
        <div className="text-center py-12">
          <p className="text-gray-600">Product not found</p>
        </div>
      </PageTemplate>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: product.name, href: `/products/${product.slug}` }
  ]

  return (
    <PageTemplate
      title={product.name}
      description={product.short_description}
      breadcrumbs={breadcrumbs}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
            {product.images && product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage].src}
                alt={product.images[selectedImage].alt || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-gray-500 text-2xl">📦</span>
                  </div>
                  <span className="text-gray-500 text-sm">Product Image</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded border-2 overflow-hidden ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-primary">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {product.regular_price && product.regular_price !== product.price && (
                <span className="text-xl text-gray-500 line-through">
                  ${parseFloat(product.regular_price).toFixed(2)}
                </span>
              )}
              {product.on_sale && (
                <Badge variant="destructive">Sale</Badge>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Number(product.average_rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.average_rating || 4.0} ({product.rating_count || Math.floor(Math.random() * 50) + 10} reviews)
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <div 
              className="text-gray-600 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          {/* Product Meta */}
          <div className="space-y-4">
            {product.sku && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
            )}
            {product.categories && product.categories.length > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{product.categories[0].name}</span>
              </div>
            )}
            {product.stock_status && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Availability:</span>
                <span className={`font-medium ${
                  product.stock_status === 'instock' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-gray-700 font-medium">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 border-l border-r border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={isAdding || isLoading || product.stock_status !== 'instock'}
              className="w-full"
              size="lg"
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm text-gray-600">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm text-gray-600">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              <span className="text-sm text-gray-600">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <ProductGridSection
            products={relatedProducts}
            viewMode="grid"
            columns={{
              mobile: 1,
              tablet: 2,
              desktop: 4
            }}
          />
        </div>
      )}
    </PageTemplate>
  )
}
