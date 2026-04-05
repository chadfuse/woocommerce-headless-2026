/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack configuration
  turbopack: {},
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
    scrollRestoration: true,
  },
  
  // Image optimization
  images: {
    domains: ['headless-store.chadsia.com'],
  },
  
  // Compression
  compress: true,
  
  // Static optimization
  trailingSlash: false,
  
  // Static export configuration for Render
  output: process.env.NODE_ENV === 'production' && process.env.RENDER_STATIC === 'true' ? 'export' : undefined,
  distDir: process.env.NODE_ENV === 'production' && process.env.RENDER_STATIC === 'true' ? 'out' : '.next',
  
  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      }
    }
    
    return config
  },
}

module.exports = nextConfig
