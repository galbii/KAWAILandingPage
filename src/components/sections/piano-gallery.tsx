"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PianoConsultationDialog from '@/components/PianoConsultationDialog';

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
    image: "/images/pianos/es120.jpeg",
    category: "Digital Piano",
    originalPrice: 1099,
    salePrice: 949,
    savings: 150,
    keyFeatures: ["88 Weighted Keys", "Responsive Hammer Action", "19 Premium Sounds"],
    availability: "Limited Stock"
  },
  {
    id: "es-520",
    model: "ES-520",
    title: "Kawai ES-520",
    description: "Advanced digital piano featuring Responsive Hammer III action, premium sound engine, and comprehensive connectivity. Professional performance in a portable design.",
    image: "/images/pianos/ES520W_above.png",
    category: "Digital Piano",
    originalPrice: 1399,
    salePrice: 999,
    savings: 400,
    keyFeatures: ["88 Weighted Keys", "Bluetooth Connectivity", "38 Premium Sounds"],
    availability: "Very Limited"
  },
  {
    id: "k-200",
    model: "K-200",
    title: "Kawai K-200",
    description: "Professional upright piano with premium spruce soundboard, responsive action, and rich, resonant tone. Popular choice for Houston piano families, serious students, teachers, and music institutions.",
    image: "/images/pianos/K-200_EP_styling.jpg",
    category: "Upright Piano",
    originalPrice: 8395,
    salePrice: 6390,
    savings: 2005,
    keyFeatures: ["Solid Spruce Soundboard", "Premium Action", "114cm Height"],
    availability: "Few Remaining"
  },
  {
    id: "gl-10",
    model: "GL-10",
    title: "Kawai GL-10",
    description: "Baby grand piano combining traditional craftsmanship with modern precision. Delivers exceptional touch, tone, and musical expression for the most discerning musicians.",
    image: "/images/pianos/GL10.jpg",
    category: "Grand Piano",
    originalPrice: 18995,
    salePrice: 12950,
    savings: 6045,
    keyFeatures: ["5'1\" Baby Grand", "Premium Action", "Solid Spruce Soundboard"],
    availability: "Exclusive Offer"
  }
];

interface PianoSectionProps {
  piano: FeaturedPiano;
  index: number;
}

function PianoSection({ piano, index }: PianoSectionProps) {
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start image animation immediately
          setIsImageVisible(true);
          
          // Start text animation after a delay
          setTimeout(() => {
            setIsTextVisible(true);
          }, 500);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

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
            <div className={`space-y-3 transition-all duration-700 ease-out ${
              isTextVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-600">{piano.category}</div>
                <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-kawai-black">
                  {piano.title}
                </h2>
              </div>
              
              {/* Pricing Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg text-gray-500 line-through">
                    ${piano.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl md:text-3xl font-bold text-red-600">
                    ${piano.salePrice.toLocaleString()}
                  </span>
                </div>
                <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Save ${piano.savings.toLocaleString()}
                </div>
              </div>
              
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

          {/* Image */}
          <div className={`relative ${isEven ? '' : 'lg:col-start-1'}`}>
            <div className={`relative transition-all duration-800 ease-out ${
              isImageVisible 
                ? 'opacity-100 translate-x-0' 
                : `opacity-0 ${isEven ? 'translate-x-12' : '-translate-x-12'}`
            }`}>
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
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeroVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div id="featured-deals" className="bg-kawai-pearl">
      {/* Section Header */}
      <section ref={heroRef} className="py-6 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <div className={`transition-all duration-700 ease-out ${
            isHeroVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-kawai-black mb-2">
              HOUSTON PIANO DEALS
            </h1>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                LIMITED TIME
              </div>
              <span className="text-red-600 font-semibold">September 11th - 14th, 2025</span>
            </div>
          </div>
          <p className={`text-base md:text-lg leading-relaxed text-kawai-black/70 max-w-2xl mx-auto transition-all duration-700 ease-out delay-200 ${
            isHeroVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            Exclusive piano sales Houston event featuring digital and acoustic pianos at special reduced prices. Used pianos Houston families trust, available at our Greater Houston Area showroom. Your purchase supports SHSU&apos;s Music Department.
          </p>
        </div>
      </section>

      {/* Piano Models */}
      {featuredPianos.map((piano, index) => (
        <PianoSection key={piano.id} piano={piano} index={index} />
      ))}
      
      {/* CTA Section */}
      <section className="py-12 text-center bg-kawai-pearl">
        <div className="max-w-2xl mx-auto px-6 space-y-4">
          <h3 className="font-heading text-2xl font-semibold text-kawai-black">
            Ready to Find Your Perfect Piano?
          </h3>
          <p className="text-kawai-black/70 max-w-md mx-auto">
            Get personalized recommendations and schedule your consultation
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group"
          >
            <span>Secure Your Savings</span>
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