'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

const destinations = [
  {
    name: 'Manali',
    state: 'Himachal Pradesh',
    trips: 45,
    description: 'Snow-capped mountains & adventure sports',
    gradient: 'from-blue-600 via-cyan-500 to-teal-400',
    emoji: '🏔️',
  },
  {
    name: 'Goa',
    state: 'Goa',
    trips: 62,
    description: 'Beach vibes & nightlife paradise',
    gradient: 'from-orange-500 via-amber-400 to-yellow-300',
    emoji: '🏖️',
  },
  {
    name: 'Rishikesh',
    state: 'Uttarakhand',
    trips: 38,
    description: 'Yoga capital & river rafting',
    gradient: 'from-green-600 via-emerald-500 to-teal-400',
    emoji: '🧘',
  },
  {
    name: 'Ladakh',
    state: 'Jammu & Kashmir',
    trips: 28,
    description: 'High-altitude desert landscapes',
    gradient: 'from-indigo-600 via-purple-500 to-pink-400',
    emoji: '🏜️',
  },
  {
    name: 'Kerala',
    state: 'Kerala',
    trips: 51,
    description: 'Backwaters & Ayurvedic retreats',
    gradient: 'from-green-500 via-lime-400 to-emerald-300',
    emoji: '🌴',
  },
  {
    name: 'Jaipur',
    state: 'Rajasthan',
    trips: 34,
    description: 'Royal palaces & rich heritage',
    gradient: 'from-pink-600 via-rose-500 to-orange-400',
    emoji: '🏰',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DestinationGrid() {
  return (
    <section className="py-20 bg-gray-50">
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
              🌍 Top Destinations
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              Where do you want to go?
            </motion.h2>
          </div>
          <Link
            href="/destinations"
            className="hidden md:flex items-center gap-2 text-[#FF6B35] font-medium hover:underline"
          >
            View all destinations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Destinations Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              variants={item}
              className="group"
            >
              <Link href={`/trips?location=${destination.name}`}>
                <div className={`relative h-72 rounded-2xl overflow-hidden bg-gradient-to-br ${destination.gradient}`}>
                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }} />
                  </div>
                  
                  {/* Emoji Icon */}
                  <div className="absolute top-4 right-4 text-4xl opacity-80">
                    {destination.emoji}
                  </div>
                  
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{destination.state}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {destination.name}
                    </h3>
                    <p className="text-white/80 text-sm mb-3">
                      {destination.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">
                        {destination.trips} trips available
                      </span>
                      <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-[#FF6B35] group-hover:scale-110 transition-all duration-300">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-[#FF6B35] font-medium"
          >
            View all destinations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
