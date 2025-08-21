import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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
    
    // Here you would typically save to your database
    // Example with various database options:
    
    // Option 1: Save to a JSON file (simple for testing)
    // await saveToFile(bookingData);
    
    // Option 2: Save to PostgreSQL/MySQL
    // await saveToDatabase(bookingData);
    
    // Option 3: Send to external service (Airtable, Google Sheets, etc.)
    // await sendToExternalService(bookingData);
    
    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Booking data saved successfully',
      bookingId: bookingData.bookingId 
    });
    
  } catch (error) {
    console.error('Error saving booking data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save booking data' },
      { status: 500 }
    );
  }
}

// Example function to save to a JSON file (for testing)
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