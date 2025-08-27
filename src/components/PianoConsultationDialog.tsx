'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { initializeCalendlyTracking, cleanupCalendlyTracking } from '@/lib/calendly-tracking';
import { usePostHog } from '@/hooks/usePostHog';
import '@/lib/calendly-debug'; // Load debug utilities
import '@/types/calendly';

interface PianoConsultationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PianoConsultationDialog({ isOpen, onClose }: PianoConsultationDialogProps) {
  const { trackBookingAttempt } = usePostHog();
  const calendlyContainerRef = useRef<HTMLDivElement>(null);
  
  const initializeFallbackWidget = useCallback(() => {
    console.log('🔄 Initializing fallback Calendly widget...');
    
    // Initialize tracking
    initializeCalendlyTracking('modal');
    
    const waitForCalendly = () => {
      if (window.Calendly && window.Calendly.initInlineWidget && calendlyContainerRef.current) {
        try {
          // Clear container first
          calendlyContainerRef.current.innerHTML = '';
          
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/kawaipianogallery/shsu-piano-sale',
            parentElement: calendlyContainerRef.current,
            utm: {
              utmSource: 'kawai-landing-page',
              utmMedium: 'modal',
              utmCampaign: 'shsu-piano-sale-2025'
            }
          });
          
          console.log('✅ Fallback Calendly widget initialized successfully');
        } catch (error) {
          console.error('❌ Failed to initialize fallback Calendly widget:', error);
        }
      } else {
        console.log('⏳ Waiting for Calendly for fallback widget...');
        setTimeout(waitForCalendly, 100);
      }
    };
    
    waitForCalendly();
  }, []);

  const movePreloadedWidget = useCallback(() => {
    const preloadedWidget = document.getElementById('calendly-preloaded-widget');
    const modalContainer = calendlyContainerRef.current;

    console.log('🔍 Checking for preloaded widget...', {
      preloadedWidget: !!preloadedWidget,
      modalContainer: !!modalContainer,
      preloadedContent: preloadedWidget?.innerHTML?.length || 0
    });

    if (preloadedWidget && modalContainer && preloadedWidget.innerHTML.trim().length > 0) {
      // Move the preloaded widget content to the modal
      const widgetContent = preloadedWidget.innerHTML;
      modalContainer.innerHTML = widgetContent;

      // Apply modal-specific styles
      modalContainer.style.width = '100%';
      modalContainer.style.height = '100%';
      modalContainer.style.position = 'relative';
      modalContainer.style.minWidth = '320px';
      
      console.log('✅ Preloaded widget moved to modal - instant display!');
    } else {
      console.warn('⚠️ Preloaded widget not ready, initializing new widget...');
      // Fallback: initialize a new widget
      initializeFallbackWidget();
    }
  }, [initializeFallbackWidget]);

  const returnWidgetToPreloader = useCallback(() => {
    const preloadedWidget = document.getElementById('calendly-preloaded-widget');
    const modalContainer = calendlyContainerRef.current;

    if (preloadedWidget && modalContainer) {
      // Return the widget content to the preloader
      preloadedWidget.innerHTML = modalContainer.innerHTML;
      modalContainer.innerHTML = '';
      
      console.log('🔄 Widget returned to preloader for next use');
    }
    
    // Clean up tracking
    cleanupCalendlyTracking();
  }, []);

  useEffect(() => {
    if (isOpen) {
      // PostHog: Track consultation modal opened
      trackBookingAttempt({
        bookingSource: 'modal',
        calendlyStatus: 'opened'
      });

      // Use the preloaded widget instead of initializing a new one
      console.log('🚀 Using preloaded Calendly widget for instant display');
      movePreloadedWidget();
    }

    return () => {
      if (isOpen) {
        // PostHog: Track consultation modal closed/abandoned
        trackBookingAttempt({
          bookingSource: 'modal',
          calendlyStatus: 'abandoned',
          abandonmentStage: 'modal_close'
        });

        // Return the widget to the preloader when modal closes
        returnWidgetToPreloader();
      }
    };
  }, [isOpen, trackBookingAttempt, movePreloadedWidget, returnWidgetToPreloader]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] max-h-[800px] p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          Book Your Piano Consultation
        </DialogTitle>
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