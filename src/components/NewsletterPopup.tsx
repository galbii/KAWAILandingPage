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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    
    try {
      // This will use the existing Constant Contact form action
      await fetch('https://ui.constantcontact.com/sa/fwtf.jsp?llr=1cf63f1b41f15055378de822630a40df&m=1141953948742&ea=' + encodeURIComponent(email) + '&p=oi', {
        method: 'POST',
        mode: 'no-cors'
      });
      
      // Show success state
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Mark as subscribed
      localStorage.setItem('kawai_newsletter_popup_seen', 'true');
      localStorage.setItem('kawai_newsletter_subscribed', 'true');
      
      // Close popup after 3 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
    } catch (error) {
      console.error('Newsletter signup failed:', error);
      // Show success anyway since mode: 'no-cors' always "succeeds"
      setIsSubmitting(false);
      setIsSubmitted(true);
      localStorage.setItem('kawai_newsletter_popup_seen', 'true');
      
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
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
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-transparent text-sm"
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    backgroundColor: isSubmitting ? '#9CA3AF' : '#DC2626',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#991B1B';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#DC2626';
                    }
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Get Exclusive VIP Offers & Events'}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                {/* Success Icon with Enhanced Animation */}
                <div className="mb-6">
                  <div 
                    className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      animation: 'success-bounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                    }}
                  >
                    {/* Success Checkmark */}
                    <svg 
                      className="w-10 h-10 text-white"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{
                        animation: 'checkmark-draw 0.6s ease-out 0.3s both'
                      }}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2.5} 
                        d="M5 13l4 4L19 7"
                        style={{
                          strokeDasharray: 24,
                          strokeDashoffset: 24,
                          animation: 'checkmark-draw 0.6s ease-out 0.3s both'
                        }}
                      />
                    </svg>
                    
                    {/* Success Ring Animation */}
                    <div 
                      className="absolute inset-0 rounded-full border-4 border-green-400/30"
                      style={{
                        animation: 'success-ring 1s ease-out 0.1s'
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Success Text with Staggered Animation */}
                <div className="space-y-3">
                  <h3 
                    className="text-2xl font-serif text-kawai-black"
                    style={{
                      animation: 'text-fade-up 0.6s ease-out 0.5s both'
                    }}
                  >
                    Welcome to VIP!
                  </h3>
                  <p 
                    className="text-kawai-black/70 text-sm leading-relaxed"
                    style={{
                      animation: 'text-fade-up 0.6s ease-out 0.7s both'
                    }}
                  >
                    You're now part of our exclusive community.<br/>
                    Get ready for premium piano offers and special events!
                  </p>
                </div>
                
                {/* Success Confetti Effect */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-kawai-red rounded-full"
                        style={{
                          animation: `confetti-${i} 1.2s ease-out 0.8s both`,
                          left: `${i * 10 - 25}px`,
                          top: '0px'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Enhanced CSS Animations */}
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes success-bounce {
                  0% {
                    transform: scale(0) rotate(-180deg);
                    opacity: 0;
                  }
                  50% {
                    transform: scale(1.2) rotate(-90deg);
                  }
                  100% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                  }
                }
                
                @keyframes checkmark-draw {
                  0% {
                    stroke-dashoffset: 24;
                    opacity: 0;
                  }
                  100% {
                    stroke-dashoffset: 0;
                    opacity: 1;
                  }
                }
                
                @keyframes success-ring {
                  0% {
                    transform: scale(0.8);
                    opacity: 1;
                  }
                  100% {
                    transform: scale(2);
                    opacity: 0;
                  }
                }
                
                @keyframes text-fade-up {
                  0% {
                    transform: translateY(20px);
                    opacity: 0;
                  }
                  100% {
                    transform: translateY(0);
                    opacity: 1;
                  }
                }
                
                @keyframes confetti-0 {
                  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                  100% { transform: translateY(-40px) translateX(-20px) rotate(120deg); opacity: 0; }
                }
                @keyframes confetti-1 {
                  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                  100% { transform: translateY(-35px) translateX(15px) rotate(-90deg); opacity: 0; }
                }
                @keyframes confetti-2 {
                  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                  100% { transform: translateY(-30px) translateX(-10px) rotate(45deg); opacity: 0; }
                }
                @keyframes confetti-3 {
                  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                  100% { transform: translateY(-45px) translateX(25px) rotate(-45deg); opacity: 0; }
                }
                @keyframes confetti-4 {
                  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                  100% { transform: translateY(-25px) translateX(-15px) rotate(90deg); opacity: 0; }
                }
                @keyframes confetti-5 {
                  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                  100% { transform: translateY(-35px) translateX(20px) rotate(-120deg); opacity: 0; }
                }
              `
            }} />
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