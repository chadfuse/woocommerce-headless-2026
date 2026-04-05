'use client'

import { useLocalCartStore } from '@/store/localCartStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'

export function CartIcon() {
  const { getTotalItems, isOpen, toggleCart } = useLocalCartStore()
  const [isBouncing, setIsBouncing] = useState(false)
  const [prevTotal, setPrevTotal] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const totalItems = getTotalItems()

  useEffect(() => {
    if (totalItems > prevTotal) {
      setIsBouncing(true)
      setTimeout(() => setIsBouncing(false), 600)
    }
    setPrevTotal(totalItems)
  }, [totalItems, prevTotal])

  return (
    <Button variant="outline" size="sm" onClick={toggleCart} className="relative">
      <ShoppingCart className={`h-4 w-4 transition-transform ${
        isBouncing ? 'animate-bounce' : ''
      }`} />
      {mounted && totalItems > 0 && (
        <Badge 
          variant="destructive" 
          className={`absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs transition-all ${
            isBouncing ? 'scale-125' : 'scale-100'
          }`}
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  )
}
