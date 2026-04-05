// Performance optimization utilities

// Image optimization utilities
export const imageUtils = {
  // Generate responsive image URLs
  getResponsiveUrl(url: string, width: number, height?: number): string {
    if (!url) return '/placeholder-product.jpg'
    
    // If it's already a WordPress URL, add size parameters
    if (url.includes('/wp-content/')) {
      const separator = url.includes('?') ? '&' : '?'
      return `${url}${separator}w=${width}${height ? `&h=${height}` : ''}`
    }
    
    return url
  },
  
  // Generate srcset for responsive images
  generateSrcSet(baseUrl: string, sizes: number[]): string {
    return sizes
      .map(size => `${this.getResponsiveUrl(baseUrl, size)} ${size}w`)
      .join(', ')
  },
  
  // Generate sizes attribute
  generateSizes(breakpoints: { [key: string]: string }): string {
    return Object.entries(breakpoints)
      .map(([breakpoint, size]) => `(min-width: ${breakpoint}) ${size}`)
      .join(', ')
  }
}

// Debounce utility for search and form inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Lazy loading utilities
export const lazyLoad = {
  // Intersection Observer for lazy loading
  observer: null as IntersectionObserver | null,
  
  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              if (img.dataset.src) {
                img.src = img.dataset.src
                img.removeAttribute('data-src')
                this.observer?.unobserve(img)
              }
            }
          })
        },
        {
          rootMargin: '50px 0px', // Start loading 50px before visible
          threshold: 0.1
        }
      )
    }
  },
  
  observe(img: HTMLImageElement) {
    if (this.observer) {
      this.observer.observe(img)
    }
  },
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}

// Performance monitoring
export const performanceMonitor = {
  // Measure component render time
  measureRender(componentName: string, renderFn: () => void) {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now()
      renderFn()
      const end = performance.now()
      console.log(`${componentName} render time: ${end - start}ms`)
    } else {
      renderFn()
    }
  },
  
  // Measure API call time
  async measureApiCall<T>(apiName: string, apiCall: () => Promise<T>): Promise<T> {
    const start = performance.now()
    try {
      const result = await apiCall()
      const end = performance.now()
      console.log(`${apiName} API call time: ${end - start}ms`)
      return result
    } catch (error) {
      const end = performance.now()
      console.error(`${apiName} API call failed after ${end - start}ms:`, error)
      throw error
    }
  },
  
  // Get page load metrics
  getPageLoadMetrics() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      }
    }
    return null
  }
}

// Bundle size optimization
export const bundleOptimizer = {
  // Dynamic imports for code splitting
  async loadComponent<T>(importFn: () => Promise<T>): Promise<T> {
    return performanceMonitor.measureApiCall('Dynamic Import', importFn)
  },
  
  // Preload critical resources
  preloadResource(url: string, as: string = 'script') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = url
    link.as = as
    document.head.appendChild(link)
  },
  
  // Prefetch next pages
  prefetchPage(url: string) {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  }
}

// Memory management
export const memoryManager = {
  // Cleanup event listeners
  cleanup() {
    // Clear any ongoing operations
    lazyLoad.disconnect()
  },
  
  // Force garbage collection hint (development only)
  gc() {
    if (process.env.NODE_ENV === 'development' && 'gc' in window) {
      (window as any).gc()
    }
  }
}

// Initialize performance optimizations
export function initPerformanceOptimizations() {
  if (typeof window !== 'undefined') {
    lazyLoad.init()
    
    // Monitor page load performance
    window.addEventListener('load', () => {
      const metrics = performanceMonitor.getPageLoadMetrics()
      if (metrics) {
        console.log('Page Load Metrics:', metrics)
      }
    })
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', memoryManager.cleanup)
  }
}

// Critical CSS inlining utility
export const criticalCSS = {
  // Inline critical CSS for above-the-fold content
  inline(styles: string) {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style')
      style.textContent = styles
      document.head.insertBefore(style, document.head.firstChild)
    }
  }
}
