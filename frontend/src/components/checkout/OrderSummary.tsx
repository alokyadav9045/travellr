'use client';

import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Image from 'next/image';
import { Trip } from '@/types';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface OrderSummaryProps {
  trip: Trip;
  selectedDate?: string;
  guestCount: number;
  promo?: {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  };
  taxes?: number;
  fees?: {
    service: number;
    processing: number;
  };
}

export default function OrderSummary({
  trip,
  selectedDate,
  guestCount,
  promo,
  taxes = 0,
  fees = { service: 0, processing: 0 }
}: OrderSummaryProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
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

  const firstImage = trip.images && trip.images.length > 0 ? trip.images.find(img => img.isPrimary)?.url || trip.images[0]?.url : null;
  const subtotal = trip.price.amount * guestCount;
  const promoDiscount = promo ? (promo.type === 'percentage' ? subtotal * (promo.discount / 100) : promo.discount) : 0;
  const total = subtotal - promoDiscount + taxes + fees.service + fees.processing;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

      {/* Trip Overview */}
      <div className="mb-6">
        {firstImage && (
          <div className="relative w-full h-32 mb-4">
            <Image
              src={firstImage}
              alt={trip.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
        )}

        <h3 className="font-medium text-gray-900 mb-2">{trip.title}</h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {typeof trip.location === 'object' ? `${trip.location.city}, ${trip.location.country}` : trip.location}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {trip.duration.days} days
          </div>
          {selectedDate && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(selectedDate)}
            </div>
          )}
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {formatPrice(trip.price.amount)} × {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
          </span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        {promo && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">
              Promo: {promo.code}
              {promo.type === 'percentage' ? ` (-${promo.discount}%)` : ''}
            </span>
            <span className="text-green-600">-{formatPrice(promoDiscount)}</span>
          </div>
        )}

        {fees.service > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service fee</span>
            <span className="text-gray-900">{formatPrice(fees.service)}</span>
          </div>
        )}

        {fees.processing > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Processing fee</span>
            <span className="text-gray-900">{formatPrice(fees.processing)}</span>
          </div>
        )}

        {taxes > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Taxes</span>
            <span className="text-gray-900">{formatPrice(taxes)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
      </div>

      {/* Cancellation Policy */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Cancellation Policy</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Free cancellation up to 48 hours before trip</p>
          <p>• 50% refund for cancellations within 48-24 hours</p>
          <p>• No refund for cancellations within 24 hours</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Need Help?</h4>
        <p className="text-xs text-blue-800">
          Contact our support team at{' '}
          <a href="mailto:support@travellr.com" className="underline">
            support@travellr.com
          </a>{' '}
          or call +1 (555) 123-4567
        </p>
      </div>
    </div>
  );
}