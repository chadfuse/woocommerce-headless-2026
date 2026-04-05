import { WooCommerceProduct, WooCommerceCategory, WooCommerceOrder } from '@/types/woocommerce'

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL + '/wp-json/wc/v3'
const CONSUMER_KEY = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET

class WooCommerceAPI {
  private getAuthHeader(): string {
    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
      throw new Error('WooCommerce API credentials not configured')
    }
    return 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`)
  }

  private async fetchAPI(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${WC_API_URL}${endpoint}`
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.getAuthHeader(),
      ...options.headers,
    }

    try {
      const response = await fetch(url, { ...options, headers })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`Failed to fetch: ${response.statusText} (${response.status}) - ${errorText}`)
      }
      
      return response
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }

  // Products
  async getProducts(params: {
    page?: number
    per_page?: number
    category?: number
    search?: string
    status?: string
  } = {}): Promise<WooCommerceProduct[]> {
    // Filter out undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    )
    const searchParams = new URLSearchParams(cleanParams as any).toString()
    const endpoint = searchParams ? `/products?${searchParams}` : '/products'
    
    const response = await this.fetchAPI(endpoint)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`)
    }
    
    return response.json()
  }

  async getProductBySlug(slug: string): Promise<WooCommerceProduct> {
    const response = await this.fetchAPI(`/products?slug=${slug}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product by slug: ${response.statusText}`)
    }
    
    const products = await response.json()
    if (products.length === 0) {
      throw new Error(`Product with slug '${slug}' not found`)
    }
    
    return products[0] // Return the first (and should be only) product
  }

  async getProduct(id: number): Promise<WooCommerceProduct> {
    const response = await this.fetchAPI(`/products/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`)
    }
    
    return response.json()
  }

  async createProduct(product: Partial<WooCommerceProduct>): Promise<WooCommerceProduct> {
    const response = await this.fetchAPI('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.statusText}`)
    }
    
    return response.json()
  }

  async updateProduct(id: number, product: Partial<WooCommerceProduct>): Promise<WooCommerceProduct> {
    const response = await this.fetchAPI(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.statusText}`)
    }
    
    return response.json()
  }

  async deleteProduct(id: number): Promise<void> {
    const response = await this.fetchAPI(`/products/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`)
    }
  }

  // Categories
  async getCategories(params: {
    page?: number
    per_page?: number
    hide_empty?: boolean
  } = {}): Promise<WooCommerceCategory[]> {
    const searchParams = new URLSearchParams(params as any).toString()
    const response = await this.fetchAPI(`/products/categories?${searchParams}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }
    
    return response.json()
  }

  async getCategory(id: number): Promise<WooCommerceCategory> {
    const response = await this.fetchAPI(`/products/categories/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.statusText}`)
    }
    
    return response.json()
  }

  // Orders
  async getOrders(params: {
    page?: number
    per_page?: number
    customer?: number
    status?: string
  } = {}): Promise<WooCommerceOrder[]> {
    const searchParams = new URLSearchParams(params as any).toString()
    const response = await this.fetchAPI(`/orders?${searchParams}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`)
    }
    
    return response.json()
  }

  async createOrder(order: Partial<WooCommerceOrder>): Promise<WooCommerceOrder> {
    const response = await this.fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Order creation error:', errorText)
      throw new Error(`Failed to create order: ${response.statusText} - ${errorText}`)
    }
    
    return response.json()
  }

  async getOrder(id: number): Promise<WooCommerceOrder> {
    const response = await this.fetchAPI(`/orders/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`)
    }
    
    return response.json()
  }

  // Customers (for authenticated requests)
  async getCustomers(params: {
    page?: number
    per_page?: number
    search?: string
  } = {}): Promise<any[]> {
    const searchParams = new URLSearchParams(params as any).toString()
    const response = await this.fetchAPI(`/customers?${searchParams}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.statusText}`)
    }
    
    return response.json()
  }

  // Cart (using WooCommerce cart API)
  async getCart(): Promise<any> {
    const response = await this.fetchAPI('/cart')
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.statusText}`)
    }
    
    return response.json()
  }

  async addToCart(productId: number, quantity: number = 1): Promise<any> {
    const response = await this.fetchAPI('/cart/add', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity,
      }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to add to cart: ${response.statusText}`)
    }
    
    return response.json()
  }

  async removeFromCart(key: string): Promise<any> {
    const response = await this.fetchAPI('/cart/remove', {
      method: 'POST',
      body: JSON.stringify({ key }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to remove from cart: ${response.statusText}`)
    }
    
    return response.json()
  }

  async updateCart(key: string, quantity: number): Promise<any> {
    const response = await this.fetchAPI('/cart/update', {
      method: 'POST',
      body: JSON.stringify({ key, quantity }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to update cart: ${response.statusText}`)
    }
    
    return response.json()
  }
}

export const woocommerce = new WooCommerceAPI()
