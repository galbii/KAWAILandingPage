
'use client';

import { useState } from 'react';
import Image from 'next/image';
import PianoConsultationDialog from '@/components/PianoConsultationDialog';

export default function AboutEventSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      {/* Piano Types Header - Moved higher to separate sections */}
      <div className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center scroll-animate">
          {/* Desktop version - normal text */}
          <h2 className="hidden md:block text-sm md:text-base font-normal text-gray-500 tracking-wider leading-relaxed opacity-80">
            HOUSTON PIANO SALES | BABY GRANDS | UPRIGHTS | DIGITALS | <span className="text-kawai-red">USED PIANOS HOUSTON</span> | FINANCING AVAILABLE
          </h2>
          {/* Mobile version - scrolling text */}
          <div className="md:hidden overflow-hidden relative w-full">
            <div className="animate-scroll-mobile">
              <h2 className="text-sm font-normal text-gray-500 tracking-wider leading-relaxed opacity-80 whitespace-nowrap inline-block">
                HOUSTON PIANO SALES | BABY GRANDS | UPRIGHTS | DIGITALS | <span className="text-kawai-red">USED PIANOS HOUSTON</span> | FINANCING AVAILABLE
              </h2>
            </div>
          </div>
        </div>
      </div>

      <section id="about-event" className="py-24 bg-muted/30 scroll-container">
        <div className="max-w-7xl mx-auto px-6">

        {/* Event Description */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 scroll-animate-left">
            <div className="flex flex-col items-center text-center mb-6">
              <Image 
                src="/images/optimized/logos/Kawai-Red.webp"
                alt="KAWAI Piano Sales Houston - Premium Piano Dealer"
                width={120}
                height={64}
                className="h-16 w-auto mb-4"
              />
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                Houston&apos;s Premier <span className="text-kawai-red">Piano Sale Event</span>
              </h3>
            </div>

            {/* Mobile Letter Image - Shown on mobile right after title */}
            <div className="lg:hidden relative mb-8 scroll-animate">
              <Image 
                src="/images/optimized/misc/letter_800.webp"
                alt="SHSU Houston Piano Sale Event Letter - Piano Deals Houston"
                width={800}
                height={600}
                className="w-full h-auto object-contain opacity-90 max-w-md mx-auto"
              />
            </div>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-base">
                For over five years, our exclusive partnership with Sam Houston State University has made us Houston&apos;s trusted piano dealer, bringing Greater Houston Area families access to premium KAWAI piano sales at specially negotiated pricing.
              </p>
              
              <p className="text-base">
                This four-day exclusive Houston piano sale event features carefully selected digital and acoustic instruments. From used pianos Houston families love to brand new grand pianos, each instrument meets SHSU&apos;s rigorous quality standards for exceptional sound and craftsmanship.
              </p>
              
              <p className="text-base">
                Whether you&apos;re seeking piano deals Houston residents can trust, need piano lessons Houston area, or want professional-grade instruments, this event offers unmatched piano sales Houston has to offer with institutional endorsement.
              </p>
            </div>

            <div className="bg-gradient-to-r from-kawai-red/5 to-tsu-blue/5 rounded-lg p-6 border border-kawai-red/20">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-black mb-2">Secure Your Savings</h4>
                <p className="text-sm text-muted-foreground mb-4">Don&apos;t miss out on exclusive deals, <span className="text-kawai-red/80 font-medium">priority access to our premium selection</span>, <span className="text-kawai-red font-medium">free delivery and tuning</span></p>
                <div className="space-y-3">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="block w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    style={{backgroundColor: '#CC0000', color: '#FFFFFF'}}
                  >
                    Secure Your Savings
                  </button>
                  <button 
                    onClick={() => {
                      const featuredDeals = document.querySelector('#featured-deals') || document.querySelector('[id*="deals"]');
                      if (featuredDeals) {
                        featuredDeals.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="block w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-in-out"
                  >
                    View Featured Deals
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Letter Image - Hidden on mobile */}
          <div className="hidden lg:block relative scroll-animate-right">
            <Image 
              src="/images/optimized/misc/letter_800.webp"
              alt="SHSU Houston Piano Sale Event Letter - Piano Deals Houston"
              width={800}
              height={600}
              className="w-full h-auto object-contain opacity-90"
            />
          </div>
        </div>

        {/* Bento Grid Gallery */}
        <div className="mt-16">
          <div className="grid grid-cols-6 gap-0 h-[40rem]">
            {/* KAWAI CA901 - Hero */}
            <div className="col-span-3 row-span-2 relative overflow-hidden scroll-animate" style={{ animationDelay: '0.1s' }}>
              <Image 
                src="/images/optimized/gallery/KAWAI-CA901B-24 copy_800.webp"
                alt="KAWAI CA901 Digital Piano"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-0 animate-fade-in-slow"
                style={{ animationDelay: '0.2s' }}
              />
            </div>

            {/* KAWAI CA501 */}
            <div className="col-span-3 row-span-1 relative overflow-hidden scroll-animate" style={{ animationDelay: '0.3s' }}>
              <Image 
                src="/images/optimized/gallery/KAWAI-CA501W-39 copy_800.webp"
                alt="KAWAI CA501 Digital Piano"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-0 animate-fade-in-slow"
                style={{ animationDelay: '0.6s' }}
              />
            </div>

            {/* KAWAI CA401 */}
            <div className="col-span-2 row-span-1 relative overflow-hidden scroll-animate" style={{ animationDelay: '0.5s' }}>
              <Image 
                src="/images/optimized/gallery/KAWAI_CA401B-43 copy_800.webp"
                alt="KAWAI CA401 Digital Piano"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-0 animate-fade-in-slow"
                style={{ animationDelay: '1.0s' }}
              />
            </div>

            {/* Connectivity */}
            <div className="col-span-1 row-span-1 relative overflow-hidden scroll-animate" style={{ animationDelay: '0.7s' }}>
              <Image 
                src="/images/optimized/gallery/connectivity_800.webp"
                alt="Connectivity Features"
                fill
                sizes="(max-width: 768px) 100vw, 16vw"
                className="object-cover opacity-0 animate-fade-in-slow"
                style={{ animationDelay: '1.4s' }}
              />
            </div>

            {/* CA401 Supplement */}
            <div className="col-span-3 row-span-1 relative overflow-hidden scroll-animate" style={{ animationDelay: '0.9s' }}>
              <Image 
                src="/images/optimized/gallery/CA401 Supplement Image_800.webp"
                alt="KAWAI CA401 Supplement"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-0 animate-fade-in-slow"
                style={{ animationDelay: '1.8s' }}
              />
            </div>

            {/* CA701R */}
            <div className="col-span-2 row-span-1 relative overflow-hidden scroll-animate" style={{ animationDelay: '1.1s' }}>
              <Image 
                src="/images/optimized/gallery/CA701R-43 copy_800.webp"
                alt="KAWAI CA701R Digital Piano"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-0 animate-fade-in-slow"
                style={{ animationDelay: '2.2s' }}
              />
            </div>

            {/* SK Series */}
            <div className="col-span-1 row-span-1 relative overflow-hidden scroll-animate" style={{ animationDelay: '1.3s' }}>
              <Image 
                src="/images/optimized/gallery/SK_800.webp"
                alt="KAWAI SK Series"
                fill
                sizes="(max-width: 768px) 100vw, 16vw"
                className="object-cover opacity-0 animate-fade-in-slow"
                style={{ animationDelay: '2.6s' }}
              />
            </div>
          </div>
        </div>
      </div>
      
        {/* Piano Consultation Dialog */}
        <PianoConsultationDialog 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </section>
    </>
  );
}