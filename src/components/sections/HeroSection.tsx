import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { OptimizedVideo } from '@/components/ui/optimized-video';
import PianoConsultationDialog from '@/components/PianoConsultationDialog';
import HoustonEventInfoDialog from '@/components/HoustonEventInfoDialog';
import { trackKawaiEvent } from '@/lib/analytics';

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventInfoModalOpen, setIsEventInfoModalOpen] = useState(false);

  const handleFindPianoClick = () => {
    // Track the analytics event
    trackKawaiEvent.findPiano('hero');
    
    // Scroll to featured deals section
    const featuredDealsSection = document.getElementById('featured-deals');
    if (featuredDealsSection) {
      featuredDealsSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Open modal after a short delay
    setTimeout(() => {
      setIsModalOpen(true);
    }, 800);
  };

  const handleSecureSpotClick = () => {
    // Track the analytics event
    trackKawaiEvent.secureSpot('hero');
    
    // Open the piano consultation dialog
    setIsModalOpen(true);
  };

  const handleRequestEventInfoClick = () => {
    // Track the analytics event
    trackKawaiEvent.openModal('Request Houston Event Information', 'hero', 'event_info', 'information_request');
    
    // Open the Houston event info dialog
    setIsEventInfoModalOpen(true);
  };

  return (
    <section className="relative min-h-screen flex items-start justify-center text-white pt-16 hero-parallax scroll-container overflow-hidden">
      {/* Optimized Video Background */}
      <OptimizedVideo
        src="/videos/CA.mp4"
        webmSrc="/optimized/videos/CA_optimized.webm"
        fallbackSrc="/optimized/videos/CA_optimized.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        startTime={13.10}
        priority={true}
        preload="metadata"
      />
      
      {/* Background Layer for Parallax */}
      <div className="hero-background parallax-element parallax-slow">
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center hero-content mt-16">
        
        
        {/* KAWAI Logo */}
        <div className="relative mb-8 scroll-animate-scale pt-8">
          <OptimizedImage
            src="/images/optimized/logos/Kawai-Red.webp"
            fallbackSrc="/images/optimized/logos/Kawai-Red.png"
            alt="KAWAI Logo"
            width={200}
            height={80}
            className="mx-auto"
            priority={true}
            quality={95}
            sizes="200px"
          />
        </div>

        {/* Main Header */}
        <div className="relative mb-6 scroll-animate-scale">
          {/* Top Line */}
          <div className="w-full h-1 bg-white/60 mb-4 scroll-animate-left"></div>
          
          <h1 className="font-heading text-white tracking-wider leading-tight scroll-animate">
            <span className="font-black text-3xl md:text-6xl lg:text-8xl tracking-wide block mb-2 drop-shadow-2xl" style={{ color: '#FF4500', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>SAM HOUSTON STATE UNIVERSITY</span>
            <span className="font-normal text-2xl md:text-4xl lg:text-5xl block">HOUSTON PIANO SALES EVENT</span>
          </h1>
          
          {/* Bottom Line */}
          <div className="w-full h-1 bg-white/60 mt-4 scroll-animate-right"></div>
          
          {/* Subtitle */}
          <p className="font-body text-sm md:text-base text-white/90 mt-6 scroll-animate">
          Premium piano deals Houston - digital & acoustic pianos at special reduced prices. KAWAI piano sales for our community with savings up to $6,000. Your purchase supports SHSU&apos;s Music Department.
          </p>
          
        </div>
        
        {/* Essential Info - Centered */}
        <div className="space-y-8 max-w-2xl mx-auto">
          <p className="font-body text-lg text-white/90 scroll-animate tracking-wide">September 11-14, 2025</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center scroll-animate">
            <Button 
              onClick={handleSecureSpotClick}
              className="bg-red-700 text-white hover:bg-red-600 px-8 py-3 text-lg font-semibold"
            >
              Schedule Your Consultation
            </Button>
            <Button 
              onClick={handleRequestEventInfoClick}
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold border-2 border-white"
            >
              Request Houston Event Information
            </Button>
          </div>
          
          {/* Secondary Find Piano CTA */}
          <div className="mt-4 scroll-animate">
            <Button 
              onClick={handleFindPianoClick}
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10 px-6 py-2 text-base font-medium underline decoration-white/60 hover:decoration-white"
            >
              Browse Piano Selection
            </Button>
          </div>
          
        </div>
      </div>
      
      {/* Piano Consultation Dialog */}
      <PianoConsultationDialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      {/* Houston Event Information Dialog */}
      <HoustonEventInfoDialog 
        isOpen={isEventInfoModalOpen} 
        onClose={() => setIsEventInfoModalOpen(false)} 
      />
    </section>
  );
}