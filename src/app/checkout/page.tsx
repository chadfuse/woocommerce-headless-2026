'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { checkoutSchema } from '@/lib/checkoutSchema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { PaymentMethods } from '@/components/PaymentMethods'
import { PaymentForms } from '@/components/PaymentForms'
import { ArrowLeft, Truck, CreditCard, User, MapPin, Phone, Mail, FileText, Package, ShoppingCart } from 'lucide-react'
import { useCheckoutStore } from '@/store/checkoutStore'
import { useLocalCartStore } from '@/store/localCartStore'
import { useCustomerStore } from '@/store/customerStore'
import { toast } from 'sonner'
import Link from 'next/link'
import { CheckoutFormData } from '@/lib/checkoutSchema'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useLocalCartStore()
  const { createOrder, order, isProcessing, error } = useCheckoutStore()
  const { customer, isAuthenticated } = useCustomerStore()
  const [isMounted, setIsMounted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
    getValues,
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onSubmit', // Only validate on submit
    defaultValues: {
      billing_country: 'US',
      shipping_country: 'US',
      payment_method: 'cod',
      shipping_to_different_address: false,
      terms: false,
    },
  })

  const shippingToDifferentAddress = watch('shipping_to_different_address')
  const paymentMethod = watch('payment_method')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (order) {
      router.push(`/order-confirmation/${order.id}`)
    }
  }, [order, router])

  // Auto-populate form with customer data when logged in
  useEffect(() => {
    if (isAuthenticated && customer && isMounted) {
      // Populate billing information
      if (customer.first_name) setValue('billing_first_name', customer.first_name)
      if (customer.last_name) setValue('billing_last_name', customer.last_name)
      if (customer.email) setValue('billing_email', customer.email)
      if (customer.phone) setValue('billing_phone', customer.phone)
      
      // Populate billing address if available
      if (customer.billing) {
        if (customer.billing.company) setValue('billing_company', customer.billing.company)
        if (customer.billing.address_1) setValue('billing_address_1', customer.billing.address_1)
        if (customer.billing.address_2) setValue('billing_address_2', customer.billing.address_2)
        if (customer.billing.city) setValue('billing_city', customer.billing.city)
        if (customer.billing.state) setValue('billing_state', customer.billing.state)
        if (customer.billing.postcode) setValue('billing_postcode', customer.billing.postcode)
        if (customer.billing.country) setValue('billing_country', customer.billing.country)
        if (customer.billing.phone) setValue('billing_phone', customer.billing.phone)
      }
      
      // Populate shipping address if available and different from billing
      if (customer.shipping) {
        if (customer.shipping.first_name) setValue('shipping_first_name', customer.shipping.first_name)
        if (customer.shipping.last_name) setValue('shipping_last_name', customer.shipping.last_name)
        if (customer.shipping.company) setValue('shipping_company', customer.shipping.company)
        if (customer.shipping.address_1) setValue('shipping_address_1', customer.shipping.address_1)
        if (customer.shipping.address_2) setValue('shipping_address_2', customer.shipping.address_2)
        if (customer.shipping.city) setValue('shipping_city', customer.shipping.city)
        if (customer.shipping.state) setValue('shipping_state', customer.shipping.state)
        if (customer.shipping.postcode) setValue('shipping_postcode', customer.shipping.postcode)
        if (customer.shipping.country) setValue('shipping_country', customer.shipping.country)
      }
    }
  }, [customer, isAuthenticated, isMounted, setValue])

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(String(price || '0')))
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const onSubmit = async (data: CheckoutFormData) => {
    console.log('Form submitted:', data)
    const orderResult = await createOrder(data)
    if (orderResult) {
      console.log('Order created successfully:', orderResult)
    }
  }

  const copyBillingToShipping = () => {
    const billingData = {
      shipping_first_name: getValues('billing_first_name'),
      shipping_last_name: getValues('billing_last_name'),
      shipping_company: getValues('billing_company'),
      shipping_address_1: getValues('billing_address_1'),
      shipping_address_2: getValues('billing_address_2'),
      shipping_city: getValues('billing_city'),
      shipping_state: getValues('billing_state'),
      shipping_postcode: getValues('billing_postcode'),
      shipping_country: getValues('billing_country'),
    }
    
    Object.entries(billingData).forEach(([key, value]) => {
      setValue(key as keyof CheckoutFormData, value || '')
    })
  }

  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
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
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some products to proceed with checkout</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
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
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Billing Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Billing Information
                    {isAuthenticated && customer && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Auto-filled
                      </span>
                    )}
                  </CardTitle>
                  {isAuthenticated && customer && (
                    <CardDescription>
                      Your account information has been pre-filled. Please verify and complete any missing details.
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billing_first_name">First Name *</Label>
                      <Input
                        id="billing_first_name"
                        {...register('billing_first_name')}
                        className={errors.billing_first_name ? 'border-red-500' : ''}
                      />
                      {errors.billing_first_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.billing_first_name.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="billing_last_name">Last Name *</Label>
                      <Input
                        id="billing_last_name"
                        {...register('billing_last_name')}
                        className={errors.billing_last_name ? 'border-red-500' : ''}
                      />
                      {errors.billing_last_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.billing_last_name.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="billing_company">Company (Optional)</Label>
                    <Input id="billing_company" {...register('billing_company')} />
                  </div>

                  <div>
                    <Label htmlFor="billing_address_1">Address *</Label>
                    <Input
                      id="billing_address_1"
                      {...register('billing_address_1')}
                      className={errors.billing_address_1 ? 'border-red-500' : ''}
                    />
                    {errors.billing_address_1 && (
                      <p className="text-red-500 text-sm mt-1">{errors.billing_address_1.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="billing_address_2">Apartment, suite, etc. (Optional)</Label>
                    <Input id="billing_address_2" {...register('billing_address_2')} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="billing_city">City *</Label>
                      <Input
                        id="billing_city"
                        {...register('billing_city')}
                        className={errors.billing_city ? 'border-red-500' : ''}
                      />
                      {errors.billing_city && (
                        <p className="text-red-500 text-sm mt-1">{errors.billing_city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="billing_state">State *</Label>
                      <Input
                        id="billing_state"
                        {...register('billing_state')}
                        className={errors.billing_state ? 'border-red-500' : ''}
                      />
                      {errors.billing_state && (
                        <p className="text-red-500 text-sm mt-1">{errors.billing_state.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="billing_postcode">Postal Code *</Label>
                      <Input
                        id="billing_postcode"
                        {...register('billing_postcode')}
                        className={errors.billing_postcode ? 'border-red-500' : ''}
                      />
                      {errors.billing_postcode && (
                        <p className="text-red-500 text-sm mt-1">{errors.billing_postcode.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billing_email">Email *</Label>
                      <Input
                        id="billing_email"
                        type="email"
                        {...register('billing_email')}
                        className={errors.billing_email ? 'border-red-500' : ''}
                      />
                      {errors.billing_email && (
                        <p className="text-red-500 text-sm mt-1">{errors.billing_email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="billing_phone">Phone Number *</Label>
                      <Input
                        id="billing_phone"
                        {...register('billing_phone')}
                        className={errors.billing_phone ? 'border-red-500' : ''}
                      />
                      {errors.billing_phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.billing_phone.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shipping_to_different_address"
                      checked={watch('shipping_to_different_address') || false}
                      onCheckedChange={(checked) => setValue('shipping_to_different_address', checked as boolean)}
                    />
                    <Label htmlFor="shipping_to_different_address">
                      Ship to a different address
                    </Label>
                  </div>

                  {watch('shipping_to_different_address') && (
                    <div className="space-y-4 border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shipping_first_name">First Name</Label>
                          <Input
                            id="shipping_first_name"
                            {...register('shipping_first_name')}
                            placeholder="Optional"
                          />
                        </div>
                        <div>
                          <Label htmlFor="shipping_last_name">Last Name</Label>
                          <Input
                            id="shipping_last_name"
                            {...register('shipping_last_name')}
                            placeholder="Optional"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="shipping_address_1">Address</Label>
                        <Input
                          id="shipping_address_1"
                          {...register('shipping_address_1')}
                          placeholder="Optional"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="shipping_city">City</Label>
                          <Input
                            id="shipping_city"
                            {...register('shipping_city')}
                            placeholder="Optional"
                          />
                        </div>
                        <div>
                          <Label htmlFor="shipping_state">State</Label>
                          <Input
                            id="shipping_state"
                            {...register('shipping_state')}
                            placeholder="Optional"
                          />
                        </div>
                        <div>
                          <Label htmlFor="shipping_postcode">Postal Code</Label>
                          <Input
                            id="shipping_postcode"
                            {...register('shipping_postcode')}
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <PaymentMethods 
                value={watch('payment_method')} 
                onValueChange={(value) => setValue('payment_method', value || '')}
              />
              {errors.payment_method && (
                <p className="text-red-500 text-sm mt-1">{errors.payment_method.message}</p>
              )}

              {/* Payment Form */}
              <PaymentForms selectedMethod={watch('payment_method')} />

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    id="order_notes"
                    rows={4}
                    className="w-full p-3 border rounded-md resize-none"
                    placeholder="Special instructions for your order..."
                    {...register('order_notes')}
                  />
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card className="border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      onCheckedChange={(checked) => setValue('terms', checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the terms and conditions. By placing this order, I agree to the
                      store's terms of service and privacy policy.
                      <span className="text-red-600 ml-1">*</span>
                    </Label>
                  </div>
                  {errors.terms && (
                    <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.key} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0">
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
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(parseFloat(item.product.price) * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Order Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(getTotal())}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(getTotal())}</span>
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    className="w-full transition-all duration-200"
                    size="lg"
                    disabled={isProcessing}
                    variant={isProcessing ? "outline" : "default"}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By placing this order, you agree to our terms of service
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
