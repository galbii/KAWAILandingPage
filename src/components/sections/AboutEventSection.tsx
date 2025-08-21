
'use client';

import { useState } from 'react';
import PianoConsultationDialog from '@/components/PianoConsultationDialog';

export default function AboutEventSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section id="about-event" className="py-24 bg-muted/30 scroll-container">
      <div className="max-w-7xl mx-auto px-6">

        {/* Piano Types Header */}
        <div className="text-center mb-12 scroll-animate">
          <h2 className="text-sm md:text-base font-normal text-gray-500 tracking-wider leading-relaxed opacity-80">
            BABY GRANDS | MUSIC ROOM GRANDS | UPRIGHTS | STUDIOS | CONSOLES | <span className="text-kawai-red">PREMIUM DIGITALS</span> | FINANCING AVAILABLE
          </h2>
        </div>

        {/* Event Description */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 scroll-animate-left">
            <div className="flex flex-col items-center text-center mb-6">
              <img 
                src="/images/kawai-logo-red-1x.png"
                alt="KAWAI Logo"
                className="h-16 w-auto mb-4"
              />
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                A Partnership Built on <span className="text-kawai-red">Musical Excellence</span>
              </h3>
            </div>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-base">
                For over five years, our exclusive partnership with Sam Houston State University&apos;s Music Department has brought Houston families access to premium Kawai pianos at specially negotiated pricing.
              </p>
              
              <p className="text-base">
                This four-day exclusive event features carefully selected instruments that meet SHSU&apos;s rigorous quality standards. Each piano has been chosen by the university&apos;s music faculty for its exceptional sound quality, build craftsmanship, and educational value.
              </p>
              
              <p className="text-base">
                Whether you&apos;re a SHSU student, Houston resident, or music enthusiast, this event offers a rare opportunity to acquire professional-grade instruments with the confidence that comes from institutional endorsement.
              </p>
            </div>

            <div className="bg-gradient-to-r from-kawai-red/5 to-tsu-blue/5 rounded-lg p-6 border border-kawai-red/20">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-kawai-red mb-2">Secure Your Access to Our Early Bird Inventory</h4>
                <p className="text-sm text-muted-foreground mb-4">Don&apos;t miss out on exclusive deals, <span className="text-kawai-red/80 font-medium">priority access to our premium selection</span>, <span className="text-kawai-red font-medium">free delivery and tuning</span></p>
                <div className="space-y-3">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-kawai-red text-white px-6 py-3 rounded-lg font-medium hover:bg-kawai-red/90 transition-colors"
                  >
                    Secure Your Savings and Find Deals
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="block w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors border-2 border-red-700"
                  >
                    Secure Your Spot
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

          <div className="relative scroll-animate-right">
            <img 
              src="/images/letter.png"
              alt="SHSU Piano Sale Letter"
              className="w-full h-auto object-contain opacity-90"
            />
          </div>
        </div>

        {/* Bento Grid Gallery */}
        <div className="mt-16">
          <div className="grid grid-cols-6 gap-0 h-[40rem]">
            {/* KAWAI CA901 - Hero */}
            <div className="col-span-3 row-span-2 relative overflow-hidden scroll-animate" style={{ animationDelay: '0.1s' }}>
              <img 
                src="/images/gallery/KAWAI-CA901B-24 copy.webp"
                alt="KAWAI CA901 Digital Piano"
                className="w-full h-full object-cover opacity-0 animate-fade-in-slow"
                style={{ animationDelay: '0.2s' }}
              />
            </div>

            {/* KAWAI CA501 */}
            <div className="col-span-3 row-span-1 relative overflow-hidden scroll-animate" style={{ animationDelay: '0.3s' }}>
              <img 
                src="/images/gallery/KAWAI-CA501W-39 copy.webp"
                alt="KAWAI CA501 Digital Piano"
                className="w-full h-full object-cover opacity-0 animate-fade-in-slow"
                style={{ animationDelay: '0.6s' }}
              />
            </div>

            {/* KAWAI CA401 */}
            <div className="col-span-2 row-span-1 relative overflow-hidden scroll-animate" style={{ animationDelay: '0.5s' }}>
              <img 
                src="/images/gallery/KAWAI_CA401B-43 copy.webp"
                alt="KAWAI CA401 Digital Piano"
                className="w-full h-full object-cover opacity-0 animate-fade-in-slow"
                style={{ animationDelay: '1.0s' }}
              />
            </div>

            {/* Connectivity */}
            <div className="col-span-1 row-span-1 relative overflow-hidden scroll-animate" style={{ animationDelay: '0.7s' }}>
              <img 
                src="/images/gallery/connectivity.webp"
                alt="Connectivity Features"
                className="w-full h-full object-cover opacity-0 animate-fade-in-slow"
                style={{ animationDelay: '1.4s' }}
              />
            </div>

            {/* CA401 Supplement */}
            <div className="col-span-3 row-span-1 relative overflow-hidden scroll-animate" style={{ animationDelay: '0.9s' }}>
              <img 
                src="/images/gallery/CA401 Supplement Image.webp"
                alt="KAWAI CA401 Supplement"
                className="w-full h-full object-cover opacity-0 animate-fade-in-slow"
                style={{ animationDelay: '1.8s' }}
              />
            </div>

            {/* CA701R */}
            <div className="col-span-2 row-span-1 relative overflow-hidden scroll-animate" style={{ animationDelay: '1.1s' }}>
              <img 
                src="/images/gallery/CA701R-43 copy.webp"
                alt="KAWAI CA701R Digital Piano"
                className="w-full h-full object-cover opacity-0 animate-fade-in-slow"
                style={{ animationDelay: '2.2s' }}
              />
            </div>

            {/* SK Series */}
            <div className="col-span-1 row-span-1 relative overflow-hidden scroll-animate" style={{ animationDelay: '1.3s' }}>
              <img 
                src="/images/gallery/SK.webp"
                alt="KAWAI SK Series"
                className="w-full h-full object-cover opacity-0 animate-fade-in-slow"
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
  );
}