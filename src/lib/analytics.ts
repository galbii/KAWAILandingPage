'use client'

import { sendGAEvent } from '@next/third-parties/google'
import { postHogAnalytics } from './posthog'
import { eventMonitor } from './posthog-validation'
import { POSTHOG_CONFIG } from './posthog-config'
import { campaignAnalytics } from './campaign-performance'

// Check if running in browser
const isBrowser = typeof window !== 'undefined'

// Type for pixel parameters
type PixelParameters = Record<string, string | number | boolean>

// Meta Pixel helper function with enhanced debugging
function trackMetaPixel(eventName: string, parameters?: PixelParameters) {
  if (!isBrowser || typeof window.fbq !== 'function') {
    console.warn('Meta Pixel not available:', { isBrowser, fbqExists: typeof window?.fbq })
    return
  }
  
  try {
    // Clean parameters to ensure Meta Pixel compatibility
    const cleanParameters = parameters ? {
      ...parameters,
      // Ensure value is a number if present
      ...(parameters.value && { value: Number(parameters.value) }),
      // Ensure currency is a string if present
      ...(parameters.currency && { currency: String(parameters.currency) })
    } : undefined
    
    console.log('Meta Pixel tracking:', eventName, cleanParameters)
    window.fbq('track', eventName, cleanParameters)
  } catch (error) {
    console.error('Meta Pixel tracking error:', error, { eventName, parameters })
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
    gtag: (command: string, targetId?: string | Date, config?: Record<string, unknown>) => void
  }
}

// Analytics tracking utility for button clicks and user interactions
export const trackEvent = {
  // CTA button clicks (using GA4 recommended select_content event)
  buttonClick: (buttonText: string, location: string, additionalData?: Record<string, string | number | boolean>) => {
    if (!isBrowser) return
    sendGAEvent('event', 'select_content', {
      content_type: 'button',
      item_name: buttonText,
      item_category: 'cta_button',
      button_location: location,
      interaction_type: 'button_click',
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
    
    // Meta Pixel - Enhanced Lead tracking
    trackMetaPixel('Lead', {
      content_name: action,
      content_category: 'lead_generation',
      content_type: 'consultation',
      source: location,
      value: 1,
      currency: 'USD',
      predicted_ltv: 500, // Lifetime value prediction for piano consultation leads
      ...additionalData
    })
  },

  // Contact interactions (improved GA4 event with better categorization)
  contact: (method: 'phone' | 'email' | 'form', location: string, additionalData?: Record<string, string | number | boolean>) => {
    if (!isBrowser) return
    
    // Google Analytics - using select_content for contact interactions
    sendGAEvent('event', 'select_content', {
      content_type: 'contact_method',
      item_name: `contact_${method}`,
      item_category: 'contact',
      contact_method: method,
      contact_location: location,
      interaction_type: 'contact_initiation',
      ...additionalData
    })
    
    // Meta Pixel - Contact tracking
    trackMetaPixel('Contact', {
      content_name: `contact_${method}`,
      content_category: 'contact',
      content_type: 'customer_service',
      source: location,
      method: method,
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
  // Engagement time tracking (disabled)
  engagementTime: null as ((timeSpent: number, pageSection?: string) => void) | null,

  // Scroll depth tracking (disabled)
  scrollDepth: null as ((percentage: number, pageSection?: string) => void) | null,

  // Session quality scoring (disabled)
  sessionQuality: null as ((score: number, interactionCount: number, timeSpent: number) => void) | null,

  // Content interaction tracking (using GA4 recommended select_content event)
  contentInteraction: (contentType: string, elementId?: string, timeToInteraction?: number) => {
    if (!isBrowser) return
    sendGAEvent('event', 'select_content', {
      content_type: contentType,
      item_id: elementId || 'unknown',
      time_to_interaction: timeToInteraction ? Math.round(timeToInteraction) : undefined,
      interaction_type: 'content_interaction'
    })
  },

  // Page section visibility tracking (using GA4 recommended view_item event)
  sectionView: (sectionName: string, timeInView: number, isFullyVisible: boolean) => {
    if (!isBrowser) return
    sendGAEvent('event', 'view_item', {
      item_name: sectionName,
      item_category: 'page_section',
      value: Math.round(timeInView),
      time_in_view: Math.round(timeInView),
      fully_visible: isFullyVisible,
      interaction_type: 'section_view'
    })
  },

  // Exit intent detection
  exitIntent: (timeOnPage: number, scrollDepth: number, interactionCount: number) => {
    if (!isBrowser) return
    sendGAEvent('event', 'exit_intent', {
      time_on_page: Math.round(timeOnPage),
      max_scroll_depth: scrollDepth,
      interaction_count: interactionCount,
      event_category: 'user_behavior'
    })
  },

  // Custom page timing events
  timing: (eventName: string, timingValue: number, category: string = 'performance') => {
    if (!isBrowser) return
    sendGAEvent('event', 'timing_complete', {
      event_category: category,
      timing_name: eventName,
      timing_value: Math.round(timingValue),
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
  // Consultation booking CTA click (engagement, not conversion)
  bookConsultation: (source: string) => {
    trackEvent.buttonClick('Book Consultation', source, {
      event_type: 'piano_consultation',
      event_date: 'september_2025',
      cta_intent: 'consultation_booking'
    })
    
    // PostHog consultation intent tracking with validation
    eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CONSULTATION_INTENT_SIGNAL, {
      trigger_source: source.includes('hero') ? 'hero_cta' : source.includes('booking') ? 'booking_section' : 'gallery_cta',
      models_viewed_count: 0, // Will be updated by the hook
      session_duration_seconds: Math.floor(performance.now() / 1000),
      engagement_score: 75, // High intent signal
      time_to_intent_seconds: Math.floor(performance.now() / 1000),
      high_intent: true
    })
  },

  // Piano browsing
  findPiano: (source: string) => {
    trackEvent.buttonClick('Find Your Piano', source, {
      event_type: 'piano_discovery'
    })
    
    // PostHog piano interest tracking with validation
    eventMonitor.capture(POSTHOG_CONFIG.EVENTS.PIANO_MODEL_VIEWED, {
      model_name: 'piano_gallery_browse',
      model_price: 'various',
      model_category: 'Digital',
      time_spent_seconds: 0,
      source_section: source,
      interaction_type: 'view'
    })
    
    // Campaign performance tracking
    campaignAnalytics.trackPianoView({
      model: 'piano_gallery_browse',
      price: 'various',
      category: 'Digital',
      source: source
    })
  },

  // Event registration CTA click (engagement, not conversion)
  secureSpot: (source: string) => {
    trackEvent.buttonClick('Secure Your Spot', source, {
      event_type: 'sale_event_registration',
      event_date: 'september_2025',
      cta_intent: 'event_registration'
    })
    
    // PostHog event interest tracking with validation
    eventMonitor.capture(POSTHOG_CONFIG.EVENTS.KAWAI_EVENT_INTEREST, {
      event_dates: 'September 11-14, 2025',
      event_location: 'Houston, TX',
      interaction_type: 'save_date',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
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

  // Private tour scheduling CTA click (engagement, not conversion)
  scheduleTour: (source: string) => {
    trackEvent.buttonClick('Schedule Private Tour', source, {
      event_type: 'showroom_tour',
      cta_intent: 'private_tour_request'
    })
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
    
    // Meta Pixel CompleteRegistration - Primary conversion event
    trackMetaPixel('CompleteRegistration', {
      content_name: 'piano_consultation_appointment',
      content_category: 'appointment',
      content_type: 'consultation_booking',
      source: source,
      value: 100,
      currency: 'USD',
      num_items: 1,
      appointment_type: 'piano_consultation',
      event_month: 'september',
      event_year: '2025',
      business_type: 'piano_dealer'
    })
    
    // Campaign performance tracking for consultation conversion
    campaignAnalytics.trackConsultationBooked({
      source: source,
      calendlyStatus: 'completed'
    })
    
    // Meta Pixel Schedule - Secondary appointment tracking
    trackMetaPixel('Schedule', {
      content_name: 'calendly_appointment_booked',
      content_category: 'scheduling',
      content_type: 'appointment',
      source: source,
      value: 50,
      currency: 'USD',
      appointment_duration: 60,
      appointment_type: 'piano_consultation',
      booking_platform: 'calendly'
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
    
    // Meta Pixel ViewContent for Calendly engagement
    trackMetaPixel('ViewContent', {
      content_name: `calendly_${interaction}`,
      content_category: 'appointment_scheduling',
      content_type: 'booking_interface',
      source: source,
      interaction_type: interaction,
      booking_step: interaction,
      platform: 'calendly'
    })
  },

  // Modal CTA button tracking
  openModal: (ctaText: string, location: string, modalType: string, intendedAction: string) => {
    if (!isBrowser) return
    
    // Google Analytics - using GA4 recommended select_content event for modal interactions
    sendGAEvent('event', 'select_content', {
      content_type: 'modal',
      item_name: modalType,
      item_id: `modal_${modalType}`,
      cta_text: ctaText,
      cta_location: location,
      intended_action: intendedAction,
      interaction_type: 'modal_open',
      event_date: 'september_2025'
    })
    
    // Meta Pixel - ViewContent event for modal engagement  
    trackMetaPixel('ViewContent', {
      content_name: `modal_${modalType}`,
      content_category: 'user_interface',
      content_type: 'modal_popup',
      source: location,
      cta_text: ctaText,
      intended_action: intendedAction,
      modal_type: modalType,
      engagement_level: 'high_intent'
    })
  },

  // Houston event information request
  requestEventInfo: (data: { source: string; houstonArea?: string; pianoInterest?: string }) => {
    if (!isBrowser) return
    
    // Track as lead generation - this is a high-value action
    trackEvent.generateLead('houston_event_info_request', data.source, {
      event_type: 'event_information_request',
      houston_area: data.houstonArea || 'not_specified',
      piano_interest: data.pianoInterest || 'not_specified',
      event_date: 'september_2025'
    })
    
    // Meta Pixel Lead event
    trackMetaPixel('Lead', {
      content_name: 'houston_event_information_request',
      content_category: 'information_request',
      content_type: 'event_inquiry',
      source: data.source,
      houston_area: data.houstonArea || 'not_specified',
      piano_interest: data.pianoInterest || 'not_specified',
      value: 25, // Medium value - information request
      currency: 'USD',
      event_location: 'houston_texas',
      lead_type: 'event_information'
    })
    
    // PostHog tracking
    postHogAnalytics.trackConsultationIntent({
      trigger: 'hero_cta',
      modelsViewed: 0,
      sessionDuration: Math.floor(performance.now() / 1000),
      engagementScore: 50, // Medium intent signal
      timeToIntent: Math.floor(performance.now() / 1000)
    })
  }
}