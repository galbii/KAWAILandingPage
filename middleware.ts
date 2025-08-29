import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface PostHogFlagsResponse {
  featureFlags: Record<string, boolean | string>
  errorComputingFlags?: boolean
}

interface BootstrapData {
  distinctID: string
  featureFlags: Record<string, boolean | string>
  timestamp: string
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  try {
    // Get PostHog configuration
    const posthogProjectKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
    
    if (!posthogProjectKey) {
      console.warn('PostHog middleware: API key not found')
      return response
    }

    // Get or generate distinct ID from PostHog cookie
    const phCookieKey = `ph_${posthogProjectKey}_posthog`
    const existingCookie = request.cookies.get(phCookieKey)
    
    let distinctId: string
    
    if (existingCookie) {
      try {
        const cookieData = JSON.parse(existingCookie.value)
        distinctId = cookieData.distinct_id || generateDistinctId()
      } catch {
        distinctId = generateDistinctId()
      }
    } else {
      distinctId = generateDistinctId()
    }

    // Fetch feature flags from PostHog
    const flagsResponse = await fetchPostHogFlags(posthogHost, posthogProjectKey, distinctId)
    
    // Prepare bootstrap data
    const bootstrapData: BootstrapData = {
      distinctID: distinctId,
      featureFlags: flagsResponse?.featureFlags || {},
      timestamp: new Date().toISOString()
    }

    // Set bootstrap data cookie for client-side hydration
    response.cookies.set('ph_bootstrap_data', JSON.stringify(bootstrapData), {
      httpOnly: false, // Needs to be accessible by client-side JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5, // 5 minutes - flags can change frequently
      path: '/'
    })

    // Set distinct ID cookie if not exists (for PostHog client consistency)
    if (!existingCookie) {
      const phCookieValue = {
        distinct_id: distinctId,
        $device_id: generateDeviceId(),
        $initial_referrer: request.headers.get('referer') || '$direct',
        $initial_referring_domain: extractDomain(request.headers.get('referer')),
        props: {
          $initial_utm_source: request.nextUrl.searchParams.get('utm_source'),
          $initial_utm_medium: request.nextUrl.searchParams.get('utm_medium'),
          $initial_utm_campaign: request.nextUrl.searchParams.get('utm_campaign'),
          $initial_utm_content: request.nextUrl.searchParams.get('utm_content'),
          $initial_utm_term: request.nextUrl.searchParams.get('utm_term')
        }
      }
      
      response.cookies.set(phCookieKey, JSON.stringify(phCookieValue), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/'
      })
    }

    // Add feature flags to response headers for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('X-PostHog-Flags', JSON.stringify(bootstrapData.featureFlags))
      response.headers.set('X-PostHog-DistinctId', distinctId)
    }

    return response

  } catch (error) {
    console.error('PostHog middleware error:', error)
    
    // Don't fail the request if flag fetching fails
    // Just proceed without bootstrap data
    return response
  }
}

// Helper function to fetch feature flags from PostHog
async function fetchPostHogFlags(
  host: string, 
  apiKey: string, 
  distinctId: string,
  timeout: number = 3000
): Promise<PostHogFlagsResponse | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const requestBody = {
      api_key: apiKey,
      distinct_id: distinctId,
      groups: {}, // Add group properties if using group analytics
      person_properties: {}, // Add person properties if available
      group_properties: {}
    }

    const flagsResponse = await fetch(`${host}/flags?v=2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'KAWAI-Landing-Page-Middleware/1.0'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!flagsResponse.ok) {
      console.warn(`PostHog flags API responded with status: ${flagsResponse.status}`)
      return null
    }

    const data = await flagsResponse.json()
    return data

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('PostHog flags request timed out')
    } else {
      console.error('Error fetching PostHog flags:', error)
    }
    return null
  }
}

// Helper function to generate a distinct ID
function generateDistinctId(): string {
  return `middleware_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Helper function to generate a device ID
function generateDeviceId(): string {
  return `device_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`
}

// Helper function to extract domain from URL
function extractDomain(url: string | null): string {
  if (!url) return '$direct'
  
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return '$direct'
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}