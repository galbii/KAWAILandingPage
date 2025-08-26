'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { postHogAnalytics } from '@/lib/posthog'
import { campaignAttribution, getAttributionForEvent } from '@/lib/campaign-attribution'
import posthog from 'posthog-js'

function PostHogProviderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize PostHog
    postHogAnalytics.init()
    
    // Initialize campaign attribution (happens automatically in constructor)
    // campaignAttribution is already initialized when imported
    
    // Debug campaign attribution in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => campaignAttribution.debug(), 1000)
    }
  }, [])

  useEffect(() => {
    // Track page views manually to avoid duplication with GA4
    // Only track if user shows engagement (scroll or time on page)
    let timeOnPage = 0
    let hasScrolled = false
    
    const timer = setInterval(() => {
      timeOnPage += 1
      if (timeOnPage > 10 && !hasScrolled) {
        // User has been on page for 10+ seconds, track pageview
        posthog.capture('$pageview', {
          $current_url: window.location.href,
          page_type: 'kawai_landing',
          time_based_pageview: true,
          // Campaign attribution now automatically included via validation system
          ...getAttributionForEvent(true)
        })
        clearInterval(timer)
      }
    }, 1000)

    const handleScroll = () => {
      if (!hasScrolled) {
        hasScrolled = true
        posthog.capture('$pageview', {
          $current_url: window.location.href,
          page_type: 'kawai_landing',
          scroll_based_pageview: true,
          // Campaign attribution now automatically included via validation system
          ...getAttributionForEvent(true)
        })
        clearInterval(timer)
      }
    }

    window.addEventListener('scroll', handleScroll, { once: true })

    return () => {
      clearInterval(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname, searchParams])

  return <>{children}</>
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <PostHogProviderInner>{children}</PostHogProviderInner>
    </Suspense>
  )
}