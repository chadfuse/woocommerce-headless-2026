'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useCustomerStore } from '@/store/customerStore'
import { checkCustomerExists } from '@/lib/wordpressAuth'

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { customer, isAuthenticated, setCustomer } = useCustomerStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Check if user was redirected from checkout
  const isFromCheckout = searchParams.has('returnUrl')

  // If user is already logged in and accessing login page, redirect them
  useEffect(() => {
    if (isAuthenticated && customer) {
      const returnUrl = searchParams.get('returnUrl') || '/account'
      router.push(returnUrl)
    }
  }, [isAuthenticated, customer, router, searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      // Check if customer exists
      const customerExists = await checkCustomerExists(data.email)
      if (!customerExists) {
        throw new Error('No account found with this email')
      }

      // For demo purposes, accept any password for existing customers
      // In production, you would verify the actual password
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/customers?email=${data.email}`,
        {
          headers: {
            'Authorization': `Basic ${btoa(
              `${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
            )}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to authenticate')
      }

      const customers = await response.json()
      const customer = customers[0]

      if (customer) {
        setCustomer(customer)
        toast.success('Login successful!')
        
        // Check if there's pending checkout data and redirect accordingly
        const pendingCheckout = localStorage.getItem('pendingCheckout')
        if (pendingCheckout) {
          localStorage.removeItem('pendingCheckout')
          router.push('/checkout')
        } else {
          const returnUrl = searchParams.get('returnUrl') || '/account'
          router.push(returnUrl)
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Store
          </Link>
          <div className="text-center">
            <Mail className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
              </Link>
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="mt-1"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
                {isFromCheckout && (
                  <p className="mt-1 text-xs text-amber-600">
                    Don't know your password? Use the "Forgot password?" link below.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/products" className="font-medium text-blue-600 hover:text-blue-500">
                  Create one during checkout
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
