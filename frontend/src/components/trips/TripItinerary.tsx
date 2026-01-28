'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Clock, Utensils, Bed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ItineraryDay } from '@/types';
import { cn } from '@/lib/utils/cn';

interface TripItineraryProps {
  itinerary: ItineraryDay[];
  duration: { days: number; nights: number };
}

export function TripItinerary({ itinerary, duration }: TripItineraryProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) =>
      prev.includes(day) 
        ? prev.filter((d) => d !== day) 
        : [...prev, day]
    );
  };

  const expandAll = () => {
    setExpandedDays(itinerary.map((day) => day.day));
  };

  const collapseAll = () => {
    setExpandedDays([]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Itinerary</h2>
            <p className="text-sm text-gray-500 mt-1">
              {duration.days} days, {duration.nights} nights adventure
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="text-sm text-[#FF6B35] hover:underline"
            >
              Expand all
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={collapseAll}
              className="text-sm text-[#FF6B35] hover:underline"
            >
              Collapse all
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden lg:block" />

        {itinerary.map((day, index) => {
          const isExpanded = expandedDays.includes(day.day);
          const isFirst = index === 0;
          const isLast = index === itinerary.length - 1;

          return (
            <div
              key={day.day}
              className={cn(
                'relative',
                !isLast && 'border-b border-gray-100'
              )}
            >
              {/* Day Header */}
              <button
                onClick={() => toggleDay(day.day)}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                {/* Day Number Circle */}
                <div className="relative z-10 w-10 h-10 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-bold shrink-0">
                  {day.day}
                </div>

                {/* Day Info */}
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{day.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    {day.accommodation && (
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {day.accommodation}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {day.activities.length} activities
                    </span>
                  </div>
                </div>

                {/* Meals Indicators */}
                <div className="hidden sm:flex items-center gap-2">
                  {day.meals.breakfast && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      B
                    </span>
                  )}
                  {day.meals.lunch && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                      L
                    </span>
                  )}
                  {day.meals.dinner && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                      D
                    </span>
                  )}
                </div>

                {/* Expand Icon */}
                <div className="shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 lg:pl-20">
                      {/* Day Description */}
                      <p className="text-gray-600 mb-6">{day.description}</p>

                      {/* Day Image */}
                      {day.image && (
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                          <Image
                            src={day.image.url}
                            alt={day.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Activities */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Activities</h4>
                        {day.activities.map((activity, actIndex) => (
                          <div
                            key={actIndex}
                            className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="shrink-0">
                              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-[#FF6B35] font-medium text-sm shadow-sm">
                                {activity.time}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {activity.title}
                              </h5>
                              <p className="text-sm text-gray-600 mt-1">
                                {activity.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                {activity.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {activity.duration}
                                  </span>
                                )}
                                {activity.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {activity.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Meals Info */}
                      <div className="mt-6 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Utensils className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Meals included
                          </p>
                          <p className="text-sm text-gray-500">
                            {[
                              day.meals.breakfast && 'Breakfast',
                              day.meals.lunch && 'Lunch',
                              day.meals.dinner && 'Dinner',
                            ]
                              .filter(Boolean)
                              .join(', ') || 'No meals included'}
                          </p>
                        </div>
                      </div>

                      {/* Accommodation */}
                      {day.accommodation && (
                        <div className="mt-4 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <Bed className="h-5 w-5 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Accommodation
                            </p>
                            <p className="text-sm text-gray-500">
                              {day.accommodation}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
