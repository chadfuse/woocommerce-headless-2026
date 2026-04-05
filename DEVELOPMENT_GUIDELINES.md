# Headless Store Development Guidelines

> **Last Updated:** 2026-04-05  
> **Version:** 1.1.0  
> **Project:** WooCommerce Headless Store
> 
> **🚀 Recent Updates:** Added React Query for improved data fetching (parallel to existing system) + WooCommerce payment integration with real payment methods + Enhanced customer creation error handling + Login flow for existing customers + WordPress email integration for password reset + Smart authentication detection (no unnecessary login redirects) + Auto-fill checkout forms for logged-in customers + Smart order confirmation messages (no "Account Created!" for existing customers) + Complete account page with real customer data, order history, and address management

---

## 🏗️ **Project Architecture**

### **Tech Stack**
- **Framework:** Next.js 16.2.2 (Turbopack)
- **Language:** TypeScript
- **Styling:** TailwindCSS + shadcn/ui components
- **State Management:** Zustand
- **Data Fetching:** React Query (NEW) + Manual Fetch (Existing)
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
│   ├── (routes)/           # Dynamic routes
│   ├── account/           # Customer account pages
│   ├── checkout/          # Checkout flow
│   ├── forgot-password/    # Password reset page (NEW)
│   ├── login/             # Customer login page (NEW)
│   ├── products/          # Product listings & details
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── ProductCard.tsx    # Product grid item
│   ├── CartDrawer.tsx     # Shopping cart sidebar
│   ├── CartIcon.tsx       # Header cart button
│   ├── AccountIcon.tsx    # Header account button
│   └── Header.tsx         # Reusable page header
├── hooks/
│   ├── useWooCommerce.ts  # API data fetching hooks
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
