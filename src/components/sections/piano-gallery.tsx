"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import PianoConsultationDialog from '@/components/PianoConsultationDialog';
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation';
import { usePostHog } from '@/hooks/usePostHog';

interface FeaturedPiano {
  id: string;
  model: string;
  title: string;
  description: string;
  image: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  savings: number;
  keyFeatures: string[];
  availability: string;
}

const featuredPianos: FeaturedPiano[] = [
  {
    id: "es-120",
    model: "ES-120",
    title: "Kawai ES-120",
    description: "Compact digital piano with Responsive Hammer Compact action, 88 weighted keys, and premium piano sounds. Perfect for Houston piano lessons, home practice, and portable performances.",
    image: "/images/optimized/pianos/es120.webp",
    category: "Digital Piano",
    originalPrice: 1099,
    salePrice: 949,
    savings: 150,
    keyFeatures: ["88 Weighted Keys", "Responsive Hammer Action", "19 Premium Sounds"],
    availability: "3 more"
  },
  {
    id: "es-520",
    model: "ES-520",
    title: "Kawai ES-520",
    description: "Advanced digital piano featuring Responsive Hammer III action, premium sound engine, and comprehensive connectivity. Professional performance in a portable design.",
    image: "/images/optimized/pianos/ES520W_above_1200.webp",
    category: "Digital Piano",
    originalPrice: 1399,
    salePrice: 999,
    savings: 400,
    keyFeatures: ["88 Weighted Keys", "Bluetooth Connectivity", "38 Premium Sounds"],
    availability: "5 more"
  },
  {
    id: "k-200",
    model: "K-200",
    title: "Kawai K-200",
    description: "Professional upright piano with premium spruce soundboard, responsive action, and rich, resonant tone. Popular choice for Houston piano families, serious students, teachers, and music institutions.",
    image: "/images/optimized/pianos/K-200_EP_styling_1200.webp",
    category: "Upright Piano",
    originalPrice: 8395,
    salePrice: 6390,
    savings: 2005,
    keyFeatures: ["Solid Spruce Soundboard", "Premium Action", "114cm Height"],
    availability: "2 more"
  },
  {
    id: "gl-10",
    model: "GL-10",
    title: "Kawai GL-10",
    description: "Baby grand piano combining traditional craftsmanship with modern precision. Delivers exceptional touch, tone, and musical expression for the most discerning musicians.",
    image: "/images/optimized/pianos/GL10_1200.webp",
    category: "Grand Piano",
    originalPrice: 18995,
    salePrice: 12950,
    savings: 6045,
    keyFeatures: ["5'1\" Baby Grand", "Premium Action", "Solid Spruce Soundboard"],
    availability: "1 more"
  }
];

interface PianoSectionProps {
  piano: FeaturedPiano;
  index: number;
  hasTrackedAnyPiano: React.MutableRefObject<boolean>;
}

function PianoSection({ piano, index, hasTrackedAnyPiano }: PianoSectionProps) {
  const { ref: sectionRef, isVisible } = useIntersectionAnimation({
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });
  const { trackPianoView } = usePostHog();
  const activeTimer = useRef<NodeJS.Timeout | null>(null);

  const isEven = index % 2 === 0;

  // Track piano gallery view after 6 seconds (once per page view, any model)
  useEffect(() => {
    // Clear any existing timer first
    if (activeTimer.current) {
      clearTimeout(activeTimer.current);
      activeTimer.current = null;
    }

    if (isVisible && !hasTrackedAnyPiano.current) {
      activeTimer.current = setTimeout(() => {
        // Double-check we haven't tracked any piano yet
        if (!hasTrackedAnyPiano.current) {
          // Mark as tracked FIRST to prevent duplicate calls
          hasTrackedAnyPiano.current = true;
          
          trackPianoView({
            model: piano.model,
            price: `$${piano.salePrice}`,
            category: piano.category.includes('Digital') ? 'Digital' : 
                     piano.category.includes('Grand') ? 'Acoustic' : 
                     piano.category.includes('Upright') ? 'Acoustic' : 'Digital',
            timeSpent: 6,
            sourceSection: 'featured_deals_gallery',
            interactionType: 'view'
          });
        }
        activeTimer.current = null;
      }, 6000); // 6 seconds
    }

    return () => {
      if (activeTimer.current) {
        clearTimeout(activeTimer.current);
        activeTimer.current = null;
      }
    };
  }, [isVisible, piano.model, piano.salePrice, piano.category, trackPianoView, hasTrackedAnyPiano]);

  return (
    <section 
      ref={sectionRef}
      className="min-h-[30vh] flex items-center py-3"
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
        <div className={`grid lg:grid-cols-2 gap-4 lg:gap-6 items-center ${
          isEven ? '' : 'lg:grid-flow-col-dense'
        }`}>
          {/* Content */}
          <div className={`space-y-4 ${isEven ? '' : 'lg:col-start-2'}`}>
            <div className="space-y-3">
              <div className={`space-y-1 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="text-sm font-medium text-gray-600 break-words overflow-hidden">{piano.category}</div>
                <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-kawai-black break-words overflow-hidden">
                  {piano.title}
                </h2>
              </div>
              
              {/* Pricing Section */}
              <div className={`space-y-2 transition-all duration-600 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className={`flex items-center gap-3 transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <span className="text-lg text-gray-500 line-through transition-all duration-300 hover:scale-105">
                    ${piano.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl md:text-3xl font-bold text-red-600 transition-all duration-300 hover:scale-110 hover:text-red-700">
                    ${piano.salePrice.toLocaleString()}
                  </span>
                </div>
                <div className={`inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold transition-all duration-500 delay-400 hover:bg-green-200 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                  Special offers on gently used products
                </div>
              </div>
              
              <div className={`space-y-4 transition-all duration-600 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-sm md:text-base leading-relaxed text-kawai-black/80 max-w-lg">
                  {piano.description}
                </p>
                
                {/* Key Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-kawai-black">Key Features:</h4>
                  <ul className="text-sm text-kawai-black/70 space-y-1">
                    {piano.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Availability */}
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-orange-600 font-medium">{piano.availability}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className={`relative ${isEven ? '' : 'lg:col-start-1'}`}>
            <div className={`relative transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
              <Image
                src={piano.image}
                alt={`${piano.title} - Houston Piano Sales - Available at KAWAI Piano Store Houston`}
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedDeals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasTrackedAnyPiano = useRef<boolean>(false);
  // const heroRef = useRef<HTMLDivElement>(null);
  const { ref: headerRef, isVisible: headerVisible } = useIntersectionAnimation({
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <div id="featured-deals" className="bg-kawai-pearl">
      {/* Section Header */}
      <section ref={headerRef} className="py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-kawai-pearl via-white to-kawai-pearl opacity-50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className={`mb-8 transition-all duration-600 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Premium Gallery Title */}
            <div className={`relative inline-block mb-6 transition-all duration-600 delay-200 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-2">
                HOUSTON PIANO GALLERY
              </h1>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg"></div>
            </div>
            
            {/* Premium Subtitle */}
            <div className={`space-y-4 mb-6 transition-all duration-600 delay-400 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-xl md:text-2xl font-semibold text-gray-700 tracking-wide">
                Premium Collection • Exclusive Prices
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  LIMITED TIME EVENT
                </div>
                <span className="text-red-600 font-bold text-lg">September 11th - 14th, 2025</span>
              </div>
            </div>
          </div>
          
          <p className={`text-base md:text-lg leading-relaxed text-kawai-black/70 max-w-3xl mx-auto transition-all duration-600 delay-600 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Experience our handpicked selection of premium digital and acoustic pianos with university-exclusive pricing. Each masterfully crafted instrument showcases KAWAI&apos;s legendary quality, ready for immediate delivery from our Houston showroom. Every purchase directly benefits SHSU&apos;s Music Department programs.
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Piano Models */}
      {featuredPianos.map((piano, index) => (
        <PianoSection key={piano.id} piano={piano} index={index} hasTrackedAnyPiano={hasTrackedAnyPiano} />
      ))}
      
      {/* CTA Section */}
      <section className="py-12 text-center bg-kawai-pearl">
        <div className="max-w-2xl mx-auto px-6 space-y-4">
          <h3 className="font-heading text-2xl font-semibold text-kawai-black">
            Reserve Your Appointment - Limited Time Slots
          </h3>
          <p className="text-kawai-black/70 max-w-lg mx-auto">
            Only 12 appointment slots available for first selection access. Reserve your spot now for guaranteed priority viewing and exclusive appointment pricing.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group"
          >
            <span>Reserve My Spot</span>
            <svg
              className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <p className="text-sm text-red-600 font-medium">
            Only 4 slots remaining for September 11th • Walk-ins welcome with remaining inventory
          </p>
        </div>
      </section>
      
      {/* Piano Consultation Dialog */}
      <PianoConsultationDialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}