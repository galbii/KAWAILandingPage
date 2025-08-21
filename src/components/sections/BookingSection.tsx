'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface BookingData {
  bookingId: string;
  name: string;
  email: string;
  phone?: string;
  startTime: string;
  endTime: string;
  eventType: string;
  location?: string;
  additionalNotes?: string;
  uid: string;
}

interface CalWindow extends Window {
  Cal?: {
    (action: string, config?: object): void;
    init: (config: { debug: boolean }) => void;
    inline: (config: { elementOrSelector: string; calLink: string; config: { theme: string } }) => void;
    on: (config: { action: string; callback: (e: { detail: unknown }) => void }) => void;
  };
}

interface CalEvent {
  detail: {
    data: {
      bookingId: string;
      uid: string;
      eventTypeId: string;
      startTime: string;
      endTime: string;
      type: string;
      location?: string;
      additionalNotes?: string;
      responses?: Record<string, { value: string }>;
      attendees?: Array<{ name: string; email: string }>;
    };
  };
}

// Function to save booking data
async function saveBookingData(data: BookingData) {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to save booking data');
  }

  return response.json();
}

export default function BookingSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCalendarLoaded, setIsCalendarLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const loadCalEmbed = useCallback(() => {
    // Check if Cal.com script is already loaded
    if (typeof window !== 'undefined' && !(window as CalWindow).Cal) {
      const script = document.createElement('script');
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      script.onload = () => {
        initializeCalendar();
      };
      document.head.appendChild(script);
    } else {
      initializeCalendar();
    }
  }, []);

  // Load Cal.com embed when component is visible
  useEffect(() => {
    if (isVisible && !isCalendarLoaded) {
      loadCalEmbed();
    }
  }, [isVisible, isCalendarLoaded, loadCalEmbed]);

  const initializeCalendar = () => {
    if (typeof window !== 'undefined' && (window as CalWindow).Cal && calendarRef.current) {
      const Cal = (window as CalWindow).Cal!;
      
      // Initialize Cal.com embed
      Cal('init', { debug: false });
      
      // Create inline calendar
      Cal('inline', {
        elementOrSelector: '#cal-booking-embed',
        calLink: 'team/your-team/piano-consultation', // Replace with your actual Cal.com link
        config: {
          theme: 'light'
        }
      });

      // Listen for booking events
      Cal('on', {
        action: 'bookingSuccessful',
        callback: async (e: CalEvent) => {
          console.log('Booking successful:', e.detail);
          
          // Extract booking data
          const bookingData = {
            bookingId: e.detail.data.bookingId,
            name: e.detail.data.responses?.name?.value || 'Unknown',
            email: e.detail.data.responses?.email?.value || 'unknown@example.com',
            phone: e.detail.data.responses?.phone?.value,
            startTime: e.detail.data.startTime,
            endTime: e.detail.data.endTime,
            eventType: e.detail.data.type,
            location: e.detail.data.location || 'Not specified',
            additionalNotes: e.detail.data.additionalNotes,
            uid: e.detail.data.uid
          };

          // Save to database
          try {
            await saveBookingData(bookingData);
            console.log('Booking data saved successfully');
          } catch (error) {
            console.error('Error saving booking data:', error);
          }
        }
      });

      Cal('on', {
        action: 'linkReady',
        callback: () => {
          setIsCalendarLoaded(true);
        }
      });
    }
  };


  return (
    <section ref={sectionRef} id="booking-consultation" className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className={`transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-kawai-black mb-4">
              Schedule Your Piano Consultation
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-kawai-black/70 max-w-2xl mx-auto">
              Get personalized recommendations from our expert piano consultants. Select a convenient time for your one-on-one session.
            </p>
          </div>

          {/* Calendar Container */}
          <div className="bg-kawai-pearl p-6 rounded-2xl shadow-lg">
            <div 
              ref={calendarRef}
              id="cal-booking-embed"
              className="min-h-[600px] w-full"
            >
              {/* Calendar will be embedded here */}
              {!isCalendarLoaded && (
                <div className="flex items-center justify-center h-96 text-kawai-black/70">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading booking calendar...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}