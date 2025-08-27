'use client';

import { useEffect, useRef } from 'react';
import { initializeCalendlyTracking } from '@/lib/calendly-tracking';
import '@/types/calendly';

export default function CalendlyPreloader() {
  const preloadedWidgetRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Initialize the preloaded widget once when component mounts
    if (!isInitializedRef.current) {
      // Wait a bit for the script to load, then initialize
      setTimeout(() => {
        initializePreloadedWidget();
      }, 1000); // Give script time to load
      isInitializedRef.current = true;
    }
  }, []);

  const initializePreloadedWidget = () => {
    console.log('🚀 Starting preloaded Calendly widget initialization...');
    
    let attempts = 0;
    const maxAttempts = 50; // Try for up to 5 seconds
    
    const waitForCalendly = () => {
      attempts++;
      console.log(`⏳ Attempt ${attempts}: Checking for Calendly...`, {
        calendlyExists: !!window.Calendly,
        initInlineWidget: !!(window.Calendly?.initInlineWidget),
        containerExists: !!preloadedWidgetRef.current
      });
      
      if (window.Calendly && window.Calendly.initInlineWidget && preloadedWidgetRef.current) {
        try {
          console.log('🎯 All dependencies ready, initializing widget...');
          
          // Initialize tracking for the preloaded widget
          initializeCalendlyTracking('modal');
          
          // Initialize the widget in the hidden container
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/kawaipianogallery/shsu-piano-sale',
            parentElement: preloadedWidgetRef.current,
            utm: {
              utmSource: 'kawai-landing-page',
              utmMedium: 'modal',
              utmCampaign: 'shsu-piano-sale-2025'
            }
          });
          
          console.log('✅ Preloaded Calendly widget initialized successfully!');
        } catch (error) {
          console.error('❌ Failed to initialize preloaded Calendly widget:', error);
        }
      } else if (attempts < maxAttempts) {
        // Wait and try again
        setTimeout(waitForCalendly, 100);
      } else {
        console.error('❌ Failed to load Calendly after maximum attempts');
        console.error('Final state:', {
          calendlyExists: !!window.Calendly,
          initInlineWidget: !!(window.Calendly?.initInlineWidget),
          containerExists: !!preloadedWidgetRef.current
        });
      }
    };

    waitForCalendly();
  };

  return (
    <>
      {/* Hidden preloaded widget container */}
      <div
        id="calendly-preloaded-widget"
        ref={preloadedWidgetRef}
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '100%',
          height: '600px',
          minWidth: '320px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1
        }}
        className="calendly-inline-widget-container"
      >
        {/* This will be populated by Calendly.initInlineWidget */}
      </div>
    </>
  );
}