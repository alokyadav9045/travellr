'use client';

import React from 'react';
import { Calendar, Clock, MapPin, Users, Star } from 'lucide-react';
import Image from 'next/image';
import { Trip } from '@/types';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface TripDetailsProps {
  trip: Trip;
  selectedDate?: string;
  guestCount: number;
  onDateChange?: (date: string) => void;
}

export default function TripDetails({ trip, selectedDate, guestCount, onDateChange }: TripDetailsProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Get the first image from the trip
  const firstImage = trip.images && trip.images.length > 0 ? trip.images.find(img => img.isPrimary)?.url || trip.images[0]?.url : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Trip Details</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Trip Image */}
        <div className="lg:w-1/3">
          {firstImage ? (
            <div className="relative w-full h-48">
              <Image
                src={firstImage}
                alt={trip.title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* Trip Information */}
        <div className="lg:w-2/3 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{trip.title}</h3>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {trip.location.city}, {trip.location.country}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {trip.duration.days} days
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Up to {trip.groupSize.max} guests
              </div>
            </div>
          </div>

          {/* Rating */}
          {trip.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{trip.rating.average.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({trip.rating.count} reviews)</span>
            </div>
          )}

          {/* Highlights (Tags) */}
          {trip.tags && trip.tags.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Highlights</h4>
              <ul className="space-y-1">
                {trip.tags.slice(0, 3).map((tag, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Guest Count */}
          <div className="space-y-2">
            <span className="block text-sm font-medium text-gray-700">
              Guests
            </span>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-900">
                {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-semibold text-gray-900">
              Total: {formatPrice(trip.price.amount * guestCount)}
            </span>
            <p className="text-sm text-gray-600">
              {formatPrice(trip.price.amount)} × {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}