# Calendly Webhook Tracking with PostHog

This document outlines the complete setup for tracking Calendly appointment bookings with PostHog analytics, including both client-side and server-side tracking.

## 🎯 Overview

The system provides comprehensive tracking of the entire Calendly booking funnel:
- **Client-side tracking**: User interactions within Calendly widget
- **Server-side tracking**: Actual appointment confirmations via webhooks
- **Cross-attribution**: Links client-side behavior with server-side conversions
- **Lead scoring**: Automatic qualification based on booking data

## 🔧 Webhook Setup

### 1. Configure Calendly Webhook

In your Calendly account:

1. **Go to Integrations > Webhooks**
2. **Add webhook endpoint**: `https://your-domain.com/api/bookings`
3. **Select events**: 
   - `invitee.created` (when appointment is booked)
   - `invitee.canceled` (optional - for cancellation tracking)
4. **Test the webhook** to ensure it's receiving data

### 2. Webhook Payload Structure

Calendly sends data in this format:
```json
{
  "event": "invitee.created",
  "time": "2025-01-XX...",
  "payload": {
    "event_type": {
      "name": "Piano Consultation",
      "duration": 60
    },
    "event": {
      "start_time": "2025-01-XX...",
      "end_time": "2025-01-XX..."
    },
    "invitee": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "questions_and_answers": [...]
    }
  }
}
```

### 3. Custom Booking Interface

Your booking interface should send data in this format to `/api/bookings`:
```typescript
interface BookingData {
  bookingId: string;          // Unique identifier
  name: string;               // Invitee name
  email: string;              // Invitee email
  phone?: string;             // Optional phone
  startTime: string;          // ISO datetime
  endTime?: string;           // ISO datetime
  eventType: string;          // "Piano Consultation"
  location?: string;          // Meeting location/method
  additionalNotes?: string;   // Custom questions/notes
  uid: string;                // Calendly UID
}
```

## 📊 PostHog Event Tracking

### Server-Side Event: `calendly_appointment_booked`

Automatically tracked when webhook receives appointment data:

```typescript
{
  booking_id: "cal_xyz123",                    // Calendly booking ID
  invitee_name: "John Doe",                    // Customer name
  invitee_email: "john@example.com",           // Email (used as distinct_id)
  invitee_phone: "+1234567890",                // Phone number
  event_type_name: "Piano Consultation",       // Appointment type
  scheduled_time: "2025-02-15T14:00:00Z",     // Appointment datetime
  duration_minutes: 60,                        // Meeting duration
  location_type: "in-person",                  // Meeting method
  booking_source: "modal",                     // "modal" | "booking_section" | "direct"
  additional_notes: "Interested in ES120",     // Custom questions
  lead_score: 85,                              // Calculated lead quality (0-100)
  advance_booking_days: 7,                     // Days booked in advance
  booked_at: "2025-01-XX...",                 // When booking was made
  booking_uid: "calendly_uid_123"              // Calendly unique ID
}
```

### Client-Side Events

Tracked during Calendly widget interaction:

#### 1. `consultation_booking_attempt` (Client-Side Completion)
```typescript
{
  booking_source: "modal",                     // Widget location
  calendly_status: "completed",                // Booking completed
  user_type: "new",                           // "new" | "returning"
  completion_timestamp: "2025-01-XX...",      // Client completion time
  calendly_event_data: {...}                  // Raw Calendly event data
}
```

## 🎯 Lead Scoring Algorithm

Automatic lead scoring based on booking characteristics:

### Base Score: 50 points (for making appointment)

**Additional scoring factors:**
- **Phone provided**: +15 points (shows higher intent)
- **Additional notes**: +10 points (shows engagement)
- **Event type bonus**:
  - Contains "consultation": +20 points
  - Contains "private": +10 points
- **Advance booking timing**:
  - >7 days ahead: +15 points (planned purchase)
  - 3-7 days ahead: +10 points
  - 1-3 days ahead: +5 points

**Maximum score**: 100 points

### Lead Score Examples

```typescript
// High-quality lead (Score: 95)
{
  hasPhone: true,           // +15
  hasNotes: true,           // +10  
  eventType: "Piano Consultation", // +20
  advanceBookingDays: 14    // +15
  // Total: 50 + 15 + 10 + 20 + 15 = 100 (capped at 100)
}

// Medium-quality lead (Score: 70)
{
  hasPhone: false,          // +0
  hasNotes: true,           // +10
  eventType: "Piano Consultation", // +20
  advanceBookingDays: 2     // +5
  // Total: 50 + 0 + 10 + 20 + 5 = 85
}
```

## 🔄 Attribution & Cross-Referencing

### Booking Source Attribution

The system determines booking source through multiple methods:

#### 1. Client-Side Storage (Most Accurate)
```typescript
// Stored when user interacts with Calendly widget
localStorage.setItem('kawai_last_booking_source', 'modal')
localStorage.setItem('kawai_last_booking_time', timestamp)
```

#### 2. HTTP Headers Analysis
- **Referer header**: Check if booking came from landing page
- **User-Agent**: Mobile users more likely to use modal

#### 3. Custom Fields/Notes
- Check `additionalNotes` for keywords like "modal", "popup", "section"

### User Journey Linking

PostHog links events using:
- **Distinct ID**: User's email address
- **Session ID**: PostHog session for same-user tracking
- **Booking timestamp**: Match client/server events within time window

## 🛠 Development & Testing

### Testing Webhook Locally

1. **Use ngrok** to expose local endpoint:
```bash
ngrok http 3000
```

2. **Set Calendly webhook** to: `https://your-ngrok-url.ngrok.io/api/bookings`

3. **Make test booking** and check console/PostHog

### Debug Dashboard Integration

The PostHog debug dashboard shows webhook events in development:
- **Server-side events**: Distinguished by `$server_side: true`
- **Validation status**: Shows if webhook data passed validation
- **Lead score**: Displays calculated lead quality

### Console Debugging

Check webhook processing:
```javascript
// View recent webhook events
console.log('Recent bookings:', window.postHogDebug.monitor.getEventsByType('calendly_appointment_booked'))

// Check server-side tracking status
window.postHogDebug.status()
```

## 📈 Analytics Insights

### Key Metrics to Track

1. **Conversion Funnel**:
   - Calendly widget loaded → Time selected → Booking completed

2. **Lead Quality Distribution**:
   - Average lead score by booking source
   - High-quality leads (score >80) percentage

3. **Booking Attribution**:
   - Modal vs booking section conversion rates
   - Mobile vs desktop booking patterns

4. **Appointment Characteristics**:
   - Average advance booking time
   - Peak booking days/times
   - Most popular appointment types

### PostHog Dashboard Queries

**Booking Conversion Rate**:
```sql
SELECT 
  COUNT(*) as total_bookings,
  AVG(properties.lead_score) as avg_lead_score
FROM events 
WHERE event = 'calendly_appointment_booked'
  AND timestamp >= now() - interval '30 days'
```

**Source Attribution**:
```sql
SELECT 
  properties.booking_source,
  COUNT(*) as bookings,
  AVG(properties.lead_score) as avg_score
FROM events 
WHERE event = 'calendly_appointment_booked'
GROUP BY properties.booking_source
```

## 🚨 Error Handling

### Webhook Reliability

The webhook endpoint includes comprehensive error handling:

1. **PostHog failures don't break webhook**:
   - PostHog tracking wrapped in try/catch
   - Always return 200 to Calendly to prevent retries

2. **Validation errors are logged** but don't prevent tracking:
   - Invalid data is sanitized when possible
   - Validation warnings logged for data quality monitoring

3. **Graceful degradation**:
   - If PostHog server client fails, booking still processes
   - Fallback booking source detection methods

### Monitoring & Alerts

Set up monitoring for:
- **Webhook endpoint uptime**: Ensure `/api/bookings` responds
- **PostHog tracking success rate**: Monitor failed event captures
- **Lead score distribution**: Alert if scores drop significantly
- **Booking source attribution**: Monitor "direct" bookings (may indicate tracking issues)

## 🔒 Security & Privacy

### Data Handling

- **PII Protection**: Customer data encrypted in PostHog
- **GDPR Compliance**: User identification only for legitimate business purposes
- **Data Retention**: Follow PostHog's standard retention policies

### Webhook Security

Consider adding webhook signature verification:
```typescript
// Verify Calendly webhook signatures (if available)
const signature = request.headers.get('calendly-webhook-signature')
if (!verifyWebhookSignature(body, signature)) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
}
```

## 📚 Next Steps

### Enhancements

1. **Database Integration**: Store bookings in permanent database
2. **Email Notifications**: Send booking confirmations
3. **CRM Integration**: Sync leads with sales tools
4. **Advanced Attribution**: Multi-touch attribution across sessions
5. **Predictive Analytics**: Predict booking likelihood based on behavior

### Maintenance

- **Regular webhook testing**: Ensure endpoint stays functional
- **Schema updates**: Keep validation schemas current with Calendly changes  
- **Performance monitoring**: Track webhook response times
- **Data quality checks**: Monitor validation error rates