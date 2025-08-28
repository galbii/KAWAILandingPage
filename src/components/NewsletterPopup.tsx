'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PopupPosition = 'center' | 'bottom-right' | 'slide-left' | 'exit-intent';

interface NewsletterPopupProps {
  position?: PopupPosition;
}

export function NewsletterPopup({ position = 'center' }: NewsletterPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  // const [showFallback, setShowFallback] = useState(true); // Unused for now

  useEffect(() => {
    // Check if user has already dismissed this popup or subscribed
    // const hasSeenPopup = localStorage.getItem('kawai_newsletter_popup_seen'); // Unused for now
    
    // TEMPORARY: For testing, always show popup regardless of localStorage
    // Remove this line in production and uncomment the line below
    // if (hasSeenPopup) return;

    // Show popup after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Simplified - no complex detection logic

  const handleClose = () => {
    setIsVisible(false);
    // Mark as seen so it doesn't show again
    localStorage.setItem('kawai_newsletter_popup_seen', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    
    try {
      // This will use the existing Constant Contact form action
      await fetch('https://ui.constantcontact.com/sa/fwtf.jsp?llr=1cf63f1b41f15055378de822630a40df&m=1141953948742&ea=' + encodeURIComponent(email) + '&p=oi', {
        method: 'POST',
        mode: 'no-cors'
      });
      
      // Mark as subscribed and close
      localStorage.setItem('kawai_newsletter_popup_seen', 'true');
      localStorage.setItem('kawai_newsletter_subscribed', 'true');
      setIsVisible(false);
    } catch (error) {
      console.error('Newsletter signup failed:', error);
      // Still close popup to avoid frustrating user
      localStorage.setItem('kawai_newsletter_popup_seen', 'true');
      setIsVisible(false);
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-50 max-w-sm animate-slide-in-right';
      case 'slide-left':
        return 'fixed top-1/2 right-4 -translate-y-1/2 z-50 max-w-sm animate-slide-in-left';
      case 'exit-intent':
        return 'fixed inset-0 z-50 flex items-center justify-center';
      default: // center
        return 'fixed inset-0 z-50 flex items-center justify-center';
    }
  };

  const isOverlay = position === 'center' || position === 'exit-intent';

  if (!isVisible) return null;

  // For corner/side positions, render as floating box
  if (!isOverlay) {
    return (
      <div className={getPositionClasses()}>
        <div className="relative bg-white rounded-none shadow-2xl border-4 border-black p-6 w-96 transform animate-in fade-in-0 slide-in-from-right-4 duration-700">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-4">
            <h3 className="text-lg font-serif text-kawai-black mb-1 animate-in fade-in-0 duration-500 delay-300">
              VIP Access Unlocked!
            </h3>
            <p className="text-kawai-black/70 text-xs leading-relaxed animate-in fade-in-0 duration-500 delay-500">
              Join 1,000+ piano lovers getting exclusive deals first
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input 
              type="email" 
              name="email"
              placeholder="your@email.com"
              className="w-60 text-xs border-2 border-black focus:ring-kawai-red focus:border-kawai-red rounded-lg"
              required
            />
            <div className="flex justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="px-3 py-1 border-2 border-black text-kawai-red hover:bg-kawai-red hover:text-white text-xs rounded-lg"
              >
                Later
              </Button>
              <Button
                type="submit"
                size="sm"
                className="px-3 py-1 bg-kawai-red hover:bg-kawai-black text-white border-2 border-black text-xs rounded-lg"
              >
                Get VIP Access
              </Button>
            </div>
          </form>

          <p className="text-xs text-kawai-black/50 text-center mt-2">
            Unsubscribe anytime.
          </p>
        </div>
      </div>
    );
  }

  // For overlay positions, render the form with popup styling wrapped around it
  return (
    <>
      {/* Scripts are loaded by ShowroomLocation component - no duplicate loading needed */}
      
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in-0 duration-700">
        <div className="relative bg-white border-4 border-black rounded-none shadow-2xl w-auto max-w-2xl mx-4 animate-in zoom-in-95 duration-700">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-kawai-red to-kawai-red-dark p-6">
            <h2 className="text-2xl font-serif text-kawai-black text-center mb-2">
              Exclusive VIP Piano Access
            </h2>
            <div className="text-center">
              <p className="text-kawai-black text-sm leading-relaxed mb-3">
                Join 1,000+ piano enthusiasts getting insider deals up to 30% off KAWAI pianos!
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-kawai-black text-xs font-medium">
                Limited spots remaining - Act now!
              </div>
            </div>
          </div>

          {/* Email Signup Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-transparent text-sm"
                  required 
                />
              </div>
              <button 
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#DC2626',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#991B1B'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#DC2626'}
              >
                Get Exclusive VIP Offers & Events
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <p className="text-xs text-kawai-black/50 text-center">
              Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}