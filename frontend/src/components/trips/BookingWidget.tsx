'use client';

import React, { useState, useMemo } from 'react';
import { format, parseISO, differenceInDays, addDays } from 'date-fns';
import {
  Calendar, Users, ChevronDown, ChevronUp, Minus, Plus,
  Clock, CheckCircle, Info, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trip, Departure } from '@/types';
import { formatPrice } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

interface BookingWidgetProps {
  trip: Trip;
  onBook: (data: BookingData) => void;
  isLoading?: boolean;
}

export interface BookingData {
  departureId: string;
  departure: Departure;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  totalGuests: number;
  pricing: {
    basePrice: number;
    subtotal: number;
    serviceFee: number;
    taxes: number;
    total: number;
  };
}

export function BookingWidget({ trip, onBook, isLoading }: BookingWidgetProps) {
  const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(
    trip.dates.find(d => d.status === 'scheduled' && d.availableSeats > 0) || null
  );
  const [showDepartures, setShowDepartures] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    infants: 0,
  });

  const totalGuests = guests.adults + guests.children;
  const availableDepartures = trip.dates.filter(
    d => d.status === 'scheduled' && d.availableSeats > 0
  );

  const pricing = useMemo(() => {
    const pricePerPerson = selectedDeparture?.price || trip.price.amount;
    const basePrice = pricePerPerson * (trip.price.priceType === 'per_person' ? totalGuests : 1);
    const serviceFee = Math.round(basePrice * 0.05);
    const taxes = Math.round(basePrice * 0.05);
    const total = basePrice + serviceFee + taxes;

    return {
      basePrice: pricePerPerson,
      subtotal: basePrice,
      serviceFee,
      taxes,
      total,
    };
  }, [selectedDeparture, totalGuests, trip.price]);

  const updateGuests = (type: 'adults' | 'children' | 'infants', delta: number) => {
    setGuests((prev) => {
      const newValue = Math.max(type === 'adults' ? 1 : 0, prev[type] + delta);
      const newTotal =
        (type === 'adults' ? newValue : prev.adults) +
        (type === 'children' ? newValue : prev.children);

      if (newTotal > (selectedDeparture?.availableSeats || trip.groupSize.max)) {
        return prev;
      }

      return { ...prev, [type]: newValue };
    });
  };

  const handleBookNow = () => {
    if (!selectedDeparture) return;

    onBook({
      departureId: selectedDeparture._id,
      departure: selectedDeparture,
      guests,
      totalGuests,
      pricing,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-24">
      {/* Price Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(pricing.basePrice, trip.price.currency)}
          </span>
          <span className="text-gray-500">
            /{trip.price.priceType === 'per_person' ? 'person' : 'group'}
          </span>
        </div>
        {trip.price.discountedAmount && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(trip.price.amount, trip.price.currency)}
            </span>
            <span className="text-sm text-green-600 font-medium">
              Save {trip.price.discountPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* Booking Form */}
      <div className="p-6 space-y-4">
        {/* Departure Date Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <button
            onClick={() => setShowDepartures(!showDepartures)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div className="text-left">
                {selectedDeparture ? (
                  <>
                    <p className="font-medium text-gray-900">
                      {format(parseISO(selectedDeparture.startDate), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedDeparture.availableSeats} spots left
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">Choose a departure date</p>
                )}
              </div>
            </div>
            {showDepartures ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {/* Departures Dropdown */}
          <AnimatePresence>
            {showDepartures && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto"
              >
                {availableDepartures.length > 0 ? (
                  availableDepartures.map((departure) => (
                    <button
                      key={departure._id}
                      onClick={() => {
                        setSelectedDeparture(departure);
                        setShowDepartures(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0',
                        selectedDeparture?._id === departure._id && 'bg-orange-50'
                      )}
                    >
                      <div className="text-left">
                        <p className="font-medium text-gray-900">
                          {format(parseISO(departure.startDate), 'EEE, MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {departure.availableSeats} spots available
                        </p>
                      </div>
                      {departure.price && departure.price !== trip.price.amount && (
                        <span className="font-medium text-[#FF6B35]">
                          {formatPrice(departure.price, trip.price.currency)}
                        </span>
                      )}
                      {selectedDeparture?._id === departure._id && (
                        <CheckCircle className="h-5 w-5 text-[#FF6B35]" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    No departures available
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guest Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guests
          </label>
          <button
            onClick={() => setShowGuestPicker(!showGuestPicker)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-400" />
              <p className="text-gray-900">
                {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
                {guests.infants > 0 && `, ${guests.infants} infant${guests.infants !== 1 ? 's' : ''}`}
              </p>
            </div>
            {showGuestPicker ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {/* Guest Picker Dropdown */}
          <AnimatePresence>
            {showGuestPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4"
              >
                {/* Adults */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Adults</p>
                    <p className="text-sm text-gray-500">Age 13+</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateGuests('adults', -1)}
                      disabled={guests.adults <= 1}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{guests.adults}</span>
                    <button
                      onClick={() => updateGuests('adults', 1)}
                      disabled={totalGuests >= (selectedDeparture?.availableSeats || trip.groupSize.max)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Children</p>
                    <p className="text-sm text-gray-500">Age 2-12</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateGuests('children', -1)}
                      disabled={guests.children <= 0}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{guests.children}</span>
                    <button
                      onClick={() => updateGuests('children', 1)}
                      disabled={totalGuests >= (selectedDeparture?.availableSeats || trip.groupSize.max)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Infants</p>
                    <p className="text-sm text-gray-500">Under 2</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateGuests('infants', -1)}
                      disabled={guests.infants <= 0}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{guests.infants}</span>
                    <button
                      onClick={() => updateGuests('infants', 1)}
                      disabled={guests.infants >= 2}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowGuestPicker(false)}
                  className="w-full mt-3 py-2 text-sm font-medium text-[#FF6B35] hover:underline"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {formatPrice(pricing.basePrice, trip.price.currency)} × {totalGuests} guests
            </span>
            <span className="text-gray-900">
              {formatPrice(pricing.subtotal, trip.price.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              Service fee
              <Info className="h-4 w-4 text-gray-400" />
            </span>
            <span className="text-gray-900">
              {formatPrice(pricing.serviceFee, trip.price.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Taxes</span>
            <span className="text-gray-900">
              {formatPrice(pricing.taxes, trip.price.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(pricing.total, trip.price.currency)}
            </span>
          </div>
        </div>

        {/* Book Now Button */}
        <Button
          onClick={handleBookNow}
          disabled={!selectedDeparture || isLoading}
          className="w-full h-12 text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            'Book Now'
          )}
        </Button>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center">
          You won&apos;t be charged yet
        </p>
      </div>

      {/* Trip Info Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{trip.duration.days}D / {trip.duration.nights}N</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Max {trip.groupSize.max}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
