'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, X } from 'lucide-react';
import PianoConsultationDialog from '@/components/PianoConsultationDialog';
import { trackKawaiEvent } from '@/lib/analytics';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0 });
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // Start minimized
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show timer immediately when mounted (always visible)
  useEffect(() => {
    if (!mounted) return;
    setIsVisible(true); // Always visible as dot
  }, [mounted]);

  // Scroll detection effect for expansion
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      console.log('Scroll detected, scrollY:', window.scrollY, 'hasScrolled:', hasScrolled);
      if (!hasScrolled && window.scrollY > 100) {
        console.log('Setting hasScrolled to true, starting 2 second timer');
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mounted, hasScrolled]);

  // Separate effect to handle expansion after scroll
  useEffect(() => {
    if (hasScrolled && isMinimized) {
      console.log('HasScrolled is true and timer is minimized - starting expansion timer');
      
      const timeout = setTimeout(() => {
        console.log('2 seconds passed - expanding timer');
        setIsMinimized(false); // Expand to full view
      }, 2000);
      
      return () => {
        console.log('Cleanup timeout');
        clearTimeout(timeout);
      };
    }
  }, [hasScrolled, isMinimized]);

  useEffect(() => {
    if (!mounted) return;

    const targetDate = new Date('2025-09-11T00:00:00').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [mounted]);

  const handleBookNowClick = () => {
    // Track the analytics event
    trackKawaiEvent.secureSpot('countdown-timer');
    
    // Open the piano consultation dialog
    setIsModalOpen(true);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    // Track minimize action
    trackKawaiEvent.secureSpot('countdown-timer-minimize');
  };

  const handleExpand = () => {
    setIsMinimized(false);
    // Track expand action
    trackKawaiEvent.secureSpot('countdown-timer-expand');
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
        {isVisible && (
          <>
            {isMinimized ? (
              // Minimized State - Small circular button
              <div 
                className="timer-minimized"
                onClick={handleExpand}
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#800000',
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  zIndex: 999
                }}
              >
                <span>...</span>
              </div>
            ) : (
              // Expanded State - Full timer
              <div className="timer-glassmorphism group timer-slide-in">
                {/* Close button */}
                <button 
                  className="timer-close-btn"
                  onClick={handleMinimize}
                  aria-label="Minimize timer"
                >
                  <X size={14} />
                </button>

                <Card className="border-0 bg-transparent shadow-none">
                  <CardContent className="p-3 sm:p-4">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-kawai-red timer-pulse" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 tracking-wide">
                        Exclusive Event
                      </span>
                    </div>
                    
                    {/* Time Display */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center mb-2 sm:mb-3">
                      <div className="timer-digit-container">
                        <div className="timer-digit" key={timeLeft.days}>
                          {timeLeft.days}
                        </div>
                        <div className="timer-label">Days</div>
                      </div>
                      <div className="timer-digit-container">
                        <div className="timer-digit" key={timeLeft.hours}>
                          {timeLeft.hours}
                        </div>
                        <div className="timer-label">Hours</div>
                      </div>
                      <div className="timer-digit-container">
                        <div className="timer-digit" key={timeLeft.minutes}>
                          {timeLeft.minutes}
                        </div>
                        <div className="timer-label">Min</div>
                      </div>
                    </div>

                    {/* Limited Spots */}
                    <div className="timer-limited-spots">
                      Limited spots available
                    </div>

                    {/* CTA */}
                    <div className="timer-cta-button" onClick={handleBookNowClick}>
                      Book Now
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>

      {/* Piano Consultation Dialog */}
      <PianoConsultationDialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}