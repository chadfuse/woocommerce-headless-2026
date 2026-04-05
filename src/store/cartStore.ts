import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { WooCommerceCart } from '@/types/woocommerce'

interface CartStore {
  cart: WooCommerceCart | null
  isLoading: boolean
  error: string | null
  isOpen: boolean
  
  // Actions
  fetchCart: () => Promise<void>
  addToCart: (productId: number, quantity?: number) => Promise<void>
  removeFromCart: (key: string) => Promise<void>
  updateQuantity: (key: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useCartStore = create<CartStore>()(
  devtools(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,
      isOpen: false,

      fetchCart: async () => {
        set({ isLoading: true, error: null })
        try {
          // For now, let's create a simple cart structure
          // WooCommerce cart endpoints might need authentication or session handling
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/cart`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(
                  `${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
                )}`,
              },
            }
          )

          if (!response.ok) {
            // If cart endpoint doesn't work, create an empty cart
            if (response.status === 404) {
              set({ 
  cart: {
    cart_hash: '',
    cart_key: '',
    cart_contents: [],
    applied_coupons: [],
    coupon_discount_amounts: [],
    coupon_discount_tax_amounts: [],
    removed_cart_contents: [],
    cart_contents_total: 0,
    cart_contents_weight: 0,
    cart_contents_tax: 0,
    subtotal: 0,
    subtotal_tax: 0,
    discount_total: 0,
    discount_tax: 0,
    shipping_total: 0,
    shipping_tax: 0,
    total: 0,
    total_tax: 0,
    fees: [],
    shipping_methods: [],
    shipping_taxes: [],
    fee_tax: 0,
    cart_tax: 0,
    taxes: [],
    taxes_total: 0,
    customer: {
      id: 0,
      email: '',
      first_name: '',
      last_name: '',
      username: '',
      avatar_url: '',
    },
  }, 
  isLoading: false 
})
              return
            }
            throw new Error(`Failed to fetch cart: ${response.statusText}`)
          }

          const cart = await response.json()
          set({ cart, isLoading: false })
        } catch (error) {
          console.error('Cart fetch error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch cart',
            isLoading: false 
          })
        }
      },

      addToCart: async (productId: number, quantity = 1) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/cart/add`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(
                  `${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
                )}`,
              },
              body: JSON.stringify({
                product_id: productId,
                quantity,
              }),
            }
          )

          if (!response.ok) {
            const errorText = await response.text()
            console.error('Add to cart error:', errorText)
            throw new Error(`Failed to add to cart: ${response.statusText} - ${errorText}`)
          }

          const cart = await response.json()
          set({ cart, isLoading: false })
        } catch (error) {
          console.error('Add to cart error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add to cart',
            isLoading: false 
          })
        }
      },

      removeFromCart: async (key: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/cart/remove`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(
                  `${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
                )}`,
              },
              body: JSON.stringify({ key }),
            }
          )

          if (!response.ok) {
            throw new Error(`Failed to remove from cart: ${response.statusText}`)
          }

          const cart = await response.json()
          set({ cart, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to remove from cart',
            isLoading: false 
          })
        }
      },

      updateQuantity: async (key: string, quantity: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/cart/update`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(
                  `${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
                )}`,
              },
              body: JSON.stringify({ key, quantity }),
            }
          )

          if (!response.ok) {
            throw new Error(`Failed to update cart: ${response.statusText}`)
          }

          const cart = await response.json()
          set({ cart, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update cart',
            isLoading: false 
          })
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/cart/clear`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(
                  `${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
                )}`,
              },
            }
          )

          if (!response.ok) {
            throw new Error(`Failed to clear cart: ${response.statusText}`)
          }

          set({ cart: null, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to clear cart',
            isLoading: false 
          })
        }
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'cart-store',
    }
  )
)
