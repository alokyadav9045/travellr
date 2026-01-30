'use client';

import React from 'react';
import { Check, ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { Trip } from '@/types';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface CheckoutSuccessProps {
  bookingId: string;
  trip: Trip;
  guestCount: number;
  totalAmount: number;
  guestDetails?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onBackToHome: () => void;
  onViewBooking?: () => void;
}

export default function CheckoutSuccess({
  bookingId,
  trip,
  guestCount,
  totalAmount,
  guestDetails,
  onBackToHome,
  onViewBooking
}: CheckoutSuccessProps) {
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

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border p-8">
      {/* Success Icon */}
      <div className="text-center mb-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">
          Thank you for your booking. We've sent a confirmation email to{' '}
          <span className="font-medium">{guestDetails?.email || 'your email'}</span>
        </p>
      </div>

      {/* Booking Details */}
      <div className="space-y-6">
        {/* Booking ID */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Booking Reference</p>
            <p className="text-lg font-mono font-bold text-gray-900">{bookingId}</p>
          </div>
        </div>

        {/* Trip Summary */}
        <div className="border-t border-b border-gray-200 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-gray-900">{trip.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {typeof trip.location === 'object' ? `${trip.location.city}, ${trip.location.country}` : trip.location}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-sm text-gray-600">
              {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
            </div>
          </div>
        </div>

        {/* Guest Information */}
        {guestDetails && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h2>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-600">Lead Guest:</span>{' '}
                <span className="font-medium">{guestDetails.firstName} {guestDetails.lastName}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Email:</span>{' '}
                <span className="font-medium">{guestDetails.email}</span>
              </p>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total Paid</span>
            <span className="text-lg font-bold text-green-600">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check your email for detailed booking confirmation</li>
            <li>• You'll receive trip details and itinerary 7 days before departure</li>
            <li>• Contact our support team if you need to make any changes</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          {onViewBooking && (
            <button
              onClick={onViewBooking}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Booking Details
            </button>
          )}
          <button
            onClick={onBackToHome}
            className="flex-1 flex items-center justify-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}