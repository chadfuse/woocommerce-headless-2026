'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getButtonClassName } from '@/lib/buttonStyles'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; errorInfo: React.ErrorInfo; reset: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Component Stack:', errorInfo.componentStack)
      console.groupEnd()
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    })

    // In production, you would send this to your error logging service
    this.logErrorToService(error, errorInfo)
  }

  logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
    // TODO: Send to error logging service (Sentry, LogRocket, etc.)
    // For now, just log to console
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // In development, show detailed error
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged to service:', errorData)
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // If custom fallback is provided, use it
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error!}
            errorInfo={this.state.errorInfo!}
            reset={this.reset}
          />
        )
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-red-900">Something went wrong</CardTitle>
              <CardDescription>
                We encountered an unexpected error. This has been logged and we'll look into it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Error Details (Development):</h4>
                  <p className="text-xs text-gray-600 mb-2">{this.state.error.message}</p>
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer">Stack Trace</summary>
                    <pre className="mt-2 whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  </details>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button onClick={this.reset} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Link 
  href="/"
  className={getButtonClassName('outline', 'default', 'flex-1')}
>
  <Home className="h-4 w-4 mr-2" />
  Home
</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.group('🚨 Manual Error Handler')
    console.error('Error:', error)
    if (errorInfo) {
      console.error('Error Info:', errorInfo)
    }
    console.groupEnd()

    // Log to service
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('Manual error logged:', errorData)
    }
  }
}

export default ErrorBoundary
