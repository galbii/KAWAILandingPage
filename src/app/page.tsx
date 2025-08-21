'use client';

import Header from '@/components/Header';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import HeroSection from '@/components/sections/HeroSection';
import ValuePropositionSection from '@/components/sections/ValuePropositionSection';
import AboutEventSection from '@/components/sections/AboutEventSection';
import { FeaturedDeals } from '@/components/sections/piano-gallery';
import BookingSection from '@/components/sections/BookingSection';
import { ShowroomLocation } from '@/components/sections/showroom-location';
import { Footer } from '@/components/Footer';

export default function Home() {
  useScrollAnimations();

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