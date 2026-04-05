# Template Usage Examples

> **Practical examples of how to use the new templating system**

---

## 🏠 **Homepage Template Example**

### **Using ContentTemplate**

```typescript
// src/app/(templates)/content/home/page.tsx
import { ContentTemplate } from '@/components/templates/ContentTemplate'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProductGridSection } from '@/components/sections/ProductGridSection'
import { useProducts } from '@/hooks/useWooCommerce'

export default function HomePage() {
  const { products: featuredProducts } = useProducts({ 
    featured: true, 
    per_page: 8 
  })
  const { products: newProducts } = useProducts({ 
    per_page: 8,
    sort: 'date_desc'
  })

  return (
    <ContentTemplate
      title="Welcome to Our Store"
      description="Discover amazing products at great prices"
      hero={{
        title: "Shop the Latest Collections",
        subtitle: "Quality Products, Great Prices",
        description: "Discover our curated selection of premium products designed to enhance your lifestyle.",
        cta: {
          children: "Shop Now",
          href: "/products",
          variant: "default",
          size: "lg"
        },
        background: "gradient",
        size: "large",
        badge: {
          text: "New Arrivals",
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
              viewMode="grid"
            />
          ),
          background: "light",
          padding: "large",
          layout: "center"
        },
        {
          title: "New Arrivals",
          subtitle: "Fresh products this week",
          content: (
            <ProductGridSection
              products={newProducts}
              viewMode="grid"
            />
          ),
          background: "gray",
          padding: "medium",
          layout: "center"
        }
      ]}
    />
  )
}
```

---

## 🛍️ **Product Listing Template Example**

### **Using CommerceTemplate**

```typescript
// src/app/(templates)/commerce/products/page.tsx
import { CommerceTemplate } from '@/components/templates/CommerceTemplate'
import { ProductGridSection } from '@/components/sections/ProductGridSection'
import { ProductFilters } from '@/components/ProductFilters'
import { SortByDropdown } from '@/components/SortByDropdown'
import { ViewModeToggle } from '@/components/ViewModeToggle'
import { useProducts } from '@/hooks/useWooCommerce'
import { useState } from 'react'

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState('date_desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { products, loading, totalPages } = useProducts({
    page: currentPage,
    per_page: 12,
    sort: sortBy,
    ...filters
  })

  return (
    <CommerceTemplate
      title="All Products"
      description="Browse our complete product catalog"
      filters={<ProductFilters filters={filters} onChange={setFilters} />}
      pagination={{
        currentPage,
        totalPages,
        onPageChange: setCurrentPage
      }}
      sortBy={
        <SortByDropdown value={sortBy} onChange={setSortBy} />
      }
      viewMode={
        <ViewModeToggle value={viewMode} onChange={setViewMode} />
      }
      actionBar={
        <div className="text-sm text-gray-600">
          {products.length} products found
        </div>
      }
    >
      <ProductGridSection
        products={products}
        viewMode={viewMode}
        title={null} // No title since we have page title
        subtitle={null}
      />
    </CommerceTemplate>
  )
}
```

---

## 📄 **Product Detail Template Example**

### **Using PageTemplate**

```typescript
// src/app/(templates)/commerce/products/[slug]/page.tsx
import { PageTemplate } from '@/components/templates/PageTemplate'
import { ProductDetail } from '@/components/ProductDetail'
import { RelatedProducts } from '@/components/RelatedProducts'
import { useProductBySlug } from '@/hooks/useWooCommerce'

export default function ProductDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const { product, loading, error } = useProductBySlug(params.slug)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!product) return <div>Product not found</div>
  
  return (
    <PageTemplate
      title={product.name}
      description={product.short_description}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: product.name, href: `/products/${product.slug}` }
      ]}
    >
      <ProductDetail product={product} />
      
      <div className="mt-16">
        <RelatedProducts productId={product.id} />
      </div>
    </PageTemplate>
  )
}
```

---

## 👤 **Account Page Template Example**

### **Using PageTemplate with Sidebar**

```typescript
// src/app/(templates)/user/account/page.tsx
import { PageTemplate } from '@/components/templates/PageTemplate'
import { AccountNavigation } from '@/components/AccountNavigation'
import { AccountOverview } from '@/components/AccountOverview'
import { useCustomerStore } from '@/store/customerStore'

export default function AccountPage() {
  const { customer, isAuthenticated } = useCustomerStore()
  
  if (!isAuthenticated) {
    return (
      <PageTemplate
        title="Not Logged In"
        description="Please log in to view your account information"
      >
        <div className="text-center py-12">
          <p>You need to be logged in to view this page.</p>
        </div>
      </PageTemplate>
    )
  }

  return (
    <PageTemplate
      title="My Account"
      description="Manage your account and orders"
      sidebar={<AccountNavigation />}
    >
      <AccountOverview customer={customer} />
    </PageTemplate>
  )
}
```

---

## 🛒 **Checkout Page Template Example**

### **Using CommerceTemplate**

```typescript
// src/app/(templates)/commerce/checkout/page.tsx
import { CommerceTemplate } from '@/components/templates/CommerceTemplate'
import { CheckoutForm } from '@/components/CheckoutForm'
import { OrderSummary } from '@/components/OrderSummary'

export default function CheckoutPage() {
  return (
    <CommerceTemplate
      title="Checkout"
      description="Complete your purchase"
      sidebar={
        <div className="space-y-6">
          <OrderSummary />
          <SecurityBadges />
        </div>
      }
      showFooter={false} // Hide footer for checkout
    >
      <CheckoutForm />
    </CommerceTemplate>
  )
}
```

---

## 📝 **About Page Template Example**

### **Using ContentTemplate**

```typescript
// src/app/(templates)/content/about/page.tsx
import { ContentTemplate } from '@/components/templates/ContentTemplate'
import { TeamSection } from '@/components/TeamSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'

export default function AboutPage() {
  return (
    <ContentTemplate
      title="About Us"
      description="Learn more about our company and values"
      hero={{
        title: "Our Story",
        subtitle: "Building great products since 2020",
        description: "We're passionate about creating amazing shopping experiences that delight our customers.",
        background: "light",
        size: "medium",
        alignment: "center"
      }}
      sections={[
        {
          title: "Our Mission",
          subtitle: "What drives us every day",
          content: (
            <div className="max-w-3xl mx-auto prose prose-lg">
              <p>
                Our mission is to provide exceptional products and service 
                that make our customers' lives better.
              </p>
              <p>
                We believe in quality, innovation, and customer satisfaction 
                above all else.
              </p>
            </div>
          ),
          background: "light",
          layout: "center"
        },
        {
          title: "Meet Our Team",
          subtitle: "The people behind our success",
          content: <TeamSection />,
          background: "gray",
          layout: "center"
        },
        {
          title: "What Our Customers Say",
          subtitle: "Real experiences from real customers",
          content: <TestimonialsSection />,
          background: "light",
          layout: "center"
        }
      ]}
    />
  )
}
```

---

## 🔧 **Custom Template Example**

### **Creating a Custom Template**

```typescript
// src/components/templates/CustomLandingTemplate.tsx
import { PageTemplate } from './PageTemplate'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { CTASection } from '@/components/sections/CTASection'

interface CustomLandingTemplateProps {
  hero: HeroSectionProps
  features: FeaturesSectionProps
  testimonials: TestimonialsSectionProps
  cta: CTASectionProps
  showHeader?: boolean
  showFooter?: boolean
}

export function CustomLandingTemplate({
  hero,
  features,
  testimonials,
  cta,
  showHeader = true,
  showFooter = true
}: CustomLandingTemplateProps) {
  return (
    <PageTemplate showHeader={showHeader} showFooter={showFooter}>
      {/* Hero */}
      <HeroSection {...hero} />
      
      {/* Features */}
      <FeaturesSection {...features} />
      
      {/* Testimonials */}
      <TestimonialsSection {...testimonials} />
      
      {/* CTA */}
      <CTASection {...cta} />
    </PageTemplate>
  )
}
```

---

## 📱 **Mobile-First Template Example**

### **Responsive Template Usage**

```typescript
// src/app/(templates)/commerce/products/page.tsx
export default function ProductsPage() {
  return (
    <CommerceTemplate
      title="Products"
      description="Browse our catalog"
      // Mobile: Hide filters, show as overlay
      filters={
        <div className="lg:block hidden">
          <ProductFilters />
        </div>
      }
      // Mobile: Show compact pagination
      pagination={{
        currentPage,
        totalPages,
        onPageChange: setCurrentPage,
        showPrevNext: false, // Hide on mobile
        showFirstLast: false  // Hide on mobile
      }}
    >
      {/* Mobile: Show filter toggle button */}
      <div className="lg:hidden mb-4">
        <Button onClick={() => setShowFilters(true)}>
          Filters
        </Button>
      </div>
      
      <ProductGridSection products={products} />
    </CommerceTemplate>
  )
}
```

---

## 🎯 **Template Composition Example**

### **Combining Multiple Templates**

```typescript
// src/app/(templates)/content/landing/page.tsx
import { ContentTemplate } from '@/components/templates/ContentTemplate'
import { CommerceTemplate } from '@/components/templates/CommerceTemplate'

export default function LandingPage() {
  return (
    <ContentTemplate
      hero={{
        title: "Welcome to Our Store",
        subtitle: "Amazing products, great prices",
        background: "gradient",
        size: "large"
      }}
      sections={[
        {
          title: "Featured Products",
          content: (
            <CommerceTemplate
              filters={<ProductFilters />}
              pagination={pagination}
            >
              <ProductGridSection products={featuredProducts} />
            </CommerceTemplate>
          ),
          background: "gray"
        }
      ]}
    />
  )
}
```

---

## 🔍 **Template Best Practices**

### **1. Choose the Right Template**
- **ContentTemplate** - For marketing/content pages
- **CommerceTemplate** - For e-commerce pages
- **PageTemplate** - For simple/custom pages

### **2. Use Sections Wisely**
- **HeroSection** - Page introductions
- **ContentSection** - Generic content blocks
- **ProductGridSection** - Product listings

### **3. Responsive Design**
- Consider mobile layout
- Use responsive props
- Test on all devices

### **4. Performance**
- Lazy load heavy sections
- Optimize images
- Use proper caching

### **5. SEO**
- Use semantic HTML
- Add proper meta tags
- Structure content logically

---

**These examples show how to use the templating system effectively. Mix and match templates and sections to create any page layout you need!**
