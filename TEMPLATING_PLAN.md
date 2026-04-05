# Templating System Implementation Plan

> **Last Updated:** 2026-04-05  
> **Version:** 1.0.0  
> **Project:** WooCommerce Headless Store

---

## 🎯 **Templating Strategy Overview**

### **Current State Analysis**
- ✅ Next.js 16.2.2 with App Router
- ✅ Client-side rendering for most pages
- ✅ shadcn/ui component library
- ✅ TailwindCSS v4 styling
- ❌ No systematic templating system
- ❌ Inconsistent page structures
- ❌ No reusable layout templates

### **Templating Goals**
- **Consistency** - Unified page structures
- **Maintainability** - Easy to update and extend
- **Performance** - Optimized rendering
- **Flexibility** - Support different page types
- **Developer Experience** - Clear patterns and conventions

---

## 🏗️ **Template Architecture**

### **Template Hierarchy**
```
src/app/
├── (templates)/           # Template route groups
│   ├── product/           # Product-based templates
│   │   ├── listing/       # Product listing template
│   │   ├── detail/        # Product detail template
│   │   └── category/      # Category template
│   ├── content/           # Content-based templates
│   │   ├── home/          # Homepage template
│   │   ├── about/         # About page template
│   │   └── contact/       # Contact page template
│   ├── user/              # User-focused templates
│   │   ├── account/       # Account dashboard template
│   │   ├── auth/          # Authentication template
│   │   └── profile/       # Profile management template
│   └── commerce/          # Commerce templates
│       ├── checkout/      # Checkout flow template
│       ├── cart/          # Shopping cart template
│       └── order/         # Order management template
├── components/
│   ├── templates/         # Template components
│   │   ├── PageTemplate.tsx
│   │   ├── ContentTemplate.tsx
│   │   ├── CommerceTemplate.tsx
│   │   └── AuthTemplate.tsx
│   ├── sections/          # Page sections
│   │   ├── Hero.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── FeaturedProducts.tsx
│   │   └── Testimonials.tsx
│   └── blocks/            # Content blocks
│       ├── HeaderBlock.tsx
│       ├── ContentBlock.tsx
│       ├── SidebarBlock.tsx
│       └── FooterBlock.tsx
```

---

## 📄 **Template Types**

### **1. Page Templates**
Base templates for different page categories

```typescript
// PageTemplate.tsx - Universal page structure
interface PageTemplateProps {
  children: React.ReactNode
  header?: React.ReactNode
  sidebar?: React.ReactNode
  footer?: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  description?: string
  className?: string
}

// ContentTemplate.tsx - Content-focused pages
interface ContentTemplateProps extends PageTemplateProps {
  hero?: HeroSectionProps
  sections?: ContentSectionProps[]
  sidebar?: SidebarProps
}

// CommerceTemplate.tsx - E-commerce pages
interface CommerceTemplateProps extends PageTemplateProps {
  cart?: React.ReactNode
  checkout?: React.ReactNode
  filters?: React.ReactNode
  pagination?: PaginationProps
}

// AuthTemplate.tsx - Authentication pages
interface AuthTemplateProps extends PageTemplateProps {
  form: React.ReactNode
  alternateAction?: React.ReactNode
  helpText?: string
}
```

### **2. Section Templates**
Reusable page sections

```typescript
// HeroSection.tsx - Page hero sections
interface HeroSectionProps {
  title: string
  subtitle?: string
  description?: string
  image?: string
  cta?: ButtonProps
  background?: 'light' | 'dark' | 'gradient'
  size?: 'small' | 'medium' | 'large'
}

// ProductGridSection.tsx - Product listing sections
interface ProductGridSectionProps {
  products: WooCommerceProduct[]
  title?: string
  subtitle?: string
  filters?: FilterProps
  pagination?: PaginationProps
  viewMode?: 'grid' | 'list'
}

// ContentSection.tsx - Generic content sections
interface ContentSectionProps {
  title?: string
  content: React.ReactNode
  background?: 'light' | 'dark' | 'gray'
  padding?: 'small' | 'medium' | 'large'
}
```

### **3. Block Templates**
Smaller reusable components

```typescript
// HeaderBlock.tsx - Page headers
interface HeaderBlockProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
}

// ContentBlock.tsx - Content blocks
interface ContentBlockProps {
  content: React.ReactNode
  aside?: React.ReactNode
  layout?: 'single' | 'two-column' | 'sidebar'
}

// SidebarBlock.tsx - Sidebar blocks
interface SidebarBlockProps {
  title?: string
  content: React.ReactNode
  position?: 'left' | 'right'
}
```

---

## 🎨 **Template Implementation Plan**

### **Phase 1: Foundation Templates** (2-3 hours)

#### **1.1 Base Page Template**
```typescript
// src/components/templates/PageTemplate.tsx
export function PageTemplate({
  children,
  header,
  sidebar,
  footer,
  breadcrumbs,
  title,
  description,
  className
}: PageTemplateProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      {header || <Header />}
      
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb items={breadcrumbs} />
          </div>
        </nav>
      )}
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            {sidebar && (
              <aside className="w-64 flex-shrink-0">
                {sidebar}
              </aside>
            )}
            
            {/* Content */}
            <div className={cn("flex-1", sidebar && "max-w-4xl")}>
              {title && (
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {title}
                  </h1>
                  {description && (
                    <p className="mt-2 text-gray-600">
                      {description}
                    </p>
                  )}
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      {footer || <Footer />}
    </div>
  )
}
```

#### **1.2 Content Template**
```typescript
// src/components/templates/ContentTemplate.tsx
export function ContentTemplate({
  children,
  hero,
  sections,
  sidebar,
  ...pageProps
}: ContentTemplateProps) {
  return (
    <PageTemplate sidebar={sidebar} {...pageProps}>
      {/* Hero Section */}
      {hero && <HeroSection {...hero} />}
      
      {/* Content Sections */}
      <div className="space-y-16">
        {sections?.map((section, index) => (
          <ContentSection key={index} {...section} />
        ))}
      </div>
      
      {/* Main Content */}
      {children}
    </PageTemplate>
  )
}
```

#### **1.3 Commerce Template**
```typescript
// src/components/templates/CommerceTemplate.tsx
export function CommerceTemplate({
  children,
  filters,
  pagination,
  ...pageProps
}: CommerceTemplateProps) {
  return (
    <PageTemplate {...pageProps}>
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {filters && (
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              {filters}
            </div>
          </aside>
        )}
        
        {/* Main Content */}
        <div className="flex-1">
          {children}
          
          {/* Pagination */}
          {pagination && (
            <div className="mt-12">
              <Pagination {...pagination} />
            </div>
          )}
        </div>
      </div>
    </PageTemplate>
  )
}
```

### **Phase 2: Section Templates** (3-4 hours)

#### **2.1 Hero Section**
```typescript
// src/components/sections/HeroSection.tsx
export function HeroSection({
  title,
  subtitle,
  description,
  image,
  cta,
  background = 'light',
  size = 'medium'
}: HeroSectionProps) {
  const bgClasses = {
    light: 'bg-white',
    dark: 'bg-gray-900',
    gradient: 'bg-gradient-to-r from-primary to-primary-600'
  }
  
  const sizeClasses = {
    small: 'py-12',
    medium: 'py-20',
    large: 'py-32'
  }
  
  return (
    <section className={cn(bgClasses[background], sizeClasses[size])}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-12">
          <div className="flex-1">
            <h1 className={cn(
              "text-4xl md:text-5xl font-bold",
              background === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {title}
            </h1>
            {subtitle && (
              <h2 className={cn(
                "text-xl md:text-2xl mt-4",
                background === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                {subtitle}
              </h2>
            )}
            {description && (
              <p className={cn(
                "mt-6 text-lg",
                background === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {description}
              </p>
            )}
            {cta && (
              <div className="mt-8">
                <Button {...cta} />
              </div>
            )}
          </div>
          {image && (
            <div className="flex-1">
              <img
                src={image}
                alt={title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
```

#### **2.2 Product Grid Section**
```typescript
// src/components/sections/ProductGridSection.tsx
export function ProductGridSection({
  products,
  title,
  subtitle,
  filters,
  pagination,
  viewMode = 'grid'
}: ProductGridSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
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
        
        {/* Filters */}
        {filters && (
          <div className="mb-8">
            {filters}
          </div>
        )}
        
        {/* Product Grid */}
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-6'
        )}>
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>
        
        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </section>
  )
}
```

### **Phase 3: Page Implementation** (4-5 hours)

#### **3.1 Homepage Template**
```typescript
// src/app/(templates)/content/home/page.tsx
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
          href: "/products"
        },
        background: 'gradient',
        size: 'large'
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
          )
        },
        {
          title: "New Arrivals",
          subtitle: "Fresh products this week",
          content: (
            <ProductGridSection
              products={newProducts}
              viewMode="grid"
            />
          )
        }
      ]}
    />
  )
}
```

#### **3.2 Product Listing Template**
```typescript
// src/app/(templates)/product/listing/page.tsx
export default function ProductsPage() {
  return (
    <CommerceTemplate
      title="All Products"
      description="Browse our complete product catalog"
      filters={
        <ProductFilters />
      }
      pagination={{
        currentPage: 1,
        totalPages: 10,
        onPageChange: (page) => console.log(page)
      }}
    >
      <ProductGridSection
        products={products}
        viewMode="grid"
      />
    </CommerceTemplate>
  )
}
```

#### **3.3 Product Detail Template**
```typescript
// src/app/(templates)/product/detail/[slug]/page.tsx
export default function ProductDetailPage({ params }: { params: { slug: string } }) {
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
      <RelatedProducts productId={product.id} />
    </PageTemplate>
  )
}
```

---

## 🔧 **Advanced Features**

### **1. Template Composition**
```typescript
// Template composition example
export function CategoryPage({ category }: { category: WooCommerceCategory }) {
  return (
    <CommerceTemplate
      title={category.name}
      description={category.description}
      sidebar={<CategorySidebar />}
    >
      <ProductGridSection
        products={categoryProducts}
        title={category.name}
        subtitle={category.description}
      />
    </CommerceTemplate>
  )
}
```

### **2. Dynamic Template Selection**
```typescript
// Template selector based on page type
export function TemplateSelector({ 
  pageType, 
  children, 
  ...props 
}: TemplateSelectorProps) {
  switch (pageType) {
    case 'content':
      return <ContentTemplate {...props}>{children}</ContentTemplate>
    case 'commerce':
      return <CommerceTemplate {...props}>{children}</CommerceTemplate>
    case 'auth':
      return <AuthTemplate {...props}>{children}</AuthTemplate>
    default:
      return <PageTemplate {...props}>{children}</PageTemplate>
  }
}
```

### **3. Template Inheritance**
```typescript
// Base template with overrides
export function BaseCommerceTemplate({ children, ...props }: CommerceTemplateProps) {
  return (
    <CommerceTemplate
      filters={<DefaultFilters />}
      pagination={<DefaultPagination />}
      {...props}
    >
      {children}
    </CommerceTemplate>
  )
}
```

---

## 📊 **Template Benefits**

### **Developer Experience**
- **Consistency** - Unified page structures
- **Productivity** - Reusable components
- **Maintainability** - Centralized updates
- **Type Safety** - Full TypeScript support

### **Performance**
- **Code Splitting** - Template-based chunks
- **Tree Shaking** - Unused template removal
- **Caching** - Template-level caching
- **SEO** - Optimized meta tags

### **Flexibility**
- **Composition** - Mix and match templates
- **Extension** - Easy to add new templates
- **Customization** - Template-specific overrides
- **Testing** - Template-level unit tests

---

## 🚀 **Implementation Timeline**

### **Week 1: Foundation**
- **Day 1-2:** Base templates (PageTemplate, ContentTemplate, CommerceTemplate)
- **Day 3-4:** Section templates (Hero, ProductGrid, Content)
- **Day 5:** Testing and refinement

### **Week 2: Integration**
- **Day 1-2:** Page implementations (Home, Products, Categories)
- **Day 3-4:** Commerce pages (Checkout, Cart, Account)
- **Day 5:** Content pages (About, Contact, FAQ)

### **Week 3: Polish**
- **Day 1-2:** Advanced features (Dynamic selection, inheritance)
- **Day 3-4:** Performance optimization
- **Day 5:** Documentation and training

---

## 📋 **Migration Strategy**

### **Phase 1: Parallel Development**
- Keep existing pages functional
- Develop templates alongside
- Test templates in isolation

### **Phase 2: Gradual Migration**
- Migrate simple pages first
- Test thoroughly at each step
- Keep backup of old code

### **Phase 3: Full Rollout**
- Complete migration
- Remove old code
- Update documentation

---

## 🎯 **Success Metrics**

### **Code Quality**
- [ ] Template reusability > 80%
- [ ] Code duplication < 20%
- [ ] Component consistency > 90%
- [ ] Type coverage > 95%

### **Performance**
- [ ] Page load time < 2s
- [ ] First Contentful Paint < 1.5s
- [ ] Bundle size reduction > 30%
- [ ] Template rendering < 100ms

### **Developer Experience**
- [ ] New page setup < 10 minutes
- [ ] Template documentation complete
- [ ] Component library usage > 70%
- [ ] Developer satisfaction > 8/10

---

**This templating system provides a robust, scalable foundation for your headless store with clear patterns, excellent developer experience, and room for growth.**
