'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star, MapPin, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trip } from '@/types';

interface FeaturedTripsProps {
  trips: Trip[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

// Simplified Trip Card for Featured Trips
function SimpleTripCard({ trip }: { trip: Trip }) {
  const primaryImage = trip.images.find(img => img.isPrimary) || trip.images[0];
  const hasDiscount = trip.price.discountedAmount && trip.price.discountedAmount < trip.price.amount;
  
  // Generate a gradient color based on trip category
  const gradients: Record<string, string> = {
    adventure: 'from-orange-500 to-red-600',
    beach: 'from-blue-400 to-cyan-500',
    cultural: 'from-purple-500 to-indigo-600',
    wellness: 'from-green-500 to-emerald-600',
    default: 'from-gray-600 to-gray-800',
  };
  const gradient = gradients[trip.category] || gradients.default;
  
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Image/Gradient Container */}
      <div className={`relative h-48 bg-gradient-to-br ${gradient}`}>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-10 opacity-0 group-hover:opacity-100">
          <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
        
        {/* Featured Badge */}
        {trip.isFeatured && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-[#FF6B35] text-white text-xs font-semibold rounded-full">
            ⭐ Featured
          </div>
        )}
        
        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
          {trip.duration.days}D / {trip.duration.nights}N
        </div>
        
        {/* Discount Badge */}
        {hasDiscount && trip.price.discountPercentage && (
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
            {trip.price.discountPercentage}% OFF
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 text-[#FF6B35]" />
          <span>{trip.location.city}, {trip.location.country}</span>
        </div>
        
        {/* Title */}
        <Link href={`/trips/${trip.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#FF6B35] transition-colors line-clamp-2 min-h-[56px]">
            {trip.title}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900 text-sm">
              {trip.rating.average.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            ({trip.rating.count} reviews)
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">From</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ₹{trip.price.amount.toLocaleString()}
            </span>
          )}
          <span className="text-xl font-bold text-[#FF6B35]">
            ₹{(trip.price.discountedAmount || trip.price.amount).toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">/person</span>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedTrips({ 
  trips, 
  title = "Featured Trips",
  subtitle = "Hand-picked experiences loved by travelers",
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#FF6B35] font-medium mb-2"
            >
              ⭐ {subtitle}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              {title}
            </motion.h2>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Trips Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trips.map((trip) => (
            <div 
              key={trip._id} 
              className="w-[320px] shrink-0 snap-start"
            >
              <SimpleTripCard trip={trip} />
            </div>
          ))}
        </motion.div>

        {/* View All Link */}
        <div className="mt-10 text-center">
          <Link href={viewAllLink}>
            <Button variant="outline" className="gap-2">
              View All Trips
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
