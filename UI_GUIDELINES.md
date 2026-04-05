# UI Guidelines & Design System

> **Last Updated:** 2026-04-05  
> **Version:** 1.0.0  
> **Project:** WooCommerce Headless Store

---

## 🎯 **Design Philosophy**

### **Core Principles**
- **Clean & Minimal** - Focus on products and user experience
- **Trust & Professional** - Build confidence in shoppers
- **Mobile-First** - Optimized for all devices
- **Accessible** - WCAG 2.1 AA compliant
- **Performance** - Fast loading and smooth interactions

### **Target Audience**
- Modern e-commerce shoppers
- Mobile and desktop users
- Users who value simplicity and efficiency

---

## 🎨 **Color System**

### **Primary Colors**
```css
/* Brand Primary - Blue Trust */
--primary-50: #eff6ff
--primary-100: #dbeafe
--primary-200: #bfdbfe
--primary-300: #93c5fd
--primary-400: #60a5fa
--primary-500: #3b82f6  /* Main Brand */
--primary-600: #2563eb
--primary-700: #1d4ed8
--primary-800: #1e40af
--primary-900: #1e3a8a
```

### **Neutral Colors**
```css
/* Gray Scale */
--gray-50: #f9fafb   /* Background */
--gray-100: #f3f4f6  /* Light BG */
--gray-200: #e5e7eb  /* Borders */
--gray-300: #d1d5db  /* Disabled */
--gray-400: #9ca3af  /* Placeholders */
--gray-500: #6b7280  /* Secondary Text */
--gray-600: #4b5563  /* Body Text */
--gray-700: #374151  /* Headings */
--gray-800: #1f2937  /* Dark Text */
--gray-900: #111827  /* Darkest */
```

### **Semantic Colors**
```css
/* Success */
--success-50: #f0fdf4
--success-500: #22c55e
--success-600: #16a34a

/* Warning */
--warning-50: #fffbeb
--warning-500: #f59e0b
--warning-600: #d97706

/* Error */
--error-50: #fef2f2
--error-500: #ef4444
--error-600: #dc2626

/* Info */
--info-50: #eff6ff
--info-500: #3b82f6
--info-600: #2563eb
```

### **Color Usage Guidelines**
- **Primary Blue** - CTAs, links, important actions
- **Gray Scale** - Text, backgrounds, borders
- **Success Green** - Completed states, success messages
- **Warning Amber** - Warnings, attention needed
- **Error Red** - Errors, destructive actions
- **Info Blue** - Information, help text

---

## 📝 **Typography System**

### **Font Stack**
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### **Type Scale**
```css
/* Text Sizes */
--text-xs: 0.75rem    /* 12px - Labels, captions */
--text-sm: 0.875rem   /* 14px - Small text */
--text-base: 1rem     /* 16px - Body text */
--text-lg: 1.125rem   /* 18px - Large body */
--text-xl: 1.25rem    /* 20px - Small headings */
--text-2xl: 1.5rem    /* 24px - Section headings */
--text-3xl: 1.875rem  /* 30px - Page headings */
--text-4xl: 2.25rem   /* 36px - Hero headings */
--text-5xl: 3rem      /* 48px - Display headings */
```

### **Font Weights**
```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

### **Line Heights**
```css
--leading-tight: 1.25
--leading-normal: 1.5
--leading-relaxed: 1.75
```

### **Typography Usage**
- **Headings** - Semibold to Bold, tight leading
- **Body Text** - Normal weight, normal leading
- **Labels** - Medium weight, tight leading
- **Prices** - Semibold, prominent size

---

## 📏 **Spacing System**

### **Base Scale (4px)**
```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
--space-20: 5rem     /* 80px */
--space-24: 6rem     /* 96px */
```

### **Spacing Guidelines**
- **Component Padding** - 4-6 (16-24px)
- **Section Spacing** - 12-20 (48-80px)
- **Element Spacing** - 2-4 (8-16px)
- **Tight Spacing** - 1-2 (4-8px)

---

## 🎯 **Component Guidelines**

### **Buttons**
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-600);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-700);
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--primary-600);
  border: 1px solid var(--primary-600);
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-weight: var(--font-medium);
}

/* Outline Button */
.btn-outline {
  background: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
}
```

### **Form Elements**
```css
/* Input Fields */
.input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  font-size: var(--text-base);
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Labels */
.label {
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  color: var(--gray-700);
  margin-bottom: var(--space-2);
}
```

### **Cards**
```css
.card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 0.75rem;
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-hover:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}
```

---

## 📱 **Responsive Design**

### **Breakpoints**
```css
--breakpoint-sm: 640px   /* Small tablets */
--breakpoint-md: 768px   /* Tablets */
--breakpoint-lg: 1024px  /* Laptops */
--breakpoint-xl: 1280px  /* Desktops */
--breakpoint-2xl: 1536px /* Large desktops */
```

### **Responsive Guidelines**
- **Mobile (< 768px)** - Single column, touch-friendly
- **Tablet (768px - 1024px)** - Two columns, adapted spacing
- **Desktop (> 1024px)** - Multi-column, full features

---

## 🎯 **Interactive States**

### **Hover Effects**
```css
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}
```

### **Focus States**
```css
.focus-ring:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

.focus-shadow:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### **Active States**
```css
.active:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
```

---

## ♿ **Accessibility Guidelines**

### **Color Contrast**
- **Normal Text** - 4.5:1 minimum
- **Large Text** - 3:1 minimum
- **Interactive Elements** - 3:1 minimum

### **Focus Management**
- Visible focus indicators
- Logical tab order
- Skip navigation links
- ARIA labels where needed

### **Screen Reader Support**
- Semantic HTML5 elements
- Alt text for images
- Descriptive link text
- Form labels and descriptions

---

## 🎨 **Layout Patterns**

### **Grid System**
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-6); }
```

### **Flex Patterns**
```css
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.flex-col { display: flex; flex-direction: column; }
```

---

## 🚀 **Implementation Plan**

### **Phase 1: Foundation**
1. Update TailwindCSS config with custom colors
2. Create CSS custom properties
3. Update existing components with new design tokens

### **Phase 2: Component Updates**
1. Update Button components
2. Update Form components
3. Update Card components
4. Update Typography components

### **Phase 3: Page Templates**
1. Update product pages
2. Update checkout flow
3. Update account pages
4. Update navigation

### **Phase 4: Polish**
1. Add micro-interactions
2. Optimize performance
3. Test accessibility
4. Cross-browser testing

---

## 📋 **Design Checklist**

### **Before Implementation**
- [ ] Review mockup carefully
- [ ] Extract all design tokens
- [ ] Plan component hierarchy
- [ ] Define responsive strategy

### **During Implementation**
- [ ] Use semantic HTML
- [ ] Follow accessibility guidelines
- [ ] Maintain consistency
- [ ] Test on multiple devices

### **After Implementation**
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] User acceptance testing

---

## 🎯 **Usage Examples**

### **Product Card**
```jsx
<div className="card card-hover">
  <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
  <div className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold text-primary-600">${product.price}</span>
      <button className="btn-primary">Add to Cart</button>
    </div>
  </div>
</div>
```

### **Checkout Form**
```jsx
<div className="max-w-2xl mx-auto">
  <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
  <form className="space-y-6">
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Information</h2>
      <div className="grid grid-2 gap-4">
        <div>
          <label className="label">First Name</label>
          <input type="text" className="input" />
        </div>
        <div>
          <label className="label">Last Name</label>
          <input type="text" className="input" />
        </div>
      </div>
    </div>
  </form>
</div>
```

---

**This UI guidelines document serves as the foundation for implementing the mockup design consistently across the entire application.**
