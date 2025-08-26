# Analytics & Tracking Documentation

This document outlines the comprehensive analytics tracking system implemented in the KAWAI Piano Landing Page.

## Overview

The tracking system uses **Google Analytics 4 (GA4)** with a custom analytics wrapper built on `@next/third-parties/google` to provide detailed insights into user behavior, conversions, and performance metrics.

**GA4 Property ID:** `G-P91EKWK0XB`

## Architecture

The analytics system is built on a **3-layer architecture**:

### Layer 1: Analytics Foundation (`src/lib/analytics.ts`)
Core tracking utilities and event management

### Layer 2: Behavioral Tracking (`src/hooks/usePageTracking.ts`)
Automated behavior tracking and engagement metrics

### Layer 3: Component Integration
Event tracking integrated directly into React components

## Tracking Categories

### 1. High-Value Conversions
**Primary business objectives tracked:**

- **Consultation Bookings** - Primary conversion goal
- **Event Registration** - "Secure Your Spot" actions  
- **Phone Calls** - Clicks to 713-904-0001
- **Email Contacts** - Clicks to info@kawaipianoshouston.com
- **Private Tour Scheduling** - Showroom visit requests
- **Calendly Appointment Bookings** - Piano consultation scheduling (HIGHEST VALUE)
- **Calendly Funnel Tracking** - Widget load → Event browsing → Time selection → Booking completed
- **Newsletter Signups** - Email list growth

### 2. User Engagement & Behavior
**Comprehensive user interaction tracking:**

- **Scroll Depth** - Tracked at 25%, 50%, 75%, 90% thresholds
- **Engagement Time** - Active time spent on page (visibility-aware)
- **Session Quality Score** - 0-100 rating based on time + scroll + interactions
- **Exit Intent Detection** - Mouse leaving through top of page
- **Interaction Counting** - Clicks, keystrokes, mouse movement
- **Content Interaction** - Time-to-interaction for specific elements

### 3. Performance Monitoring
**Technical performance metrics:**

- **Core Web Vitals** - LCP, FID, CLS, INP, TTFB, FCP
- **Performance Ratings** - Good/Needs-Improvement/Poor classifications
- **Next.js Metrics** - Framework-specific performance data
- **Custom Timing Events** - Application-specific performance markers

### 4. Piano Sale-Specific Events
**Business-specific tracking:**

- **Piano Discovery** - "Find Your Piano" interactions
- **Showroom Directions** - Location-based requests
- **September 2025 Event Attribution** - Campaign-specific tracking
- **KAWAI Brand Interactions** - Brand engagement metrics

## Technical Implementation

### Event Tracking Functions

#### Core Event Types
```typescript
// Generic button clicks
trackEvent.buttonClick(buttonText, location, additionalData)

// Lead generation (high-value actions)
trackEvent.generateLead(action, location, additionalData)

// Contact interactions
trackEvent.contact(method, location, additionalData)

// Newsletter signups
trackEvent.signUp(location, additionalData)

// Information requests
trackEvent.viewInfo(contentType, location, additionalData)
```

#### KAWAI-Specific Events
```typescript
// Consultation booking (highest priority)
trackKawaiEvent.bookConsultation(source)

// Piano browsing
trackKawaiEvent.findPiano(source)

// Event registration
trackKawaiEvent.secureSpot(source)

// Contact actions
trackKawaiEvent.callPhone(source)
trackKawaiEvent.emailContact(source)

// Location requests
trackKawaiEvent.getDirections(source)

// Tour scheduling
trackKawaiEvent.scheduleTour(source)

// Newsletter subscription
trackKawaiEvent.subscribeNewsletter(source)

// Calendly conversion tracking (HIGHEST PRIORITY)
trackKawaiEvent.calendlyConversion(source)

// Calendly interaction tracking (funnel steps)
trackKawaiEvent.calendlyInteraction(interaction, source)
```

### GA4 Event Structure Examples

#### High-Value Conversion
```javascript
{
  event: 'generate_lead',
  event_category: 'lead_generation',
  action: 'consultation_booking',
  location: 'hero',
  value: 1,
  event_type: 'piano_consultation',
  event_date: 'september_2025'
}
```

#### User Behavior Tracking
```javascript
// Scroll tracking
{
  event: 'scroll',
  event_category: 'engagement',
  scroll_depth: 50,
  page_section: 'kawai_piano_sale_landing',
  value: 50
}

// Session quality assessment
{
  event: 'session_quality',
  event_category: 'engagement',
  quality_score: 85,
  interaction_count: 12,
  session_time: 180,
  value: 85
}

// Calendly appointment booking (HIGHEST VALUE)
{
  event: 'generate_lead',
  event_category: 'lead_generation',
  action: 'calendly_appointment_scheduled',
  location: 'modal', // or 'booking_section'
  value: 50,
  event_type: 'piano_consultation',
  event_date: 'september_2025',
  calendly_source: 'modal',
  conversion_value: 50
}

// Calendly funnel step tracking
{
  event: 'select_content',
  content_type: 'booking_interface',
  item_name: 'calendly_time_selected',
  interaction_type: 'time_selected',
  calendly_source: 'booking_section',
  event_type: 'calendly_engagement'
}
```

#### Performance Metrics
```javascript
{
  event: 'web_vital',
  event_category: 'performance',
  metric_name: 'LCP',
  metric_value: 2300,
  metric_rating: 'good',
  metric_id: 'v3-1234567890',
  value: 2300
}
```

## Page-Level Setup

### Main Page Configuration
```typescript
// In src/app/page.tsx
const { trackContentInteraction } = usePageTracking({
  pageName: 'kawai_piano_sale_landing',
  enableScrollTracking: true,
  enableTimeTracking: true,
  enableExitIntent: true,
  scrollThresholds: [25, 50, 75, 90],
  timeUpdateInterval: 30000 // Update every 30 seconds
});
```

### Component Integration Example
```typescript
// In HeroSection.tsx
const handleFindPianoClick = () => {
  trackKawaiEvent.findPiano('hero');  // Track immediately
  
  // Then execute UI logic
  const featuredDealsSection = document.getElementById('featured-deals');
  if (featuredDealsSection) {
    featuredDealsSection.scrollIntoView({ behavior: 'smooth' });
  }
};
```

## Behavioral Tracking Features

### Automatic Event Detection
- **Scroll Tracking** - `window.scroll` listener with percentage calculation
- **Time Tracking** - `setInterval` + `visibilitychange` for active engagement
- **Interaction Tracking** - Multiple event listeners: `['click', 'keydown', 'mousemove', 'touchstart']`
- **Exit Intent** - `mouseleave` detection when `clientY <= 0`

### Real-Time Data Collection
- **30-second intervals** - Engagement updates sent regularly
- **Scroll milestones** - Immediate tracking at threshold crossings
- **Performance monitoring** - Continuous Web Vitals collection
- **Session quality scoring** - Dynamic quality assessment

## Performance Optimizations

### Technical Features
- **Browser-only execution** - `isBrowser` checks prevent SSR issues
- **Throttled scroll events** - 100ms throttling prevents performance degradation
- **Visibility-aware timing** - Only tracks engagement when tab is active
- **Automatic cleanup** - Event listeners removed on component unmount
- **Development logging** - Console output in dev mode for debugging

### Data Quality
- **Structured event categorization** - Consistent naming conventions
- **Source attribution** - All events include location context
- **Value assignment** - Numeric values for conversion tracking
- **Event deduplication** - Prevents duplicate tracking of same actions

## Monitoring & Debugging

### Development Mode
- Console logging enabled for all tracking events
- Web Vitals metrics displayed in browser console
- Event structure validation

### Production Monitoring
- GA4 Real-time reports for immediate feedback
- Custom event validation through GA4 DebugView
- Performance metrics tracked via Core Web Vitals

## Calendly Integration & Conversion Tracking

### Overview
The Calendly booking system provides **the highest value conversion tracking** on the site. It includes comprehensive funnel tracking from initial widget load through completed appointment booking.

### Calendly Tracking Architecture

**Two Integration Points:**
1. **Modal Popup** - Triggered by CTA buttons across the page
2. **Inline Widget** - Dedicated booking section on the page

**Both locations track the complete funnel with proper source attribution.**

### Calendly Event Flow & Tracking

#### 1. Widget Load (`calendly.profile_page_viewed`)
**Google Analytics:**
```javascript
{
  event: 'select_content',
  content_type: 'booking_interface', 
  interaction_type: 'widget_load'
}
```

**Meta Pixel:**
```javascript
fbq('track', 'ViewContent', {
  content_category: 'appointment_scheduling',
  content_type: 'booking_interface'
})
```

**PostHog:**
```javascript
{
  event: 'calendly_widget_loaded',
  booking_source: 'modal' | 'booking_section',
  funnel_step: 'widget_load'
}
```

#### 2. Event Browsing (`calendly.event_type_viewed`)
**Google Analytics:**
```javascript
{
  event: 'select_content',
  content_type: 'booking_interface',
  item_name: 'calendly_event_type_viewed'
}
```

**Meta Pixel:**
```javascript
fbq('track', 'ViewContent', {
  content_name: 'calendly_event_type_viewed',
  content_category: 'appointment_scheduling'
})
```

#### 3. Time Selection (`calendly.date_and_time_selected`)
**Google Analytics:**
```javascript
{
  event: 'select_content',
  content_type: 'booking_interface',
  item_name: 'calendly_time_selected',
  interaction_type: 'time_selected'
}
```

**Meta Pixel:**
```javascript
fbq('track', 'ViewContent', {
  content_name: 'calendly_time_selected',
  booking_step: 'time_selected'
})
```

**PostHog:**
```javascript
{
  event: 'consultation_booking_attempt',
  calendly_status: 'time_selected',
  funnel_step: 'time_selection',
  engagement_level: 'high'
}
```

#### 4. Appointment Booking (`calendly.invitee_scheduled`)
**Google Analytics (Primary Conversion):**
```javascript
{
  event: 'generate_lead',
  event_category: 'lead_generation',
  action: 'calendly_appointment_scheduled',
  value: 50,
  conversion_value: 50
}
```

**Meta Pixel (Primary Conversion):**
```javascript
fbq('track', 'CompleteRegistration', {
  content_name: 'piano_consultation_appointment',
  value: 100,
  currency: 'USD',
  appointment_type: 'piano_consultation'
})

fbq('track', 'Schedule', {
  content_name: 'calendly_appointment_booked',
  value: 50,
  booking_platform: 'calendly'
})
```

**Google Ads Conversion:**
```javascript
gtag('event', 'conversion', {
  'send_to': 'AW-755074614',
  'value': 1.0,
  'currency': 'USD'
})
```

### Server-Side Webhook Tracking
**Additional tracking occurs via Calendly webhooks** when appointments are actually confirmed:

**PostHog Server Event:**
```javascript
{
  event: 'calendly_appointment_booked',
  booking_source: 'modal' | 'booking_section' | 'direct',
  invitee_name: 'Customer Name',
  invitee_email: 'customer@email.com',
  scheduled_time: '2025-09-15T14:00:00Z',
  lead_score: 85, // Calculated quality score
  $server_side: true
}
```

### Funnel Analysis & Attribution

**Complete Conversion Funnel:**
1. **Widget Load** → Initial interest
2. **Event Browsing** → Engagement with service details  
3. **Time Selection** → High intent signal
4. **Appointment Booking** → Conversion completed
5. **Webhook Confirmation** → Server-side verification

**Source Attribution:**
- `modal` - Bookings from CTA button popups
- `booking_section` - Bookings from inline section
- `direct` - Direct Calendly links (if any)

### Key Performance Indicators

**Primary Metrics:**
- **Calendly Conversion Rate** - Appointments booked / Widget loads
- **Funnel Drop-off Analysis** - Step-by-step completion rates
- **Source Performance** - Modal vs inline booking rates
- **Lead Quality Score** - Average qualification of booked appointments

**Advanced Metrics:**
- Time from widget load to booking completion
- Mobile vs desktop conversion rates
- Return visitor booking rates
- Cross-session booking behavior

## Data Flow

**Complete tracking flow from user action to GA4:**

1. **User Action** - User interacts with page element
2. **Component Handler** - React component event handler fires
3. **Analytics Layer** - Custom tracking function called
4. **Event Processing** - Data structured for GA4 format
5. **GA4 Transmission** - `sendGAEvent()` sends to Google Analytics
6. **Data Collection** - Event appears in GA4 with full context

## Key Metrics Dashboard

### Conversion Metrics
- **Calendly appointment booking rate** (PRIMARY CONVERSION)
- Calendly funnel completion rate (Widget Load → Time Selection → Booking)
- Consultation booking rate (overall)
- Event registration conversions
- Phone call click-through rate
- Email contact engagement
- Newsletter subscription rate

### Engagement Metrics
- Average session duration (active time)
- Scroll depth distribution
- Session quality score distribution
- Exit intent trigger rate
- Content interaction frequency

### Performance Metrics
- Core Web Vitals trends
- Page load performance
- User experience quality ratings
- Technical performance optimization opportunities

---

---

## Implementation Files & Dependencies

### Core Analytics Files
- **`src/lib/analytics.ts`** - Main analytics wrapper with Google Analytics, Meta Pixel, and Google Ads integration
- **`src/lib/calendly-tracking.ts`** - Calendly PostMessage event handling and tracking
- **`src/lib/posthog.ts`** - PostHog client-side integration
- **`src/lib/posthog-server.ts`** - PostHog server-side tracking for webhooks
- **`src/lib/posthog-validation.ts`** - Event validation and monitoring system
- **`src/hooks/usePageTracking.ts`** - Automated behavioral tracking hook
- **`src/components/WebVitals.tsx`** - Performance monitoring component

### Calendly Integration Files
- **`src/components/sections/BookingSection.tsx`** - Inline Calendly widget implementation
- **`src/components/PianoConsultationDialog.tsx`** - Modal Calendly widget implementation
- **`src/app/api/bookings/route.ts`** - Webhook endpoint for server-side tracking

### Configuration Files
- **`next.config.ts`** - CSP headers configured for Calendly iframe support
- **`CALENDLY_WEBHOOK_SETUP.md`** - Complete webhook configuration guide

## Platform Integration Status

### ✅ Active Tracking Platforms
- **Google Analytics 4** (Property: `G-P91EKWK0XB`) - Complete conversion and funnel tracking
- **Meta Pixel** - Lead generation and conversion optimization
- **Google Ads** (Account: `AW-755074614`) - Conversion tracking and attribution
- **PostHog** - Advanced funnel analysis and user behavior tracking
- **Campaign Performance Analytics** - Custom attribution and ROI tracking

### 🎯 Conversion Values & Attribution
- **Calendly Appointments**: GA4 value: 50, Meta Pixel value: $100 USD
- **Lead Generation Events**: GA4 value: 1, Meta Pixel value: $1 USD + $500 predicted LTV
- **Google Ads Conversions**: $1.00 USD per appointment booking
- **Source Attribution**: Modal vs Booking Section vs Direct tracking

## Testing & Validation

### Development Testing
```javascript
// Available in browser console during development:
window.postHogDebug.status()                    // Check PostHog initialization
window.postHogDebug.monitor.getEvents()         // View captured events
window.postHogDebug.testEvents()               // Run validation tests

// Manual event testing:
window.postMessage({
  event: 'calendly.date_and_time_selected',
  payload: { test: true }
}, '*')
```

### Production Monitoring
- **GA4 Real-time Reports** - Immediate conversion visibility
- **GA4 DebugView** - Event structure validation
- **Meta Pixel Helper** - Facebook tracking verification
- **PostHog Session Recordings** - User journey analysis (high-intent sessions only)

## Privacy & Compliance

### Data Collection Standards
- **GDPR Compliant** - User consent management via ConsentBanner component
- **Cookie Classification** - Strictly necessary, functional, performance, targeting
- **Data Retention** - Standard platform retention policies
- **PII Protection** - Email addresses used as PostHog distinct IDs only for legitimate business purposes

### Security Measures  
- **Webhook Signature Verification** - HMAC-SHA256 validation for Calendly webhooks
- **CSP Headers** - Strict content security policy with Calendly exceptions
- **Server-side Validation** - All webhook data validated before tracking
- **Client-side Sanitization** - Event properties cleaned and validated

---

**Last Updated:** August 2025  
**GA4 Property:** G-P91EKWK0XB  
**Meta Pixel ID:** Active (configured in analytics.ts)  
**Google Ads ID:** AW-755074614  
**PostHog Integration:** Active with event monitoring