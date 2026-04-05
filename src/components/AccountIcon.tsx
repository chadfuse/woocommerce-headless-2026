'use client'

import { useCustomerStore } from '@/store/customerStore'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import Link from 'next/link'

export function AccountIcon() {
  const { customer, isAuthenticated } = useCustomerStore()

  if (isAuthenticated && customer) {
    return (
      <Link href="/account" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 relative">
        <User className="h-4 w-4" />
        {customer.first_name && (
          <span className="ml-2 hidden sm:inline text-sm">
            {customer.first_name}
          </span>
        )}
      </Link>
    )
  }

  return (
    <Link href="/account" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
      <User className="h-4 w-4" />
      <span className="ml-2 hidden sm:inline text-sm">Account</span>
    </Link>
  )
}
