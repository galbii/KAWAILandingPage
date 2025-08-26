'use client'

import { useCallback, useEffect, useRef } from 'react'
import { postHogAnalytics } from '@/lib/posthog'
import { eventMonitor } from '@/lib/posthog-validation'
import { POSTHOG_CONFIG } from '@/lib/posthog-config'
import type { PianoModel, ConsultationEvent, PianoInteractionEvent } from '@/lib/posthog'

interface BookingAttemptData {
  bookingSource: 'modal' | 'booking_section'
  calendlyStatus: 'opened' | 'time_selected' | 'completed' | 'abandoned'
  abandonmentStage?: string
}

interface PianoBehaviorData {
  timeSpent: number
  scrollDepth: number
  interactions: number
}

interface EventInterestData {
  eventDates: string
  location: string
  interactionType: 'view' | 'save_date' | 'directions'
}

interface UserData {
  email?: string
  phone?: string
  consultationBooked?: boolean
  pianoPreferences?: string[]
}

interface UsePostHogReturn {
  trackPianoView: (model: PianoInteractionEvent) => void
  trackConsultationIntent: (event: ConsultationEvent) => void
  trackBookingAttempt: (data: BookingAttemptData) => void
  trackPianoInterest: (pianos: PianoModel[], behavior: PianoBehaviorData) => void
  trackEventInterest: (data: EventInterestData) => void
  identifyUser: (userData: UserData) => void
  getFeatureFlag: (flagName: string) => string | boolean
}

export function usePostHog(): UsePostHogReturn {
  const viewStartTime = useRef<number>(Date.now())
  const interactionCount = useRef<number>(0)
  const modelsViewed = useRef<PianoModel[]>([])

  const trackPianoView = useCallback((model: PianoInteractionEvent) => {
    // Track with validation
    eventMonitor.capture(POSTHOG_CONFIG.EVENTS.PIANO_MODEL_VIEWED, {
      model_name: model.model,
      model_price: model.price,
      model_category: model.category,
      time_spent_seconds: model.timeSpent,
      source_section: model.sourceSection,
      interaction_type: model.interactionType
    })
    
    // Add to models viewed for session tracking
    const piano: PianoModel = {
      name: model.model,
      price: model.price,
      category: model.category as 'Digital' | 'Acoustic' | 'Hybrid'
    }
    
    if (!modelsViewed.current.find(p => p.name === piano.name)) {
      modelsViewed.current.push(piano)
    }
    
    interactionCount.current += 1
  }, [])

  // Helper function to calculate session quality
  const calculateSessionQuality = useCallback(() => {
    const sessionDuration = Math.floor((Date.now() - viewStartTime.current) / 1000)
    const scrollDepth = Math.min(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
      100
    )
    
    let score = 0
    
    // Time-based scoring (0-40 points)
    if (sessionDuration > 120) score += 40
    else if (sessionDuration > 60) score += 30
    else if (sessionDuration > 30) score += 20
    else if (sessionDuration > 15) score += 10
    
    // Scroll-based scoring (0-30 points)
    if (scrollDepth > 75) score += 30
    else if (scrollDepth > 50) score += 20
    else if (scrollDepth > 25) score += 10
    
    // Interaction-based scoring (0-30 points)
    if (interactionCount.current > 5) score += 30
    else if (interactionCount.current > 2) score += 20
    else if (interactionCount.current > 0) score += 10
    
    return Math.min(score, 100)
  }, [])

  const trackConsultationIntent = useCallback((event: ConsultationEvent) => {
    postHogAnalytics.trackConsultationIntent(event)
    
    // Enhance with session data
    const sessionData = {
      ...event,
      modelsViewed: modelsViewed.current.length,
      totalInteractions: interactionCount.current,
      sessionDuration: Math.floor((Date.now() - viewStartTime.current) / 1000),
    }
    
    postHogAnalytics.trackConsultationIntent(sessionData)
  }, [])

  const trackBookingAttempt = useCallback((data: BookingAttemptData) => {
    const sessionQuality = calculateSessionQuality()
    const isReturning = typeof localStorage !== 'undefined' ? localStorage.getItem('kawai_returning_user') === 'true' : false
    
    // Track with validation
    eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT, {
      booking_source: data.bookingSource,
      calendly_status: data.calendlyStatus,
      abandonment_stage: data.abandonmentStage,
      session_quality: sessionQuality,
      user_type: isReturning ? 'returning' : 'new',
      models_viewed_count: modelsViewed.current.length,
      total_interactions: interactionCount.current
    })
    
    // Mark as returning user
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('kawai_returning_user', 'true')
    }
  }, [calculateSessionQuality]);

  const trackPianoInterest = useCallback((pianos: PianoModel[], behavior: PianoBehaviorData) => {
    postHogAnalytics.trackPianoInterest(pianos, behavior)
  }, [])

  const trackEventInterest = useCallback((data: EventInterestData) => {
    postHogAnalytics.trackEventAttendance(data)
  }, [])

  const identifyUser = useCallback((userData: UserData) => {
    const enhancedUserData = {
      ...userData,
      pianoPreferences: modelsViewed.current.map(p => p.name),
      sessionQuality: calculateSessionQuality(),
    }
    
    postHogAnalytics.identifyUser(enhancedUserData)
  }, [calculateSessionQuality])

  const getFeatureFlag = useCallback((flagName: string) => {
    return postHogAnalytics.shouldShowVariation(flagName)
  }, [])


  // Track engagement metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const quality = calculateSessionQuality()
      
      // Track high engagement sessions
      if (quality > 70 && modelsViewed.current.length > 0) {
        postHogAnalytics.trackPianoInterest(modelsViewed.current, {
          timeSpent: Math.floor((Date.now() - viewStartTime.current) / 1000),
          scrollDepth: Math.min(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
            100
          ),
          interactions: interactionCount.current,
        })
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [calculateSessionQuality])

  return {
    trackPianoView,
    trackConsultationIntent,
    trackBookingAttempt,
    trackPianoInterest,
    trackEventInterest,
    identifyUser,
    getFeatureFlag,
  }
}