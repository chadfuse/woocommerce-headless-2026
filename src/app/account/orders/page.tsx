'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Package } from 'lucide-react'
import Link from 'next/link'

export default function OrdersPage() {
  // Mock data - in real app, this would come from API
  const orders = [
    {
      id: '12345',
      date: '2024-01-15',
      status: 'completed',
      total: 129.99,
      items: [
        {
          name: 'Sample Product',
          quantity: 2,
          price: 64.99,
          image: '/placeholder-product.jpg'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/account" className="hover:text-blue-600">Account</Link>
            <span>/</span>
            <span className="text-gray-900">Orders</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Order History</h1>
          <p className="text-gray-600 mt-2">View and track your past orders</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">When you place your first order, it will appear here.</p>
              <Link 
  href="/products"
  className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 h-8 gap-1.5 px-2.5 hover:bg-primary/80"
>
  Start Shopping
</Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <CardDescription>Placed on {order.date}</CardDescription>
                    </div>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.price}</p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-lg">${order.total}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline">View Details</Button>
                      <Button variant="outline">Track Order</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
