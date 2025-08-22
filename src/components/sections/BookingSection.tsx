'use client';

import { useState, useEffect, useRef } from 'react';
import { initializeCalendlyTracking, cleanupCalendlyTracking } from '@/lib/calendly-tracking';

export default function BookingSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Preload Calendly script immediately when component mounts
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        // Initialize Calendly tracking once script is loaded
        initializeCalendlyTracking('booking_section');
      };
      script.onerror = () => console.warn('Failed to load Calendly script');
      document.head.appendChild(script);
    } else {
      // Initialize tracking if script already exists
      initializeCalendlyTracking('booking_section');
    }

    return () => {
      // Clean up script when component unmounts
      const scriptToRemove = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
      
      // Clean up Calendly tracking
      cleanupCalendlyTracking();
    };
  }, []);

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

          {/* Calendly Widget */}
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/kawaipianogallery/shsu-piano-sale" 
            data-resize="true"
            style={{ 
              minWidth: '320px',
              width: '100%'
            }}
          />
        </div>
      </div>
    </section>
  );
}