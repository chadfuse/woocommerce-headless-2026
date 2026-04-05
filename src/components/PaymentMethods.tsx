'use client'

import { useQuery } from '@tanstack/react-query'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Smartphone, Truck, FileText } from 'lucide-react'

interface PaymentMethod {
  id: string
  title: string
  description: string
  enabled: boolean
  icon?: string
}

// Mock data - replace with real API call
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'cod',
    title: 'Cash on Delivery',
    description: 'Pay with cash upon delivery',
    enabled: true,
  },
  {
    id: 'bacs',
    title: 'Direct Bank Transfer',
    description: 'Make payment directly into our bank account',
    enabled: true,
  },
  {
    id: 'cheque',
    title: 'Cheque Payment',
    description: 'Send cheque to our business address',
    enabled: false,
  },
  {
    id: 'stripe',
    title: 'Credit Card (Stripe)',
    description: 'Pay with Visa, Mastercard, or other credit cards',
    enabled: true,
  },
  {
    id: 'paypal',
    title: 'PayPal',
    description: 'Pay with PayPal or credit card',
    enabled: true,
  },
  {
    id: 'paymongo',
    title: 'PayMongo',
    description: 'Pay via PayMongo — cards, GCash, Maya & more',
    enabled: true,
  },
]

// Real API call function
async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/payment_gateways`,
      {
        headers: {
          'Authorization': `Basic ${btoa(
            `${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
          )}`,
        },
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch payment methods')
    }
    
    const methods = await response.json()
    return methods.filter((method: any) => method.enabled)
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    // Fallback to mock data for development
    return mockPaymentMethods.filter(method => method.enabled)
  }
}

interface PaymentMethodsProps {
  value?: string
  onValueChange?: (value: string) => void
}

export function PaymentMethods({ value, onValueChange }: PaymentMethodsProps) {
  const { data: paymentMethods, isLoading, error } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: fetchPaymentMethods,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Loading payment options...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Unable to load payment options</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">Please refresh the page and try again.</p>
        </CardContent>
      </Card>
    )
  }

  const getPaymentIcon = (methodId: string) => {
    switch (methodId) {
      case 'cod':
        return <Truck className="h-5 w-5" />
      case 'stripe':
        return <CreditCard className="h-5 w-5" />
      case 'paypal':
        return <Smartphone className="h-5 w-5" />
      case 'bacs':
      case 'cheque':
        return <FileText className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Select how you would like to pay</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={onValueChange}>
          <div className="space-y-3">
            {paymentMethods?.map((method) => (
              <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label htmlFor={method.id} className="flex items-center space-x-3 cursor-pointer flex-1">
                  <div className="flex-shrink-0">
                    {getPaymentIcon(method.id)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{method.title}</div>
                    {method.description && (
                      <div className="text-sm text-gray-600">{method.description}</div>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

// Helper function to get payment method title
export function getPaymentMethodTitle(methodId: string): string {
  const method = mockPaymentMethods.find(m => m.id === methodId)
  return method?.title || methodId || 'Payment Method'
}
