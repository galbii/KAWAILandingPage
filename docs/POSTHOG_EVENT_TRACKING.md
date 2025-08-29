# PostHog Event Tracking & Analytics System

This document outlines the enterprise-grade PostHog implementation for the KAWAI Piano Landing Page, including event tracking, privacy compliance, data retention, and advanced analytics features.

## 🎯 Overview

The system provides:
- **Real-time event validation** with schema enforcement  
- **Comprehensive error handling** and debugging tools
- **Development dashboard** for monitoring event flow
- **Enterprise privacy compliance** with GDPR controls
- **Feature flag bootstrapping** for flicker-free experiences
- **Advanced session recording** with privacy controls
- **Automated data retention** with configurable policies
- **Heatmaps integration** with proper CSP configuration
- **Performance-optimized tracking** with minimal impact

## 📋 Event Schema Validation

### Validated Events

#### 1. Piano Model Viewed (`piano_model_viewed`)
```typescript
{
  model_name: string (required, max 100 chars)          // e.g., "ES120"
  model_price: string (required, format: $X,XXX)        // e.g., "$949"
  model_category: "Digital" | "Acoustic" | "Hybrid"     // Required enum
  time_spent_seconds: number (optional, 0-3600)         // e.g., 45
  source_section: string (required, max 50 chars)       // e.g., "hero", "gallery"
  interaction_type: "view" | "compare" | "calculate_payment" // Optional enum
}
```

#### 2. Consultation Intent Signal (`consultation_intent_signal`)
```typescript
{
  trigger_source: "hero_cta" | "gallery_cta" | "booking_section" | "exit_intent" // Required
  models_viewed_count: number (required, 0-50)          // Number of pianos viewed
  session_duration_seconds: number (required, 0-86400)  // Time on site
  engagement_score: number (required, 0-100)            // Calculated engagement
  time_to_intent_seconds: number (required, 0-86400)    // Time to show intent
  high_intent: boolean (optional)                       // High-value signal
}
```

#### 3. Consultation Booking Attempt (`consultation_booking_attempt`)
```typescript
{
  booking_source: "modal" | "booking_section"           // Required enum
  calendly_status: "opened" | "time_selected" | "completed" | "abandoned" // Required
  abandonment_stage: string (optional, max 50 chars)    // Where user left
  session_quality: number (optional, 0-100)             // Session quality score
  user_type: "new" | "returning" (optional)             // User classification
  models_viewed_count: number (optional, 0-50)          // Context data
  total_interactions: number (optional, 0-100)          // Engagement context
}
```

#### 4. KAWAI Event Interest (`kawai_event_interest`)
```typescript
{
  event_dates: string (required, max 100 chars)         // "September 11-14, 2025"
  event_location: string (required, max 100 chars)      // "Houston, TX"
  interaction_type: "view" | "save_date" | "directions" // Required enum
  timezone: string (optional, max 50 chars)             // User timezone
}
```

## 🔒 Privacy & Compliance Features

### GDPR-Compliant Consent Management

The system implements comprehensive privacy controls with user consent management:

```typescript
import { useConsent } from '@/lib/consent-manager'

function MyComponent() {
  const { 
    hasConsent, 
    consentStatus, 
    acceptConsent, 
    declineConsent,
    exportUserData,
    deleteUserData 
  } = useConsent()
  
  // PostHog automatically adapts based on consent status
  // - Consented: Full tracking with localStorage persistence
  // - Declined: Memory-only tracking, no session recording
}
```

### Privacy Controls Component

```tsx
import { PrivacyControls } from '@/components/PrivacyControls'

// Cookie consent banner (auto-hides after consent given/declined)
<PrivacyControls variant="banner" />

// Full privacy settings panel
<PrivacyControls variant="inline" className="max-w-2xl" />

// Modal privacy preferences
<PrivacyControls variant="modal" />
```

### Data Retention Policies

Automated data retention with configurable policies:

```typescript
import { DATA_RETENTION_CONFIG, getRetentionDays } from '@/lib/data-retention-config'

// Retention periods by data type
const retentionDays = getRetentionDays('piano_interactions') // Returns 730 days
const requiresConsent = requiresConsent('pageviews') // Returns true

// Automatic cleanup configuration
- Session recordings: 90 days maximum
- Piano interactions: 2 years for product insights  
- Consultation bookings: 3 years for business analysis
- Error logs: 3 months for debugging
- Consent records: 7 years for legal compliance
```

### Enhanced Session Recording Privacy

```typescript
// Privacy-first session recording configuration
session_recording: {
  sample_rate: consentManager.hasConsent() ? 0.1 : 0.0, // 10% when consented
  maskAllInputs: true,
  maskInputOptions: {
    password: true,
    email: false, // Allow for lead qualification
    phone: true,
  },
  maskTextSelector: '.ph-mask-text, .sensitive, [data-private]',
  blockSelector: 'input[type="password"], [data-sensitive], .private-data',
  recordCanvas: false,
  recordCrossOriginIframes: false
}
```

## 🚀 Advanced Features

### Feature Flag Bootstrapping

Eliminates UI flicker by pre-loading flags server-side:

```typescript
// middleware.ts pre-loads flags
const bootstrapData = {
  distinctID: distinctId,
  featureFlags: await fetchPostHogFlags(),
  timestamp: new Date().toISOString()
}

// Client immediately hydrates without API calls
posthog.init(apiKey, {
  bootstrap: {
    distinctID: bootstrapData.distinctID,
    featureFlags: bootstrapData.featureFlags
  }
})
```

### Error Boundary Integration

Comprehensive error tracking with business context:

```typescript
// Automatic error capture with enhanced context
posthog?.capture('$exception', {
  message: error.message,
  stack: error.stack,
  page_url: window.location.href,
  session_id: posthog?.get_session_id?.(),
  error_boundary_triggered: true,
  severity: categorizeSeverity(error.message),
  affects_conversion: isConversionAffecting(pathname),
  viewport_width: window.innerWidth,
  viewport_height: window.innerHeight
})
```

### Server-Side Tracking

Optimized for serverless environments:

```typescript
import { withPostHogCleanup, captureServerEvent } from '@/lib/posthog-server'

// API route with automatic cleanup
export const POST = withPostHogCleanup(async (request: NextRequest) => {
  await captureServerEvent('consultation_booking', {
    booking_id: bookingData.id,
    invitee_email: bookingData.email,
    lead_score: calculateLeadScore(bookingData)
  }, {
    distinctId: bookingData.email,
    userProperties: { consultation_booked: true }
  })
  
  // PostHog automatically flushes and shuts down after request
  return Response.json({ success: true })
})
```

### Heatmaps Configuration

Privacy-conscious heatmap tracking:

```typescript
// CSP headers configured for PostHog heatmaps
frame-ancestors 'self' https://*.posthog.com

// Heatmap settings with data retention
heatmaps: {
  retention_days: 180,     // 6 months
  sample_rate: 0.15,       // 15% of consented users
  privacy_mode: true,      // Enhanced privacy
  exclude_selectors: ['.sensitive', '[data-private]']
}
```

## 🔧 Implementation Guide

### Using the Validation System

#### Basic Event Capture with Validation
```typescript
import { eventMonitor } from '@/lib/posthog-validation'
import { POSTHOG_CONFIG } from '@/lib/posthog-config'

// Capture event with automatic validation
eventMonitor.capture(POSTHOG_CONFIG.EVENTS.PIANO_MODEL_VIEWED, {
  model_name: 'ES120',
  model_price: '$949',
  model_category: 'Digital',
  time_spent_seconds: 45,
  source_section: 'hero',
  interaction_type: 'view'
})
```

#### Advanced Capture with Options
```typescript
import { captureWithValidation } from '@/lib/posthog-validation'

const result = await captureWithValidation(
  'piano_model_viewed',
  {
    model_name: 'ES120',
    // ... other properties
  },
  {
    skipValidation: false,     // Enable validation (default)
    logValidation: true,       // Log validation results to console
    fallbackToGA: true         // Fallback to GA4 if PostHog fails
  }
)

console.log('Event captured:', result.success)
console.log('Validation errors:', result.validation.errors)
```

### Using the PostHog React Hook

```typescript
import { usePostHog } from '@/hooks/usePostHog'

function PianoCard({ piano }) {
  const { trackPianoView, trackConsultationIntent } = usePostHog()
  
  const handlePianoClick = () => {
    trackPianoView({
      model: piano.name,
      price: piano.price,
      category: piano.category,
      timeSpent: 30,
      sourceSection: 'gallery',
      interactionType: 'view'
    })
  }
  
  return <div onClick={handlePianoClick}>...</div>
}
```

## 🐛 Development & Debugging

### Debug Dashboard (Development Only)

In development mode, a debug dashboard appears in the bottom-right corner:

**Features:**
- **Real-time event monitoring**: See events as they're captured
- **Validation error tracking**: Identify and fix data quality issues  
- **Test event generation**: Generate sample events for testing
- **PostHog status check**: Verify PostHog initialization
- **Event statistics**: Total events, error counts, etc.

**Using the Dashboard:**
1. Click "📊 PostHog Debug" button in bottom-right corner
2. Use action buttons to test, refresh, or clear events
3. Monitor validation errors in real-time
4. Check console for detailed debugging information

### Console Debugging Commands

Available in development mode via `window.postHogDebug`:

```javascript
// Check PostHog initialization status
window.postHogDebug.status()

// Generate test events with validation
window.postHogDebug.testEvents()

// Get event monitor summary
window.postHogDebug.monitor.printSummary()

// View recent events
window.postHogDebug.monitor.getEvents()

// Get validation errors only
window.postHogDebug.monitor.getValidationErrors()

// Manually validate event properties
window.postHogDebug.validateEvent('piano_model_viewed', { /* properties */ })
```

### Error Handling & Recovery

The system includes comprehensive error handling:

1. **Validation Errors**: Invalid properties are sanitized or flagged
2. **Network Failures**: Events are queued and retried
3. **PostHog Unavailable**: Graceful degradation with console warnings
4. **Property Sanitization**: Invalid values are automatically corrected when possible

## 📊 Data Quality Features

### Automatic Property Enhancement

Every event is automatically enhanced with:
```typescript
{
  $timestamp: "2025-01-XX...",           // ISO timestamp
  $source: "kawai_landing_page",         // Source identifier
  $validation_passed: true,              // Validation status
  $session_id: "session_abc123",         // PostHog session ID
  $page_url: "https://...",              // Current page URL
  $user_agent: "Mozilla/5.0..."          // User agent string
}
```

### Data Sanitization

- **String lengths**: Automatically truncated to schema limits
- **Number ranges**: Clamped to min/max values
- **Enum validation**: Invalid enum values trigger warnings
- **Type coercion**: Automatic type conversion when safe
- **Required fields**: Missing required fields block event capture

### Validation Levels

1. **Errors** (Block Event): Missing required fields, invalid types
2. **Warnings** (Allow Event): Unexpected properties, truncated values
3. **Info** (Log Only): Successful validation, property sanitization

## 🚀 Performance Optimizations

### Efficient Validation

- **Schema caching**: Validation schemas are cached in memory
- **Lazy validation**: Only validates known event types
- **Minimal overhead**: < 5ms validation time for typical events
- **Batch processing**: Multiple validations processed efficiently

### Memory Management

- **Event buffer**: Keeps only last 100 events in memory
- **Automatic cleanup**: Old events are automatically purged
- **Development only**: Debug features disabled in production

## 📈 Analytics Integration

### Complementary Tracking

PostHog validation works alongside existing analytics:

```typescript
// Existing GA4 tracking continues
trackKawaiEvent.bookConsultation('hero')

// Enhanced with PostHog validation
eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CONSULTATION_INTENT_SIGNAL, {
  trigger_source: 'hero_cta',
  // ... validated properties
})
```

### Cross-Platform Consistency

Events maintain consistency across:
- **PostHog Analytics**: Deep user behavior analysis
- **Google Analytics 4**: Standard web analytics  
- **Meta Pixel**: Facebook advertising attribution
- **Google Ads**: Conversion tracking

## 🎯 Best Practices

### Event Naming

- Use descriptive, action-based names
- Follow snake_case convention
- Include business context (piano, consultation, etc.)

### Property Guidelines

- **Be specific**: `model_name: "ES120"` vs `piano: "ES120"`
- **Use consistent units**: Always use seconds for time
- **Include context**: Add source_section for user journey analysis
- **Validate enums**: Use TypeScript enums for better type safety

### Development Workflow

1. **Design event schema** before implementation
2. **Add to validation system** with proper types and constraints
3. **Test with debug dashboard** to verify data quality
4. **Monitor validation errors** and fix data issues
5. **Document new events** in this file

### Production Considerations

- **Disable debug features**: Automatic in production builds
- **Monitor validation errors**: Set up alerts for high error rates
- **Regular schema updates**: Keep schemas in sync with business needs
- **Performance monitoring**: Track validation impact on page performance

## 🏗️ System Architecture

### Next.js 15 App Router Integration

The PostHog implementation follows Next.js 15 best practices:

```typescript
// src/components/PostHogProvider.tsx - Official pattern
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export function PostHogProvider({ children }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      // Enhanced configuration with privacy controls
      opt_out_capturing_by_default: !consentManager.hasConsent(),
      bootstrap: bootstrapData,
      before_send: (event) => {
        // Automatic campaign attribution injection
        return { ...event, properties: { ...event.properties, ...attribution }}
      }
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
```

### File Structure Overview

```
src/
├── components/
│   ├── PostHogProvider.tsx         # Main provider with privacy controls
│   ├── PrivacyControls.tsx         # GDPR consent interface
│   └── PostHogDebugDashboard.tsx   # Development debugging tools
├── lib/
│   ├── posthog.ts                  # Client-side PostHog wrapper
│   ├── posthog-server.ts           # Server-side client (enhanced)
│   ├── posthog-config.ts           # Event schemas & configuration
│   ├── posthog-validation.ts       # Real-time validation system
│   ├── consent-manager.ts          # GDPR consent management
│   └── data-retention-config.ts    # Retention policies & cleanup
├── hooks/
│   ├── usePostHog.ts              # React hook for PostHog
│   └── usePageTracking.ts         # Page engagement tracking
├── app/
│   ├── error.tsx                  # Page-level error boundary
│   ├── global-error.tsx           # Global error boundary
│   └── api/error-tracking/route.ts # Server-side error API
└── middleware.ts                  # Feature flag bootstrapping
```

### Privacy-First Architecture Flow

1. **Middleware** → Pre-loads feature flags, sets bootstrap cookies
2. **PostHogProvider** → Initializes with consent-aware configuration
3. **ConsentManager** → Manages user privacy preferences
4. **Event Validation** → Real-time schema validation and sanitization
5. **Data Retention** → Automatic cleanup based on configurable policies

## 🔍 Troubleshooting

### Common Issues

#### PostHog Not Initializing
```javascript
// Check initialization
window.postHogDebug.status()

// Verify environment variables
console.log(process.env.NEXT_PUBLIC_POSTHOG_KEY)
console.log(process.env.NEXT_PUBLIC_POSTHOG_HOST)
```

#### Validation Errors
```typescript
// Check specific event validation
const validation = validateEventProperties('piano_model_viewed', properties)
console.log('Validation result:', validation)
```

#### Events Not Appearing in PostHog
1. **Check network tab**: Verify HTTP requests to PostHog
2. **Verify API key**: Ensure correct PostHog project key
3. **Check PostHog dashboard**: Events may take 1-2 minutes to appear
4. **Debug mode**: Enable PostHog debug mode in configuration
5. **Consent status**: Verify user has given analytics consent

#### Privacy & Consent Issues

```typescript
// Check consent status
window.postHogDebug.consentManager.getConsentStatus() // 'accepted', 'declined', or 'pending'

// Verify PostHog configuration adapts to consent
window.postHogDebug.status() // Shows current PostHog settings

// Test consent flow
window.postHogDebug.consentManager.acceptConsent()
window.postHogDebug.consentManager.declineConsent()
```

#### Feature Flag Bootstrapping Issues

```typescript
// Check bootstrap data in middleware
console.log(document.cookie.includes('ph_bootstrap_data'))

// Verify flags loaded correctly
window.postHog.getAllFlags() // Should show pre-loaded flags

// Debug middleware flag fetching (check server logs)
// Look for "PostHog middleware error" or "PostHog flags API responded"
```

#### Session Recording Not Working

```typescript
// Check recording status
window.postHog.sessionRecording?.status // Should show recording state

// Verify consent for recording
window.postHogDebug.consentManager.hasConsent() // Must be true

// Check sample rate (10% of consented users)
window.postHog.get_config('session_recording').sample_rate
```

### Debug Mode Configuration

```typescript
// Enable debug mode in posthog.ts
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  debug: true, // Enable debug logging
  // ... other config
})
```

## 📚 Resources

### PostHog Documentation
- [Event Tracking](https://posthog.com/docs/product-analytics/capture-events)
- [Feature Flags](https://posthog.com/docs/feature-flags)
- [Session Recording](https://posthog.com/docs/session-replay)

### Code References

#### Core PostHog Files
- `/src/components/PostHogProvider.tsx`: Main provider with Next.js 15 integration
- `/src/lib/posthog.ts`: Client-side PostHog wrapper
- `/src/lib/posthog-server.ts`: Server-side client with cleanup utilities
- `/src/lib/posthog-config.ts`: Event schemas and configuration
- `/src/lib/posthog-validation.ts`: Real-time validation system

#### Privacy & Compliance
- `/src/lib/consent-manager.ts`: GDPR consent management system
- `/src/components/PrivacyControls.tsx`: User privacy interface components
- `/src/lib/data-retention-config.ts`: Comprehensive retention policies

#### Advanced Features  
- `/middleware.ts`: Feature flag bootstrapping and distinct ID management
- `/src/app/error.tsx`: Page-level error boundary with PostHog integration
- `/src/app/global-error.tsx`: Global error boundary for critical errors
- `/src/app/api/error-tracking/route.ts`: Server-side error tracking API

#### React Integration
- `/src/hooks/usePostHog.ts`: React hook for PostHog integration
- `/src/hooks/usePageTracking.ts`: Advanced page engagement tracking
- `/src/components/PostHogDebugDashboard.tsx`: Development debugging tools

#### Configuration Files
- `/next.config.ts`: CSP headers for heatmaps and PostHog integration
- `/POSTHOG_ENHANCEMENTS.md`: Complete implementation summary

### New Debugging Commands

Enhanced debugging capabilities in development:

```javascript
// Privacy & consent debugging
window.postHogDebug.consentManager.getConsentStatus()
window.postHogDebug.consentManager.exportUserData()
window.postHogDebug.consentManager.deleteUserData()

// Feature flag debugging  
window.postHogDebug.getBootstrapData()
window.postHog.getAllFlags()
window.postHog.reloadFeatureFlags()

// Error tracking debugging
window.postHogDebug.testErrorBoundary()
window.postHogDebug.simulateServerError()

// Data retention debugging
window.postHogDebug.dataRetention.getRetentionPolicy('pageviews')
window.postHogDebug.dataRetention.checkCleanupSchedule()
```