import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Set headers to allow third-party iframes and cookies to work properly
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none')
  
  // Comprehensive CSP to allow all third-party services
  response.headers.set(
    'Content-Security-Policy',
    "frame-src 'self' https: data:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:; " +
    "connect-src 'self' https: wss: data:; " +
    "style-src 'self' 'unsafe-inline' https: data:; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data: https:; " +
    "media-src 'self' data: https: blob:; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "frame-ancestors 'self';"
  )

  // Allow comprehensive storage access for all third-party services
  response.headers.set(
    'Permissions-Policy',
    'storage-access=*, unpartitioned-storage-access=*, cross-origin-isolated=(), camera=(), microphone=(), geolocation=()'
  )

  // Enable cross-origin resource sharing and disable strict policies
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
  response.headers.set('Cross-Origin-Opener-Policy', 'unsafe-none')
  response.headers.set('Referrer-Policy', 'unsafe-url')

  // Add headers to help with cookie acceptance
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}