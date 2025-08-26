'use client'

import posthog from 'posthog-js'
import { trackKawaiEvent } from './analytics'
import { eventMonitor } from './posthog-validation'
import { POSTHOG_CONFIG } from './posthog-config'

// Check if running in browser
const isBrowser = typeof window !== 'undefined'

// Calendly event types we want to track
type CalendlyEventType = 
  | 'calendly.profile_page_viewed'
  | 'calendly.event_type_viewed'
  | 'calendly.invitee_date_time_selected'  // Documented name
  | 'calendly.date_and_time_selected'      // Actual name being sent
  | 'calendly.invitee_scheduled'
  | 'calendly.event_scheduled'  // The actual event that fires on booking
  | 'calendly.page_height'      // Height change events

interface CalendlyEvent {
  event: CalendlyEventType
  _retryCount?: number
  [key: string]: string | number | boolean
}

// Track the source of the Calendly widget for attribution
let calendlySource: 'modal' | 'booking_section' | 'unknown' = 'unknown'

// Track processed appointments to prevent duplicate events
const processedAppointments = new Set<string>()

// Check if message is from Calendly
function isCalendlyEvent(e: MessageEvent): e is MessageEvent<CalendlyEvent> {
  return (
    e.data &&
    typeof e.data === 'object' &&
    'event' in e.data &&
    typeof e.data.event === 'string' &&
    e.data.event.indexOf('calendly') === 0
  )
}

// Handle Calendly events
function handleCalendlyEvent(event: CalendlyEvent) {
  if (!isBrowser) return

  // Check if PostHog is properly initialized
  const isPostHogReady = posthog && (posthog.__loaded || typeof posthog.capture === 'function')
  if (!isPostHogReady) {
    console.warn('PostHog not ready for Calendly event:', event.event, {
      posthogExists: !!posthog,
      isLoaded: posthog?.__loaded,
      hasCaptureMethod: typeof posthog?.capture === 'function'
    })
    // Store event for potential retry (max 10 retries)
    if (!event._retryCount) event._retryCount = 0
    if (event._retryCount < 10) {
      event._retryCount++
      setTimeout(() => handleCalendlyEvent(event), 500) // Retry after 500ms
    } else {
      console.error('❌ PostHog never became ready, dropping Calendly event:', event.event)
    }
    return
  }

  console.log('✅ Calendly event detected:', event)

  switch (event.event) {
    case 'calendly.profile_page_viewed':
      // Track when Calendly widget loads
      console.log('🎨 Calendly profile page viewed:', event)
      
      trackKawaiEvent.calendlyInteraction('profile_viewed', calendlySource)
      
      // Track widget load in PostHog
      eventMonitor.capture('calendly_widget_loaded', {
        booking_source: calendlySource,
        widget_type: 'inline',
        load_timestamp: new Date().toISOString(),
        user_type: localStorage.getItem('kawai_returning_user') === 'true' ? 'returning' : 'new',
        funnel_step: 'widget_load'
      })
      
      console.log('✅ Calendly widget load tracked')
      break

    case 'calendly.event_type_viewed':
      // Track when user views event details
      console.log('🔍 User viewing event type details:', event)
      
      trackKawaiEvent.calendlyInteraction('event_type_viewed', calendlySource)
      
      // Track event browsing in PostHog  
      eventMonitor.capture('calendly_event_browsed', {
        booking_source: calendlySource,
        event_type: 'Piano Consultation',
        browse_timestamp: new Date().toISOString(),
        user_type: localStorage.getItem('kawai_returning_user') === 'true' ? 'returning' : 'new',
        funnel_step: 'event_browsing',
        engagement_level: 'medium'
      })
      
      console.log('✅ Event type browsing tracked')
      break

    case 'calendly.invitee_date_time_selected':
    case 'calendly.date_and_time_selected':
      // Track when user selects a time slot (both possible event names)
      console.log('📅 User selected date/time in Calendly:', event)
      
      // Track with Google Analytics and other platforms
      trackKawaiEvent.calendlyInteraction('time_selected', calendlySource)
      
      // Track with PostHog for funnel analysis
      eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT, {
        booking_source: calendlySource,
        calendly_status: 'time_selected',
        user_type: localStorage.getItem('kawai_returning_user') === 'true' ? 'returning' : 'new',
        interaction_timestamp: new Date().toISOString(),
        calendly_event_data: event,
        funnel_step: 'time_selection',
        engagement_level: 'high'
      })
      
      console.log('✅ Time selection tracked in PostHog and analytics')
      break

    case 'calendly.invitee_scheduled':
      // This is the main conversion event - user completed booking
      console.group('🎯 Calendly Booking Completed')
      console.log('Event data:', event)
      console.log('Booking source:', calendlySource)
      console.log('PostHog available:', !!window.posthog)
      
      // Generate unique ID for this booking to prevent duplicates
      const bookingId = `${event.event}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Check if we've already processed this type of booking recently (within 5 seconds)
      const recentBookings = Array.from(processedAppointments).filter(id => {
        const timestamp = parseInt(id.split('-')[1])
        return Date.now() - timestamp < 5000 // 5 seconds
      })
      
      if (recentBookings.length === 0) {
        // Only track if no recent duplicates
        processedAppointments.add(bookingId)
        
        console.log('🚀 Firing PostHog events...')
        
        // Track conversion with all analytics platforms
        trackKawaiEvent.calendlyConversion(calendlySource)
        console.log('✅ Calendly conversion tracked')
        
        // Also track with PostHog (client-side)
        const postHogEventData = {
          booking_source: calendlySource,
          calendly_status: 'completed',
          user_type: localStorage.getItem('kawai_returning_user') === 'true' ? 'returning' : 'new',
          completion_timestamp: new Date().toISOString(),
          calendly_event_data: event
        }
        
        eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT, postHogEventData)
        console.log('✅ PostHog consultation booking attempt tracked:', postHogEventData)
        
        // Store booking source in localStorage for webhook attribution
        localStorage.setItem('kawai_last_booking_source', calendlySource)
        localStorage.setItem('kawai_last_booking_time', Date.now().toString())
        console.log('✅ Booking source stored in localStorage for webhook attribution')
        
        // Clean up old entries to prevent memory leaks (keep last 10)
        if (processedAppointments.size > 10) {
          const oldestId = Array.from(processedAppointments)[0]
          processedAppointments.delete(oldestId)
        }
        
        console.log('🎉 All PostHog events successfully fired!')
      } else {
        console.warn('⚠️ Duplicate Calendly conversion detected and prevented')
      }
      
      console.groupEnd()
      break

    case 'calendly.event_scheduled':
      // This is the REAL booking completion event with actual data
      console.group('🎯 REAL Calendly Booking Completed!')
      console.log('Event data:', event)
      console.log('Booking source:', calendlySource)
      console.log('PostHog available:', !!posthog)
      console.log('Payload data:', event.payload)
      
      // Generate unique ID for this booking to prevent duplicates
      const realBookingId = `${event.event}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Check if we've already processed this type of booking recently (within 10 seconds for real bookings)
      const recentRealBookings = Array.from(processedAppointments).filter(id => {
        const timestamp = parseInt(id.split('-')[1])
        return Date.now() - timestamp < 10000 // 10 seconds for real bookings
      })
      
      if (recentRealBookings.length === 0) {
        // Only track if no recent duplicates
        processedAppointments.add(realBookingId)
        
        console.log('🚀 Firing PostHog events for REAL booking...')
        
        // Track conversion with all analytics platforms
        trackKawaiEvent.calendlyConversion(calendlySource)
        console.log('✅ Calendly conversion tracked')
        
        // Track with PostHog (client-side) - REAL booking data
        const realBookingEventData = {
          booking_source: calendlySource,
          calendly_status: 'completed',
          user_type: localStorage.getItem('kawai_returning_user') === 'true' ? 'returning' : 'new',
          completion_timestamp: new Date().toISOString(),
          calendly_event_data: event,
          // Extract real booking details from payload
          event_uri: event.payload?.event?.uri || 'unknown',
          invitee_uri: event.payload?.invitee?.uri || 'unknown',
          is_real_booking: true  // Flag to distinguish from test events
        }
        
        // Fire the PostHog event and verify it's sent
        console.log('🔄 Attempting to send PostHog event...')
        console.log('Event name:', POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT)
        console.log('Event data:', realBookingEventData)
        
        // Try eventMonitor.capture first
        eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT, realBookingEventData)
          .then(eventResult => {
            console.log('✅ PostHog event sent via eventMonitor:', eventResult)
          })
          .catch(error => {
            console.error('❌ EventMonitor capture failed:', error)
          })
        
        // Also send directly via PostHog for backup
        try {
          posthog.capture(POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT, realBookingEventData)
          console.log('✅ Direct PostHog capture sent')
          console.log('PostHog instance status:', {
            loaded: posthog.__loaded,
            config: !!posthog.config,
            distinct_id: posthog.get_distinct_id?.()
          })
        } catch (directError) {
          console.error('❌ Direct PostHog capture failed:', directError)
        }
        
        // Store booking source in localStorage for webhook attribution
        localStorage.setItem('kawai_last_booking_source', calendlySource)
        localStorage.setItem('kawai_last_booking_time', Date.now().toString())
        console.log('✅ Real booking source stored in localStorage')
        
        // Clean up old entries
        if (processedAppointments.size > 10) {
          const oldestId = Array.from(processedAppointments)[0]
          processedAppointments.delete(oldestId)
        }
        
        console.log('🎉 All PostHog events successfully fired for REAL booking!')
      } else {
        console.warn('⚠️ Duplicate real Calendly booking detected and prevented')
      }
      
      console.groupEnd()
      break

    case 'calendly.page_height':
      // Just ignore height change events - they're not important for tracking
      console.log('📏 Calendly height changed (ignoring)')
      break

    default:
      // Log any other Calendly events for debugging and track them
      console.log('🔍 Unhandled Calendly event:', event.event, event)
      
      // Track unknown events in PostHog for analysis
      eventMonitor.capture('calendly_unknown_event', {
        event_name: event.event,
        booking_source: calendlySource,
        event_data: event,
        timestamp: new Date().toISOString(),
        user_type: localStorage.getItem('kawai_returning_user') === 'true' ? 'returning' : 'new'
      })
      
      // Also track as generic interaction for analytics
      if (typeof event.event === 'string' && event.event.startsWith('calendly.')) {
        const eventType = event.event.replace('calendly.', '')
        trackKawaiEvent.calendlyInteraction(eventType, calendlySource)
        console.log('✅ Unknown Calendly event tracked as generic interaction')
      }
  }
}

// Track if listener is already active to prevent multiple listeners
let isListenerActive = false

// Initialize Calendly event listener
export function initializeCalendlyTracking(source: 'modal' | 'booking_section') {
  if (!isBrowser) return

  // Set the source for attribution
  calendlySource = source

  // Only add listener if not already active
  if (!isListenerActive) {
    window.addEventListener('message', handleCalendlyMessage)
    isListenerActive = true
    console.log(`Calendly tracking initialized for source: ${source}`)
  } else {
    console.log(`Calendly tracking already active, updated source to: ${source}`)
  }
}

// Message event handler
function handleCalendlyMessage(e: MessageEvent) {
  if (isCalendlyEvent(e)) {
    handleCalendlyEvent(e.data)
  }
}

// Clean up event listener
export function cleanupCalendlyTracking() {
  if (!isBrowser) return
  
  if (isListenerActive) {
    window.removeEventListener('message', handleCalendlyMessage)
    isListenerActive = false
  }
  
  calendlySource = 'unknown'
  processedAppointments.clear()
  
  console.log('Calendly tracking cleaned up')
}

// Manual tracking for custom events (if needed)
export function trackCalendlyCustomEvent(eventType: string, source?: 'modal' | 'booking_section' | 'unknown') {
  if (!isBrowser) return
  
  const currentSource = source || calendlySource
  trackKawaiEvent.calendlyInteraction(eventType, currentSource)
}