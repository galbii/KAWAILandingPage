'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100/50 header-enhanced">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center h-16 sm:h-18 lg:h-20 header-content pl-2">
          {/* Brand Partnership Section - Far Left */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
            {/* KAWAI Logo */}
            <div className="relative w-28 h-9 sm:w-36 sm:h-11 lg:w-44 lg:h-13 header-logo">
              <Image
                src="/images/kawai-logo-red-1x.png"
                alt="KAWAI"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Partnership Connector - Refined */}
            <div className="flex items-center header-connector">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-gray-400/60 tracking-wider">×</span>
            </div>
            
            {/* SHSU Logo */}
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 header-logo">
              <Image
                src="/images/d58176959ed0e21ad2d59eb2fc3a6c0f-2439863838.png"
                alt="Sam Houston State University"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}