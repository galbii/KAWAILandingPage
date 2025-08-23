'use client'

import { trackKawaiEvent } from './analytics'
import { requestStorageAccess } from './storage-access'

// Check if running in browser
const isBrowser = typeof window !== 'undefined'

// Calendly event types we want to track
type CalendlyEventType = 
  | 'calendly.profile_page_viewed'
  | 'calendly.event_type_viewed'
  | 'calendly.date_and_time_selected'
  | 'calendly.event_scheduled'

interface CalendlyEvent {
  event: CalendlyEventType
  [key: string]: string | number | boolean
}

// Track the source of the Calendly widget for attribution
let calendlySource: 'modal' | 'booking_section' | 'unknown' = 'unknown'

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

  console.log('Calendly event detected:', event)

  switch (event.event) {
    case 'calendly.profile_page_viewed':
      // Track when Calendly widget loads
      trackKawaiEvent.calendlyInteraction('profile_viewed', calendlySource)
      break

    case 'calendly.event_type_viewed':
      // Track when user views event details
      trackKawaiEvent.calendlyInteraction('event_type_viewed', calendlySource)
      break

    case 'calendly.date_and_time_selected':
      // Track when user selects a time slot
      trackKawaiEvent.calendlyInteraction('time_selected', calendlySource)
      break

    case 'calendly.event_scheduled':
      // This is the main conversion event - user completed booking
      trackKawaiEvent.calendlyConversion(calendlySource)
      break

    default:
      // Log any other Calendly events for debugging
      console.log('Unhandled Calendly event:', event.event)
  }
}

// Initialize Calendly event listener
export async function initializeCalendlyTracking(source: 'modal' | 'booking_section') {
  if (!isBrowser) return

  // Request storage access for third-party cookies
  try {
    await requestStorageAccess()
  } catch (error) {
    console.warn('Could not request storage access:', error)
  }

  // Set the source for attribution
  calendlySource = source

  // Remove existing listener if any
  window.removeEventListener('message', handleCalendlyMessage)
  
  // Add new listener
  window.addEventListener('message', handleCalendlyMessage)
  
  console.log(`Calendly tracking initialized for source: ${source}`)
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
  
  window.removeEventListener('message', handleCalendlyMessage)
  calendlySource = 'unknown'
  
  console.log('Calendly tracking cleaned up')
}

// Manual tracking for custom events (if needed)
export function trackCalendlyCustomEvent(eventType: string, source?: 'modal' | 'booking_section' | 'unknown') {
  if (!isBrowser) return
  
  const currentSource = source || calendlySource
  trackKawaiEvent.calendlyInteraction(eventType, currentSource)
}