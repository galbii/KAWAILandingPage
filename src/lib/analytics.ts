'use client'

import { sendGAEvent } from '@next/third-parties/google'

// Check if running in browser
const isBrowser = typeof window !== 'undefined'

// Type for pixel parameters
type PixelParameters = Record<string, string | number | boolean>

// Meta Pixel helper function
function trackMetaPixel(eventName: string, parameters?: PixelParameters) {
  if (!isBrowser || typeof window.fbq !== 'function') return
  
  try {
    window.fbq('track', eventName, parameters)
  } catch (error) {
    console.warn('Meta Pixel tracking error:', error)
  }
}

// Google Ads conversion tracking helper function
function trackGoogleAdsConversion(conversionLabel?: string) {
  if (!isBrowser || typeof window.gtag !== 'function') return
  
  try {
    window.gtag('event', 'conversion', {
      'send_to': `AW-755074614${conversionLabel ? `/${conversionLabel}` : ''}`,
      'value': 1.0,
      'currency': 'USD'
    })
  } catch (error) {
    console.warn('Google Ads conversion tracking error:', error)
  }
}

// Declare global functions for TypeScript
declare global {
  interface Window {
    fbq: (action: string, event: string, parameters?: PixelParameters) => void
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void
  }
}

// Analytics tracking utility for button clicks and user interactions
export const trackEvent = {
  // CTA button clicks
  buttonClick: (buttonText: string, location: string, additionalData?: Record<string, string | number | boolean>) => {
    if (!isBrowser) return
    sendGAEvent('event', 'click', {
      event_category: 'engagement',
      button_text: buttonText,
      button_location: location,
      ...additionalData
    })
  },

  // Lead generation events (high-value actions)
  generateLead: (action: string, location: string, additionalData?: Record<string, string | number | boolean>) => {
    if (!isBrowser) return
    
    // Google Analytics
    sendGAEvent('event', 'generate_lead', {
      event_category: 'lead_generation', 
      action: action,
      location: location,
      value: 1, // Assign value to lead generation events
      ...additionalData
    })
    
    // Meta Pixel
    trackMetaPixel('Lead', {
      content_name: action,
      content_category: 'lead_generation',
      source: location,
      value: 1,
      currency: 'USD',
      ...additionalData
    })
  },

  // Contact interactions
  contact: (method: 'phone' | 'email' | 'form', location: string, additionalData?: Record<string, string | number | boolean>) => {
    if (!isBrowser) return
    
    // Google Analytics
    sendGAEvent('event', 'contact', {
      event_category: 'contact',
      contact_method: method,
      location: location,
      ...additionalData
    })
    
    // Meta Pixel
    trackMetaPixel('Contact', {
      content_name: `contact_${method}`,
      content_category: 'contact',
      source: location,
      ...additionalData
    })
  },

  // Newsletter signup
  signUp: (location: string, additionalData?: Record<string, string | number | boolean>) => {
    if (!isBrowser) return
    sendGAEvent('event', 'sign_up', {
      event_category: 'engagement',
      signup_type: 'newsletter',
      location: location,
      ...additionalData
    })
  },

  // Information requests
  viewInfo: (contentType: string, location: string, additionalData?: Record<string, string | number | boolean>) => {
    if (!isBrowser) return
    sendGAEvent('event', 'view_item', {
      event_category: 'engagement',
      content_type: contentType,
      location: location,
      ...additionalData
    })
  }
}

// Page engagement and behavior tracking
export const trackPageEvent = {
  // Engagement time tracking
  engagementTime: (timeSpent: number, pageSection?: string) => {
    if (!isBrowser) return
    sendGAEvent('event', 'page_engagement', {
      event_category: 'engagement',
      engagement_time_msec: Math.round(timeSpent * 1000),
      page_section: pageSection || 'page',
      value: Math.round(timeSpent) // Time in seconds
    })
  },

  // Scroll depth tracking
  scrollDepth: (percentage: number, pageSection?: string) => {
    if (!isBrowser) return
    sendGAEvent('event', 'scroll', {
      event_category: 'engagement',
      scroll_depth: percentage,
      page_section: pageSection || 'page',
      value: percentage
    })
  },

  // Session quality scoring
  sessionQuality: (score: number, interactionCount: number, timeSpent: number) => {
    if (!isBrowser) return
    sendGAEvent('event', 'session_quality', {
      event_category: 'engagement',
      quality_score: score,
      interaction_count: interactionCount,
      session_time: Math.round(timeSpent),
      value: score
    })
  },

  // Content interaction tracking
  contentInteraction: (contentType: string, elementId?: string, timeToInteraction?: number) => {
    if (!isBrowser) return
    sendGAEvent('event', 'content_interaction', {
      event_category: 'engagement',
      content_type: contentType,
      element_id: elementId || 'unknown',
      time_to_interaction: timeToInteraction ? Math.round(timeToInteraction) : undefined
    })
  },

  // Page section visibility tracking
  sectionView: (sectionName: string, timeInView: number, isFullyVisible: boolean) => {
    if (!isBrowser) return
    sendGAEvent('event', 'section_view', {
      event_category: 'engagement',
      section_name: sectionName,
      time_in_view: Math.round(timeInView),
      fully_visible: isFullyVisible,
      value: Math.round(timeInView)
    })
  },

  // Exit intent detection
  exitIntent: (timeOnPage: number, scrollDepth: number, interactionCount: number) => {
    if (!isBrowser) return
    sendGAEvent('event', 'exit_intent', {
      event_category: 'engagement',
      time_on_page: Math.round(timeOnPage),
      max_scroll_depth: scrollDepth,
      interaction_count: interactionCount
    })
  },

  // Custom page timing events
  timing: (eventName: string, timingValue: number, category: string = 'performance') => {
    if (!isBrowser) return
    sendGAEvent('event', 'timing_complete', {
      event_category: category,
      name: eventName,
      value: Math.round(timingValue)
    })
  }
}

// Web Vitals tracking for performance monitoring
export const trackWebVitals = {
  // Core Web Vitals
  coreVital: (name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor', id: string) => {
    if (!isBrowser) return
    sendGAEvent('event', 'web_vital', {
      event_category: 'performance',
      metric_name: name,
      metric_value: Math.round(name === 'CLS' ? value * 1000 : value),
      metric_rating: rating,
      metric_id: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value)
    })
  },

  // Custom Next.js metrics
  nextjsMetric: (name: string, value: number, navigationType?: string) => {
    if (!isBrowser) return
    sendGAEvent('event', 'nextjs_metric', {
      event_category: 'performance',
      metric_name: name,
      metric_value: Math.round(value),
      navigation_type: navigationType || 'unknown',
      value: Math.round(value)
    })
  }
}

// Convenience functions for common KAWAI piano sale events
export const trackKawaiEvent = {
  // Consultation booking (highest priority conversion)
  bookConsultation: (source: string) => {
    trackEvent.generateLead('consultation_booking', source, {
      event_type: 'piano_consultation',
      event_date: 'september_2025'
    })
    
    // Facebook Pixel CompleteRegistration tracking
    trackMetaPixel('CompleteRegistration', {
      content_name: 'piano_consultation_booking',
      content_category: 'consultation',
      source: source,
      value: 100,
      currency: 'USD'
    })
    
    // Google Ads conversion tracking
    trackGoogleAdsConversion()
  },

  // Piano browsing
  findPiano: (source: string) => {
    trackEvent.buttonClick('Find Your Piano', source, {
      event_type: 'piano_discovery'
    })
  },

  // Event registration  
  secureSpot: (source: string) => {
    trackEvent.generateLead('event_registration', source, {
      event_type: 'sale_event_registration',
      event_date: 'september_2025'
    })
    
    // Facebook Pixel CompleteRegistration tracking
    trackMetaPixel('CompleteRegistration', {
      content_name: 'piano_sale_event_registration',
      content_category: 'event_registration',
      source: source,
      value: 75,
      currency: 'USD'
    })
    
    // Google Ads conversion tracking
    trackGoogleAdsConversion()
  },

  // Contact actions
  callPhone: (source: string) => {
    trackEvent.contact('phone', source, {
      phone_number: '713-904-0001'
    })
  },

  emailContact: (source: string) => {
    trackEvent.contact('email', source, {
      email: 'info@kawaipianoshouston.com'
    })
  },

  // Location/directions
  getDirections: (source: string) => {
    trackEvent.buttonClick('Get Directions', source, {
      destination: 'kawai_showroom_houston'
    })
  },

  // Private tour scheduling
  scheduleTour: (source: string) => {
    trackEvent.generateLead('private_tour_request', source, {
      event_type: 'showroom_tour'
    })
    
    // Facebook Pixel CompleteRegistration tracking
    trackMetaPixel('CompleteRegistration', {
      content_name: 'private_tour_scheduling',
      content_category: 'tour_request',
      source: source,
      value: 50,
      currency: 'USD'
    })
    
    // Google Ads conversion tracking
    trackGoogleAdsConversion()
  },

  // Newsletter signup
  subscribeNewsletter: (source: string) => {
    trackEvent.signUp(source, {
      subscription_type: 'kawai_updates'
    })
  },

  // Calendly-specific tracking functions
  calendlyConversion: (source: 'modal' | 'booking_section' | 'unknown') => {
    // Track the main conversion - appointment scheduled
    trackEvent.generateLead('calendly_appointment_scheduled', source, {
      event_type: 'piano_consultation',
      event_date: 'september_2025',
      calendly_source: source,
      conversion_value: 50 // Higher value for actual appointments
    })
    
    // Facebook Pixel CompleteRegistration tracking for Calendly conversion
    trackMetaPixel('CompleteRegistration', {
      content_name: 'calendly_appointment_scheduled',
      content_category: 'appointment',
      source: source,
      value: 100,
      currency: 'USD',
      appointment_type: 'piano_consultation'
    })
    
    // Additional Meta Pixel event for appointment booking
    trackMetaPixel('Schedule', {
      content_name: 'piano_consultation_appointment',
      content_category: 'appointment',
      source: source,
      value: 50,
      currency: 'USD',
      appointment_type: 'piano_consultation'
    })
    
    // Google Ads conversion tracking for Calendly
    trackGoogleAdsConversion()
  },

  calendlyInteraction: (interaction: string, source: 'modal' | 'booking_section' | 'unknown') => {
    // Track user interactions within Calendly widget
    trackEvent.buttonClick(`calendly_${interaction}`, source, {
      interaction_type: interaction,
      calendly_source: source,
      event_type: 'calendly_engagement'
    })
    
    // Meta Pixel custom event for engagement
    trackMetaPixel('CustomizeProduct', {
      content_name: `calendly_${interaction}`,
      content_category: 'calendly_interaction',
      source: source,
      interaction_type: interaction
    })
  },

  // Modal CTA button tracking
  openModal: (ctaText: string, location: string, modalType: string, intendedAction: string) => {
    if (!isBrowser) return
    
    // Google Analytics - custom modal_open event
    sendGAEvent('event', 'modal_open', {
      event_category: 'modal_interaction',
      cta_text: ctaText,
      cta_location: location,
      modal_type: modalType,
      intended_action: intendedAction,
      event_type: 'modal_open',
      event_date: 'september_2025'
    })
    
    // Meta Pixel - ViewContent event for modal engagement
    trackMetaPixel('ViewContent', {
      content_name: `modal_${modalType}`,
      content_category: 'modal_interaction',
      source: location,
      cta_text: ctaText,
      intended_action: intendedAction,
      modal_type: modalType
    })
  }
}