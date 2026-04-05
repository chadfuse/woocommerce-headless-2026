// Simple client-side rate limiter for API calls
interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  
  // Rate limits per endpoint (requests per minute)
  private readonly limits = {
    '/wc/v3/orders': 60, // 60 orders per minute
    '/wc/v3/customers': 30, // 30 customer operations per minute
    '/wc/v3/products': 120, // 120 product fetches per minute
    default: 100, // 100 requests per minute for other endpoints
  }

  isAllowed(endpoint: string, limit?: number): boolean {
    const key = this.getKey(endpoint)
    const now = Date.now()
    const rateLimit = limit || this.getLimit(endpoint)
    
    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + 60000 // 1 minute from now
      }
      return true
    }
    
    const entry = this.store[key]
    
    // Reset if time window has passed
    if (now > entry.resetTime) {
      entry.count = 1
      entry.resetTime = now + 60000
      return true
    }
    
    // Check if under limit
    if (entry.count < rateLimit) {
      entry.count++
      return true
    }
    
    return false
  }
  
  getRemainingRequests(endpoint: string): number {
    const key = this.getKey(endpoint)
    const entry = this.store[key]
    
    if (!entry || Date.now() > entry.resetTime) {
      return this.getLimit(endpoint)
    }
    
    return Math.max(0, this.getLimit(endpoint) - entry.count)
  }
  
  getResetTime(endpoint: string): number {
    const key = this.getKey(endpoint)
    const entry = this.store[key]
    
    if (!entry) {
      return Date.now() + 60000
    }
    
    return entry.resetTime
  }
  
  private getKey(endpoint: string): string {
    return endpoint.split('?')[0] // Remove query params
  }
  
  private getLimit(endpoint: string): number {
    for (const [path, limit] of Object.entries(this.limits)) {
      if (endpoint.includes(path)) {
        return limit
      }
    }
    return this.limits.default
  }
  
  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key]
      }
    })
  }
}

export const rateLimiter = new RateLimiter()

// Clean up every 5 minutes
setInterval(() => rateLimiter.cleanup(), 300000)
