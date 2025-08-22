import { Cpu, Piano, Shield } from 'lucide-react';

export default function ValuePropositionSection() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/images/kawai-piano-hands.jpeg"
          alt="KAWAI Piano Background"
          className="w-full h-full object-cover"
        />
        
        {/* Elegant Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
      </div>
    
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Value Propositions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Modern Technology */}
          <div className="text-center scroll-animate">
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                <Cpu className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="font-heading text-xl lg:text-2xl text-white mb-6 tracking-wide">
              MODERN TECHNOLOGY
            </h3>
            <p className="font-body text-gray-200 leading-relaxed max-w-sm mx-auto">
              Advanced digital features and cutting-edge piano technology for enhanced musical expression
            </p>
          </div>

          {/* High-Quality Selection */}
          <div className="text-center scroll-animate">
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                <Piano className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="font-heading text-xl lg:text-2xl text-white mb-6 tracking-wide">
              HIGH-QUALITY SELECTION
            </h3>
            <p className="font-body text-gray-200 leading-relaxed max-w-sm mx-auto">
              Shop a piano collection that meets rigorous standards, ensuring exceptional tone, touch, and durability
            </p>
          </div>

          {/* 10 Year Warranty */}
          <div className="text-center scroll-animate">
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="font-heading text-xl lg:text-2xl text-white mb-6 tracking-wide">
              10 YEAR WARRANTY
            </h3>
            <p className="font-body text-gray-200 leading-relaxed max-w-sm mx-auto">
              All pianos have been professionally maintained and some come with a 10-year manufacturer&apos;s warranty
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}