import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface Customer {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
  username: string
  phone?: string
  billing?: {
    first_name: string
    last_name: string
    company?: string
    address_1: string
    address_2?: string
    city: string
    state: string
    postcode: string
    country: string
    email: string
    phone?: string
  }
  shipping?: {
    first_name: string
    last_name: string
    company?: string
    address_1: string
    address_2?: string
    city: string
    state: string
    postcode: string
    country: string
  }
}

interface CustomerStore {
  customer: Customer | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setCustomer: (customer: Customer | null) => void
  logout: () => void
  clearError: () => void
}

export const useCustomerStore = create<CustomerStore>()(
  devtools(
    persist(
      (set) => ({
        customer: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        setCustomer: (customer) => {
          set({
            customer,
            isAuthenticated: !!customer,
            error: null,
          })
        },

        logout: () => {
          set({
            customer: null,
            isAuthenticated: false,
            error: null,
          })
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'customer-storage',
      }
    ),
    {
      name: 'customer-store',
    }
  )
)
