import { NextRequest, NextResponse } from 'next/server';

interface BookingData {
  bookingId: string;
  uid: string;
  name?: string;
  email?: string;
  phone?: string;
  startTime: string;
  endTime: string;
  eventType: string;
  location?: string;
  additionalNotes?: string;
  organizerName?: string;
  organizerEmail?: string;
  status: string;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();
    
    console.log('Cal.com webhook received:', webhookData);
    
    // Handle different event types
    if (webhookData.triggerEvent === 'BOOKING_CREATED') {
      const booking = webhookData.payload;
      
      // Extract the data you need
      const bookingData = {
        bookingId: booking.bookingId,
        uid: booking.uid,
        name: booking.responses?.name?.value || booking.attendees?.[0]?.name,
        email: booking.responses?.email?.value || booking.attendees?.[0]?.email,
        phone: booking.responses?.phone?.value,
        startTime: booking.startTime,
        endTime: booking.endTime,
        eventType: booking.type,
        location: booking.location,
        additionalNotes: booking.additionalNotes || booking.responses?.notes?.value,
        organizerName: booking.organizer?.name,
        organizerEmail: booking.organizer?.email,
        status: booking.status,
        createdAt: webhookData.createdAt
      };
      
      // Save to your database
      await saveBookingToDatabase(bookingData);
      
      // Optional: Send confirmation email, update CRM, etc.
      await sendConfirmationEmail(bookingData);
      
    } else if (webhookData.triggerEvent === 'BOOKING_CANCELLED') {
      // Handle booking cancellation
      const booking = webhookData.payload;
      await handleBookingCancellation(booking.bookingId, booking.cancellationReason);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function saveBookingToDatabase(bookingData: BookingData) {
  // Save to your database of choice
  console.log('Saving booking to database:', bookingData);
  
  // Example implementations:
  // - PostgreSQL with Prisma
  // - MySQL with Drizzle
  // - MongoDB with Mongoose
  // - Airtable API
  // - Google Sheets API
  // - Supabase
}

async function sendConfirmationEmail(bookingData: BookingData) {
  // Send email confirmation using your email service
  // - Resend
  // - SendGrid
  // - Mailgun
  // - Nodemailer
  
  console.log(`Sending confirmation email to ${bookingData.email}`);
}

async function handleBookingCancellation(bookingId: string, reason?: string) {
  console.log(`Booking ${bookingId} was cancelled. Reason: ${reason}`);
  // Update database, send cancellation email, etc.
}