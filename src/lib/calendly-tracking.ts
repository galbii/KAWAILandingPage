'use client'

import { trackKawaiEvent } from './analytics'

// Check if running in browser
const isBrowser = typeof window !== 'undefined'

// Calendly event types we want to track
type CalendlyEventType = 
  | 'calendly.profile_page_viewed'
  | 'calendly.event_type_viewed'
  | 'calendly.date_and_time_selected'
  | 'calendly.invitee_scheduled'

interface CalendlyEvent {
  event: CalendlyEventType
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

    case 'calendly.invitee_scheduled':
      // This is the main conversion event - user completed booking
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
        trackKawaiEvent.calendlyConversion(calendlySource)
        
        // Clean up old entries to prevent memory leaks (keep last 10)
        if (processedAppointments.size > 10) {
          const oldestId = Array.from(processedAppointments)[0]
          processedAppointments.delete(oldestId)
        }
      } else {
        console.log('Duplicate Calendly conversion detected and prevented')
      }
      break

    default:
      // Log any other Calendly events for debugging
      console.log('Unhandled Calendly event:', event.event)
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