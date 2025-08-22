'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100/50 header-enhanced">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center h-16 sm:h-18 lg:h-20 header-content pl-2">
          {/* KAWAI Logo with Tagline */}
          <div className="flex items-end gap-4">
            <div className="relative w-32 h-10 sm:w-40 sm:h-12 lg:w-48 lg:h-14 header-logo">
              <Image
                src="/images/optimized/logos/Kawai-Red.webp"
                alt="KAWAI"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-sm text-gray-500 font-light tracking-wide opacity-80">Instrumental to Life.</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}