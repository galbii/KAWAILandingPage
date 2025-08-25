# PostHog Event Tracking & Validation System

This document outlines the comprehensive event tracking and validation system implemented for the KAWAI Piano Landing Page using PostHog analytics.

## 🎯 Overview

The system provides:
- **Real-time event validation** with schema enforcement  
- **Comprehensive error handling** and debugging tools
- **Development dashboard** for monitoring event flow
- **Automatic event sanitization** and data quality assurance
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
- `/src/lib/posthog-validation.ts`: Core validation system
- `/src/lib/posthog-config.ts`: Event schemas and configuration
- `/src/hooks/usePostHog.ts`: React hook for PostHog integration
- `/src/components/PostHogDebugDashboard.tsx`: Development debugging tools