# Quick Start Guide: Design System Implementation

> **Get started immediately with these actionable steps**

---

## 🚀 **Step 1: Update CSS Variables (15 minutes)**

### **Update `src/app/globals.css`**

Replace the current color variables with the new design system:

```css
@theme inline {
  /* Brand Colors - Updated */
  --color-primary: oklch(0.55 0.2 240);  /* Trust Blue */
  --color-primary-foreground: oklch(1 0 0);
  
  /* Update existing colors to match new palette */
  --color-secondary: oklch(0.97 0.01 240);
  --color-secondary-foreground: oklch(0.3 0.07 240);
  --color-muted: oklch(0.94 0.02 240);
  --color-muted-foreground: oklch(0.45 0.06 240);
  --color-accent: oklch(0.94 0.02 240);
  --color-accent-foreground: oklch(0.3 0.07 240);
  --color-destructive: oklch(0.6 0.2 20);  /* Error Red */
  --color-border: oklch(0.9 0.03 240);
  --color-input: oklch(0.9 0.03 240);
  --color-ring: oklch(0.55 0.2 240);
  
  /* Add Gray Scale */
  --color-gray-50: oklch(0.99 0.005 240);
  --color-gray-100: oklch(0.97 0.01 240);
  --color-gray-200: oklch(0.94 0.02 240);
  --color-gray-300: oklch(0.9 0.03 240);
  --color-gray-400: oklch(0.8 0.04 240);
  --color-gray-500: oklch(0.65 0.05 240);
  --color-gray-600: oklch(0.45 0.06 240);
  --color-gray-700: oklch(0.3 0.07 240);
  --color-gray-800: oklch(0.2 0.08 240);
  --color-gray-900: oklch(0.1 0.09 240);
  
  /* Add Semantic Colors */
  --color-success: oklch(0.65 0.15 145);
  --color-warning: oklch(0.75 0.15 70);
  --color-error: oklch(0.6 0.2 20);
  --color-info: oklch(0.55 0.2 240);
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  
  /* Spacing Scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
}
```

---

## 🎨 **Step 2: Update Button Component (10 minutes)**

### **Update `src/components/ui/button.tsx`**

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        destructive: "bg-error text-white hover:bg-error/90 shadow-sm",
        outline: "border border-gray-300 bg-background hover:bg-gray-50 hover:text-gray-900",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

---

## 📝 **Step 3: Update Input Component (10 minutes)**

### **Update `src/components/ui/input.tsx`**

```typescript
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

---

## 🃏 **Step 4: Update Card Component (5 minutes)**

### **Update `src/components/ui/card.tsx`**

```typescript
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm",
      className
    )}
    {...props}
  />
))
```

---

## 🧪 **Step 5: Test Changes (5 minutes)**

### **Run Development Server**

```bash
npm run dev
```

### **Test Key Pages**
1. **Homepage** - Check button colors and card styling
2. **Product Page** - Verify form inputs and buttons
3. **Checkout** - Test all form elements
4. **Account** - Check navigation and cards

### **Verify Changes**
- [ ] Primary buttons are trust blue (#3b82f6)
- [ ] Input fields have proper borders and focus states
- [ ] Cards have subtle shadows and borders
- [ ] Text colors follow the new gray scale
- [ ] Hover states work properly

---

## 🎯 **Step 6: Update Product Card (15 minutes)**

### **Update `src/components/ProductCard.tsx`**

```typescript
return (
  <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
    <div className="aspect-square w-full overflow-hidden bg-gray-50">
      <img
        src={product.images[0]?.src}
        alt={product.images[0]?.alt || product.name}
        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          target.parentElement?.classList.add('bg-gray-100')
        }}
      />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
        {product.name}
      </h3>
      <p className="text-2xl font-bold text-primary mb-3">
        ${parseFloat(product.price).toFixed(2)}
      </p>
      <Button 
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className="w-full"
        size="sm"
      >
        {isAddingToCart ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  </div>
)
```

---

## 📱 **Step 7: Update Header (10 minutes)**

### **Update `src/components/Header.tsx`**

```typescript
return (
  <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">Store</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors">
            Products
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <AccountIcon />
          <CartDrawer />
        </div>
      </div>
    </div>
  </header>
)
```

---

## ✅ **Step 8: Verification Checklist**

### **Visual Design**
- [ ] Primary color is trust blue
- [ ] Gray scale is consistent
- [ ] Typography is clean and readable
- [ ] Spacing follows the 4px grid
- [ ] Shadows are subtle and consistent

### **Interactions**
- [ ] Buttons have hover states
- [ ] Links have hover states
- [ ] Forms have focus states
- [ ] Cards have hover effects
- [ ] Transitions are smooth

### **Responsive Design**
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Breakpoints are correct
- [ ] Navigation adapts properly

### **Accessibility**
- [ ] Color contrast is sufficient
- [ ] Focus indicators are visible
- [ ] Interactive elements are large enough
- [ ] Text is readable
- [ ] Forms are accessible

---

## 🚨 **Troubleshooting**

### **Common Issues**

**Colors not updating:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Tailwind classes not working:**
```bash
# Restart development server
npm run dev
```

**TypeScript errors:**
```bash
# Check types
npm run build
```

**Performance issues:**
- Check bundle size
- Optimize images
- Minimize CSS

---

## 🎯 **Next Steps**

After completing these quick updates:

1. **Test thoroughly** - Click through all pages
2. **Get feedback** - Share with stakeholders
3. **Refine details** - Adjust spacing, colors, interactions
4. **Document changes** - Update UI guidelines
5. **Plan Phase 2** - Component library expansion

---

**You should now have a modern, professional design system implemented! The site will feel more trustworthy and polished with these updates.**
