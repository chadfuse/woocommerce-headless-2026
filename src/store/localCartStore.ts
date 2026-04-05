import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { WooCommerceProduct } from '@/types/woocommerce'

interface CartItem {
  product: WooCommerceProduct
  quantity: number
  key: string
}

interface LocalCartStore {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  isOpen: boolean
  
  // Actions
  addToCart: (product: WooCommerceProduct, quantity?: number) => void
  removeFromCart: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  // Computed
  getTotalItems: () => number
  getSubtotal: () => string
  getTotal: () => string
}

export const useLocalCartStore = create<LocalCartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        isLoading: false,
        error: null,
        isOpen: false,

        addToCart: (product: WooCommerceProduct, quantity = 1) => {
          const { items } = get()
          const existingItem = items.find(item => item.product.id === product.id)
          
          if (existingItem) {
            set({
              items: items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            })
          } else {
            set({
              items: [...items, { product, quantity, key: `${product.id}-${Date.now()}` }]
            })
          }
        },

        removeFromCart: (key: string) => {
          set(state => ({
            items: state.items.filter(item => item.key !== key)
          }))
        },

        updateQuantity: (key: string, quantity: number) => {
          if (quantity === 0) {
            get().removeFromCart(key)
            return
          }
          
          set(state => ({
            items: state.items.map(item =>
              item.key === key ? { ...item, quantity } : item
            )
          }))
        },

        clearCart: () => {
          set({ items: [] })
        },

        openCart: () => set({ isOpen: true }),
        closeCart: () => set({ isOpen: false }),
        toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

        getTotalItems: () => {
          return get().items.reduce((total, item) => total + item.quantity, 0)
        },

        getSubtotal: () => {
          return get().items.reduce((total, item) => {
            return total + (parseFloat(item.product.price || '0') * item.quantity)
          }, 0).toFixed(2)
        },

        getTotal: () => {
          return get().getSubtotal() // For now, same as subtotal (no shipping/tax)
        },
      }),
      {
        name: 'local-cart',
      }
    ),
    {
      name: 'local-cart-store',
    }
  )
)
