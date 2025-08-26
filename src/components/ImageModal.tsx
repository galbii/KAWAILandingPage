'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export default function ImageModal({ 
  isOpen, 
  onClose, 
  src, 
  alt, 
  width = 800, 
  height = 600 
}: ImageModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-[10000] bg-black/40 rounded-full p-3"
        aria-label="Close image"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
      
      {/* Centered image container */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div 
          className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            maxWidth: '90vw', 
            maxHeight: '90vh'
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={width || 800}
            height={height || 600}
            className="block"
            style={{ 
              maxWidth: '90vw', 
              maxHeight: '90vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain'
            }}
            priority
          />
        </div>
      </div>
    </div>
  );

  // Use portal to render at document root level
  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}