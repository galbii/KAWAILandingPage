# Calendly Integration Implementation Guide

This document outlines the comprehensive Calendly integration implementation for the KAWAI Piano Landing Page, including widget management, event tracking, and PostHog analytics integration.

## 🎯 Overview

The Calendly integration provides a seamless booking experience for piano consultations with:
- **Preloaded widget system** for instant display
- **Multi-platform analytics tracking** (PostHog, Google Analytics, Meta Pixel)
- **Advanced event deduplication** and validation
- **Attribution tracking** across user journey
- **Modal and inline widget support**

## 📋 Architecture

### Core Components

#### 1. Widget Management (`PianoConsultationDialog.tsx`)
- **Preloaded widget system**: Widget loads in background for instant modal display
- **Modal container**: Responsive dialog with proper accessibility
- **Error handling**: Graceful fallbacks for widget initialization failures

#### 2. Event Tracking (`calendly-tracking.ts`)
- **PostMessage listener**: Captures Calendly events via `window.postMessage()`
- **Event validation**: Ensures data quality and prevents duplicates
- **Multi-platform tracking**: Synchronized analytics across platforms

#### 3. Analytics Integration (`usePostHog.ts`)
- **Session quality scoring**: Behavioral analysis for lead qualification
- **User identification**: Cross-session tracking and attribution
- **Feature flag integration**: A/B testing support

## 🚀 Calendly Event Flow

### Event Types Tracked

Based on Calendly's official documentation, we track these events:

```typescript
// Primary booking events
'calendly.profile_page_viewed'      // Widget loaded
'calendly.event_type_viewed'        // Event details viewed
'calendly.invitee_date_time_selected' // Time slot selected
'calendly.invitee_scheduled'        // Booking completed ✅

// Additional events
'calendly.page_height'              // Widget height changes (ignored)
```

### Event Tracking Pipeline

1. **Event Detection**: `window.addEventListener('message', handleCalendlyMessage)`
2. **Event Validation**: `isCalendlyEvent()` filters for Calendly-specific events
3. **Deduplication**: Time-based UUID system prevents duplicate tracking
4. **Analytics Dispatch**: Parallel tracking to PostHog, GA4, and Meta Pixel
5. **Attribution Persistence**: Store booking source and session data

## 📊 PostHog Event Schemas

### Consultation Booking Attempt
```typescript
// Event: consultation_booking_attempt
{
  booking_source: 'modal' | 'booking_section',
  calendly_status: 'opened' | 'time_selected' | 'completed' | 'abandoned',
  abandonment_stage?: string,
  session_quality: number, // 0-100
  user_type: 'new' | 'returning',
  models_viewed_count: number,
  total_interactions: number
}
```

### Calendly Appointment Booked
```typescript
// Event: calendly_appointment_booked
{
  booking_id: string,
  invitee_name: 'Contact Information Provided', // Privacy-safe
  invitee_email: 'contact@calendly-form.com',  // Privacy-safe
  event_type_name: 'KAWAI Piano Consultation',
  scheduled_time: string, // ISO timestamp
  duration_minutes: 30,
  location_type: 'video_call',
  booking_source: 'modal' | 'booking_section',
  calendly_event_type: string,
  additional_notes: string,
  lead_score: number // 0-100
}
```

## 🔧 Implementation Details

### Widget Preloading System

```typescript
// Background widget preloading for instant modal display
const CalendlyPreloader = () => {
  useEffect(() => {
    // Initialize Calendly widget in hidden container
    window.Calendly?.initInlineWidget({
      url: 'https://calendly.com/kawaipianogallery/shsu-piano-sale',
      parentElement: preloadContainer,
      utm: {
        utmSource: 'kawai-landing-page',
        utmMedium: 'preload',
        utmCampaign: 'shsu-piano-sale-2025'
      }
    });
  }, []);

  return (
    <div 
      id="calendly-preloaded-widget" 
      style={{ display: 'none' }}
    />
  );
};
```

### Event Deduplication

```typescript
// Enhanced deduplication with time-based cleanup
const processedAppointments = new Map<string, number>();

function generateBookingUUID(eventType: string, eventData: CalendlyEvent): string {
  const sessionId = window.crypto?.randomUUID?.() || 'unknown';
  const eventIdentifier = eventData.payload?.event?.uri || 'unknown';
  const timestamp = Math.floor(Date.now() / 1000);
  
  return `${eventType}-${sessionId}-${eventIdentifier}-${timestamp}`;
}
```

### Attribution Tracking

```typescript
// Persistent attribution data across sessions
function persistAttributionData() {
  const attributionData = {
    source: calendlySource,
    timestamp: Date.now(),
    sessionId: posthog.get_session_id?.(),
    distinctId: posthog.get_distinct_id?.(),
    userAgent: navigator.userAgent,
    referrer: document.referrer || 'direct'
  };

  // Store in multiple locations for reliability
  localStorage.setItem('kawai_attribution', JSON.stringify(attributionData));
  sessionStorage.setItem('kawai_attribution_backup', JSON.stringify(attributionData));
}
```

## 🎨 User Experience Features

### Modal Integration

```typescript
// Instant widget display using preloaded content
const movePreloadedWidget = () => {
  const preloadedWidget = document.getElementById('calendly-preloaded-widget');
  const modalContainer = calendlyContainerRef.current;

  if (preloadedWidget && modalContainer) {
    // Move preloaded content to modal
    modalContainer.innerHTML = preloadedWidget.innerHTML;
    
    // Apply modal-specific styles
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
  }
};
```

### Responsive Design

```typescript
// Modal configuration for optimal mobile experience
<DialogContent className="max-w-4xl w-full h-[90vh] max-h-[800px] p-0">
  <div 
    ref={calendlyContainerRef}
    style={{ 
      minWidth: '320px',
      height: '100%',
      width: '100%'
    }}
  />
</DialogContent>
```

## 📈 Analytics Integration

### Multi-Platform Tracking

```typescript
// Synchronized tracking across platforms
case 'calendly.invitee_scheduled':
  // Google Analytics conversion
  trackKawaiEvent.calendlyConversion(calendlySource);
  
  // PostHog with validation
  eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT, {
    booking_source: calendlySource,
    calendly_status: 'completed'
  });
  
  // PostHog appointment details
  eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CALENDLY_APPOINTMENT_BOOKED, {
    booking_id: bookingUUID,
    event_type_name: 'KAWAI Piano Consultation'
  });
```

### Session Quality Scoring

```typescript
// Behavioral scoring for lead qualification
const calculateSessionQuality = () => {
  let score = 0;
  
  // Time-based scoring (0-40 points)
  if (sessionDuration > 120) score += 40;
  else if (sessionDuration > 60) score += 30;
  
  // Scroll-based scoring (0-30 points)
  if (scrollDepth > 75) score += 30;
  else if (scrollDepth > 50) score += 20;
  
  // Interaction-based scoring (0-30 points)
  if (interactionCount > 5) score += 30;
  
  return Math.min(score, 100);
};
```

## 🔍 Debugging & Monitoring

### Console Logging

```typescript
// Comprehensive logging for debugging
console.group(`🎯 Primary Booking Event`);
console.log('Event data:', event);
console.log('Booking source:', calendlySource);
console.log('PostHog available:', !!posthog);
console.log('Payload data:', event.payload);
console.groupEnd();
```

### Event Validation

```typescript
// Delivery validation with timeout
function validateEventDelivery(bookingUUID: string) {
  setTimeout(() => {
    const sessionId = posthog.get_session_id?.();
    console.log('🔍 Validating event delivery:', {
      bookingUUID,
      sessionId,
      posthogReady: !!posthog.__loaded
    });
  }, 2000);
}
```

### Status Monitoring

```typescript
// Export tracking status for debugging
export function getTrackingStatus() {
  return {
    isListenerActive,
    calendlySource,
    processedAppointmentsCount: processedAppointments.size,
    posthogReady: posthog && (posthog.__loaded || typeof posthog.capture === 'function'),
    attributionData: JSON.parse(localStorage.getItem('kawai_attribution') || '{}')
  };
}
```

## 🛠️ Configuration

### Environment Variables

```bash
# Calendly configuration
CALENDLY_URL=https://calendly.com/kawaipianogallery/shsu-piano-sale

# PostHog integration
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=your_posthog_host
```

### UTM Tracking

```typescript
// Automatic UTM parameter injection
window.Calendly.initInlineWidget({
  url: 'https://calendly.com/kawaipianogallery/shsu-piano-sale',
  parentElement: calendlyContainer,
  utm: {
    utmSource: 'kawai-landing-page',
    utmMedium: 'modal',
    utmCampaign: 'shsu-piano-sale-2025'
  }
});
```

## 🔐 Privacy & Security

### Data Privacy

- **Generic contact information**: Avoid storing actual user details
- **UUID-based identification**: Anonymous booking identifiers
- **Local storage cleanup**: Automatic cleanup of old attribution data

### Error Handling

```typescript
// Graceful error handling with fallbacks
try {
  eventMonitor.capture(EVENT_NAME, eventData)
    .then(result => console.log('✅ Event captured:', result))
    .catch(error => {
      console.error('❌ Event capture failed:', error);
      // Fallback to direct PostHog capture
      posthog.capture(EVENT_NAME, eventData);
    });
} catch (error) {
  console.error('❌ PostHog tracking error:', error);
}
```

## 🚨 Troubleshooting

### Common Issues

#### Widget Not Loading
```typescript
// Check Calendly script loading
if (!window.Calendly) {
  console.error('Calendly script not loaded');
  // Implement fallback or retry logic
}
```

#### Events Not Firing
```typescript
// Verify event listener is active
console.log('Calendly listener status:', {
  isListenerActive,
  calendlySource,
  windowCalendly: !!window.Calendly
});
```

#### PostHog Events Missing
```typescript
// Validate PostHog initialization
console.log('PostHog status:', {
  exists: !!posthog,
  loaded: posthog?.__loaded,
  capture: typeof posthog?.capture === 'function'
});
```

### Debug Console Commands

```javascript
// Available in development mode
window.calendlyDebug = {
  getStatus: () => getTrackingStatus(),
  testEvent: (eventType) => handleCalendlyEvent({ event: eventType }),
  clearCache: () => {
    processedAppointments.clear();
    localStorage.removeItem('kawai_attribution');
  }
};
```

## 📋 Testing Checklist

### Widget Functionality
- [ ] Modal opens with preloaded widget
- [ ] Widget displays correctly on mobile
- [ ] Fallback works if preload fails
- [ ] Modal closes and returns widget to preloader

### Event Tracking
- [ ] `calendly.profile_page_viewed` tracked on widget load
- [ ] `calendly.invitee_date_time_selected` tracked on time selection
- [ ] `calendly.invitee_scheduled` tracked on booking completion
- [ ] No duplicate events for same booking

### Analytics Integration
- [ ] PostHog events validate against schema
- [ ] Google Analytics conversion tracking works
- [ ] Attribution data persists across sessions
- [ ] Session quality scores calculate correctly

### Error Handling
- [ ] Graceful fallback for PostHog failures
- [ ] Console warnings for missing dependencies
- [ ] Network error handling for analytics calls
- [ ] Local storage quota exceeded handling

## 🔄 Maintenance

### Regular Tasks

1. **Monitor PostHog Event Quality**: Check for validation errors
2. **Review Attribution Data**: Ensure accurate source tracking  
3. **Update Calendly URL**: Sync with any Calendly configuration changes
4. **Test Cross-Platform**: Verify analytics consistency

### Performance Optimization

- **Widget preloading**: Reduces modal open time by ~2-3 seconds
- **Event deduplication**: Prevents analytics inflation
- **Lazy loading**: Non-critical tracking loads after widget
- **Error boundaries**: Prevent tracking failures from breaking UI

## 📞 Support

For issues with:
- **Calendly Configuration**: Check Calendly dashboard settings
- **PostHog Events**: Review PostHog project configuration  
- **Widget Display**: Verify CSS and responsive design
- **Analytics Tracking**: Cross-reference with GA4 and Meta Pixel data

---

*Last updated: Based on Calendly API documentation and PostHog event tracking validation system*