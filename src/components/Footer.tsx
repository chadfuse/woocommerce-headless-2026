import Link from 'next/link'

const SHOP_LINKS = [
  { label: 'All Products',   href: '/products' },
  { label: 'New Arrivals',   href: '/products' },
  { label: 'Best Sellers',   href: '/products' },
  { label: 'Sale',           href: '/products' },
]

const HELP_LINKS = [
  { label: 'About Us',       href: '/about' },
  { label: 'Contact',        href: '/contact' },
  { label: 'Shipping Info',  href: '/shipping' },
  { label: 'Returns',        href: '/returns' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A2E1A' }} className="text-white">
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white tracking-tight">
              Aquapure
            </Link>
            <p className="text-green-300 text-sm mt-3 leading-relaxed">
              Colder. Hotter. Longer.
            </p>
            <p className="text-green-400 text-xs mt-4 leading-relaxed">
              Premium stainless steel water bottles for every adventure.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2">
              {SHOP_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-green-300 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Help</h4>
            <ul className="space-y-2">
              {HELP_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-green-300 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-green-300 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-green-900 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-green-500 text-xs">© 2026 Aquapure. All rights reserved.</p>
          <p className="text-green-500 text-xs">Made with ❤️ for hydration enthusiasts</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
