# PostHog Integration for KAWAI Piano Landing Page

This document outlines the comprehensive PostHog integration implemented for the KAWAI piano sales landing page, designed to complement the existing GA4, GTM, and Meta Pixel analytics stack.

## 🎯 Overview

PostHog has been integrated to provide:
- **Session recordings** of piano browsing behavior
- **Advanced funnel analysis** for consultation bookings  
- **Feature flags** for A/B testing CTAs and layouts
- **User segmentation** based on piano preferences and engagement
- **Real-time insights** into user behavior patterns

## 📁 File Structure

```
src/
├── lib/
│   ├── posthog.ts              # Core PostHog analytics class
│   ├── posthog-config.ts       # Configuration and constants
│   └── analytics.ts            # Enhanced with PostHog integration
├── components/
│   ├── PostHogProvider.tsx     # PostHog context provider
│   ├── PostHogFeatures.tsx     # A/B testing components
│   └── PianoConsultationDialog.tsx # Enhanced with PostHog tracking
└── hooks/
    └── usePostHog.ts           # PostHog React hook
```

## 🔧 Configuration

### Environment Variables
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_7sH8Nnnif69BbjSSMWJ91J7GJHTrJ4EZkLcJ1bKmfWB
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Key Features Enabled
- **Person profiles**: Only for identified users (lead qualification)
- **Session recordings**: Selective based on engagement score
- **Autocapture**: Disabled (manual tracking for precision)
- **Privacy**: Email capture enabled for lead qualification

## 📊 Event Tracking

### Piano-Specific Events

#### 1. Piano Model Viewed
```typescript
posthog.capture('piano_model_viewed', {
  model_name: 'ES120',
  model_price: '$949',
  model_category: 'Digital',
  time_spent_seconds: 45,
  source_section: 'featured_deals',
  interaction_type: 'view'
})
```

#### 2. Consultation Intent Signal
```typescript
posthog.capture('consultation_intent_signal', {
  trigger_source: 'hero_cta',
  models_viewed_count: 2,
  session_duration_seconds: 120,
  engagement_score: 85,
  time_to_intent_seconds: 23,
  high_intent: true
})
```

#### 3. Piano Interest Profile
```typescript
posthog.capture('piano_interest_profile', {
  interested_models: ['ES120', 'K200'],
  price_range: 'mid',
  category_preference: 'Digital',
  lead_score: 85,
  session_engagement: {
    time_spent_seconds: 340,
    scroll_depth_percent: 75,
    interaction_count: 5
  }
})
```

### Consultation Funnel Events

#### 1. Booking Attempt
```typescript
posthog.capture('consultation_booking_attempt', {
  booking_source: 'modal',
  calendly_status: 'opened',
  session_quality: 85,
  user_type: 'returning'
})
```

#### 2. Booking Abandonment
```typescript
posthog.capture('consultation_booking_attempt', {
  booking_source: 'modal',
  calendly_status: 'abandoned',
  abandonment_stage: 'time_selection'
})
```

### Event Attendance Tracking

```typescript
posthog.capture('kawai_event_interest', {
  event_dates: 'September 11-14, 2025',
  event_location: 'Houston, TX',
  interaction_type: 'save_date'
})
```

## 🔍 User Segmentation

### Lead Scoring Algorithm
Users are scored 0-100 based on:
- **Time engagement** (0-30 points)
- **Scroll depth** (0-25 points)  
- **Interaction count** (0-25 points)
- **Piano interest depth** (0-20 points)

### User Properties
- `piano_preferences`: Array of viewed piano models
- `budget_range`: 'entry', 'mid', 'premium', or 'mixed'
- `experience_level`: 'beginner', 'intermediate', 'advanced'
- `lead_score`: Calculated engagement score (0-100)
- `consultation_status`: Booking funnel stage

## 🎬 Session Recordings

### Recording Triggers
Sessions are recorded when users show:
- **High engagement score** (>70)
- **Consultation intent** (CTA clicks)
- **Multiple piano views** (>3 models)
- **Long session duration** (>2 minutes)

### Privacy Configuration
- **Email**: Captured (for lead qualification)
- **Phone**: Captured (for lead qualification)
- **Passwords**: Masked
- **Credit cards**: Masked

## 🧪 Feature Flags & A/B Testing

### Available Tests

#### 1. Hero CTA Variations
- `book-consultation`: "Book Your Piano Consultation" 
- `find-piano`: "Find Your Perfect Piano"
- `secure-spot`: "Secure Your Spot Today"

#### 2. Piano Gallery Layout
- `grid`: Traditional grid layout
- `carousel`: Horizontal scrolling carousel
- `list_detailed`: Detailed list with descriptions

#### 3. Countdown Timer Position
- `hero`: In hero section
- `floating`: Floating top-right
- `booking_section`: In booking section

### Implementation Example
```tsx
import { usePostHog } from '@/hooks/usePostHog'

function HeroSection() {
  const { getFeatureFlag } = usePostHog()
  const ctaVariation = getFeatureFlag('hero-cta-variation')
  
  return (
    <CTAButtonWithVariations 
      variation={ctaVariation}
      onClick={handleConsultationClick}
      source="hero"
    />
  )
}
```

## 📈 Analytics Dashboards

### Key Metrics to Track

#### Conversion Funnel
1. Page View → Piano Model Viewed (Awareness)
2. Piano Model Viewed → Consultation Intent (Interest)  
3. Consultation Intent → Booking Attempt (Consideration)
4. Booking Attempt → Booking Completed (Conversion)

#### Lead Quality Metrics
- **Lead Score Distribution**: Histogram of user engagement scores
- **High-Intent Users**: Users with score >70
- **Piano Preference Segments**: Digital vs Acoustic vs Hybrid interest
- **Price Range Targeting**: Entry vs Mid vs Premium piano interest

#### A/B Test Performance
- **CTA Conversion Rates**: By variation
- **Gallery Engagement**: Time spent by layout type
- **Mobile vs Desktop**: Behavior differences

## 🔄 Integration with Existing Analytics

### Complementary Approach
PostHog **enhances** rather than **replaces** existing tracking:

- **GA4**: Continues handling pageviews, standard events
- **Meta Pixel**: Continues Facebook advertising attribution
- **GTM**: Continues tag management
- **PostHog**: Adds session recordings, funnel analysis, feature flags

### Data Consistency
Events are tracked in both systems with consistent naming:
```typescript
// Existing GA4 tracking continues
sendGAEvent('event', 'button_click', { ... })

// PostHog adds deeper context
posthog.capture('consultation_intent_signal', { ... })
```

## 🛠 Development Usage

### Using the PostHog Hook
```tsx
import { usePostHog } from '@/hooks/usePostHog'

function PianoCard({ piano }) {
  const { trackPianoView } = usePostHog()
  
  const handleViewPiano = () => {
    trackPianoView({
      model: piano.name,
      price: piano.price,
      category: piano.category,
      timeSpent: 0,
      sourceSection: 'piano_gallery',
      interactionType: 'view'
    })
  }
  
  return <div onClick={handleViewPiano}>...</div>
}
```

### Identifying Users
```typescript
// When user books consultation
const { identifyUser } = usePostHog()

identifyUser({
  email: 'customer@example.com',
  consultationBooked: true,
  pianoPreferences: ['ES120', 'K200']
})
```

## 🎯 Success Metrics

### Key Performance Indicators
1. **Consultation Conversion Rate**: % of visitors who book consultations
2. **Lead Quality Score**: Average engagement score of converted leads
3. **Session Recording Insights**: Number of UX improvements identified
4. **A/B Test Winners**: Performance lift from optimized variations
5. **User Journey Optimization**: Reduced drop-off points in funnel

### Expected Improvements
- **+15%** consultation booking rate through A/B testing
- **+25%** lead quality score through better targeting
- **-30%** booking abandonment through UX insights
- **+20%** mobile conversion rate through device optimization

## 🔒 Privacy & Compliance

### Data Collection
- **GDPR Compliant**: User consent managed through existing systems
- **Selective Recording**: Only high-value sessions recorded
- **Anonymization**: No PII in event properties except for leads
- **Retention**: Standard PostHog data retention policies

### Security
- **API Key**: Stored in environment variables
- **HTTPS Only**: All data transmission encrypted
- **Access Control**: Limited to authorized team members

## 🚀 Next Steps

### Phase 1: Foundation ✅
- [x] PostHog initialization and basic events
- [x] Consultation funnel tracking
- [x] Session recording setup

### Phase 2: Advanced Features (In Progress)
- [ ] Complete A/B test implementation
- [ ] Custom dashboard creation
- [ ] Lead scoring automation

### Phase 3: Optimization
- [ ] Predictive analytics integration
- [ ] Advanced cohort analysis
- [ ] Cross-session attribution modeling

## 📞 Support

For questions about the PostHog implementation:
- **Analytics Team**: Review event tracking and dashboards
- **Development Team**: Modify tracking code and feature flags
- **Marketing Team**: Interpret insights and optimization opportunities

## 📚 Resources

- [PostHog Documentation](https://posthog.com/docs)
- [Feature Flags Guide](https://posthog.com/docs/feature-flags)
- [Session Recordings](https://posthog.com/docs/session-replay)
- [Funnel Analysis](https://posthog.com/docs/user-guides/funnels)