import { rateLimiter } from './rateLimiter'

// Simple in-memory cache
interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
}

class Cache {
  private store: Map<string, CacheEntry> = new Map()
  
  set(key: string, data: any, ttl: number = 300000): void { // 5 minutes default TTL
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }
  
  get(key: string): any | null {
    const entry = this.store.get(key)
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key)
      return null
    }
    
    return entry.data
  }
  
  clear(): void {
    this.store.clear()
  }
  
  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.store.delete(key)
      }
    }
  }
}

const cache = new Cache()

// Clean up cache every 10 minutes
setInterval(() => cache.cleanup(), 600000)

class EnhancedWooCommerce {
  private baseURL: string
  private auth: string
  
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_WORDPRESS_URL || ''
    this.auth = btoa(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
    )
  }
  
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {},
    cacheTTL?: number
  ): Promise<T> {
    const url = `${this.baseURL}/wp-json/wc/v3${endpoint}`
    
    // Check cache for GET requests
    if (!options.method || options.method === 'GET') {
      const cacheKey = `${url}${JSON.stringify(options)}`
      const cached = cache.get(cacheKey)
      if (cached) {
        console.log(`Cache hit for ${endpoint}`)
        return cached
      }
    }
    
    // Rate limiting check
    if (!rateLimiter.isAllowed(endpoint)) {
      const resetTime = rateLimiter.getResetTime(endpoint)
      const waitTime = Math.max(0, resetTime - Date.now())
      
      console.warn(`Rate limit exceeded for ${endpoint}. Waiting ${waitTime}ms`)
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
        return this.request(endpoint, options, cacheTTL)
      }
    }
    
    const remaining = rateLimiter.getRemainingRequests(endpoint)
    console.log(`Rate limit for ${endpoint}: ${remaining} requests remaining`)
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.auth}`,
          ...options.headers,
        },
      })
      
      if (!response.ok) {
        throw new Error(`WooCommerce API Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Cache successful GET requests
      if (!options.method || options.method === 'GET') {
        const cacheKey = `${url}${JSON.stringify(options)}`
        cache.set(cacheKey, data, cacheTTL)
      }
      
      return data
    } catch (error) {
      console.error(`WooCommerce API request failed for ${endpoint}:`, error)
      throw error
    }
  }
  
  // Enhanced product methods with caching
  async getProducts(params?: {
    page?: number
    per_page?: number
    category?: number
    search?: string
    status?: string
  }) {
    const query = new URLSearchParams(params as any).toString()
    return this.request(`/products${query ? '?' + query : ''}`, {}, 600000) // 10 minutes cache
  }
  
  async getProduct(id: number) {
    return this.request(`/products/${id}`, {}, 600000) // 10 minutes cache
  }
  
  async getProductBySlug(slug: string) {
    return this.request(`/products?slug=${slug}`, {}, 600000) // 10 minutes cache
  }
  
  // Customer methods with stricter rate limiting
  async createCustomer(customerData: any) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    })
  }
  
  async getCustomerByEmail(email: string) {
    return this.request(`/customers?email=${encodeURIComponent(email)}`)
  }
  
  // Order methods
  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }
  
  async getOrder(id: number) {
    return this.request(`/orders/${id}`, {}, 300000) // 5 minutes cache
  }
  
  async getOrders(params?: {
    customer?: number
    status?: string
    page?: number
    per_page?: number
  }) {
    const query = new URLSearchParams(params as any).toString()
    return this.request(`/orders${query ? '?' + query : ''}`, {}, 300000) // 5 minutes cache
  }
  
  // Batch operations for better performance
  async getProductsBatch(ids: number[]) {
    const batchSize = 10 // WooCommerce limit
    const results = []
    
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize)
      const promises = batch.map(id => this.getProduct(id))
      const batchResults = await Promise.all(promises)
      results.push(...batchResults)
    }
    
    return results
  }
  
  // Cache management
  clearCache(): void {
    cache.clear()
  }
  
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: (cache as any).store.size,
      keys: Array.from((cache as any).store.keys())
    }
  }
}

export const enhancedWooCommerce = new EnhancedWooCommerce()
export default enhancedWooCommerce
