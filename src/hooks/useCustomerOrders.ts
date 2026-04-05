import { useState, useEffect } from 'react'
import { WooCommerceOrder } from '@/types/woocommerce'

export function useCustomerOrders(customerId?: number) {
  const [orders, setOrders] = useState<WooCommerceOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    if (!customerId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/orders?customer=${customerId}`,
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
        throw new Error(`Failed to fetch orders: ${response.statusText}`)
      }

      const ordersData = await response.json()
      setOrders(ordersData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [customerId])

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  }
}
