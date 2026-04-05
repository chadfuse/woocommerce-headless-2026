'use client'

import { useState, use } from 'react'
import { useParams } from 'next/navigation'
import { useProductBySlug } from '@/hooks/useWooCommerce'
import { useLocalCartStore } from '@/store/localCartStore'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Star, Minus, Plus } from 'lucide-react'
import Link from 'next/link'

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug
  const { product, loading, error } = useProductBySlug(slug)
  const { addToCart } = useLocalCartStore()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async () => {
    if (!product) return
    
    setIsAddingToCart(true)
    
    // Add a success toast
    toast.success(`${product.name} added to cart!`, {
      description: `${quantity} item(s) added to your shopping cart`,
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
      await addToCart(product, quantity)
      // Keep the "Added!" state for a moment to show the animation
      setTimeout(() => {
        setIsAddingToCart(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast.error('Failed to add item to cart')
      setIsAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This product does not exist.'}</p>
          <Link href="/">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    )
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
          className={`h-5 w-5 ${
            i <= ratingValue ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      )
    }
    return stars
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/products" className="hover:text-blue-600">Products</Link></li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage].src}
                  alt={product.images[selectedImage].alt || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded border-2 transition-all ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.featured && (
                  <Badge className="bg-blue-500">Featured</Badge>
                )}
                <Badge 
                  variant={product.stock_status === 'instock' ? 'default' : 'secondary'}
                  className={product.stock_status === 'instock' ? 'bg-green-500' : ''}
                >
                  {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {renderStars(product.average_rating)}
                </div>
                <span className="text-sm text-gray-600">
                  {product.average_rating} ({product.rating_count} reviews)
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
                {product.regular_price && product.regular_price !== product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.regular_price)}
                  </span>
                )}
                {product.on_sale && (
                  <Badge className="bg-red-500 text-white">
                    Save {Math.round((1 - parseFloat(product.price) / parseFloat(product.regular_price)) * 100)}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Short Description */}
            {product.short_description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <div 
                  className="text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              </div>
            )}

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((category) => (
                    <Link key={category.id} href={`/categories/${category.slug}`}>
                      <Badge variant="secondary" className="hover:bg-blue-100 cursor-pointer">
                        {category.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            {product.purchasable && product.stock_status === 'instock' && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <label className="font-semibold">Quantity:</label>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center border-x focus:outline-none"
                        min="1"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`w-full transition-all duration-200 ${
                      isAddingToCart 
                        ? 'bg-green-600 hover:bg-green-700 scale-95' 
                        : 'hover:scale-105 hover:shadow-lg'
                    }`}
                    size="lg"
                  >
                    <ShoppingCart className={`h-5 w-5 mr-2 transition-transform ${
                      isAddingToCart ? 'animate-bounce' : ''
                    }`} />
                    {isAddingToCart ? 'Added!' : 'Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            {product.sku && (
              <div className="text-sm text-gray-600">
                <span className="font-semibold">SKU:</span> {product.sku}
              </div>
            )}

            {/* Full Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-4">Full Description</h3>
                <div 
                  className="text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
