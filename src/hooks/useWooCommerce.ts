'use client'

import { useState, useEffect } from 'react'
import { woocommerce } from '@/lib/woocommerce'
import { WooCommerceProduct, WooCommerceCategory, WooCommerceOrder } from '@/types/woocommerce'

export function useProducts(params: {
  page?: number
  per_page?: number
  category?: number
  search?: string
  status?: string
} = {}) {
  const [products, setProducts] = useState<WooCommerceProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await woocommerce.getProducts(params)
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [JSON.stringify(params)])

  return { products, loading, error, refetch: fetchProducts }
}

export function useProductBySlug(slug: string) {
  const [product, setProduct] = useState<WooCommerceProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return

      try {
        setLoading(true)
        setError(null)
        const data = await woocommerce.getProductBySlug(slug)
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  return { product, loading, error }
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<WooCommerceProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return

      try {
        setLoading(true)
        setError(null)
        const data = await woocommerce.getProduct(id)
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  return { product, loading, error }
}

export function useCategories(params: {
  page?: number
  per_page?: number
  hide_empty?: boolean
} = {}) {
  const [categories, setCategories] = useState<WooCommerceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        setError(null)
        const data = await woocommerce.getCategories(params)
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [JSON.stringify(params)])

  return { categories, loading, error }
}

export function useOrders(params: {
  page?: number
  per_page?: number
  customer?: number
  status?: string
} = {}) {
  const [orders, setOrders] = useState<WooCommerceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        setError(null)
        const data = await woocommerce.getOrders(params)
        setOrders(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [JSON.stringify(params)])

  return { orders, loading, error }
}

export function useCart() {
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await woocommerce.getCart()
      setCart(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      await woocommerce.addToCart(productId, quantity)
      await fetchCart() // Refresh cart after adding
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart')
      throw err
    }
  }

  const removeFromCart = async (key: string) => {
    try {
      await woocommerce.removeFromCart(key)
      await fetchCart() // Refresh cart after removing
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from cart')
      throw err
    }
  }

  const updateCart = async (key: string, quantity: number) => {
    try {
      await woocommerce.updateCart(key, quantity)
      await fetchCart() // Refresh cart after updating
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart')
      throw err
    }
  }

  return { 
    cart, 
    loading, 
    error, 
    addToCart, 
    removeFromCart, 
    updateCart, 
    refetch: fetchCart 
  }
}
