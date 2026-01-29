'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star, MapPin, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trip } from '@/types';
import Image from 'next/image';
import { cleanImageUrl } from '@/lib/utils/images';

interface FeaturedTripsProps {
  trips: Trip[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
  }
};

// Simplified Trip Card for Featured Trips
function SimpleTripCard({ trip }: { trip: Trip }) {
  const primaryImage = trip.images.find(img => img.isPrimary) || trip.images[0];
  const hasDiscount = trip.price.discountedAmount && trip.price.discountedAmount < trip.price.amount;

  return (
    <motion.div
      variants={item}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="group bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] dark:shadow-none transition-all duration-500 border border-gray-100 dark:border-gray-800 h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={cleanImageUrl(primaryImage?.url) || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'}
          alt={trip.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 320px"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#F15A24] transition-all duration-300 z-10 border border-white/20">
          <Heart className="h-5 w-5 text-white" />
        </button>

        {/* Featured Badge */}
        {trip.isFeatured && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-4 left-4 px-3 py-1.5 bg-[#F15A24] text-white text-[10px] uppercase tracking-widest font-bold rounded-full shadow-lg"
          >
            Featured
          </motion.div>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4 flex flex-col items-start translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-1.5 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl">
            <span className="text-lg font-black text-[#F15A24]">₹{(trip.price.discountedAmount || trip.price.amount).toLocaleString()}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">₹{trip.price.amount.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-white/10">
          {trip.duration.days}D / {trip.duration.nights}N
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#F15A24] uppercase tracking-widest mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span>{trip.location.city}, {trip.location.country}</span>
          </div>

          {/* Title */}
          <Link href={`/trips/${trip.slug}`}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#F15A24] transition-colors line-clamp-2 leading-snug">
              {trip.title}
            </h3>
          </Link>
        </div>

        <div>
          {/* Rating */}
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 font-bold text-gray-900 dark:text-white">{trip.rating.average.toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">({trip.rating.count} reviews)</span>
            </div>

            <Link href={`/trips/${trip.slug}`}>
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[#F15A24] group-hover:text-white transition-all duration-300">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedTrips({
  trips,
  title = "Featured Trips",
  subtitle = "Hand-picked experiences",
  viewAllLink = "/trips?featured=true"
}: FeaturedTripsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!trips || trips.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-[#F15A24] font-black uppercase tracking-[0.2em] text-xs mb-4"
            >
              <div className="h-px w-8 bg-[#F15A24]" />
              {subtitle}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight"
            >
              {title}
            </motion.h2>
          </div>

          <div className="flex items-center gap-4">
            <Link href={viewAllLink} className="mr-4 group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#F15A24] transition-colors">
              View All Trips
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-[#F15A24] hover:border-[#F15A24] hover:text-white transition-all duration-300 group shadow-sm"
                suppressHydrationWarning
              >
                <ChevronLeft className="h-6 w-6 text-gray-400 group-hover:text-white" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-[#F15A24] hover:border-[#F15A24] hover:text-white transition-all duration-300 group shadow-sm"
                suppressHydrationWarning
              >
                <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Trips Carousel */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide pb-12 -mx-4 px-4 snap-x snap-mandatory no-scrollbar"
        >
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="w-[340px] md:w-[380px] shrink-0 snap-start"
            >
              <SimpleTripCard trip={trip} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
