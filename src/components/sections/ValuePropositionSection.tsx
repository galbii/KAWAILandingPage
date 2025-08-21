import { Cpu, Piano, Shield } from 'lucide-react';

export default function ValuePropositionSection() {
  return (
    <section className="relative py-12 lg:py-16 overflow-hidden">
      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(2deg); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%) scale(0.8); }
            100% { transform: translateX(200%) scale(1.2); }
          }
          
          @keyframes rainbow-pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.7; }
          }
          
          @keyframes card-entrance {
            0% { opacity: 0; transform: translateY(30px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0px) scale(1); }
          }
          
          @keyframes border-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.3), inset 0 0 20px rgba(255,255,255,0.1); }
            50% { box-shadow: 0 0 30px rgba(255,255,255,0.5), inset 0 0 30px rgba(255,255,255,0.2); }
          }
          
          @keyframes icon-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          
          @keyframes gradient-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .icon-float {
            animation: float 4s ease-in-out infinite;
          }
          
          .shimmer-overlay {
            animation: shimmer 8s linear infinite;
          }
          
          .rainbow-pulse {
            animation: rainbow-pulse 6s ease-in-out infinite;
          }
          
          .card-animate-1 {
            animation: card-entrance 0.8s ease-out 0.2s both;
          }
          
          .card-animate-2 {
            animation: card-entrance 0.8s ease-out 0.4s both;
          }
          
          .card-animate-3 {
            animation: card-entrance 0.8s ease-out 0.6s both;
          }
          
          .value-card {
            border: 2px solid rgba(255,255,255,0.4);
            border-radius: 16px;
            padding: 2rem;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
            animation: border-glow 4s ease-in-out infinite;
          }
          
          .icon-container {
            position: relative;
          }
          
          .fade-in-up {
            animation: card-entrance 0.8s ease-out both;
          }
        `
      }} />
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/images/kawai-piano-hands.jpeg"
          alt="KAWAI Piano Background"
          className="w-full h-full object-cover"
        />
        
        {/* Base Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Rainbow Light Overlay */}
        <div 
          className="absolute inset-0 rainbow-pulse"
          style={{
            background: 'linear-gradient(45deg, rgba(255,0,150,0.2), rgba(0,255,255,0.2), rgba(255,255,0,0.2), rgba(150,255,0,0.2), rgba(255,100,255,0.2), rgba(0,150,255,0.2))',
            mixBlendMode: 'overlay'
          }}
        ></div>
        
        {/* Animated Shimmer Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="shimmer-overlay absolute inset-0 w-[200%] h-full opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(255,200,255,0.3), rgba(200,255,255,0.3), rgba(255,255,200,0.3), transparent)',
              mixBlendMode: 'soft-light'
            }}
          ></div>
        </div>
      </div>
    
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Value Propositions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Modern Technology */}
          <div className="text-center card-animate-1 value-card">
            <div className="icon-container mb-6">
              <div className="icon-bg w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-premium">
                <Cpu className="icon-float w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-20 w-20 h-20 mx-auto"></div>
            </div>
            <h3 className="font-heading text-xl lg:text-2xl text-white mb-4 tracking-wide">
              MODERN TECHNOLOGY
            </h3>
            <p className="font-body text-gray-200 leading-relaxed max-w-sm mx-auto">
              Advanced digital features and cutting-edge piano technology for enhanced musical expression
            </p>
          </div>

          {/* High-Quality Selection */}
          <div className="text-center card-animate-2 value-card">
            <div className="icon-container mb-6">
              <div className="icon-bg w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-premium">
                <Piano 
                  className="icon-float w-10 h-10 text-white"
                  style={{animationDelay: '1s'}} 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-20 w-20 h-20 mx-auto"></div>
            </div>
            <h3 className="font-heading text-xl lg:text-2xl text-white mb-4 tracking-wide">
              HIGH-QUALITY SELECTION
            </h3>
            <p className="font-body text-gray-200 leading-relaxed max-w-sm mx-auto">
              Shop a piano collection that meets rigorous standards, ensuring exceptional tone, touch, and durability
            </p>
          </div>

          {/* 10 Year Warranty */}
          <div className="text-center card-animate-3 value-card">
            <div className="icon-container mb-6">
              <div className="icon-bg w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-premium">
                <Shield 
                  className="icon-float w-10 h-10 text-white"
                  style={{animationDelay: '2s'}} 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-20 w-20 h-20 mx-auto"></div>
            </div>
            <h3 className="font-heading text-xl lg:text-2xl text-white mb-4 tracking-wide">
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