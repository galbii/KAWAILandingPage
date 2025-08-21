'use client'

import { sendGAEvent } from '@next/third-parties/google'

// Analytics tracking utility for button clicks and user interactions
export const trackEvent = {
  // CTA button clicks
  buttonClick: (buttonText: string, location: string, additionalData?: Record<string, any>) => {
    sendGAEvent('event', 'click', {
      event_category: 'engagement',
      button_text: buttonText,
      button_location: location,
      ...additionalData
    })
  },

  // Lead generation events (high-value actions)
  generateLead: (action: string, location: string, additionalData?: Record<string, any>) => {
    sendGAEvent('event', 'generate_lead', {
      event_category: 'lead_generation', 
      action: action,
      location: location,
      value: 1, // Assign value to lead generation events
      ...additionalData
    })
  },

  // Contact interactions
  contact: (method: 'phone' | 'email' | 'form', location: string, additionalData?: Record<string, any>) => {
    sendGAEvent('event', 'contact', {
      event_category: 'contact',
      contact_method: method,
      location: location,
      ...additionalData
    })
  },

  // Newsletter signup
  signUp: (location: string, additionalData?: Record<string, any>) => {
    sendGAEvent('event', 'sign_up', {
      event_category: 'engagement',
      signup_type: 'newsletter',
      location: location,
      ...additionalData
    })
  },

  // Information requests
  viewInfo: (contentType: string, location: string, additionalData?: Record<string, any>) => {
    sendGAEvent('event', 'view_item', {
      event_category: 'engagement',
      content_type: contentType,
      location: location,
      ...additionalData
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
  },

  // Newsletter signup
  subscribeNewsletter: (source: string) => {
    trackEvent.signUp(source, {
      subscription_type: 'kawai_updates'
    })
  }
}