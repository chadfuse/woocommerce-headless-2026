'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Trash2, Plus, Minus, X, ShoppingCart } from 'lucide-react'
import { useLocalCartStore } from '@/store/localCartStore'
import Link from 'next/link'

export function CartDrawer() {
  const {
    items,
    isOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    closeCart,
    getTotalItems,
    getTotal,
  } = useLocalCartStore()

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(String(price || '0')))
  }

  const handleUpdateQuantity = async (key: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(key)
    } else {
      updateQuantity(key, newQuantity)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
              {getTotalItems() > 0 && (
                <Badge variant="secondary">{getTotalItems()}</Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={closeCart}>
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-4">Add some products to get started!</p>
              <Link href="/">
                <Button onClick={closeCart}>Continue Shopping</Button>
              </Link>
            </div>
          )}

          {items.length > 0 && (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 p-4 border rounded-lg">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0].src}
                        alt={item.product.images[0].alt || item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">{formatPrice(item.product.price)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.key, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.key)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            <Separator />
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>

              <div className="space-y-2">
                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link href="/account" onClick={closeCart}>
                  <Button variant="outline" className="w-full">
                    My Account
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full" onClick={closeCart}>
                  Continue Shopping
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full text-red-600 hover:text-red-700"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
