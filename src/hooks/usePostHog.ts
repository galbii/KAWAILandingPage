'use client'

import { useCallback, useEffect, useRef } from 'react'
import { postHogAnalytics } from '@/lib/posthog'
import type { PianoModel, ConsultationEvent, PianoInteractionEvent } from '@/lib/posthog'

interface UsePostHogReturn {
  trackPianoView: (model: PianoInteractionEvent) => void
  trackConsultationIntent: (event: ConsultationEvent) => void
  trackBookingAttempt: (data: any) => void
  trackPianoInterest: (pianos: PianoModel[], behavior: any) => void
  trackEventInterest: (data: any) => void
  identifyUser: (userData: any) => void
  getFeatureFlag: (flagName: string) => string | boolean
}

export function usePostHog(): UsePostHogReturn {
  const viewStartTime = useRef<number>(Date.now())
  const interactionCount = useRef<number>(0)
  const modelsViewed = useRef<PianoModel[]>([])

  const trackPianoView = useCallback((model: PianoInteractionEvent) => {
    postHogAnalytics.trackPianoModelViewed(model)
    
    // Add to models viewed for session tracking
    const piano: PianoModel = {
      name: model.model,
      price: model.price,
      category: model.category
    }
    
    if (!modelsViewed.current.find(p => p.name === piano.name)) {
      modelsViewed.current.push(piano)
    }
    
    interactionCount.current += 1
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

  const trackBookingAttempt = useCallback((data: any) => {
    const enhancedData = {
      ...data,
      sessionData: {
        qualityScore: calculateSessionQuality(),
        isReturning: localStorage.getItem('kawai_returning_user') === 'true',
        modelsViewedCount: modelsViewed.current.length,
        totalInteractions: interactionCount.current,
      }
    }
    
    postHogAnalytics.trackConsultationBookingAttempt(enhancedData)
    
    // Mark as returning user
    localStorage.setItem('kawai_returning_user', 'true')
  }, [])

  const trackPianoInterest = useCallback((pianos: PianoModel[], behavior: any) => {
    postHogAnalytics.trackPianoInterest(pianos, behavior)
  }, [])

  const trackEventInterest = useCallback((data: any) => {
    postHogAnalytics.trackEventAttendance(data)
  }, [])

  const identifyUser = useCallback((userData: any) => {
    const enhancedUserData = {
      ...userData,
      pianoPreferences: modelsViewed.current.map(p => p.name),
      sessionQuality: calculateSessionQuality(),
    }
    
    postHogAnalytics.identifyUser(enhancedUserData)
  }, [])

  const getFeatureFlag = useCallback((flagName: string) => {
    return postHogAnalytics.shouldShowVariation(flagName)
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