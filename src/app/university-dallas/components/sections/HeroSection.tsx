import Image from 'next/image';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import PianoConsultationDialog from '../PianoConsultationDialog';
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

  const handleReserveAppointmentClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Reserve Appointment clicked');
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
      
      {/* Enhanced Background Overlay for Better Text Readability */}
      <div className="absolute inset-0 z-5" style={{ pointerEvents: 'none' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40"></div>
      </div>
      
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center hero-content py-8 sm:py-12 lg:pt-20 lg:pb-12">
        <style jsx>{`
          .hero-content,
          .hero-content *,
          .hero-content span,
          .hero-content div,
          .hero-content h1,
          .hero-content button {
            color: #ffffff !important;
            opacity: 1 !important;
            filter: none !important;
            text-shadow: 2px 2px 6px rgba(0,0,0,0.8) !important;
          }
          .hero-content .text-red-600 {
            color: #dc2626 !important;
          }
          .hero-content .text-orange-400 {
            color: #fb923c !important;
          }
          .hero-content .text-red-200 {
            color: #fecaca !important;
          }
          .hero-content .text-orange-300 {
            color: #fdba74 !important;
          }
        `}</style>
        
        {/* Partnership Branding */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-12 animate-sophisticated-float animate-elegant-slide-up animate-delay-300">
          <div className="flex items-center gap-4">
            <Image
              src="/images/optimized/logos/Kawai-Red.webp"
              alt="KAWAI"
              width={160}
              height={64}
              className="drop-shadow-2xl w-32 sm:w-40"
              priority
            />
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-orange-400/40 to-transparent"></div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-400 drop-shadow-lg">UTD</div>
              <div className="text-xs text-orange-300 tracking-wide drop-shadow-sm">PARTNERSHIP</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-6 sm:mb-8 animate-elegant-slide-up animate-delay-600">
          <div className="text-xs sm:text-sm text-orange-400 font-medium tracking-wider uppercase px-2 drop-shadow-sm">University of Texas at Dallas is proud to present</div>
        </div>

        {/* Main Headlines - Centerpiece */}
        <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
          <h1 className="font-heading leading-tight px-2">
            <div className="animate-luxury-fade-in animate-delay-900 mb-2 sm:mb-4">
              {/* Mobile Layout - Vertical Stack */}
              <div className="flex flex-col items-center justify-center gap-3 sm:hidden">
                {/* Sam Houston text - First on mobile */}
                <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-2xl tracking-wide">
                  SAM HOUSTON
                </div>
                {/* Cross symbol */}
                <div className="text-xl font-black text-white drop-shadow-2xl">✕</div>
                {/* KAWAI text - Last on mobile */}
                <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-2xl tracking-wide">
                  KAWAI
                </div>
              </div>
              
              {/* Desktop Layout - Horizontal */}
              <div className="hidden sm:flex items-center justify-center gap-6 md:gap-8">
                {/* KAWAI Logo - First on desktop */}
                <Image
                  src="/images/Kawai (Red)(2).png"
                  alt="KAWAI Logo"
                  width={160}
                  height={48}
                  className="h-12 md:h-16 lg:h-18 xl:h-20 w-auto drop-shadow-2xl"
                />
                {/* Cross symbol */}
                <div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white drop-shadow-2xl">✕</div>
                {/* UTD Logo - Last on desktop */}
                <Image
                  src="/images/cd908542103759.57c06762b252e.jpg"
                  alt="UT Dallas Logo"
                  width={320}
                  height={160}
                  className="h-24 md:h-28 lg:h-32 xl:h-36 w-auto drop-shadow-2xl"
                />
              </div>
            </div>
            <div className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white tracking-wide animate-luxury-fade-in animate-delay-1200 drop-shadow-2xl">
              DALLAS EXCLUSIVE EVENT
            </div>
          </h1>
          
          {/* Premium Value Proposition */}
          <div className="space-y-4 animate-premium-glow animate-delay-1500 px-2">
            <div className="text-base sm:text-lg md:text-xl text-white font-light drop-shadow-lg">Cutting Edge Technology • Expert Piano Guidance</div>
          </div>
        </div>
        
        {/* Event Details & CTA */}
        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-2">
          
          {/* Event Timing with Urgency */}
          <div className="space-y-2 sm:space-y-3 animate-elegant-slide-up animate-delay-1800">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600/15 backdrop-blur-sm rounded-full border border-red-400/20 shadow-lg">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse drop-shadow-sm"></div>
              <span className="text-red-200 font-semibold tracking-wide text-xs sm:text-sm drop-shadow-sm">SCHEDULE YOUR APPOINTMENT</span>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-light text-white tracking-wider drop-shadow-lg">September 18-21, 2025</div>
            <div className="text-sm sm:text-base text-white/95 drop-shadow-sm animate-elegant-slide-up animate-delay-2000">Schedule your personal appointment with KAWAI piano experts for personalized recommendations and guidance</div>
          </div>
          
          {/* Primary Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button 
              onClick={handleReserveAppointmentClick}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-bold rounded-lg shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl border-2 border-red-400/40 w-full sm:w-auto cursor-pointer relative drop-shadow-lg animate-gentle-scale animate-delay-2200"
              style={{ pointerEvents: 'auto', zIndex: 50 }}
              type="button"
            >
              <span className="block sm:hidden drop-shadow-sm">Book Appointment</span>
              <span className="hidden sm:block drop-shadow-sm">Book Appointment</span>
            </button>
            
            <button 
              onClick={handleExploreCollectionClick}
              className="bg-white/80 backdrop-blur-sm text-black hover:bg-white/90 px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl w-full sm:w-auto cursor-pointer relative drop-shadow-lg animate-gentle-scale animate-delay-2400"
              style={{ pointerEvents: 'auto', zIndex: 50 }}
              type="button"
            >
              <span className="block sm:hidden drop-shadow-sm">View Piano Collection</span>
              <span className="hidden sm:block drop-shadow-sm">View Piano Collection</span>
            </button>
          </div>
          
          {/* Supporting Message */}
          <div className="text-sm sm:text-base text-white/90 italic animate-elegant-slide-up animate-delay-2600 drop-shadow-sm">
            Your purchase supports the UTD Music Department
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