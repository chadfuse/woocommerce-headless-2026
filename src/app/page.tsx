'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/hooks/useWooCommerce'
import { ProductCard } from '@/components/ProductCard'
import { Star, ShieldCheck, Thermometer, Leaf, Droplets, Check } from 'lucide-react'

export default function HomePage() {
  const { products, loading } = useProducts({ per_page: 3 })

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── 1. HERO ── */}
      <section
        className="relative min-h-[580px] flex items-center overflow-hidden"
        style={{ backgroundColor: '#1E3A1E' }}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&h=900&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
        </div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                Have Colder.<br />Hotter.<br />Longer.
              </h1>
              <p className="text-green-200 text-lg mb-8 max-w-md leading-relaxed">
                Premium stainless steel water bottles designed to keep your beverages at the perfect temperature, all day long.
              </p>
              <Link href="/products">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-full text-base">
                  Explore
                </Button>
              </Link>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=380&h=560&fit=crop"
                alt="Premium Water Bottle"
                className="h-80 md:h-96 object-contain drop-shadow-2xl rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURES BAR ── */}
      <section className="py-8 bg-green-50 border-b border-green-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, label: 'BPA Free Material' },
              { icon: Thermometer, label: 'Temperature Control' },
              { icon: Leaf,        label: 'Eco Friendly' },
              { icon: Droplets,    label: 'Leak Proof Design' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2 py-2">
                <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-green-700" />
                </div>
                <span className="text-sm font-medium text-green-900">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PRODUCT INTRO TEXT ── */}
      <section className="pt-14 pb-6 bg-white">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <p className="text-gray-700 text-lg leading-relaxed">
            Get the attraction with our bottles of stainless steel! BPA free &amp; non-toxic in stainless
            steel water bottles come in chilly &amp; unique designs.
          </p>
        </div>
      </section>

      {/* ── 4. PRODUCTS GRID ── */}
      <section className="pb-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-80" />
                ))
              : products.slice(0, 3).map((product) => (
                  <ProductCard key={product.id} product={product} viewMode="grid" />
                ))}
          </div>
        </div>
      </section>

      {/* ── 5. SPLIT: Shop all | Testimonial ── */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shop all card */}
            <div className="relative rounded-2xl overflow-hidden min-h-[320px]">
              <img
                src="https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=700&h=450&fit=crop"
                alt="Shop all products"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-8 left-8">
                <Link href="/products">
                  <Button className="bg-green-700 hover:bg-green-800 text-white rounded-full px-6">
                    Shop all
                  </Button>
                </Link>
              </div>
            </div>
            {/* Testimonial card */}
            <div className="bg-green-800 rounded-2xl p-8 flex flex-col justify-center text-white">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-green-100 text-lg italic mb-6 leading-relaxed">
                &ldquo;These water bottles are absolutely amazing! They keep my drinks cold for over 24 hours
                and hot for 12. The design is elegant and unique. Won&apos;t buy from anyone else!&rdquo;
              </p>
              <p className="font-semibold text-amber-400">— Caroline White</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. THE GAME CHANGER ── */}
      <section className="py-20 bg-neutral-950">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                The game<br />changer
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Revolutionary thermal technology that changes the way you hydrate.
              </p>
              <Link href="/products">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-full px-6">
                  Shop
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400&h=500&fit=crop"
                alt="The game changer bottle"
                className="h-80 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. THE TRAVEL MAJESTY ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                The travel<br />majesty
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Engineered for every adventure. Whether you&apos;re hiking mountains or commuting through
                the city, our bottles are your perfect companion.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Keeps cold 24 hours, hot 12 hours',
                  '100% BPA free & non-toxic',
                  'Fits standard car cup holders',
                  'Lifetime warranty included',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/products">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-8">
                  Shop Now
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=500&fit=crop"
                alt="Travel majesty bottle"
                className="h-96 object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. BRAND PARTNERS ── */}
      <section className="py-12" style={{ backgroundColor: '#C9C040' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 items-center text-center">
            {[
              { name: 'vertrio',  sub: 'Premium Partner' },
              { name: 'happers', sub: 'Trusted Supplier' },
              { name: 'Cugrey',  sub: 'Official Partner' },
            ].map(({ name, sub }) => (
              <div key={name}>
                <p className="text-2xl font-bold text-green-900">{name}</p>
                <p className="text-green-800 text-sm mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. LATEST BLOGS ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Latest blogs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                img:   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=260&fit=crop',
                title: 'Best Practices for Staying Hydrated',
                date:  'March 15, 2026',
              },
              {
                img:   'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=260&fit=crop',
                title: 'Why Stainless Steel is Better for You',
                date:  'March 10, 2026',
              },
              {
                img:   'https://images.unsplash.com/photo-1473223987666-c53f8bc5ad4e?w=400&h=260&fit=crop',
                title: 'Top Hiking Essentials for 2026',
                date:  'March 5, 2026',
              },
              {
                img:   'https://images.unsplash.com/photo-1566655077428-5f5a01c9c3b0?w=400&h=260&fit=crop',
                title: 'The Science of Temperature Retention',
                date:  'February 28, 2026',
              },
            ].map((post) => (
              <Link key={post.title} href="#" className="group">
                <div className="rounded-xl overflow-hidden mb-3">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs text-gray-400 mb-1">{post.date}</p>
                <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors text-sm leading-snug">
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. INSTAGRAM GRID ── */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <p className="text-green-700 font-medium text-sm">@aquapure</p>
            <h2 className="text-2xl font-bold text-gray-900">Follow Us on Instagram</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              'https://images.unsplash.com/photo-1612690660723-f0ae11e55dd4?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1616279967983-ec413476e824?w=300&h=300&fit=crop',
            ].map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={src}
                  alt={`Instagram post ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
