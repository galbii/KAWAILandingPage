'use client';

import { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { initializeCalendlyTracking, cleanupCalendlyTracking } from '@/lib/calendly-tracking';
import { usePostHog } from '@/hooks/usePostHog';
import '@/types/calendly';

interface PianoConsultationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PianoConsultationDialog({ isOpen, onClose }: PianoConsultationDialogProps) {
  const { trackBookingAttempt } = usePostHog();
  const calendlyContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      // PostHog: Track consultation modal opened
      trackBookingAttempt({
        bookingSource: 'modal',
        calendlyStatus: 'opened'
      });

      // Load Calendly script when dialog opens
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      
      script.onload = () => {
        console.log('✅ Calendly script loaded in modal');
        
        // Initialize tracking before widget
        initializeCalendlyTracking('modal');
        
        // Initialize Calendly inline widget with JavaScript API
        if (calendlyContainerRef.current && window.Calendly) {
          console.log('🚀 Initializing Calendly modal widget with JavaScript API');
          
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/kawaipianogallery/shsu-piano-sale',
            parentElement: calendlyContainerRef.current,
            utm: {
              utmSource: 'kawai-landing-page',
              utmMedium: 'modal',
              utmCampaign: 'shsu-piano-sale-2025'
            }
          });
          
          console.log('✅ Calendly modal widget initialized');
        }
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Calendly script in modal');
      };
      
      document.head.appendChild(script);

      return () => {
        // PostHog: Track consultation modal closed/abandoned
        trackBookingAttempt({
          bookingSource: 'modal',
          calendlyStatus: 'abandoned',
          abandonmentStage: 'modal_close'
        });

        // Clean up script when dialog closes
        const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
        
        // Clean up Calendly tracking
        cleanupCalendlyTracking();
      };
    }
  }, [isOpen, trackBookingAttempt]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] max-h-[800px] p-0 overflow-hidden">
        <div className="h-full overflow-hidden">
          {/* Calendly inline widget */}
          <div 
            ref={calendlyContainerRef}
            className="calendly-inline-widget-container" 
            style={{ 
              minWidth: '320px', 
              height: '100%',
              width: '100%',
              position: 'relative'
            }}
          >
            {/* Container will be populated by Calendly.initInlineWidget */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}