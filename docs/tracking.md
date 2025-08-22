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
- Consultation booking rate
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

**Last Updated:** January 2025  
**GA4 Property:** G-P91EKWK0XB  
**Implementation Files:** `src/lib/analytics.ts`, `src/hooks/usePageTracking.ts`, `src/components/WebVitals.tsx`