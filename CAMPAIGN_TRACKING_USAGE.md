# Campaign Tracking Implementation Guide

## Overview

The PostHog campaign tracking system has been successfully implemented with support for the UTD (University of Texas at Dallas) campaign. The system automatically tracks campaign context and enhances all events with campaign-specific properties.

## Key Features

- **Automatic Campaign Detection**: Routes are automatically detected and mapped to campaigns
- **Enhanced Event Tracking**: All events include campaign context (UTD vs Main campaign)
- **UTM Data Generation**: Automatic UTM equivalent data for attribution
- **Schema Validation**: Extended validation for all campaign properties
- **Source Section Enhancement**: Format like `university-dallas:gallery` for better analytics

## Usage Examples

### 1. Using Campaign Context in Components

```tsx
// In any component within /university-dallas/ routes
import { usePostHog } from '@/hooks/usePostHog'

function PianoCard({ piano }) {
  const { trackPianoView, getCampaignContext } = usePostHog()
  
  // Get current campaign context
  const campaign = getCampaignContext()
  console.log('Current campaign:', campaign.partner) // "UTD" for university-dallas
  
  const handlePianoClick = () => {
    trackPianoView({
      model: piano.name,
      price: piano.price,
      category: piano.category,
      timeSpent: 30,
      sourceSection: 'gallery', // Will become "university-dallas:gallery"
      interactionType: 'view'
    })
    // Campaign context is automatically added!
  }
  
  return <div onClick={handlePianoClick}>...</div>
}
```

### 2. Enhanced Event Properties

Events automatically include these campaign properties:

```typescript
{
  // Original event properties
  model_name: "CA99",
  model_price: "$4,799",
  source_section: "university-dallas:gallery",
  
  // Automatic campaign context
  campaign_id: "utd-partnership-2025",
  partner: "UTD",
  event_context: "university_partnership",
  page_variant: "university-dallas",
  target_audience: "students_faculty",
  campaign_type: "university_partnership",
  university: "University of Texas at Dallas",
  program_focus: "music_education",
  
  // UTM equivalent data
  utm_source: "utd",
  utm_medium: "partnership",
  utm_campaign: "utd-partnership-2025",
  utm_content: "university-dallas",
  utm_term: "students_faculty"
}
```

## Testing the Implementation

### Development Console Commands

In development mode, you can test the campaign tracking:

```javascript
// Test all campaign functionality
window.campaignDebug.testCampaignTracking()

// Get campaign context for current page
window.campaignDebug.getCampaignContext(window.location.pathname)

// Test event validation
window.postHogDebug.testEvents()

// Monitor events in real-time
window.postHogDebug.monitor.printSummary()
```

### Running Tests

1. **Build Test**: `bun run build` ✅ (Passed)
2. **Lint Test**: `bun run lint` ✅ (Passed)
3. **Campaign Tests**: Available via `window.campaignDebug.testCampaignTracking()`

## Campaign Configuration

### UTD Campaign (University of Texas at Dallas)

- **Routes**: `/university-dallas`, `/university-dallas/`
- **Partner**: `UTD`
- **Campaign Type**: `university_partnership`
- **Target Audience**: `students_faculty`

### Main Campaign

- **Routes**: `/`, `/home`
- **Partner**: `kawai_direct`
- **Campaign Type**: `direct_marketing`
- **Target Audience**: `general_public`

## Analytics Benefits

With this implementation, you can now analyze:

1. **Campaign Performance Comparison**
   ```sql
   SELECT campaign_id, COUNT(*) as piano_views
   FROM piano_model_viewed 
   GROUP BY campaign_id
   ```

2. **UTD Partnership Effectiveness**
   ```sql
   SELECT partner, target_audience, COUNT(*) as consultations
   FROM consultation_intent_signal 
   WHERE partner = 'UTD'
   ```

3. **Source Attribution**
   ```sql
   SELECT page_variant, source_section, COUNT(*) 
   FROM piano_model_viewed
   GROUP BY page_variant, source_section
   ```

## Implementation Status

- ✅ Campaign context system implemented
- ✅ PostHog hook enhanced with campaign support
- ✅ Event validation schemas extended
- ✅ Campaign testing utilities created
- ✅ Build and lint verification passed
- ✅ Ready for use in university-dallas components

## Next Steps

1. **Update Components**: University-dallas components now automatically use enhanced tracking
2. **Monitor Events**: Use PostHog dashboard to verify campaign data is flowing correctly
3. **Create Dashboards**: Set up PostHog dashboards to compare UTD vs Main campaign performance
4. **A/B Testing**: Use campaign context for targeted feature flags and experiments

## Development Tools

- **Campaign Context Testing**: `window.campaignDebug.*`
- **PostHog Event Monitoring**: `window.postHogDebug.*`
- **Validation Testing**: Automatic with every event capture
- **Real-time Debugging**: PostHog debug dashboard in development mode

The implementation is complete and ready for production use!