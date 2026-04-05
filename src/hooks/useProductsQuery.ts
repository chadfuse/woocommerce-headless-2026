import { useQuery } from '@tanstack/react-query'
import { woocommerce } from '@/lib/woocommerce'
import { WooCommerceProduct } from '@/types/woocommerce'

interface UseProductsParams {
  page?: number
  per_page?: number
  category?: number
  search?: string
  status?: string
}

export function useProductsQuery(params: UseProductsParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => woocommerce.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404s
      if (error instanceof Error && error.message.includes('404')) {
        return false
      }
      // Retry up to 3 times for other errors
      return failureCount < 3
    },
  })
}

export function useProductBySlugQuery(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => woocommerce.getProductBySlug(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes for single product
    enabled: !!slug, // Only run if slug is provided
  })
}

export function useCategoriesQuery(params: { hide_empty?: boolean } = {}) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => woocommerce.getCategories(params),
    staleTime: 30 * 60 * 1000, // 30 minutes for categories (rarely change)
  })
}
