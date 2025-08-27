'use client';

import { useState, useEffect, useRef } from 'react';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { initializeCalendlyTracking, cleanupCalendlyTracking } from '@/lib/calendly-tracking';
import '@/lib/calendly-debug'; // Load debug utilities
import '@/types/calendly';

export default function BookingSection() {
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false);
  const [shouldLoadCalendly, setShouldLoadCalendly] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const calendlyContainerRef = useRef<HTMLDivElement>(null);

  // Optimized Calendly loading - only when section becomes visible
  useEffect(() => {
    if (!shouldLoadCalendly) return;

    console.log('🔄 Starting Calendly loading process...');
    console.log('Container ref available:', !!calendlyContainerRef.current);

    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    console.log('Existing Calendly script found:', !!existingScript);
    
    const initializeWidget = () => {
      console.log('🔧 Attempting widget initialization...');
      console.log('Window.Calendly available:', !!window.Calendly);
      console.log('Container available:', !!calendlyContainerRef.current);
      
      if (calendlyContainerRef.current && window.Calendly && window.Calendly.initInlineWidget) {
        console.log('🚀 Initializing Calendly inline widget with JavaScript API');
        
        try {
          // Clear any existing content
          calendlyContainerRef.current.innerHTML = '';
          
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/kawaipianogallery/shsu-piano-sale',
            parentElement: calendlyContainerRef.current,
            utm: {
              utmSource: 'kawai-landing-page',
              utmMedium: 'booking-section',
              utmCampaign: 'shsu-piano-sale-2025'
            }
          });
          
          console.log('✅ Calendly widget initialized successfully');
        } catch (error) {
          console.error('❌ Failed to initialize Calendly widget:', error);
        }
      } else {
        console.warn('⚠️ Missing dependencies for widget initialization');
        console.warn('  - Container:', !!calendlyContainerRef.current);
        console.warn('  - Calendly object:', !!window.Calendly);
        console.warn('  - initInlineWidget method:', !!window.Calendly?.initInlineWidget);
        
        // Retry after a short delay if Calendly object is missing
        if (!window.Calendly && calendlyContainerRef.current) {
          console.log('⏳ Retrying widget initialization in 200ms...');
          setTimeout(initializeWidget, 200);
        }
      }
    };
    
    if (!existingScript) {
      console.log('📥 Loading new Calendly script...');
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Calendly script loaded successfully');
        setIsCalendlyLoaded(true);
        
        // Initialize tracking
        initializeCalendlyTracking('booking_section');
        
        // Small delay to ensure script is fully initialized
        setTimeout(initializeWidget, 100);
      };
      script.onerror = (error) => {
        console.error('❌ Failed to load Calendly script:', error);
        setIsCalendlyLoaded(false);
      };
      document.head.appendChild(script);
    } else {
      console.log('📦 Calendly script already loaded, checking availability...');
      setIsCalendlyLoaded(true);
      initializeCalendlyTracking('booking_section');
      
      // Check if Calendly is available, if not wait a bit
      if (window.Calendly) {
        initializeWidget();
      } else {
        console.log('⏳ Calendly object not ready, waiting...');
        const checkInterval = setInterval(() => {
          if (window.Calendly) {
            console.log('✅ Calendly object now available');
            clearInterval(checkInterval);
            initializeWidget();
          }
        }, 100);
        
        // Stop checking after 5 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!window.Calendly) {
            console.error('❌ Calendly object never became available');
          }
        }, 5000);
      }
    }

    return () => {
      cleanupCalendlyTracking();
    };
  }, [shouldLoadCalendly]);

  // Intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
        <div>
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
              ref={calendlyContainerRef}
              className="calendly-inline-widget-container"
              style={{ 
                minWidth: '320px',
                width: '100%',
                height: '600px',
                position: 'relative'
              }}
            >
              {/* Container will be populated by Calendly.initInlineWidget */}
            </div>
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