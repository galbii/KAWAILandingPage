'use client';

import { useState, useEffect, useRef } from 'react';

export default function BookingSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  // Load Calendly script when component becomes visible
  useEffect(() => {
    if (isVisible) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);

      return () => {
        // Clean up script when component unmounts
        const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, [isVisible]);


  return (
    <section ref={sectionRef} id="booking-consultation" className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
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

          {/* Calendly Widget Container */}
          <div className="bg-kawai-pearl p-6 rounded-2xl shadow-lg">
            <div 
              className="calendly-inline-widget" 
              data-url="https://calendly.com/kawaipianogallery/shsu-piano-sale" 
              style={{ 
                minWidth: '320px', 
                height: '700px',
                width: '100%'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}