'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CreditCard, Lock, User } from 'lucide-react'

interface PaymentFormsProps {
  selectedMethod: string
}

export function PaymentForms({ selectedMethod }: PaymentFormsProps) {
  const renderStripeForm = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Credit Card Details
        </CardTitle>
        <CardDescription>
          Your payment information is encrypted and secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="pl-10"
                  required
                />
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <div className="relative">
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  className="pl-10"
                  required
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expiryMonth">Expiry Month</Label>
              <select
                id="expiryMonth"
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">MM</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={String(i + 1).padStart(2, '0')}>
                    {String(i + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="expiryYear">Expiry Year</Label>
              <select
                id="expiryYear"
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">YYYY</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={new Date().getFullYear() + i}>
                    {new Date().getFullYear() + i}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <div className="relative">
                <Input
                  id="cvv"
                  placeholder="123"
                  maxLength={4}
                  className="pl-10"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="h-4 w-4" />
              <span>Your payment information is encrypted and secure. We never store your card details.</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderPayPalForm = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          PayPal Payment
        </CardTitle>
        <CardDescription>
          You will be redirected to PayPal to complete your payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">PayPal Checkout</h4>
                <p className="text-sm text-blue-700">
                  Pay with PayPal, credit card, or debit card
                </p>
              </div>
            </div>
          </div>
          
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Pay with PayPal
            </div>
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            After clicking, you'll be redirected to PayPal to complete your payment securely.
          </p>
        </div>
      </CardContent>
    </Card>
  )

  const renderBankTransferForm = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Direct Bank Transfer Instructions
        </CardTitle>
        <CardDescription>
          Please transfer the payment to our bank account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Bank Details:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Bank Name:</span>
                <span>Example Bank</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Account Name:</span>
                <span>Your Store Name</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Account Number:</span>
                <span>1234567890</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Routing Number:</span>
                <span>987654321</span>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Important:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Please include your order number in the transfer reference</li>
              <li>• Orders will be processed once payment is confirmed</li>
              <li>• Payment confirmation may take 1-2 business days</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCashOnDeliveryForm = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Cash on Delivery
        </CardTitle>
        <CardDescription>
          Pay with cash when your order is delivered
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Pay on Delivery</h4>
                <p className="text-sm text-green-700">
                  No payment required now. Pay with cash when you receive your order.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What to Expect:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Have the exact amount ready</li>
              <li>• Driver will provide receipt</li>
              <li>• Please inspect items before paying</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Render the appropriate payment form based on selected method
  switch (selectedMethod) {
    case 'stripe':
      return renderStripeForm()
    case 'paypal':
      return renderPayPalForm()
    case 'bacs':
    case 'cheque':
      return renderBankTransferForm()
    case 'cod':
      return renderCashOnDeliveryForm()
    case 'paymongo':
      return (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              PayMongo
            </CardTitle>
            <CardDescription>
              Pay securely via PayMongo — cards, GCash, Maya &amp; more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              You will be redirected to PayMongo to complete your payment securely.
            </div>
          </CardContent>
        </Card>
      )
    default:
      return (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {selectedMethod}
            </CardTitle>
            <CardDescription>
              Complete your payment using the selected method.
            </CardDescription>
          </CardHeader>
        </Card>
      )
  }
}
