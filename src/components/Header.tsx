'use client'

import Link from 'next/link'
import { CartIcon } from '@/components/CartIcon'
import { AccountIcon } from '@/components/AccountIcon'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home',     href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About',    href: '/about' },
  { label: 'Contact',  href: '/contact' },
]

interface HeaderProps {
  showAccount?: boolean
  showCart?: boolean
  title?: string
  showBackButton?: boolean
  variant?: 'light' | 'dark'
}

export function Header({ 
  showAccount = true, 
  showCart = true, 
  title = "Aquapure",
  showBackButton = false,
  variant = 'light'
}: HeaderProps) {
  const dark = variant === 'dark'
  return (
    <header className={cn(
      'border-b',
      dark ? 'bg-[#1E3A1E] border-green-900' : 'bg-white shadow-sm border-gray-200'
    )}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link href="/" className={cn(
                'flex items-center transition-colors text-sm',
                dark ? 'text-green-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              )}>
                ← Back
              </Link>
            )}
            <Link href="/" className={cn(
              'text-2xl font-bold tracking-tight',
              dark ? 'text-white' : 'text-gray-900'
            )}>
              {title}
            </Link>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  dark ? 'text-green-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showAccount && <AccountIcon />}
            {showCart && <CartIcon />}
          </div>
        </div>
      </div>
    </header>
  )
}
