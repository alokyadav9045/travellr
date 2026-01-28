'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Play, Expand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface GalleryImage {
  url: string;
  publicId?: string;
  caption?: string;
  isPrimary: boolean;
}

interface TripGalleryProps {
  images: GalleryImage[];
  videoUrl?: string;
  title: string;
}

export function TripGallery({ images, videoUrl, title }: TripGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const otherImages = images.filter(img => img !== primaryImage).slice(0, 4);
  const hasMoreImages = images.length > 5;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[400px] md:h-[500px]">
          {/* Primary Image */}
          <div 
            className="relative md:col-span-2 md:row-span-2 cursor-pointer group"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={primaryImage?.url || '/images/placeholder-trip.jpg'}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            
            {videoUrl && (
              <button className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 text-[#FF6B35] ml-1" />
                </div>
              </button>
            )}
          </div>

          {/* Other Images */}
          {otherImages.map((image, index) => (
            <div
              key={image.publicId || index}
              className="relative hidden md:block cursor-pointer group"
              onClick={() => openLightbox(index + 1)}
            >
              <Image
                src={image.url}
                alt={image.caption || `${title} - Image ${index + 2}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              
              {/* Show more overlay on last image */}
              {index === otherImages.length - 1 && hasMoreImages && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">
                    +{images.length - 5} more
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 px-4 py-2 bg-white rounded-lg shadow-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Expand className="h-4 w-4" />
          View all {images.length} photos
        </button>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation */}
            <button
              onClick={() => navigateLightbox('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={() => navigateLightbox('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Main Image */}
            <div className="absolute inset-0 flex items-center justify-center p-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={images[lightboxIndex]?.url || '/images/placeholder-trip.jpg'}
                    alt={images[lightboxIndex]?.caption || `${title} - Image ${lightboxIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Caption */}
            {images[lightboxIndex]?.caption && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-lg text-white text-sm">
                {images[lightboxIndex].caption}
              </div>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4 pb-2">
              {images.map((image, index) => (
                <button
                  key={image.publicId || index}
                  onClick={() => setLightboxIndex(index)}
                  className={cn(
                    'w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all',
                    index === lightboxIndex 
                      ? 'ring-2 ring-white scale-110' 
                      : 'opacity-60 hover:opacity-100'
                  )}
                >
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
