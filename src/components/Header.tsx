'use client'

import Link from 'next/link'
import { CartIcon } from '@/components/CartIcon'
import { AccountIcon } from '@/components/AccountIcon'

interface HeaderProps {
  showAccount?: boolean
  showCart?: boolean
  title?: string
  showBackButton?: boolean
}

export function Header({ 
  showAccount = true, 
  showCart = true, 
  title = "Headless Store",
  showBackButton = false 
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                ← Back
              </Link>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {showAccount && <AccountIcon />}
            {showCart && <CartIcon />}
          </div>
        </div>
      </div>
    </header>
  )
}
