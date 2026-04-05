'use client'

import { useState } from 'react'
import { useCustomerStore } from '@/store/customerStore'
import { useCustomerOrders } from '@/hooks/useCustomerOrders'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getButtonClassName } from '@/lib/buttonStyles'
import { Package, User, MapPin, CreditCard, LogOut, ShoppingBag, ArrowLeft, Mail, Phone, Calendar, Truck } from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders')
  const { customer, isAuthenticated, logout } = useCustomerStore()
  const { orders, loading, error } = useCustomerOrders(customer?.id)

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(String(price || '0')))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isAuthenticated || !customer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Logged In</h1>
            <p className="text-gray-600 mb-6">
              Please log in to view your account information.
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/login" className={getButtonClassName('default', 'default', 'w-full')}>
              Log In
            </Link>
            <Link href="/" className={getButtonClassName('outline', 'default', 'w-full')}>
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Store
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your orders, profile, and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-gray-500" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    {customer?.first_name} {customer?.last_name}
                  </h3>
                  <p className="text-gray-600 text-sm">{customer?.email}</p>
                  {customer?.phone && (
                    <p className="text-gray-600 text-sm">{customer.phone}</p>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                    className="mt-4 w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Order History
                    </CardTitle>
                    <CardDescription>
                      View and track your recent orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-20 bg-gray-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : error ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">{error}</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-6">
                          You haven't placed any orders yet. Start shopping to see your order history here.
                        </p>
                        <Link href="/products" className={getButtonClassName('default', 'default')}>
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-semibold">Order #{order.number}</h4>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.date_created).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                                <p className="font-semibold mt-1">{formatPrice(order.total)}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {order.line_items?.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                  <span>{item.name} x {item.quantity}</span>
                                  <span>{formatPrice(item.price)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                              <Link 
                              href={`/order-confirmation/${order.id}`}
                              className={getButtonClassName('default', 'sm')}
                            >
                              View Order Details
                            </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Manage your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>First Name</Label>
                        <Input value={customer?.first_name || ''} disabled />
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <Input value={customer?.last_name || ''} disabled />
                      </div>
                    </div>
                    <div>
                      <Label>Email Address</Label>
                      <Input 
                        type="email" 
                        value={customer?.email || ''} 
                        disabled 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input 
                        type="tel" 
                        value={customer?.phone || ''} 
                        disabled 
                        className="mt-1"
                        placeholder="No phone number provided"
                      />
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-gray-600">
                        To update your profile information, please contact customer support.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Addresses
                    </CardTitle>
                    <CardDescription>
                      Manage your billing and shipping addresses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Billing Address */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Billing Address
                        </h4>
                        {customer?.billing ? (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium">
                              {customer.billing.first_name} {customer.billing.last_name}
                            </p>
                            {customer.billing.company && (
                              <p className="text-gray-600">{customer.billing.company}</p>
                            )}
                            <p className="text-gray-600">
                              {customer.billing.address_1}
                              {customer.billing.address_2 && `, ${customer.billing.address_2}`}
                            </p>
                            <p className="text-gray-600">
                              {customer.billing.city}, {customer.billing.state} {customer.billing.postcode}
                            </p>
                            <p className="text-gray-600">{customer.billing.country}</p>
                            {customer.billing.phone && (
                              <p className="text-gray-600">{customer.billing.phone}</p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">No billing address on file</p>
                          </div>
                        )}
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Shipping Address
                        </h4>
                        {customer?.shipping ? (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium">
                              {customer.shipping.first_name} {customer.shipping.last_name}
                            </p>
                            {customer.shipping.company && (
                              <p className="text-gray-600">{customer.shipping.company}</p>
                            )}
                            <p className="text-gray-600">
                              {customer.shipping.address_1}
                              {customer.shipping.address_2 && `, ${customer.shipping.address_2}`}
                            </p>
                            <p className="text-gray-600">
                              {customer.shipping.city}, {customer.shipping.state} {customer.shipping.postcode}
                            </p>
                            <p className="text-gray-600">{customer.shipping.country}</p>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">No shipping address on file</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
                
