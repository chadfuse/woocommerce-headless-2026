'use client'

import { useEffect } from 'react'
import { performanceMonitor } from '@/lib/performance'

interface PerformanceMetrics {
  domContentLoaded: number
  loadComplete: number
  firstPaint: number
  firstContentfulPaint: number
}

export function PerformanceMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Monitor component renders
      const originalLog = console.log
      console.log = (...args) => {
        if (args[0]?.includes?.('render time:')) {
          const componentName = args[0]?.split(' ')[0]
          const renderTime = parseFloat(args[0]?.split(' ').pop()?.replace('ms', '') || '0')
          
          if (renderTime > 16) { // Warn if render takes longer than one frame
            console.warn(`⚠️ Slow render detected: ${componentName} took ${renderTime}ms`)
          }
        }
        originalLog(...args)
      }
      
      // Monitor API calls
      const originalFetch = window.fetch
      window.fetch = async (...args) => {
        const start = performance.now()
        const url = args[0] as string
        
        try {
          const response = await originalFetch(...args)
          const end = performance.now()
          
          if (end - start > 1000) { // Warn if API call takes longer than 1 second
            console.warn(`⚠️ Slow API call: ${url} took ${(end - start).toFixed(2)}ms`)
          }
          
          return response
        } catch (error) {
          const end = performance.now()
          console.error(`❌ Failed API call: ${url} after ${(end - start).toFixed(2)}ms`, error)
          throw error
        }
      }
      
      return () => {
        console.log = originalLog
        window.fetch = originalFetch
      }
    }
  }, [])
  
  useEffect(() => {
    // Log page load metrics
    const metrics = performanceMonitor.getPageLoadMetrics()
    if (metrics) {
      console.log('📊 Page Load Metrics:', metrics)
      
      // Performance warnings
      if (metrics.domContentLoaded > 1000) {
        console.warn('⚠️ Slow DOM content loading:', metrics.domContentLoaded, 'ms')
      }
      
      if (metrics.loadComplete > 3000) {
        console.warn('⚠️ Slow page load:', metrics.loadComplete, 'ms')
      }
      
      if (metrics.firstContentfulPaint > 1500) {
        console.warn('⚠️ Slow first contentful paint:', metrics.firstContentfulPaint, 'ms')
      }
    }
  }, [])
  
  // This component doesn't render anything visible
  return null
}
