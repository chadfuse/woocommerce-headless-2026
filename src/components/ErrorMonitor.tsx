'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Bug, Trash2, Download, Eye, X } from 'lucide-react'
import { useErrorLogger } from '@/lib/errorLogger'

export function ErrorMonitor() {
  const { getRecentErrors, getSummary, clear } = useErrorLogger()
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState(getRecentErrors())
  const [summary, setSummary] = useState(getSummary())

  useEffect(() => {
    const interval = setInterval(() => {
      setErrors(getRecentErrors())
      setSummary(getSummary())
    }, 1000)

    return () => clearInterval(interval)
  }, [getRecentErrors, getSummary])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const handleClear = () => {
    clear()
    setErrors([])
    setSummary(getSummary())
  }

  const handleExport = () => {
    const data = {
      summary,
      errors,
      timestamp: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `error-logs-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant={summary.errors > 0 ? "destructive" : "outline"}
          size="sm"
          className="shadow-lg"
        >
          <Bug className="h-4 w-4 mr-2" />
          Errors ({summary.errors})
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Error Monitor
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Summary */}
          <div className="flex gap-2 mb-3">
            <Badge variant={summary.errors > 0 ? "destructive" : "secondary"}>
              {summary.errors} Errors
            </Badge>
            <Badge variant="secondary">
              {summary.warnings} Warnings
            </Badge>
            <Badge variant="secondary">
              {summary.info} Info
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleClear}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Error List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[60vh]">
          {errors.length === 0 ? (
            <div className="text-center py-8">
              <Bug className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No errors logged</p>
            </div>
          ) : (
            errors.map((error, index) => (
              <Card key={index} className="text-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm truncate">
                      {error.message}
                    </CardTitle>
                    <Badge 
                      variant={error.level === 'error' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {error.level}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {error.context && (
                    <div className="bg-gray-50 p-2 rounded text-xs mb-2">
                      <strong>Context:</strong>
                      <pre className="mt-1 whitespace-pre-wrap">
                        {JSON.stringify(error.context, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {error.stack && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                        <Eye className="h-3 w-3 inline mr-1" />
                        Stack Trace
                      </summary>
                      <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Development helper - show error count in console
if (process.env.NODE_ENV === 'development') {
  console.log('%c🐛 Error Monitor Active', 'color: #888; font-size: 12px;')
  console.log('Click the error button in the bottom-right corner to view error logs')
}
