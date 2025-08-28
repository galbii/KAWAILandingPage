'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { usePageTracking } from '@/hooks/usePageTracking';
import { trackDemographics } from '@/lib/analytics';
import HeroSection from '@/components/sections/HeroSection';
import ValuePropositionSection from '@/components/sections/ValuePropositionSection';
import AboutEventSection from '@/components/sections/AboutEventSection';
import { FeaturedDeals } from '@/components/sections/piano-gallery';
import BookingSection from '@/components/sections/BookingSection';
import { ShowroomLocation } from '@/components/sections/showroom-location';
import { Footer } from '@/components/Footer';
import { StructuredData } from '@/components/SEO/StructuredData';
import FAQSection from '@/components/sections/FAQSection';
import { CountdownTimer } from '@/components/CountdownTimer';
import { NewsletterPopup } from '@/components/NewsletterPopup';

export default function ClientHomePage() {
  useScrollAnimations();
  
  // Enable comprehensive page tracking for the KAWAI piano sale landing page
  usePageTracking({
    pageName: 'kawai_piano_sale_landing',
    enableScrollTracking: true,
    enableTimeTracking: true,
    enableExitIntent: true,
    scrollThresholds: [25, 50, 75, 90],
    timeUpdateInterval: 30000 // Update every 30 seconds
  });

  // Initialize enhanced demographic tracking
  useEffect(() => {
    // Enable Google Analytics demographic collection
    trackDemographics.enableGoogleDemographics();
    
    // Set initial user segmentation for piano sale visitors
    trackDemographics.setUserSegment({
      customer_type: 'first_time', // Assume first time unless we have data otherwise
      engagement_level: 'medium',  // Will be updated based on behavior
      piano_interest: 'both',      // Piano sale event covers both digital and acoustic
      budget_range: 'mid_range'    // KAWAI targets mid to premium market
    });
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <StructuredData />
      <Header />
      <HeroSection />
      <AboutEventSection />
      <ValuePropositionSection />
      <FeaturedDeals />
      <BookingSection />
      <FAQSection />
      <ShowroomLocation />
      <Footer />
      <CountdownTimer />
      <NewsletterPopup />
    </div>
  );
}