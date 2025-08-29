'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // For global errors, we can't rely on PostHog being available
    // So we'll use a direct API call or basic logging
    
    // Log to console for debugging
    console.error('KAWAI Landing Page Global Error:', {
      error: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    })

    // Attempt to send error to our API endpoint for server-side tracking
    if (typeof window !== 'undefined') {
      fetch('/api/error-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            message: error.message,
            stack: error.stack,
            digest: error.digest,
            name: error.name
          },
          context: {
            url: window.location.href,
            pathname: window.location.pathname,
            userAgent: window.navigator.userAgent,
            timestamp: new Date().toISOString(),
            errorType: 'global_error_boundary',
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            }
          }
        })
      }).catch(() => {
        // Silently fail if API is not available
        console.warn('Could not send error to tracking API')
      })
    }
  }, [error])

  const handleReset = () => {
    // Track retry attempt via API if possible
    if (typeof window !== 'undefined') {
      fetch('/api/error-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'global_error_boundary_retry',
          context: {
            originalError: error.message,
            url: window.location.href,
            timestamp: new Date().toISOString()
          }
        })
      }).catch(() => {
        // Silently fail
      })
    }
    
    reset()
  }

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
          <div className="max-w-lg w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center">
              {/* Error Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>

              {/* Error Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Critical Error
              </h1>

              {/* Error Description */}
              <p className="text-gray-600 mb-8 leading-relaxed">
                We&apos;re experiencing a critical system error. Our team has been notified 
                and is working to resolve this issue. Please try refreshing the page.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-red-50 rounded-lg p-4 mb-6 text-left border border-red-200">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">
                    Global Error Details (Development):
                  </h3>
                  <p className="text-xs text-red-700 font-mono break-words mb-2">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-red-600 mb-2">
                      Digest: {error.digest}
                    </p>
                  )}
                  {error.stack && (
                    <details className="text-xs text-red-600">
                      <summary className="cursor-pointer mb-1">Stack Trace</summary>
                      <pre className="whitespace-pre-wrap text-xs">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleReset}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reload Application
                </Button>
                
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Return to Homepage
                </Button>
              </div>

              {/* Support Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">
                  Error ID: {error.digest || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  If this problem persists, please contact our technical support 
                  team with the error ID above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}