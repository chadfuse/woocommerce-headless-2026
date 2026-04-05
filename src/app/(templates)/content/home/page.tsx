'use client'

import { ContentTemplate } from '@/components/templates/ContentTemplate'
import { ProductGridSection } from '@/components/sections/ProductGridSection'
import { useProducts } from '@/hooks/useWooCommerce'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag, Star, Truck, Shield, RefreshCw } from 'lucide-react'

export default function HomePage() {
  const { products: featuredProducts, loading: featuredLoading } = useProducts({ 
    per_page: 8 
  })
  const { products: newProducts, loading: newLoading } = useProducts({ 
    per_page: 8
  })

  const FeaturesSection = () => (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600">Free shipping on all orders over $50</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-gray-600">100% secure payment processing</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-gray-600">30-day return policy</p>
          </div>
        </div>
      </div>
    </section>
  )

  const StatsSection = () => (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-gray-600">Products</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <ContentTemplate
      title="Welcome to Our Store"
      description="Discover amazing products at great prices"
      hero={{
        title: "Premium Products for Modern Living",
        subtitle: "Quality meets affordability",
        description: "Discover our curated selection of premium products designed to enhance your lifestyle. From everyday essentials to unique finds, we have something for everyone.",
        cta: {
          children: (
            <>
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ),
          href: "/products",
          variant: "default",
          size: "lg"
        },
        background: "gradient",
        size: "large",
        badge: {
          text: "New Collection 2026",
          variant: "secondary"
        },
        alignment: "left"
      }}
      sections={[
        {
          title: "Featured Products",
          subtitle: "Handpicked items just for you",
          content: (
            <ProductGridSection
              products={featuredProducts}
              loading={featuredLoading}
              viewMode="grid"
              columns={{
                mobile: 1,
                tablet: 2,
                desktop: 4
              }}
            />
          ),
          background: "light",
          padding: "large",
          layout: "center"
        },
        {
          content: <FeaturesSection />,
          background: "white",
          padding: "medium",
          layout: "center"
        },
        {
          title: "New Arrivals",
          subtitle: "Fresh products this week",
          content: (
            <ProductGridSection
              products={newProducts}
              loading={newLoading}
              viewMode="grid"
              columns={{
                mobile: 1,
                tablet: 2,
                desktop: 3
              }}
            />
          ),
          background: "gray",
          padding: "medium",
          layout: "center"
        },
        {
          content: <StatsSection />,
          background: "white",
          padding: "medium",
          layout: "center"
        }
      ]}
    />
  )
}
