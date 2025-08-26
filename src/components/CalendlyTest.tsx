'use client';

import { useEffect, useRef, useState } from 'react';
import { initializeCalendlyTracking } from '@/lib/calendly-tracking';

declare global {
  interface Window {
    Calendly: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        utm?: Record<string, string>;
      }) => void;
    };
  }
}

export default function CalendlyTest() {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('🧪 Calendly Test Component Mounted');
    
    // Initialize tracking immediately
    initializeCalendlyTracking('booking_section');
    
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Calendly script loaded in test component');
      
      // Wait a bit for Calendly object
      setTimeout(() => {
        console.log('Calendly object available:', !!window.Calendly);
        console.log('Container available:', !!containerRef.current);
        
        if (window.Calendly && containerRef.current) {
          console.log('🚀 Initializing Calendly test widget...');
          
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/kawaipianogallery/shsu-piano-sale',
            parentElement: containerRef.current,
            utm: {
              utmSource: 'test-component',
              utmMedium: 'debug',
              utmCampaign: 'test'
            }
          });
          
          console.log('✅ Test widget initialized');
          setIsLoaded(true);
        }
      }, 1000);
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Calendly script in test:', error);
    };
    
    document.head.appendChild(script);
    
    return () => {
      console.log('🧹 Test component cleanup');
    };
  }, []);

  return (
    <div className="p-8 border-2 border-red-500">
      <h2 className="text-xl font-bold mb-4 text-red-600">
        🧪 Calendly Test Component {isLoaded ? '✅' : '⏳'}
      </h2>
      <div
        ref={containerRef}
        className="calendly-test-container"
        style={{
          minWidth: '320px',
          width: '100%',
          height: '600px',
          border: '2px dashed #ccc',
          position: 'relative'
        }}
      >
        {!isLoaded && (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading Calendly Test Widget...
          </div>
        )}
      </div>
    </div>
  );
}