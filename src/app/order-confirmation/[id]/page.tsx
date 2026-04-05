'use client'

import { useEffect, useState, use } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getButtonClassName } from '@/lib/buttonStyles'
import { CheckCircle, Package, Truck, CreditCard, ArrowLeft, Home, User } from 'lucide-react'
import Link from 'next/link'
import { WooCommerceOrder } from '@/types/woocommerce'
import { useCustomerStore } from '@/store/customerStore'
import { useCheckoutStore } from '@/store/checkoutStore'

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { customer, isAuthenticated } = useCustomerStore()
  const { isNewAccountCreated } = useCheckoutStore()
  const resolvedParams = use(params)
  const orderId = resolvedParams.id
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<WooCommerceOrder | null>(null)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/orders/${orderId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(
              `${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
            )}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.statusText}`)
      }

      const orderData = await response.json()
      setOrder(orderData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(String(price || '0')))
  }

  const calculateSubtotal = (order: WooCommerceOrder) => {
    return order.line_items.reduce((sum, item) => {
      return sum + parseFloat(item.subtotal || '0')
    }, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'processing':
        return 'bg-blue-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'on-hold':
        return 'bg-orange-500'
      case 'cancelled':
        return 'bg-red-500'
      case 'refunded':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'We couldn\'t find your order. Please check your order number or contact support.'}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/" className={getButtonClassName('outline', 'default')}>
              Go to Homepage
            </Link>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-4">
              Thank you for your order. We've received your order and will begin processing it shortly.
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge className={`${getStatusColor(order.status)} text-white`}>
                {getStatusText(order.status)}
              </Badge>
              <span className="text-sm text-gray-600">
                Order #{order.number}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Order placed on {new Date(order.date_created).toLocaleDateString()}
            </p>

            {/* Account Creation Success Message - Only for NEW customers */}
            {isNewAccountCreated && isAuthenticated && customer && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Account Created!</h3>
                    <p className="text-sm text-blue-700">
                      We've created an account for you with email {customer.email}. 
                      You can now track your orders and manage your account.
                    </p>
                  </div>
                </div>
                <Link href="/account" className={getButtonClassName('outline', 'default', 'mt-3')}>
                  View My Account
                </Link>
              </div>
            )}

            {/* Order Confirmation Message - For existing customers or when no new account was created */}
            {(!isNewAccountCreated || !isAuthenticated) && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Order Confirmed!</h3>
                    <p className="text-sm text-green-700">
                      Your order has been placed successfully. You can track your order status and manage your account.
                    </p>
                  </div>
                </div>
                {isAuthenticated && (
                  <Link href="/account" className={getButtonClassName('outline', 'default', 'mt-3')}>
                    View My Account
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.line_items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          {item.sku && (
                            <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.total)}</p>
                          <p className="text-sm text-gray-600">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping & Billing Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">
                        {order.shipping.first_name} {order.shipping.last_name}
                      </p>
                      {order.shipping.company && <p>{order.shipping.company}</p>}
                      <p>{order.shipping.address_1}</p>
                      {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
                      <p>
                        {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}
                      </p>
                      <p>{order.shipping.country}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Billing Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">
                        {order.billing.first_name} {order.billing.last_name}
                      </p>
                      {order.billing.company && <p>{order.billing.company}</p>}
                      <p>{order.billing.address_1}</p>
                      {order.billing.address_2 && <p>{order.billing.address_2}</p>}
                      <p>
                        {order.billing.city}, {order.billing.state} {order.billing.postcode}
                      </p>
                      <p>{order.billing.country}</p>
                      <p>{order.billing.email}</p>
                      <p>{order.billing.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Notes */}
              {order.customer_note && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{order.customer_note}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(calculateSubtotal(order))}</span>
                    </div>
                    
                    {order.shipping_total && parseFloat(order.shipping_total) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>{formatPrice(order.shipping_total)}</span>
                      </div>
                    )}
                    
                    {order.discount_total && parseFloat(order.discount_total) > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(order.discount_total)}</span>
                      </div>
                    )}
                    
                    {order.cart_tax && parseFloat(order.cart_tax) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>{formatPrice(order.cart_tax)}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payment Method</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {order.payment_method.replace('-', ' ')}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order Status</p>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Link href="/" className={getButtonClassName('default', 'default', 'w-full')}>
                      Continue Shopping
                    </Link>
                    <Link href="/account" className={getButtonClassName('outline', 'default', 'w-full')}>
                      View My Account
                    </Link>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-2">
                      Need help? Contact our support team
                    </p>
                    <Link href="/contact" className={getButtonClassName('ghost', 'sm')}>
                      Contact Support
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
