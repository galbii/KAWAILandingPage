import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { trackCalendlyAppointment } from '@/lib/posthog-server';

interface BookingData {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  startTime: string;
  endTime: string;
  eventType: string;
  location: string;
  additionalNotes?: string;
  uid: string;
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    // Log the booking data (in production, you'd save this to a database)
    console.log('New booking received:', bookingData);

    // Track the appointment with PostHog (don't let this fail the webhook)
    try {
      const postHogResult = await trackCalendlyAppointment({
        bookingId: bookingData.bookingId || bookingData.uid || `booking_${Date.now()}`,
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        eventType: bookingData.eventType || 'Piano Consultation',
        location: bookingData.location,
        additionalNotes: bookingData.additionalNotes,
        uid: bookingData.uid,
        // Try to determine booking source from referrer or custom fields
        bookingSource: determineBookingSource(bookingData, request)
      });

      console.log('PostHog booking tracked:', {
        success: postHogResult.success,
        eventId: postHogResult.eventId,
        validationErrors: postHogResult.validation.errors
      });

      // If validation errors, log them but don't fail the webhook
      if (postHogResult.validation.errors.length > 0) {
        console.warn('PostHog booking validation warnings:', postHogResult.validation.errors);
      }
    } catch (postHogError) {
      // Log PostHog errors but don't fail the webhook
      console.error('PostHog tracking failed for booking:', postHogError);
    }
    
    // Here you would typically save to your database
    // Example with various database options:
    
    // Option 1: Save to a JSON file (simple for testing)
    // await saveToFile(bookingData);
    
    // Option 2: Save to PostgreSQL/MySQL
    // await saveToDatabase(bookingData);
    
    // Option 3: Send to external service (Airtable, Google Sheets, etc.)
    // await sendToExternalService(bookingData);
    
    // Always return success to Calendly (even if PostHog tracking fails)
    return NextResponse.json({ 
      success: true, 
      message: 'Booking data saved successfully',
      bookingId: bookingData.bookingId || bookingData.uid,
      tracking: 'enabled' // Let client know tracking is active
    });
    
  } catch (error) {
    console.error('Error processing booking data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process booking data' },
      { status: 500 }
    );
  }
}

// Enhanced helper function to determine booking source with better attribution
function determineBookingSource(bookingData: BookingData, request: NextRequest): 'modal' | 'booking_section' | 'direct' {
  // Check for custom fields or UTM parameters that might indicate source
  const referer = request.headers.get('referer') || '';
  const userAgent = request.headers.get('user-agent') || '';
  
  // First priority: Check for attribution data in booking notes or custom fields
  const notes = bookingData.additionalNotes?.toLowerCase() || '';
  
  // Look for direct attribution markers in booking notes
  if (notes.includes('source:modal') || notes.includes('modal')) {
    console.log('📍 Booking source determined from notes: modal');
    return 'modal';
  }
  if (notes.includes('source:booking_section') || notes.includes('booking-section')) {
    console.log('📍 Booking source determined from notes: booking_section');
    return 'booking_section';
  }
  
  // Second priority: Check UTM parameters in notes
  if (notes.includes('utm_medium=modal')) {
    console.log('📍 Booking source determined from UTM: modal');
    return 'modal';
  }
  if (notes.includes('utm_medium=booking-section')) {
    console.log('📍 Booking source determined from UTM: booking_section');
    return 'booking_section';
  }
  
  // Third priority: Referer analysis
  if (referer.includes(process.env.NEXT_PUBLIC_SITE_URL || 'kawaipianoshouston.com')) {
    console.log('📍 Booking from landing page, defaulting to: booking_section');
    return 'booking_section';
  }
  
  // Fourth priority: User agent analysis (mobile users more likely to use modal)
  if (userAgent.includes('Mobile') && referer) {
    console.log('📍 Mobile booking with referer, likely: modal');
    return 'modal';
  }
  
  // Default: Direct booking
  console.log('📍 No clear source indicators, marking as: direct');
  return 'direct';
}

// Example function to save to a JSON file (for testing)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _saveToFile(_bookingData: BookingData) {
  
  const filePath = path.join(process.cwd(), 'bookings.json');
  
  let existingBookings = [];
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    existingBookings = JSON.parse(fileContents);
  } catch {
    // File doesn't exist or is empty, start with empty array
  }
  
  existingBookings.push({
    ..._bookingData,
    savedAt: new Date().toISOString()
  });
  
  await fs.writeFile(filePath, JSON.stringify(existingBookings, null, 2));
}

// Example function to save to a database
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _saveToDatabase(_bookingData: BookingData) {
  // Example with Prisma/PostgreSQL:
  /*
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  await prisma.booking.create({
    data: {
      bookingId: _bookingData.bookingId,
      name: _bookingData.name,
      email: _bookingData.email,
      phone: _bookingData.phone,
      startTime: new Date(_bookingData.startTime),
      endTime: new Date(_bookingData.endTime),
      eventType: _bookingData.eventType,
      location: _bookingData.location,
      additionalNotes: _bookingData.additionalNotes,
      uid: _bookingData.uid,
    }
  });
  */
}

// Example function to send to external service
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _sendToExternalService(_bookingData: BookingData) {
  // Example with Airtable:
  /*
  const response = await fetch('https://api.airtable.com/v0/YOUR_BASE_ID/Bookings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      records: [{
        fields: {
          'Name': _bookingData.name,
          'Email': _bookingData.email,
          'Phone': _bookingData.phone,
          'Start Time': _bookingData.startTime,
          'End Time': _bookingData.endTime,
          'Event Type': _bookingData.eventType,
          'Location': _bookingData.location,
          'Notes': _bookingData.additionalNotes,
          'Booking UID': _bookingData.uid
        }
      }]
    })
  });
  */
}