import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PianoConsultationDialog from '@/components/PianoConsultationDialog';
import { trackKawaiEvent } from '@/lib/analytics';

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <section className="relative min-h-screen flex items-start justify-center text-white pt-16 hero-parallax scroll-container overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        onLoadedData={(e) => {
          const video = e.target as HTMLVideoElement;
          video.currentTime = 13.10;
        }}
      >
        <source src="/videos/CA.mp4" type="video/mp4" />
      </video>
      
      {/* Background Layer for Parallax */}
      <div className="hero-background parallax-element parallax-slow">
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center hero-content mt-16">
        
        
        {/* KAWAI Logo */}
        <div className="relative mb-8 scroll-animate-scale pt-8">
          <Image
            src="/images/optimized/logos/Kawai-Red.webp"
            alt="KAWAI Logo"
            width={200}
            height={80}
            className="mx-auto"
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
              onClick={handleFindPianoClick}
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Find Your Piano
            </Button>
            <Button 
              onClick={handleSecureSpotClick}
              className="bg-red-700 text-white hover:bg-red-600 px-8 py-3 text-lg font-semibold"
            >
              Secure Your Spot
            </Button>
          </div>
          
        </div>
      </div>
      
      {/* Piano Consultation Dialog */}
      <PianoConsultationDialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}