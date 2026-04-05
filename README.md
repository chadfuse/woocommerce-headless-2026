# WooCommerce Headless Store 2026

A modern, fully-featured headless e-commerce store built with Next.js 16, TypeScript, and WooCommerce REST API. This project showcases a complete e-commerce solution with a beautiful, responsive design and advanced features.

## 🚀 Features

### ✨ Core Features
- **Modern Design**: Beautiful hero sections with background images and professional UI
- **Product Catalog**: Advanced filtering, sorting, and pagination
- **Shopping Cart**: Local storage-based cart with add/remove functionality
- **User Authentication**: Login, registration, and password reset
- **Checkout Flow**: Complete checkout with payment integration
- **Order Management**: Order history and confirmation pages
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization

### 🎨 Design System
- **Template System**: Reusable PageTemplate, ContentTemplate, and CommerceTemplate
- **Component Library**: Built with shadcn/ui components
- **Modern Color Palette**: Professional blue-based color scheme
- **Typography**: Inter font family with optimized readability
- **Micro-interactions**: Hover effects, transitions, and loading states

### 🔧 Technical Stack
- **Framework**: Next.js 16.2.2 with App Router
- **Language**: TypeScript for type safety
- **Styling**: TailwindCSS v4 with CSS variables
- **State Management**: Zustand for global state
- **Forms**: React Hook Form with Zod validation
- **API**: WooCommerce REST API v3 integration
- **UI Components**: shadcn/ui component library

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- WooCommerce store with REST API enabled
- WordPress site with WooCommerce plugin

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/chadfuse/woocommerce-headless-2026.git
cd woocommerce-headless-2026
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment variables**
Create a `.env.local` file in the root directory:

```env
# WordPress/WooCommerce Configuration
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-wordpress-site.com/wp-json/wc/v3

# WooCommerce Keys (generate in WooCommerce > Settings > Advanced > REST API)
WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret

# Optional: Stripe Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Optional: reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (templates)/        # Template-based pages
│   ├── account/           # User account pages
│   ├── products/          # Product pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── templates/        # Page templates
│   ├── sections/         # Reusable sections
│   ├── ui/              # UI components
│   └── ProductCard.tsx   # Product display component
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── store/               # Zustand stores
└── types/               # TypeScript type definitions
```

### Key Features

#### Template System
- **PageTemplate**: Universal page structure with header, footer, breadcrumbs
- **ContentTemplate**: Content-focused pages with hero sections
- **CommerceTemplate**: E-commerce pages with filters and pagination

#### Product Management
- **Product Cards**: Grid and list view modes with hover effects
- **Product Grid**: Advanced filtering by category, price, and search
- **Product Details**: Complete product pages with related items

#### Shopping Experience
- **Cart Management**: Add to cart, quantity controls, local storage
- **Checkout Flow**: Multi-step checkout with payment integration
- **Order Tracking**: Order history and confirmation pages

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   - Push to GitHub
   - Import repository in Vercel dashboard
   - Configure environment variables

2. **Environment Variables**
   Set the same variables from `.env.local` in Vercel dashboard

3. **Deploy**
   - Automatic deployment on git push
   - Preview deployments for pull requests

### Netlify

1. **Connect to Netlify**
   - Push to GitHub
   - Import repository in Netlify dashboard
   - Configure build settings

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

3. **Environment Variables**
   Configure in Netlify dashboard

### Render

1. **Connect to Render**
   - Push to GitHub
   - Import repository in Render dashboard
   - Choose "Web Service" or "Static Site"

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Start command: `npm start`
   - Runtime: Node 18

3. **Environment Variables**
   Configure in Render dashboard

4. **Deploy**
   - Automatic deployment on git push
   - Preview deployments available

### Manual Deployment

```bash
npm run build
npm run start
```

## 📱 Pages

### Public Pages
- **Homepage** (`/`) - Hero section with featured products
- **Products** (`/products`) - Product catalog with filtering
- **Product Detail** (`/products/[slug]`) - Individual product pages
- **About** (`/about`) - Company information
- **Contact** (`/contact`) - Contact form and information

### User Pages
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration
- **Account** (`/account`) - User dashboard
- **Addresses** (`/account/addresses`) - Shipping/billing addresses
- **Orders** (`/account/orders`) - Order history

### Checkout Pages
- **Cart** (`/cart`) - Shopping cart management
- **Checkout** (`/checkout`) - Multi-step checkout process
- **Order Confirmation** (`/order-confirmation/[id]`) - Post-purchase page

## 🎨 Customization

### Theming
Update colors in `src/app/globals.css`:
```css
:root {
  --primary: oklch(0.55 0.2 240);  /* Primary color */
  --secondary: oklch(0.97 0.01 240); /* Secondary color */
  /* Add more color variables */
}
```

### Templates
Create new pages using the template system:
```typescript
import { ContentTemplate } from '@/components/templates/ContentTemplate'

export default function CustomPage() {
  return (
    <ContentTemplate
      title="Page Title"
      hero={{
        title: "Hero Title",
        description: "Hero description",
        background: "gradient"
      }}
      sections={[
        {
          title: "Section Title",
          content: <YourComponent />,
          background: "light"
        }
      ]}
    />
  )
}
```

## 🔧 Configuration

### WooCommerce Setup
1. Install WooCommerce plugin on WordPress
2. Enable REST API in WooCommerce settings
3. Create API keys with read/write permissions
4. Configure products, categories, and shipping

### Payment Integration
1. Set up Stripe account
2. Configure webhook endpoints
3. Add environment variables
4. Test payment flow in development

## 📊 Performance

### Optimization Features
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: API response caching
- **Bundle Optimization**: Tree shaking and minification
- **SEO**: Meta tags, structured data, sitemaps

### Monitoring
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Load time monitoring
- **User Analytics**: Optional analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the [documentation](./docs/)
- Review the [development guidelines](./DEVELOPMENT_GUIDELINES.md)

## 🎯 Roadmap

- [ ] Wishlist functionality
- [ ] Product comparison
- [ ] Advanced search with filters
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)
- [ ] Mobile app integration

---

**Built with ❤️ using Next.js, TypeScript, and WooCommerce**
