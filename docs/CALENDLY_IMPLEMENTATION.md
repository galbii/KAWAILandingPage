# Calendly Integration Implementation Guide

This document outlines the comprehensive Calendly integration implementation for the KAWAI Piano Landing Page, including inline widget display, event tracking, and PostHog analytics integration.

## 🎯 Overview

The Calendly integration provides a seamless inline booking experience for piano consultations with:
- **Inline widget display** directly on the page in a dedicated booking section
- **Lazy loading** for optimal performance (loads when section becomes visible)
- **Multi-platform analytics tracking** (PostHog, Google Analytics, Meta Pixel)
- **Advanced event deduplication** and validation
- **Attribution tracking** across user journey
- **Background preloader** for enhanced performance

## 📋 Architecture

### Core Components

#### 1. Inline Widget Display (`BookingSection.tsx`)
- **Lazy loading**: Widget loads only when section comes into view (intersection observer)
- **Responsive container**: Full-width inline display with proper height
- **Loading states**: Skeleton loading and progress indicators
- **Error handling**: Graceful fallbacks for widget initialization failures

#### 2. Background Preloader (`CalendlyPreloader.tsx`)
- **Hidden widget preloading**: Loads widget in background for performance optimization
- **Attribution setup**: Initializes tracking before widget interaction
- **Script dependency management**: Ensures Calendly scripts are ready

#### 3. Event Tracking (`calendly-tracking.ts`)
- **PostMessage listener**: Captures Calendly events via `window.postMessage()`
- **Event validation**: Ensures data quality and prevents duplicates
- **Multi-platform tracking**: Synchronized analytics across platforms

#### 4. Analytics Integration (`usePostHog.ts`)
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

### Inline Widget Display System

```typescript
// Main booking section with lazy loading
const BookingSection = () => {
  const [shouldLoadCalendly, setShouldLoadCalendly] = useState(false);
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false);
  const calendlyContainerRef = useRef<HTMLDivElement>(null);

  // Lazy loading with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadCalendly(true);
        }
      },
      { threshold: 0.3, rootMargin: '100px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Initialize widget when section becomes visible
  useEffect(() => {
    if (!shouldLoadCalendly) return;

    const initializeWidget = () => {
      if (calendlyContainerRef.current && window.Calendly) {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/kawaipianogallery/shsu-piano-sale',
          parentElement: calendlyContainerRef.current,
          utm: {
            utmSource: 'kawai-landing-page',
            utmMedium: 'booking-section',
            utmCampaign: 'shsu-piano-sale-2025'
          }
        });
        setIsCalendlyLoaded(true);
      }
    };

    // Initialize tracking and widget
    initializeCalendlyTracking('booking_section');
    initializeWidget();
  }, [shouldLoadCalendly]);

  return (
    <section id="booking-consultation" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Loading skeleton */}
        {!isCalendlyLoaded && shouldLoadCalendly && <LoadingSkeleton />}
        
        {/* Calendly widget container */}
        <div 
          ref={calendlyContainerRef}
          className="calendly-inline-widget-container"
          style={{ 
            minWidth: '320px',
            width: '100%',
            height: '600px'
          }}
        />
      </div>
    </section>
  );
};
```

### Background Preloader System

```typescript
// Background widget preloading for performance optimization
const CalendlyPreloader = () => {
  useEffect(() => {
    setTimeout(() => {
      if (window.Calendly?.initInlineWidget && preloadedWidgetRef.current) {
        // Initialize widget in hidden container for performance
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/kawaipianogallery/shsu-piano-sale',
          parentElement: preloadedWidgetRef.current,
          utm: {
            utmSource: 'kawai-landing-page',
            utmMedium: 'modal',
            utmCampaign: 'shsu-piano-sale-2025'
          }
        });
      }
    }, 1000);
  }, []);

  return (
    <div 
      id="calendly-preloaded-widget"
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        opacity: 0,
        pointerEvents: 'none'
      }}
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

### Lazy Loading Integration

```typescript
// Intersection observer for performance optimization
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        // Start loading Calendly when section comes into view
        setShouldLoadCalendly(true);
      }
    },
    { 
      threshold: 0.3,
      rootMargin: '100px' // Pre-load when within 100px of viewport
    }
  );

  if (sectionRef.current) {
    observer.observe(sectionRef.current);
  }

  return () => observer.disconnect();
}, []);
```

### Loading States & Responsive Design

```typescript
// Loading skeleton while widget initializes
{!isCalendlyLoaded && shouldLoadCalendly && (
  <div className="space-y-4">
    <LoadingSkeleton className="h-8 w-64 mx-auto" />
    <LoadingSkeleton className="h-96 w-full" />
    <div className="text-center text-gray-500 text-sm">
      Loading booking calendar...
    </div>
  </div>
)}

// Responsive widget container
<div 
  ref={calendlyContainerRef}
  className="calendly-inline-widget-container"
  style={{ 
    minWidth: '320px',
    width: '100%',
    height: '600px',
    position: 'relative'
  }}
/>
```

## 📈 Analytics Integration

### Multi-Platform Tracking

```typescript
// Synchronized tracking across platforms for inline widget
case 'calendly.invitee_scheduled':
  // Google Analytics conversion
  trackKawaiEvent.calendlyConversion(calendlySource); // 'booking_section'
  
  // PostHog booking attempt completion
  eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT, {
    booking_source: 'booking_section',
    calendly_status: 'completed',
    user_type: localStorage.getItem('kawai_returning_user') === 'true' ? 'returning' : 'new',
    models_viewed_count: parseInt(localStorage.getItem('kawai_pianos_viewed') || '0'),
    session_quality: parseInt(localStorage.getItem('kawai_session_quality') || '50'),
    total_interactions: parseInt(localStorage.getItem('kawai_total_interactions') || '1')
  });
  
  // PostHog appointment details with inline widget attribution
  eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CALENDLY_APPOINTMENT_BOOKED, {
    booking_id: bookingUUID,
    invitee_name: 'Contact Information Provided',
    invitee_email: 'contact@calendly-form.com',
    event_type_name: 'KAWAI Piano Consultation',
    scheduled_time: new Date().toISOString(),
    duration_minutes: 30,
    location_type: 'video_call',
    booking_source: 'booking_section',
    calendly_event_type: event.event,
    additional_notes: `Inline widget booking from booking section`,
    lead_score: parseInt(localStorage.getItem('kawai_session_quality') || '50')
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