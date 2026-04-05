'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Time in milliseconds that data remains fresh
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Retry failed requests 3 times
        retry: 3,
        // Don't refetch on window focus (better UX)
        refetchOnWindowFocus: false,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getBrowserQueryClient() {
  if (!browserQueryClient) browserQueryClient = getQueryClient()
  return browserQueryClient
}

export function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: useState is used to avoid the QueryClient instance being shared between the server and the client
  // This allows us to use the same QueryClient instance across all server components
  const queryClient = getBrowserQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
