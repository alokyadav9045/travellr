'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, MapPin, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Trip } from '@/types';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/format';

interface TripCardProps {
  trip: Trip;
  variant?: 'default' | 'horizontal' | 'compact';
  showVendor?: boolean;
  onWishlistToggle?: (tripId: string) => void;
  isWishlisted?: boolean;
}

export function TripCard({
  trip,
  variant = 'default',
  showVendor = false,
  onWishlistToggle,
  isWishlisted = false
}: TripCardProps) {
  const primaryImage = trip.images.find(img => img.isPrimary) || trip.images[0];
  const formattedPrice = formatPrice(trip.price.amount, trip.price.currency);
  const hasDiscount = trip.price.discountedAmount && trip.price.discountedAmount < trip.price.amount;

  if (variant === 'horizontal') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex"
      >
        {/* Image */}
        <div className="relative w-72 shrink-0">
          <Link href={`/trips/${trip.slug}`}>
            <Image
              src={primaryImage?.url || '/images/placeholder-trip.jpg'}
              alt={trip.title}
              width={288}
              height={200}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onWishlistToggle?.(trip._id);
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
              )}
            />
          </button>

          {/* Featured Badge */}
          {trip.isFeatured && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#FF6B35] text-white text-xs font-medium rounded-full">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {typeof trip.location === 'object'
                    ? `${trip.location.city}, ${trip.location.country}`
                    : trip.location}
                </span>
              </div>

              <Link href={`/trips/${trip.slug}`}>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#FF6B35] transition-colors line-clamp-2">
                  {trip.title}
                </h3>
              </Link>

              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {trip.shortDescription || trip.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{trip.duration.days}D/{trip.duration.nights}N</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Max {trip.groupSize.max}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{trip.rating.average.toFixed(1)} ({trip.rating.count})</span>
              </div>
            </div>

            <div className="text-right">
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through mr-2">
                  {formattedPrice}
                </span>
              )}
              <span className="text-xl font-bold text-[#FF6B35]">
                {hasDiscount
                  ? formatPrice(trip.price.discountedAmount!, trip.price.currency)
                  : formattedPrice
                }
              </span>
              <span className="text-sm text-gray-500 ml-1">
                /{trip.price.priceType === 'per_person' ? 'person' : 'group'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default vertical card
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/trips/${trip.slug}`}>
          <Image
            src={primaryImage?.url || '/images/placeholder-trip.jpg'}
            alt={trip.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onWishlistToggle?.(trip._id);
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
        >
          <Heart
            className={cn(
              'h-5 w-5 transition-colors',
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            )}
          />
        </button>

        {/* Featured Badge */}
        {trip.isFeatured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#FF6B35] text-white text-xs font-medium rounded-full">
            Featured
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && trip.price.discountPercentage && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
            {trip.price.discountPercentage}% OFF
          </div>
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
          {trip.duration.days}D / {trip.duration.nights}N
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 text-[#FF6B35]" />
          <span>
            {typeof trip.location === 'object'
              ? `${trip.location.city}, ${trip.location.country}`
              : trip.location}
          </span>
        </div>

        {/* Title */}
        <Link href={`/trips/${trip.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#FF6B35] transition-colors line-clamp-2 min-h-[56px]">
            {trip.title}
          </h3>
        </Link>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-900">
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
              {formattedPrice}
            </span>
          )}
          <span className="text-xl font-bold text-[#FF6B35]">
            {hasDiscount
              ? formatPrice(trip.price.discountedAmount!, trip.price.currency)
              : formattedPrice
            }
          </span>
          <span className="text-sm text-gray-500">
            /{trip.price.priceType === 'per_person' ? 'person' : 'group'}
          </span>
        </div>

        {/* Vendor Info */}
        {showVendor && typeof trip.vendor === 'object' && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
              {trip.vendor.businessName?.charAt(0) || 'V'}
            </div>
            <span className="text-sm text-gray-600">
              {trip.vendor.businessName}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default TripCard;
