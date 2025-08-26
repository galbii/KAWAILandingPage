import { NextRequest, NextResponse } from 'next/server'
import { trackCalendlyAppointment } from '@/lib/posthog-server'

// Test endpoint to verify webhook tracking works correctly
export async function POST(_request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Test endpoint only available in development' }, { status: 403 })
  }

  try {
    // Sample booking data for testing
    const testBookingData = {
      bookingId: `test_booking_${Date.now()}`,
      name: 'Test Customer',
      email: 'test@kawaipianoshouston.com',
      phone: '+1-713-904-0001',
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hour duration
      eventType: 'Piano Consultation - Test',
      location: 'KAWAI Piano Gallery Houston',
      additionalNotes: 'Test booking - interested in ES120 digital piano. Booking via test endpoint.',
      uid: `test_uid_${Math.random().toString(36).substr(2, 9)}`,
      bookingSource: 'modal' as const
    }

    console.log('Testing PostHog webhook tracking with data:', testBookingData)

    // Track the test appointment
    const result = await trackCalendlyAppointment(testBookingData)

    console.log('PostHog tracking test result:', result)

    // Return detailed result for testing
    return NextResponse.json({
      success: true,
      message: 'Test booking tracked successfully',
      testData: testBookingData,
      postHogResult: {
        success: result.success,
        eventId: result.eventId,
        timestamp: result.timestamp,
        validationPassed: result.validation.isValid,
        validationErrors: result.validation.errors,
        validationWarnings: result.validation.warnings,
        sanitizedProperties: Object.keys(result.validation.sanitizedProperties)
      }
    })

  } catch (error) {
    console.error('Test booking tracking failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Test booking tracking failed'
    }, { status: 500 })
  }
}

// GET endpoint to check test availability
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Test endpoint only available in development' }, { status: 403 })
  }

  return NextResponse.json({
    message: 'Calendly webhook test endpoint available',
    instructions: {
      method: 'POST',
      endpoint: '/api/bookings/test',
      description: 'Send POST request to test PostHog webhook tracking',
      environment: 'development only'
    },
    postHogConfig: {
      apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ? '***configured***' : 'missing',
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
    }
  })
}