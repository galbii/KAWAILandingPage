# Campaign Attribution & Performance Tracking

This document outlines the comprehensive campaign attribution system implemented for tracking campaign effectiveness on the KAWAI Piano Landing Page.

## 🎯 Overview

The campaign attribution system automatically captures, classifies, and tracks all traffic sources and marketing campaigns to measure their effectiveness in driving piano sales conversions.

## 🏗 System Architecture

### Components
1. **Campaign Attribution Manager** (`/src/lib/campaign-attribution.ts`)
2. **Performance Tracking** (`/src/lib/campaign-performance.ts`)
3. **Enhanced PostHog Integration** (automatic attribution on all events)
4. **Debug Dashboard** (development monitoring)

### Data Flow
```
User Visits → Attribution Capture → Session Storage → Event Enhancement → PostHog Analysis
```

## 📊 Attribution Data Captured

### UTM Parameters
All standard UTM parameters are automatically captured:
- `utm_source` - Traffic source (google, facebook, email, etc.)
- `utm_medium` - Traffic medium (cpc, organic, social, email, etc.)
- `utm_campaign` - Campaign name
- `utm_content` - Ad/content variation
- `utm_term` - Keywords (for search campaigns)

### Traffic Source Classification
Automatic classification into standardized categories:
- **`organic`** - Search engine organic results
- **`direct`** - Direct traffic (no referrer)
- **`referral`** - Other websites linking to you
- **`social`** - Social media platforms
- **`email`** - Email marketing campaigns
- **`paid`** - Paid advertising (PPC, display ads)

### Enhanced Attribution Data
- **Referrer Information** - Full referrer URL and domain
- **Attribution Timestamp** - When attribution was first captured
- **Session Context** - Entry page, first visit status
- **Attribution Persistence** - Original vs current session attribution

## 🔧 Implementation Examples

### Basic Usage

The system works automatically once initialized. All PostHog events now include campaign attribution:

```typescript
// This automatically includes campaign attribution
eventMonitor.capture('piano_model_viewed', {
  model_name: 'ES120',
  // ... other properties
})

// Result includes:
// utm_source: 'google'
// utm_medium: 'cpc' 
// utm_campaign: 'piano_sale_2025'
// traffic_source: 'paid'
// referrer_domain: 'google.com'
// attribution_timestamp: '2025-01-15T10:30:00Z'
// is_first_visit: true
```

### Campaign Performance Tracking

Track specific conversions with campaign context:

```typescript
import { campaignAnalytics } from '@/lib/campaign-performance'

// Track piano interest with campaign attribution
campaignAnalytics.trackPianoView({
  model: 'ES120',
  price: '$949', 
  category: 'Digital',
  source: 'hero'
})

// Track consultation booking (highest value conversion)
campaignAnalytics.trackConsultationBooked({
  source: 'modal',
  calendlyStatus: 'completed'
})
```

## 📈 Campaign Analysis Capabilities

### Conversion Attribution
Every conversion is automatically attributed to the original campaign:

```typescript
// Example PostHog event data with attribution:
{
  event: 'consultation_booking_attempt',
  properties: {
    booking_source: 'modal',
    calendly_status: 'completed',
    
    // Campaign Attribution (automatic)
    utm_source: 'facebook',
    utm_medium: 'cpc',
    utm_campaign: 'houston_piano_sale',
    traffic_source: 'paid',
    attribution_timestamp: '2025-01-15T10:30:00Z',
    attribution_type: 'original',
    
    // Session Context
    is_first_visit: true,
    session_entry_page: '/'
  }
}
```

### Campaign ROI Analysis
Conversion values are assigned for ROI calculation:

| Conversion Type | Value | Description |
|---|---|---|
| `consultation_booked` | $100 | High-value lead (actual consultation) |
| `piano_viewed` | $10 | Interest signal |
| `event_info_requested` | $25 | Qualified interest in Houston event |
| `newsletter_signup` | $5 | Future marketing opportunity |

### Performance Queries in PostHog

**1. Campaign Conversion Rate**
```sql
-- Events: consultation_booking_attempt
-- Breakdown: utm_campaign
-- Formula: Count / Unique users
```

**2. Cost Per Acquisition by Source**
```sql
-- Events: consultation_booking_attempt  
-- Breakdown: utm_source
-- Filter: calendly_status = 'completed'
```

**3. Piano Model Interest by Campaign**
```sql
-- Events: piano_model_viewed
-- Breakdown: utm_campaign, model_name
-- Visualization: Stacked bar chart
```

## 🎨 Traffic Source Classification Logic

### UTM-Based Classification (Primary)
```typescript
utm_medium = 'cpc' | 'paid' | 'ppc' → 'paid'
utm_medium = 'email' | 'newsletter' → 'email'
utm_medium = 'social' → 'social'
utm_medium = 'organic' → 'organic'
utm_medium = 'referral' → 'referral'
```

### Referrer-Based Classification (Fallback)
```typescript
// Social Media Referrers
facebook.com, twitter.com, instagram.com → 'social'

// Search Engines
google.com, bing.com, yahoo.com → 'organic'

// Email Clients
gmail.com, outlook.com → 'email'

// Other Domains
[any other referrer] → 'referral'

// No Referrer
[empty referrer] → 'direct'
```

## 🔍 Development & Testing

### Debug Dashboard
In development mode, the PostHog Debug Dashboard shows:
- **Campaign Attribution** - Current UTM parameters and traffic source
- **Attribution Age** - How long ago attribution was captured
- **Visitor Type** - New vs returning visitor
- **Referrer Information** - Full referrer details

### Console Debugging
```javascript
// Check campaign attribution
window.campaignAttribution.manager.debug()

// Get current campaign data
window.campaignAttribution.getCampaignString()
window.campaignAttribution.getTrafficSource()

// Test campaign performance tracking
window.campaignPerformance.trackConversion('piano_viewed', {
  piano_model: 'ES120'
})
```

### Testing Different Campaigns

Test various campaign scenarios by visiting with UTM parameters:

```
# Google Ads Campaign
https://yoursite.com/?utm_source=google&utm_medium=cpc&utm_campaign=piano_sale_houston

# Facebook Ads Campaign  
https://yoursite.com/?utm_source=facebook&utm_medium=paid&utm_campaign=piano_video_ad

# Email Campaign
https://yoursite.com/?utm_source=newsletter&utm_medium=email&utm_campaign=monthly_deals

# Social Media Post
https://yoursite.com/?utm_source=instagram&utm_medium=social&utm_campaign=shsu_partnership
```

## 📊 Campaign Performance Dashboard

### Key Metrics to Track in PostHog

**1. Traffic Source Performance**
- Sessions by traffic source
- Conversion rate by traffic source  
- Average session quality by source

**2. Campaign Effectiveness**
- UTM campaign performance ranking
- Cost per conversion by campaign
- Piano model interest by campaign

**3. Attribution Analysis**
- First-touch vs last-touch attribution
- Multi-session conversion paths
- Attribution window analysis

**4. ROI Calculation**
- Total conversion value by campaign
- Campaign cost (external data) vs PostHog conversion value
- Customer lifetime value by acquisition source

### Sample PostHog Insights

**Top Converting Campaigns:**
```sql
SELECT 
  utm_campaign,
  COUNT(*) as conversions,
  COUNT(*) / COUNT(DISTINCT person_id) as conversion_rate
FROM events 
WHERE event = 'consultation_booking_attempt'
  AND properties.calendly_status = 'completed'
GROUP BY utm_campaign
ORDER BY conversions DESC
```

**Piano Interest by Traffic Source:**
```sql
SELECT 
  traffic_source,
  properties.model_name,
  COUNT(*) as views
FROM events
WHERE event = 'piano_model_viewed'
GROUP BY traffic_source, properties.model_name
ORDER BY views DESC
```

## 🎯 Business Impact for KAWAI Piano Sales

### Campaign Optimization Opportunities

**1. Budget Allocation**
- Identify highest-converting traffic sources
- Reallocate budget from low-performing campaigns
- Scale successful campaigns

**2. Creative Testing**
- Test different ad creatives via utm_content
- A/B test landing page elements with feature flags
- Optimize messaging for different traffic sources

**3. Audience Targeting**
- Understand which traffic sources prefer which piano models
- Tailor campaigns to audience preferences
- Create lookalike audiences based on high-value conversions

**4. Attribution Insights**
- Understand typical customer journey length
- Optimize attribution windows for campaign measurement
- Identify assist campaigns vs final-touch campaigns

### Conversion Path Analysis
Track complete customer journeys:
```
Google Ad Click → Piano Gallery Browse → Consultation Modal → Booking Completed
     ↓              ↓                    ↓                  ↓
  Paid Traffic    Interest Signal    High Intent       Conversion
  ($1 cost)       ($10 value)       ($50 value)      ($100 value)
```

## 🚀 Advanced Features

### Session-Based Attribution
- **First-touch attribution** - Credit to original campaign
- **Last-touch attribution** - Credit to most recent campaign  
- **Multi-touch analysis** - See all touchpoints in customer journey

### Attribution Persistence
- **localStorage** - Persistent across browser sessions
- **sessionStorage** - Current session attribution
- **PostHog profiles** - Long-term user attribution history

### Custom Attribution Windows
Configure different attribution windows for different conversion types:
- **Consultation bookings** - 30-day attribution window
- **Piano model views** - 7-day attribution window  
- **Newsletter signups** - 1-day attribution window

## 🔒 Privacy & Compliance

### Data Collection
- **No PII in UTM parameters** - Only campaign identifiers
- **Consent-aware tracking** - Respects user privacy preferences
- **GDPR compliance** - Attribution data can be deleted on request

### Data Retention
- **Campaign attribution** - Stored for 30 days in localStorage
- **Session attribution** - Cleared when browser session ends
- **PostHog events** - Follow PostHog data retention policies

## 📚 Resources

### Documentation
- [PostHog UTM Attribution Guide](https://posthog.com/docs/data/utm-segmentation)
- [Campaign Attribution Best Practices](https://posthog.com/docs/product-analytics/attribution)

### Code References
- `/src/lib/campaign-attribution.ts` - Core attribution logic
- `/src/lib/campaign-performance.ts` - Performance tracking
- `/src/lib/posthog-validation.ts` - Automatic event enhancement
- `/src/components/PostHogDebugDashboard.tsx` - Debug tools