import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PianoConsultationModal from '@/components/PianoConsultationModal';

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFindPianoClick = () => {
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

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white pt-24 hero-parallax scroll-container overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        onLoadedData={(e) => {
          const video = e.target as HTMLVideoElement;
          video.currentTime = 10.10;
        }}
      >
        <source src="/videos/CA.mp4" type="video/mp4" />
      </video>
      
      {/* Background Layer for Parallax */}
      <div className="hero-background parallax-element parallax-slow">
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center hero-content">
        
        {/* SHSU Logo - Prominent at top of hero */}
        <div className="-mb-8 scroll-animate-scale">
          <div className="relative w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 mx-auto">
            <Image
              src="/images/d58176959ed0e21ad2d59eb2fc3a6c0f-2439863838.png"
              alt="Sam Houston State University"
              fill
              className="object-contain filter drop-shadow-lg"
              priority
            />
          </div>
        </div>
        
        {/* Main Header */}
        <div className="relative mb-8 scroll-animate-scale">
          {/* Top Line */}
          <div className="w-full h-1 bg-white/60 mb-8 scroll-animate-left"></div>
          
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl text-white tracking-wider leading-tight scroll-animate">
            <span className="font-normal">SAM HOUSTON STATE UNIVERSITY</span>
            <br />
            <span className="font-bold">PIANO SALE EVENT</span>
          </h1>
          
          {/* Bottom Line */}
          <div className="w-full h-1 bg-white/60 mt-8 scroll-animate-right"></div>
          
          {/* Subtitle */}
          <p className="font-body text-sm md:text-base text-white/90 mt-6 scroll-animate">
          Special reduced prices for our community - alumni, friends, and early birds before public sale. Your purchase directly benefits the talented students and faculty of SHSU&apos;s Music Department.
          </p>
          
        </div>
        
        {/* Essential Info - Centered */}
        <div className="space-y-8 max-w-2xl mx-auto">
          <p className="font-body text-lg text-white/90 scroll-animate tracking-wide">April 3-6, 2025</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center scroll-animate">
            <Button 
              onClick={handleFindPianoClick}
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Find Your Piano
            </Button>
            <Button className="bg-red-700 text-white hover:bg-red-600 px-8 py-3 text-lg font-semibold">
              Secure Your Spot
            </Button>
          </div>
          
          {/* Early Bird Incentive */}
          <div className="mt-8 scroll-animate">
            <p className="font-body text-base md:text-lg text-white font-medium tracking-wide">
              <span className="italic">Book now for early bird access to our premium inventory</span>
              <br className="hidden sm:block" />
              <span className="sm:inline block mt-1 sm:mt-0"> — </span>
              <span className="font-semibold">plus free tuning and delivery</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Piano Consultation Modal */}
      <PianoConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}