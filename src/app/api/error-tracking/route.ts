import { NextRequest, NextResponse } from 'next/server'
import { captureServerEvent, withPostHogCleanup } from '@/lib/posthog-server'

interface ErrorTrackingPayload {
  error?: {
    message: string
    stack?: string
    digest?: string
    name?: string
  }
  event?: string
  context: {
    url?: string
    pathname?: string
    userAgent?: string
    timestamp: string
    errorType?: string
    viewport?: {
      width: number
      height: number
    }
    originalError?: string
  }
}

async function handleErrorTracking(request: NextRequest) {
  try {
    const payload: ErrorTrackingPayload = await request.json()

    // Extract IP for geo-location (if needed for analytics)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'

    if (payload.error) {
      // Track application error
      await captureServerEvent('application_error', {
        // Error details
        error_message: payload.error.message,
        error_stack: payload.error.stack,
        error_digest: payload.error.digest,
        error_name: payload.error.name || 'Error',
        error_type: payload.context.errorType || 'unknown',
        
        // Context
        page_url: payload.context.url,
        page_pathname: payload.context.pathname,
        user_agent: payload.context.userAgent,
        client_ip: ip,
        timestamp: payload.context.timestamp,
        
        // Technical context
        viewport_width: payload.context.viewport?.width,
        viewport_height: payload.context.viewport?.height,
        
        // Source tracking
        error_source: 'client_side',
        tracking_method: 'error_boundary',
        
        // Business impact categorization
        severity: categorizeSeverity(payload.error.message, payload.context.errorType),
        affects_conversion: isConversionAffecting(payload.context.pathname),
        
        // Additional debugging
        referrer: request.headers.get('referer'),
        origin: request.headers.get('origin')
      }, {
        skipValidation: false,
        logValidation: process.env.NODE_ENV === 'development',
        distinctId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })
    } else if (payload.event) {
      // Track error-related events (like retry attempts)
      await captureServerEvent(payload.event, {
        original_error: payload.context.originalError,
        page_url: payload.context.url,
        timestamp: payload.context.timestamp,
        user_agent: payload.context.userAgent,
        client_ip: ip,
        event_source: 'error_tracking_api'
      }, {
        skipValidation: false,
        logValidation: process.env.NODE_ENV === 'development',
        distinctId: `error_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })
    }

    return NextResponse.json({ 
      success: true,
      tracked: true,
      timestamp: new Date().toISOString()
    })
  } catch (trackingError) {
    console.error('Error tracking API failed:', trackingError)
    
    // Return success even if tracking fails to avoid breaking user experience
    return NextResponse.json({ 
      success: true,
      tracked: false,
      error: 'Tracking failed but request processed',
      timestamp: new Date().toISOString()
    })
  }
}

// Helper function to categorize error severity
function categorizeSeverity(errorMessage: string, errorType?: string): 'low' | 'medium' | 'high' | 'critical' {
  const message = errorMessage.toLowerCase()
  
  // Critical errors that break core functionality
  if (
    message.includes('chunk load') ||
    message.includes('network error') ||
    message.includes('failed to fetch') ||
    errorType === 'global_error_boundary'
  ) {
    return 'critical'
  }
  
  // High severity errors that affect user experience
  if (
    message.includes('render') ||
    message.includes('component') ||
    message.includes('hook') ||
    message.includes('undefined') ||
    message.includes('null')
  ) {
    return 'high'
  }
  
  // Medium severity for general application errors
  if (
    message.includes('validation') ||
    message.includes('parsing') ||
    message.includes('format')
  ) {
    return 'medium'
  }
  
  // Default to medium severity
  return 'medium'
}

// Helper function to determine if error affects conversion flow
function isConversionAffecting(pathname?: string): boolean {
  if (!pathname) return false
  
  const conversionPaths = [
    '/',              // Homepage with consultation booking
    '/consultation',  // Direct consultation pages
    '/booking',       // Booking flow
    '/contact'        // Contact form
  ]
  
  return conversionPaths.some(path => pathname.startsWith(path))
}

// Export the handler with PostHog cleanup
export const POST = withPostHogCleanup(handleErrorTracking)

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
}