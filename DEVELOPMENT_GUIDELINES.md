# Development Guidelines - WooCommerce Headless Store

> **Last Updated:** 2026-04-05  
> **Version:** 1.1.0  
> **Project:** WooCommerce Headless Store

---

## 🏗️ **Project Architecture**

### **Tech Stack**
- **Framework:** Next.js 16.2.2 (Turbopack)
- **Language:** TypeScript
- **Styling:** TailwindCSS + shadcn/ui components
- **State Management:** Zustand
- **Data Fetching:** Custom hooks + WooCommerce REST API
- **Forms:** React Hook Form + Zod validation
- **Notifications:** Sonner
- **Icons:** Lucide React

### **Authentication Flow**
- **Auto Account Creation** - During checkout with random password
- **Smart Login Detection** - Checks if user is already logged in before redirecting
- **Password Reset** - WordPress handles email delivery
- **Login Verification** - Checks customer existence
- **Session Management** - Zustand + localStorage persistence
- **Seamless Checkout** - Logged-in users bypass login requirements

### **Directory Structure**
```
src/
├── app/                    # Next.js App Router pages
│   ├── (templates)/        # Template-based pages
│   ├── account/           # Customer account pages
│   ├── checkout/          # Checkout flow
│   ├── forgot-password/    # Password reset page
│   ├── login/             # Customer login page
│   ├── products/          # Product listings & details
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── templates/        # Page templates
│   ├── sections/         # Reusable sections
│   ├── ProductCard.tsx    # Product grid item
│   ├── CartDrawer.tsx     # Shopping cart sidebar
│   ├── CartIcon.tsx       # Header cart button
│   ├── AccountIcon.tsx    # Header account button
│   └── Header.tsx         # Reusable page header
├── hooks/
│   ├── useWooCommerce.ts  # API data fetching hooks
│   └── useCustomerOrders.ts # Customer order history
├── lib/
│   ├── woocommerce.ts     # WooCommerce API client
│   ├── wordpressAuth.ts    # WordPress authentication
│   ├── errorLogger.ts     # Error logging utility
│   └── utils.ts           # Helper functions
├── store/
│   ├── cartStore.ts       # Shopping cart state
│   ├── customerStore.ts    # Customer data state
│   └── checkoutStore.ts   # Checkout flow state
└── types/
    └── woocommerce.ts     # TypeScript type definitions
```

---

## 📋 **Component Rules**

### **✅ Do's**
- **Use shadcn/ui components** as base components
- **Follow TypeScript strict mode** - all types must be defined
- **Use semantic HTML5** tags for accessibility
- **Implement proper error boundaries** for error handling
- **Use TailwindCSS classes** for styling (no inline styles)
- **Follow React hooks rules** - only call hooks at top level
- **Use proper key props** in lists for performance
- **Implement loading states** for better UX
- **Use proper form validation** with React Hook Form + Zod
- **Follow the template system** for consistent page structure

### **❌ Don'ts**
- **Don't use Next.js Image component** - use regular `<img>` tags
- **Don't use inline styles** - use TailwindCSS classes only
- **Don't ignore TypeScript errors** - fix all type issues
- **Don't use any type** - define proper interfaces
- **Don't commit sensitive data** - use environment variables
- **Don't forget error handling** - wrap async operations
- **Don't use console.log in production** - use proper logging
- **Don't ignore accessibility** - test with screen readers
- **Don't break the template structure** - follow established patterns

---

## 🎨 **Design System Rules**

### **Color Usage**
```css
/* Primary Colors - Use these variables */
--primary: oklch(0.55 0.2 240);      /* Main brand color */
--secondary: oklch(0.97 0.01 240);   /* Secondary color */
--muted: oklch(0.94 0.02 240);       /* Muted backgrounds */

/* Semantic Colors */
--destructive: oklch(0.6 0.2 20);    /* Error states */
--success: oklch(0.65 0.15 145);      /* Success states */
--warning: oklch(0.75 0.15 60);      /* Warning states */
```

### **Typography**
- **Font Family:** Inter (system-ui fallback)
- **Headings:** Use `text-2xl` to `text-6xl` classes
- **Body Text:** Use `text-sm` to `text-lg` classes
- **Font Weights:** `font-normal`, `font-medium`, `font-semibold`, `font-bold`

### **Spacing**
- **Use Tailwind spacing scale:** `p-4`, `m-8`, `gap-6`, etc.
- **Consistent padding:** `p-4` for cards, `p-6` for sections
- **Responsive spacing:** Use `sm:p-4 md:p-6 lg:p-8` pattern

---

## 🔧 **State Management Patterns**

### **Zustand Store Structure**
```typescript
// Example: Cart Store
interface CartStore {
  items: CartItem[]
  total: number
  subtotal: number
  isLoading: boolean
  
  // Actions
  addItem: (product: WooCommerceProduct) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}
```

### **Local State Management**
- **Use useState** for component-local state
- **Use useEffect** for side effects and API calls
- **Use useCallback** for memoized functions
- **Use useMemo** for expensive calculations

---

## 🌐 **API Integration Rules**

### **WooCommerce API**
```typescript
// Correct API call pattern
const { products, loading, error } = useProducts({
  per_page: 12,
  page: currentPage,
  category: selectedCategory
})

// Error handling
if (error) {
  toast.error('Failed to load products')
  return null
}
```

### **Error Handling**
- **Always handle loading states**
- **Show user-friendly error messages**
- **Log errors for debugging**
- **Implement retry logic for critical operations**
- **Use toast notifications** for user feedback

---

## 📝 **Form Patterns**

### **React Hook Form + Zod**
```typescript
// Schema definition
const checkoutSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  email: z.string().email('Invalid email address'),
  // ... other fields
})

// Form usage
const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
  resolver: zodResolver(checkoutSchema)
})
```

### **Validation Rules**
- **Client-side validation** for immediate feedback
- **Server-side validation** for security
- **Clear error messages** for users
- **Accessible error indicators** with proper ARIA labels

---

## 🎯 **Performance Guidelines**

### **Code Splitting**
- **Use dynamic imports** for large components
- **Lazy load images** with proper loading states
- **Optimize bundle size** with tree shaking
- **Use Next.js built-in optimizations**

### **Image Optimization**
```typescript
// Correct image usage
<img
  src={product.image.src}
  alt={product.image.alt || product.name}
  className="w-full h-full object-cover"
  loading="lazy"
  onError={(e) => {
    // Handle image errors
  }}
/>
```

---

## 🔒 **Security Best Practices**

### **Environment Variables**
```env
# Public variables (accessible in browser)
NEXT_PUBLIC_WORDPRESS_URL=https://your-site.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Private variables (server-only)
WOOCOMMERCE_CONSUMER_SECRET=cs_...
STRIPE_SECRET_KEY=sk_...
```

### **Data Validation**
- **Validate all user inputs** on both client and server
- **Sanitize data** before API calls
- **Use HTTPS** for all API requests
- **Never expose secrets** in client-side code

---

## 🧪 **Testing Guidelines**

### **Pre-Commit Checklist**
- [ ] **TypeScript compilation** passes (`npm run build`)
- [ ] **No console errors** in browser
- [ ] **All forms validate** correctly
- [ ] **Loading states** display properly
- [ ] **Error handling** works for all scenarios
- [ ] **Responsive design** works on mobile/tablet/desktop
- [ ] **Accessibility** features work (keyboard navigation, screen readers)
- [ ] **Performance** is acceptable (load times, animations)

### **Common Issues to Check**
- **Select components** handle null values properly
- **API calls** have proper error handling
- **Forms** don't submit with invalid data
- **Images** have proper alt text and error handling
- **Navigation** works correctly on all pages

---

## 🚀 **Deployment Rules**

### **Environment Setup**
- **Never commit .env files** to Git
- **Use different environments** for development/staging/production
- **Test all environment variables** before deployment
- **Use proper build commands** for each platform

### **Build Verification**
```bash
# Always run before deployment
npm run build
npm run start  # Test production build locally
```

---

## 🔄 **Common Patterns**

### **Product Card Component**
```typescript
// Standard ProductCard props
interface ProductCardProps {
  product: WooCommerceProduct
  viewMode?: 'grid' | 'list'
  onAddToCart?: (product: WooCommerceProduct) => void
}

// Standard usage
<ProductCard
  product={product}
  viewMode="grid"
  onAddToCart={handleAddToCart}
/>
```

### **Template Usage**
```typescript
// Standard page template
export default function ProductsPage() {
  return (
    <CommerceTemplate
      title="Products"
      filters={<Filters />}
      sortBy={<SortBy />}
    >
      <ProductGridSection products={products} />
    </CommerceTemplate>
  )
}
```

---

## 🆘 **Troubleshooting**

### **Common TypeScript Errors**
- **"string | null" not assignable**: Add null fallback (`value || ''`)
- **"Property does not exist":** Check type definitions
- **"Argument of type never":** Check generic type constraints

### **Common Runtime Errors**
- **API 401 errors**: Check WooCommerce API keys
- **CORS issues**: Verify WordPress CORS settings
- **Build failures**: Check environment variables and dependencies

### **Debugging Tips**
- **Use browser dev tools** for network inspection
- **Check console** for JavaScript errors
- **Verify API responses** in Network tab
- **Test with different user roles** and permissions

---

## 📈 **Code Quality**

### **ESLint Rules**
- **No unused variables**
- **No console.log in production**
- **Proper TypeScript types**
- **Consistent code formatting**

### **Best Practices**
- **Write readable, self-documenting code**
- **Use meaningful variable names**
- **Keep components small and focused**
- **Follow React best practices**
- **Implement proper error boundaries**

---

**Follow these guidelines to ensure consistent, high-quality code across the project!**
│   └── useProductsQuery.ts # React Query hooks (NEW)
├── lib/
│   ├── checkoutSchema.ts  # Form validation schemas
│   ├── utils.ts           # Utility functions
│   ├── woocommerce.ts     # API client
│   └── wordpressAuth.ts   # WordPress authentication utilities (NEW)
├── store/
│   ├── localCartStore.ts  # Shopping cart state
│   ├── checkoutStore.ts   # Checkout process state
│   └── customerStore.ts   # Customer authentication
└── types/
    └── woocommerce.ts     # TypeScript type definitions
```

---

## 🔧 **Core Development Rules**

### **1. Component Development**
- ✅ **ALWAYS** use `'use client'` for interactive components
- ✅ **NEVER** use Next.js `<Image>` component for external images
- ✅ **ALWAYS** use regular `<img>` tags for WordPress images
- ✅ **ALWAYS** remove unused imports to prevent module errors
- ✅ **ALWAYS** implement error boundaries and fallbacks
- ✅ **ALWAYS** add loading states for async operations

### **2. Import Management**
```typescript
// ✅ CORRECT - Clean imports
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus } from 'lucide-react'

// ❌ WRONG - Unused imports cause module errors
import { Button, Input } from '@/components/ui/button' // Input unused
import { ShoppingCart, Package } from 'lucide-react' // Package unused
```

### **3. Image Handling**
```typescript
// ✅ CORRECT - Use regular img tags
<img
  src={product.images[0].src}
  alt={product.images[0].alt || product.name}
  className="w-full h-full object-cover"
  onError={(e) => {
    // Handle fallback
  }}
/>

// ❌ WRONG - Causes hostname configuration errors
<Image
  src={product.images[0].src}
  alt={product.images[0].alt}
  fill
  sizes="..."
/>
```

### **4. State Management Pattern**
```typescript
// ✅ CORRECT - Zustand store pattern
interface CartStore {
  items: CartItem[]
  actions: {
    addItem: (product: Product, quantity: number) => Promise<void>
    removeItem: (key: string) => void
    clearCart: () => void
  }
}

// ✅ CORRECT - Selective subscriptions
const items = useCartStore(state => state.items)
const addItem = useCartStore(state => state.actions.addItem)
```

---

## 📊 **Data Flow Patterns**

### **1. Product Catalog Flow**
1. `useProducts()` hook → WooCommerce API
2. Component state → UI display
3. User actions → Zustand store updates
4. Error handling → User feedback

### **2. Checkout Flow**
1. Form validation → Zod schema
2. Customer creation → WooCommerce API
3. Order creation → Line items included
4. Cart clearing → Local state update
5. Redirect → Order confirmation

### **3. Auto Account Creation Algorithm**
```typescript
// Implementation pattern
const createOrUpdateCustomer = async (data: CheckoutFormData) => {
  try {
    // 1. Try to create customer
    const customer = await wooCommerce.createCustomer(customerData)
    // 2. Store in customer store
    useCustomerStore.getState().setCustomer(customer)
    // 3. Return customer ID for order
    return customer
  } catch (error) {
    if (error.includes('exists')) {
      // 4. Fetch existing customer
      const existing = await wooCommerce.getCustomerByEmail(data.billing_email)
      useCustomerStore.getState().setCustomer(existing)
      return existing
    }
    throw error
  }
}
```

### **4. WordPress Email Integration**
```typescript
// Password reset using WordPress API
const sendPasswordReset = async (email: string) => {
  const response = await fetch(
    `${WORDPRESS_URL}/wp-json/wc/v3/customers/lost-password`,
    {
      method: 'POST',
      headers: { 'Authorization': `Basic ${btoa(KEY:SECRET)}` },
      body: JSON.stringify({ email })
    }
  )
  return response.json()
}

// WordPress handles email delivery automatically
// - Password reset links
// - Order confirmations  
// - Customer notifications
// - Customizable templates in WordPress admin
```

---

## 🚨 **Critical Rules & Solutions**

### **1. Module Import Errors**
**Problem:** Stale browser cache serving old chunks  
**Solution:**
```bash
# Clear cache and restart
pkill -f "next dev"
rm -rf .next
npm run dev
# Then hard refresh browser (Cmd+Shift+R)
```

### **2. Next.js Configuration**
**Problem:** Cache headers preventing module updates  
**Solution:** Remove immutable cache headers for `/_next/static/`

```javascript
// ❌ WRONG - Prevents module updates
{
  source: '/_next/static/(.*)',
  headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
}

// ✅ CORRECT - Allow module updates
// Remove this header entirely for development
```

### **3. Form Validation**
**Problem:** Zod enum validation conflicts  
**Solution:** Use `.refine()` instead of `errorMap`

```typescript
// ✅ CORRECT
payment_method: z.enum(['cod', 'stripe']).refine((val) => val === 'cod' || val === 'stripe', {
  message: 'Payment method is required',
})

// ❌ WRONG - Causes lint errors
payment_method: z.enum(['cod', 'stripe'], {
  errorMap: () => ({ message: 'Payment method is required' })
})
```

---

## 🔍 **Development Workflow**

### **1. Feature Development Process**
1. **Types First:** Define/update TypeScript interfaces
2. **API Integration:** Implement WooCommerce API calls
3. **Component Build:** Create UI with shadcn/ui
4. **State Management:** Add Zustand store logic
5. **Error Handling:** Add try/catch and fallbacks
6. **Testing:** Verify success and error scenarios

### **2. Debugging Process**
1. Check browser console for errors
2. Verify API responses in Network tab
3. Inspect Zustand store state
4. Validate form schemas
5. Test error boundaries and fallbacks

### **3. Performance Checklist**
- [ ] No unused imports
- [ ] Images have lazy loading
- [ ] Components have loading states
- [ ] API calls have rate limiting
- [ ] Bundle size is optimized

---

## ⚡ **Performance Optimization Rules**

### **1. Image Optimization**
```typescript
// ✅ CORRECT - Lazy loading with fallback
<img
  src={image.src}
  alt={image.alt}
  className="w-full h-full object-cover"
  loading="lazy"
  onError={(e) => {
    const target = e.target as HTMLImageElement
    target.style.display = 'none'
    target.nextElementSibling?.classList.remove('hidden')
  }}
/>
<div className="image-placeholder hidden">
  <span>No image available</span>
</div>
```

### **2. State Optimization**
- Use Zustand selectors to prevent unnecessary re-renders
- Persist customer data in localStorage
- Implement rate limiting for API calls

### **3. Bundle Optimization**
- Dynamic imports for route-based code splitting
- Remove unused dependencies
- Enable compression in Next.js config

---

## 🛡️ **Security Guidelines**

### **1. API Security**
- ✅ Never expose API keys in client code
- ✅ Use environment variables for sensitive data
- ✅ Implement rate limiting
- ✅ Validate all user inputs

### **2. Form Security**
- ✅ Use Zod schemas for validation
- ✅ Sanitize user inputs
- ✅ Implement CSRF protection where needed

### **3. Data Protection**
- ✅ Use HTTPS for all API calls
- ✅ Implement proper CORS headers
- ✅ Store sensitive data securely

---

## 📋 **Pre-Commit Checklist**

### **Code Quality**
- [ ] No unused imports (`eslint` check)
- [ ] No console errors in browser
- [ ] All forms have proper validation
- [ ] Images have fallback handling
- [ ] Loading states implemented

### **Functionality**
- [ ] Cart operations work correctly
- [ ] Checkout flow completes successfully
- [ ] Account creation works automatically
- [ ] Error scenarios handled gracefully

### **Performance**
- [ ] Page load times under 3 seconds
- [ ] Images load properly with fallbacks
- [ ] No memory leaks in components
- [ ] Bundle size is reasonable

---

## 🚀 **Deployment Guidelines**

### **Environment Setup**
```bash
# Required environment variables
NEXT_PUBLIC_WORDPRESS_URL=https://your-site.com
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=your_key
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=your_secret
```

### **Build Process**
1. Clear all caches: `rm -rf .next`
2. Run build: `npm run build`
3. Test locally: `npm run start`
4. Deploy to production

### **Production Monitoring**
- Monitor Core Web Vitals
- Track API response times
- Watch error rates
- Monitor bundle size changes

---

## 🔄 **Update Process**

### **When to Update Guidelines**
- New major features added
- Architecture changes
- New dependencies added
- Performance issues discovered
- Security vulnerabilities found

### **Update Process**
1. Document the change
2. Update relevant sections
3. Update version number and date
4. Communicate changes to team
5. Update any related documentation

---

## 📞 **Troubleshooting Guide**

### **Common Issues & Solutions**

#### **Module Not Found Errors**
```bash
# Solution
rm -rf .next
npm run dev
# Hard refresh browser
```

#### **Image Loading Issues**
```typescript
// Check image URL format
console.log(product.images[0].src)
// Verify Next.js config has no Image domain restrictions
```

#### **State Not Updating**
```typescript
// Verify Zustand subscription
const items = useCartStore(state => state.items)
// Check for proper action calls
```

#### **Form Validation Issues**
```typescript
// Check Zod schema syntax
// Verify resolver is properly configured
// Check form submission handler
```

---

## 🎯 **Best Practices Summary**

### **DOs**
- ✅ Use regular `<img>` tags for external images
- ✅ Clean up unused imports
- ✅ Implement proper error handling
- ✅ Add loading states
- ✅ Use TypeScript strictly
- ✅ Follow the established patterns
- ✅ Test error scenarios
- ✅ Update documentation

### **DON'Ts**
- ❌ Use Next.js `<Image>` component
- ❌ Leave unused imports
- ❌ Skip error handling
- ❌ Hardcode API keys
- ❌ Ignore TypeScript errors
- ❌ Skip loading states
- ❌ Break established patterns
- ❌ Forget to update docs

---

**This document is living and should be updated as the project evolves. Always refer to the latest version before making changes.**
