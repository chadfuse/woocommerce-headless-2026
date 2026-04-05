import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { CheckoutFormData } from '@/lib/checkoutSchema'
import { WooCommerceOrder } from '@/types/woocommerce'
import { useLocalCartStore } from './localCartStore'
import { useCustomerStore } from './customerStore'
import { logError, logInfo } from '@/lib/errorLogger'

interface WooCommerceCustomer {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
}

interface CheckoutStore {
  order: WooCommerceOrder | null
  customer: WooCommerceCustomer | null
  isLoading: boolean
  error: string | null
  isProcessing: boolean
  isNewAccountCreated: boolean
  
  // Actions
  createOrder: (data: CheckoutFormData) => Promise<WooCommerceOrder | null>
  createOrUpdateCustomer: (data: CheckoutFormData) => Promise<WooCommerceCustomer | null>
  clearOrder: () => void
  clearError: () => void
  setIsNewAccountCreated: (created: boolean) => void
}

export const useCheckoutStore = create<CheckoutStore>()(
  devtools(
    (set, get) => ({
      order: null,
      customer: null,
      isLoading: false,
      error: null,
      isProcessing: false,
      isNewAccountCreated: false,

      createOrUpdateCustomer: async (data: CheckoutFormData) => {
        try {
          const customerData = {
            email: data.billing_email,
            first_name: data.billing_first_name,
            last_name: data.billing_last_name,
            billing: {
              first_name: data.billing_first_name,
              last_name: data.billing_last_name,
              company: data.billing_company || '',
              address_1: data.billing_address_1,
              address_2: data.billing_address_2 || '',
              city: data.billing_city,
              state: data.billing_state,
              postcode: data.billing_postcode,
              country: data.billing_country,
              email: data.billing_email,
              phone: data.billing_phone,
            },
            shipping: data.shipping_to_different_address
              ? {
                  first_name: data.shipping_first_name || '',
                  last_name: data.shipping_last_name || '',
                  company: data.shipping_company || '',
                  address_1: data.shipping_address_1 || '',
                  address_2: data.shipping_address_2 || '',
                  city: data.shipping_city || '',
                  state: data.shipping_state || '',
                  postcode: data.shipping_postcode || '',
                  country: data.shipping_country || '',
                }
              : {
                  first_name: data.billing_first_name,
                  last_name: data.billing_last_name,
                  company: data.billing_company || '',
                  address_1: data.billing_address_1,
                  address_2: data.billing_address_2 || '',
                  city: data.billing_city,
                  state: data.billing_state,
                  postcode: data.billing_postcode,
                  country: data.billing_country,
                },
            username: data.billing_email.toLowerCase().replace(/[^a-z0-9]/g, ''),
            password: Math.random().toString(36).slice(-8), // Random password
            // Store password for potential display (in production, you'd send this via email)
            meta_data: [
              {
                key: 'generated_password',
                value: Math.random().toString(36).slice(-8)
              }
            ]
          }

          console.log('Creating customer with data:', customerData)

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/customers`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(
                  `${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
                )}`,
              },
              body: JSON.stringify(customerData),
            }
          )

          if (!response.ok) {
            let errorText
            let errorData
            
            try {
              // Try to parse as JSON first
              const errorJson = await response.json()
              errorText = JSON.stringify(errorJson)
              errorData = errorJson
            } catch {
              // Fallback to text if JSON parsing fails
              errorText = await response.text()
              errorData = { message: errorText }
            }
            
            // Log customer creation error with context
            logError('Customer creation error', {
              status: response.status,
              errorText,
              errorData,
              email: data.billing_email,
              isExistingCustomer: response.status === 400 && (
                errorText.includes('exists') || 
                errorText.includes('registration-error-email-exists') ||
                errorText.includes('already registered') ||
                errorData?.code === 'registration-error-email-exists'
              )
            })
            
            // Check if customer already exists - check for multiple error patterns
            const isExistingCustomer = response.status === 400 && (
              errorText.includes('exists') || 
              errorText.includes('registration-error-email-exists') ||
              errorText.includes('already registered') ||
              errorData?.code === 'registration-error-email-exists'
            )
            
            if (isExistingCustomer) {
              logInfo('Existing customer detected during checkout', {
                email: data.billing_email,
                isCheckingAuth: true
              })
              
              // Check if customer is already logged in
              const currentCustomer = useCustomerStore.getState().customer
              const isAuthenticated = useCustomerStore.getState().isAuthenticated
              
              if (isAuthenticated && currentCustomer && currentCustomer.email === data.billing_email) {
                logInfo('Customer already logged in, proceeding with checkout', {
                  email: data.billing_email,
                  customerId: currentCustomer.id
                })
                // Customer is already logged in with same email, proceed with checkout
                // Return the existing customer to continue the flow
                set({ customer: currentCustomer })
                return currentCustomer
              }
              
              // Store the checkout data to restore after login
              const checkoutData = JSON.stringify(data)
              if (typeof window !== 'undefined') {
                localStorage.setItem('pendingCheckout', checkoutData)
                
                // Redirect to login page with return URL
                const returnUrl = encodeURIComponent(window.location.pathname)
                logInfo('Redirecting existing customer to login', {
                  email: data.billing_email,
                  returnUrl: window.location.pathname
                })
                window.location.href = `/login?returnUrl=${returnUrl}`
              }
              
              // Return a promise that never resolves since we're redirecting
              return new Promise(() => {})
            }
            
            throw new Error(`Failed to create customer: ${response.statusText} - ${errorText}`)
          }

          const customer = await response.json()
          console.log('Customer created successfully:', customer)
          
          // Store customer in both checkout and customer stores
          set({ customer, isNewAccountCreated: true })
          useCustomerStore.getState().setCustomer(customer)
          
          return customer
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create customer'
          console.error('Customer creation error:', errorMessage)
          // Don't set error in store for customer creation - it's not critical for checkout
          return null
        }
      },

      createOrder: async (data: CheckoutFormData) => {
        set({ isProcessing: true, error: null })
        
        try {
          // First, create or get customer
          const customer = await get().createOrUpdateCustomer(data)
          
          // Get cart items from local cart store
          const { items } = useLocalCartStore.getState()
          
          if (items.length === 0) {
            throw new Error('Cannot create order: Cart is empty')
          }

          // Convert cart items to WooCommerce line items format
          const line_items = items.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            name: item.product.name,
            price: item.product.price.toString(),
          }))

          // Prepare order data for WooCommerce
          const orderData = {
            customer_id: customer?.id || 0, // Use customer ID if available
            billing: {
              first_name: data.billing_first_name,
              last_name: data.billing_last_name,
              company: data.billing_company || '',
              address_1: data.billing_address_1,
              address_2: data.billing_address_2 || '',
              city: data.billing_city,
              state: data.billing_state,
              postcode: data.billing_postcode,
              country: data.billing_country,
              email: data.billing_email,
              phone: data.billing_phone,
            },
            shipping: data.shipping_to_different_address
              ? {
                  first_name: data.shipping_first_name || '',
                  last_name: data.shipping_last_name || '',
                  company: data.shipping_company || '',
                  address_1: data.shipping_address_1 || '',
                  address_2: data.shipping_address_2 || '',
                  city: data.shipping_city || '',
                  state: data.shipping_state || '',
                  postcode: data.shipping_postcode || '',
                  country: data.shipping_country || '',
                }
              : {
                  first_name: data.billing_first_name,
                  last_name: data.billing_last_name,
                  company: data.billing_company || '',
                  address_1: data.billing_address_1,
                  address_2: data.billing_address_2 || '',
                  city: data.billing_city,
                  state: data.billing_state,
                  postcode: data.billing_postcode,
                  country: data.billing_country,
                },
            payment_method: data.payment_method,
            customer_note: data.order_notes || '',
            line_items, // Add cart items to order
          }

          console.log('Creating order with data:', orderData)

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/orders`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(
                  `${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
                )}`,
              },
              body: JSON.stringify(orderData),
            }
          )

          if (!response.ok) {
            const errorText = await response.text()
            console.error('Order creation error:', errorText)
            throw new Error(`Failed to create order: ${response.statusText} - ${errorText}`)
          }

          const order = await response.json()
          console.log('Order created successfully:', order)
          
          // Clear cart after successful order creation
          const { clearCart } = useLocalCartStore.getState()
          clearCart()
          
          set({ order, isProcessing: false })
          return order
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create order'
          console.error('Checkout error:', errorMessage)
          set({ 
            error: errorMessage,
            isProcessing: false 
          })
          return null
        }
      },

      clearOrder: () => set({ order: null, customer: null, error: null, isNewAccountCreated: false }),
      clearError: () => set({ error: null }),
      setIsNewAccountCreated: (created: boolean) => set({ isNewAccountCreated: created }),
    }),
    {
      name: 'checkout-store',
    }
  )
)
