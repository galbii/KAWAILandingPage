'use client';

import { useState, useEffect, useRef } from 'react';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { initializeCalendlyTracking, cleanupCalendlyTracking } from '@/lib/calendly-tracking';

export default function BookingSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false);
  const [shouldLoadCalendly, setShouldLoadCalendly] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Optimized Calendly loading - only when section becomes visible
  useEffect(() => {
    if (!shouldLoadCalendly) return;

    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        setIsCalendlyLoaded(true);
        initializeCalendlyTracking('booking_section');
      };
      script.onerror = () => {
        console.warn('Failed to load Calendly script');
        setIsCalendlyLoaded(false);
      };
      document.head.appendChild(script);
    } else {
      setIsCalendlyLoaded(true);
      initializeCalendlyTracking('booking_section');
    }

    return () => {
      cleanupCalendlyTracking();
    };
  }, [shouldLoadCalendly]);

  // Intersection observer for scroll animations and lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start loading Calendly when section comes into view
          setShouldLoadCalendly(true);
        }
      },
      { 
        threshold: 0.3,
        rootMargin: '100px' // Pre-load when within 100px of viewport
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);


  return (
    <section ref={sectionRef} id="booking-consultation" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
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

          {/* Calendly Widget with Loading State */}
          {!isCalendlyLoaded && shouldLoadCalendly && (
            <div className="space-y-4">
              <LoadingSkeleton className="h-8 w-64 mx-auto" />
              <LoadingSkeleton className="h-96 w-full" />
              <div className="text-center text-gray-500 text-sm">
                Loading booking calendar...
              </div>
            </div>
          )}
          
          {isCalendlyLoaded && (
            <div 
              className="calendly-inline-widget" 
              data-url="https://calendly.com/kawaipianogallery/shsu-piano-sale" 
              data-resize="true"
              style={{ 
                minWidth: '320px',
                width: '100%',
                height: '600px'
              }}
            />
          )}
          
          {!shouldLoadCalendly && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">Loading booking system...</p>
              <div className="w-8 h-8 border-2 border-kawai-red border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}