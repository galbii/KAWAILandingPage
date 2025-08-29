'use client'

import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorBoundaryProps) {
  const posthog = usePostHog()

  useEffect(() => {
    // Capture exception with PostHog including enhanced context
    posthog?.capture('$exception', {
      // Error details
      message: error.message,
      stack: error.stack,
      error_digest: error.digest,
      error_name: error.name,
      // Page context
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      page_pathname: typeof window !== 'undefined' ? window.location.pathname : undefined,
      page_search: typeof window !== 'undefined' ? window.location.search : undefined,
      // User agent and technical context
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      timestamp: new Date().toISOString(),
      // Business context
      source_component: 'error_boundary',
      error_boundary_level: 'page',
      // Session context
      session_id: posthog?.get_session_id?.(),
      distinct_id: posthog?.get_distinct_id?.(),
      // Additional debugging info
      error_boundary_triggered: true,
      viewport_width: typeof window !== 'undefined' ? window.innerWidth : undefined,
      viewport_height: typeof window !== 'undefined' ? window.innerHeight : undefined
    })

    // Log to console for debugging
    console.error('KAWAI Landing Page Error Boundary:', {
      error: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString()
    })
  }, [error, posthog])

  const handleRetry = () => {
    // Track retry attempt
    posthog?.capture('error_boundary_retry', {
      error_message: error.message,
      error_digest: error.digest,
      page_pathname: typeof window !== 'undefined' ? window.location.pathname : undefined
    })
    
    reset()
  }

  const handleGoHome = () => {
    // Track navigation to home
    posthog?.capture('error_boundary_navigate_home', {
      error_message: error.message,
      error_digest: error.digest,
      previous_page: typeof window !== 'undefined' ? window.location.pathname : undefined
    })
    
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kawai-gold-50 to-shsu-orange-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl border border-kawai-gold-200 p-8 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Oops! Something went wrong
          </h1>

          {/* Error Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            We encountered an unexpected error while loading the page. 
            Don&apos;t worry - your piano consultation booking is still secure.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Error Details (Development):
              </h3>
              <p className="text-xs text-gray-600 font-mono break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-1">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full bg-kawai-gold-600 hover:bg-kawai-gold-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full border-kawai-gold-300 text-kawai-gold-700 hover:bg-kawai-gold-50 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </Button>
          </div>

          {/* Support Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If this problem persists, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}