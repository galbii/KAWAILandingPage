'use client';

import Header from '@/components/Header';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { usePageTracking } from '@/hooks/usePageTracking';
import HeroSection from '@/components/sections/HeroSection';
import ValuePropositionSection from '@/components/sections/ValuePropositionSection';
import AboutEventSection from '@/components/sections/AboutEventSection';
import { FeaturedDeals } from '@/components/sections/piano-gallery';
import BookingSection from '@/components/sections/BookingSection';
import { ShowroomLocation } from '@/components/sections/showroom-location';
import { Footer } from '@/components/Footer';

export default function Home() {
  useScrollAnimations();
  
  // Enable comprehensive page tracking for the KAWAI piano sale landing page
  const { trackContentInteraction } = usePageTracking({
    pageName: 'kawai_piano_sale_landing',
    enableScrollTracking: true,
    enableTimeTracking: true,
    enableExitIntent: true,
    scrollThresholds: [25, 50, 75, 90],
    timeUpdateInterval: 30000 // Update every 30 seconds
  });

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ValuePropositionSection />
      <AboutEventSection />
      <FeaturedDeals />
      <BookingSection />
      <ShowroomLocation />
      <Footer />
    </div>
  );
}