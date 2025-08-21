'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PianoConsultationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PianoConsultationDialog({ isOpen, onClose }: PianoConsultationDialogProps) {
  useEffect(() => {
    if (isOpen) {
      // Load Calendly script when dialog opens
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);

      return () => {
        // Clean up script when dialog closes
        const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] max-h-[800px] p-0 overflow-hidden">
        <div className="h-full overflow-hidden">
          {/* Calendly inline widget */}
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/kawaipianogallery/shsu-piano-sale" 
            style={{ 
              minWidth: '320px', 
              height: '100%',
              width: '100%'
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}