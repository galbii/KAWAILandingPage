import { Cpu, Piano, Shield, Phone } from 'lucide-react';
import { trackKawaiEvent } from '@/lib/analytics';

export default function ValuePropositionSection() {
  return (
    <section className="relative overflow-hidden value-prop-section-mobile py-4 lg:py-6">
      
      {/* Enhanced Background Image with Fixed Attachment */}
      <div className="value-prop-background-fixed"></div>
      
      {/* Elegant Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 value-prop-overlay"></div>
    
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Value Propositions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 value-prop-grid-mobile">
          
          {/* Modern Technology */}
          <div className="text-center value-prop-left value-prop-mobile-compact">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/25 shadow-2xl value-prop-icon">
                <Cpu className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="font-heading text-lg lg:text-xl text-white mb-3 tracking-wide value-prop-title">
              MODERN TECHNOLOGY
            </h3>
            <p className="font-body text-gray-200 leading-snug max-w-sm mx-auto text-sm value-prop-desc">
              Advanced digital features and cutting-edge piano technology for enhanced musical expression
            </p>
          </div>

          {/* High-Quality Selection */}
          <div className="text-center value-prop-center value-prop-mobile-compact">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/25 shadow-2xl value-prop-icon">
                <Piano className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="font-heading text-lg lg:text-xl text-white mb-3 tracking-wide value-prop-title">
              HIGH-QUALITY SELECTION
            </h3>
            <p className="font-body text-gray-200 leading-snug max-w-sm mx-auto text-sm value-prop-desc">
              Shop a piano collection that meets rigorous standards, ensuring exceptional tone, touch, and durability
            </p>
          </div>

          {/* 10 Year Warranty */}
          <div className="text-center value-prop-right value-prop-mobile-compact">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/25 shadow-2xl value-prop-icon">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="font-heading text-lg lg:text-xl text-white mb-3 tracking-wide value-prop-title">
              10 YEAR WARRANTY
            </h3>
            <p className="font-body text-gray-200 leading-snug max-w-sm mx-auto text-sm value-prop-desc">
              All pianos have been professionally maintained and some come with a 10-year manufacturer&apos;s warranty
            </p>
          </div>

        </div>

        {/* Subtle Call to Action */}
        <div className="mt-6 text-center value-prop-cta-section value-prop-cta-mobile">
          <a 
            href="tel:7139040001"
            onClick={() => trackKawaiEvent.callPhone('value_proposition_section')}
            className="inline-block"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300">
              <p className="font-body text-white/70 text-base italic mb-1">
                Call Now
              </p>
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-5 h-5 text-white" />
                <p className="font-body text-white text-lg font-medium">
                  (713) 904-0001
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}