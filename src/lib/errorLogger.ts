// Global Error Logging System

interface ErrorLog {
  message: string
  stack?: string
  componentStack?: string
  timestamp: string
  userAgent: string
  url: string
  level: 'error' | 'warning' | 'info'
  context?: Record<string, any>
}

class ErrorLogger {
  private logs: ErrorLog[] = []
  private maxLogs = 100 // Keep only last 100 errors

  log(error: Error | string, level: 'error' | 'warning' | 'info' = 'error', context?: Record<string, any>) {
    const errorLog: ErrorLog = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : 'Server',
      level,
      context,
    }

    // Add to logs
    this.logs.push(errorLog)

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Log to console with styling
    this.consoleLog(errorLog)

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToService(errorLog)
    }
  }

  private consoleLog(errorLog: ErrorLog) {
    const style = {
      error: 'background: #ff4444; color: white; padding: 2px 4px; border-radius: 2px;',
      warning: 'background: #ffaa00; color: white; padding: 2px 4px; border-radius: 2px;',
      info: 'background: #4488ff; color: white; padding: 2px 4px; border-radius: 2px;',
    }

    console.log(
      `%c${errorLog.level.toUpperCase()}%c ${errorLog.message}`,
      style[errorLog.level],
      'color: inherit;'
    )

    if (errorLog.context) {
      console.log('Context:', errorLog.context)
    }

    if (errorLog.stack && process.env.NODE_ENV === 'development') {
      console.log('Stack:', errorLog.stack)
    }
  }

  private sendToService(errorLog: ErrorLog) {
    // TODO: Send to your error logging service
    // Examples: Sentry, LogRocket, custom endpoint
    try {
      // Example: Send to custom endpoint
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
      }).catch(() => {
        // Silently fail if error logging fails
      })
    } catch (e) {
      // Silently fail if error logging fails
    }
  }

  // Get recent errors
  getRecentErrors(count = 10): ErrorLog[] {
    return this.logs.slice(-count)
  }

  // Clear all logs
  clear() {
    this.logs = []
  }

  // Get error summary
  getSummary() {
    const summary = {
      total: this.logs.length,
      errors: this.logs.filter(log => log.level === 'error').length,
      warnings: this.logs.filter(log => log.level === 'warning').length,
      info: this.logs.filter(log => log.level === 'info').length,
      recent: this.getRecentErrors(5),
    }
    return summary
  }
}

// Global instance
export const errorLogger = new ErrorLogger()

// Convenience functions
export const logError = (error: Error | string, context?: Record<string, any>) => {
  errorLogger.log(error, 'error', context)
}

export const logWarning = (message: string, context?: Record<string, any>) => {
  errorLogger.log(message, 'warning', context)
}

export const logInfo = (message: string, context?: Record<string, any>) => {
  errorLogger.log(message, 'info', context)
}

// Hook for React components
export function useErrorLogger() {
  return {
    logError,
    logWarning,
    logInfo,
    getRecentErrors: () => errorLogger.getRecentErrors(),
    getSummary: () => errorLogger.getSummary(),
    clear: () => errorLogger.clear(),
  }
}

// Global error handlers
if (typeof window !== 'undefined') {
  // Handle unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    logError(event.error || new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      type: 'unhandled_error',
    })
  })

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason || new Error('Unhandled promise rejection'), {
      type: 'unhandled_rejection',
    })
  })
}

export default errorLogger
