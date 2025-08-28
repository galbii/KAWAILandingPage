import Image from 'next/image';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import PianoConsultationDialog from '@/components/PianoConsultationDialog';
import HoustonEventInfoDialog from '@/components/HoustonEventInfoDialog';
import { trackKawaiEvent } from '@/lib/analytics';

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventInfoModalOpen, setIsEventInfoModalOpen] = useState(false);

  const handleExploreCollectionClick = () => {
    console.log('Explore Collection clicked');
    // Track the analytics event
    trackKawaiEvent.findPiano('hero');
    
    // Try multiple selectors to find the piano deals section
    let featuredDealsSection = document.getElementById('featured-deals');
    if (!featuredDealsSection) {
      featuredDealsSection = document.querySelector('[id="featured-deals"]');
    }
    if (!featuredDealsSection) {
      featuredDealsSection = document.querySelector('.piano-gallery, .featured-deals');
    }
    
    console.log('Found featured deals section:', featuredDealsSection);
    if (featuredDealsSection) {
      featuredDealsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.error('Could not find featured deals section');
    }
  };

  const handleReserveConsultationClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Reserve Consultation clicked');
    // Track the analytics event
    trackKawaiEvent.secureSpot('hero');
    
    // Open the piano consultation dialog
    setIsModalOpen(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white hero-parallax scroll-container overflow-hidden w-full">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        webkit-playsinline="true"
        controls={false}
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ pointerEvents: 'none' }}
        onLoadedData={(e) => {
          const video = e.target as HTMLVideoElement;
          video.currentTime = 13.10;
          video.play().catch(() => {
            // Fallback if autoplay fails
          });
        }}
      >
        <source src="/videos/CA.mp4" type="video/mp4" />
      </video>
      
      {/* Background Layer for Parallax */}
      <div className="hero-background parallax-element parallax-slow" style={{ pointerEvents: 'none' }}>
        <div className="absolute inset-0 bg-black/15"></div>
      </div>
      
      {/* Premium Content Backdrop */}
      <div className="absolute inset-0 z-5" style={{ pointerEvents: 'none' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/25"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center hero-content py-8 sm:py-12 lg:pt-20 lg:pb-12">
        
        {/* Partnership Branding */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-12 animate-premium-float animate-hero-entrance-subtle animate-delay-500">
          <div className="flex items-center gap-4">
            <Image
              src="/images/optimized/logos/Kawai-Red.webp"
              alt="KAWAI"
              width={160}
              height={64}
              className="drop-shadow-lg w-32 sm:w-40"
              priority
            />
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-orange-400/60 to-transparent"></div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-500">SHSU</div>
              <div className="text-xs text-orange-400 tracking-wide">PARTNERSHIP</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-6 sm:mb-8 animate-hero-entrance-subtle animate-delay-1000">
          <div className="text-xs sm:text-sm text-orange-500 font-medium tracking-wider uppercase px-2">Sam Houston State University is proud to present</div>
        </div>

        {/* Main Headlines */}
        <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
          <h1 className="font-heading leading-tight px-2">
            <div className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight mb-2 sm:mb-4 animate-hero-entrance-subtle animate-delay-1500">
              EXCLUSIVE
            </div>
            <div className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white tracking-wide animate-hero-entrance-subtle animate-delay-2000">
              PIANO SALE
            </div>
          </h1>
          
          {/* Premium Value Proposition */}
          <div className="space-y-4 animate-hero-entrance-subtle animate-delay-2500 px-2">
            <div className="text-base sm:text-lg md:text-xl text-white font-light">Modern Technology • Special University Pricing</div>
          </div>
        </div>
        
        {/* Event Details & CTA */}
        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-2">
          
          {/* Event Timing with Urgency */}
          <div className="space-y-2 sm:space-y-3 animate-hero-entrance-subtle animate-delay-3000">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600/20 backdrop-blur-sm rounded-full border border-red-400/30">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-300 font-semibold tracking-wide text-xs sm:text-sm">4 DAYS ONLY</span>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-light text-white tracking-wider">September 11-14, 2025</div>
            <div className="text-sm sm:text-base text-white/90">Houston • While Selection Lasts</div>
          </div>
          
          {/* Primary Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-hero-entrance-subtle animate-delay-3500">
            <button 
              onClick={handleExploreCollectionClick}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-bold rounded-lg shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-red-400/50 w-full sm:w-auto cursor-pointer relative"
              style={{ pointerEvents: 'auto', zIndex: 50 }}
              type="button"
            >
              <span className="block sm:hidden">Explore Collection</span>
              <span className="hidden sm:block">Explore Exclusive Collection</span>
            </button>
            
            <button 
              onClick={handleReserveConsultationClick}
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto cursor-pointer relative"
              style={{ pointerEvents: 'auto', zIndex: 50 }}
              type="button"
            >
              <span className="block sm:hidden">Reserve Consultation</span>
              <span className="hidden sm:block">Reserve Private Consultation</span>
            </button>
          </div>
          
          {/* Supporting Message */}
          <div className="text-sm sm:text-base text-white/80 italic animate-hero-entrance-subtle animate-delay-4000">
            Your purchase supports the SHSU Music Department
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