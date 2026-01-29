'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Grid, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { tripApi } from '@/lib/api/trips';
import type { Trip } from '@/types';
import { cn } from '@/lib/utils/cn';

// Categories mapping to backend enum values or tags
const categories = [
  { id: 'all', label: 'All', icon: <Grid className="w-5 h-5" /> },
  { id: 'mountain', label: 'Mountains', icon: <span className="text-xl">🏔️</span> },
  { id: 'beach', label: 'Beaches', icon: <span className="text-xl">🏖️</span> },
  { id: 'cultural', label: 'Cultural', icon: <span className="text-xl">🕌</span> },
  { id: 'adventure', label: 'Adventure', icon: <span className="text-xl">🏄</span> },
  { id: 'wellness', label: 'Wellness', icon: <span className="text-xl">🧘</span> },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function DestinationGrid() {
  const [activeCategory, setActiveCategory] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['trips', 'grid', activeCategory],
    queryFn: () => tripApi.getTrips({
      category: activeCategory === 'all' ? undefined : activeCategory,
      limit: 12
    })
  });

  const trips = data?.data || [];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950 mb-20 transition-colors duration-300" id="destinations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#F15A24] font-medium mb-2"
          >
            🌟 Discover More
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8"
          >
            Explore Top Trips
          </motion.h2>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300",
                  activeCategory === cat.id
                    ? "bg-[#F15A24] border-[#F15A24] text-white shadow-lg scale-105"
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#F15A24] dark:hover:border-[#F15A24] hover:text-[#F15A24] dark:hover:text-[#F15A24]"
                )}
              >
                <span className={activeCategory === cat.id ? "text-white" : ""}>{cat.icon}</span>
                <span className="font-medium">{cat.label}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Destinations Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No trips found in this category.</p>
            </div>
          ) : (
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeCategory} // Helper for animation to reset
                variants={container}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {trips.map((trip: Trip) => (
                  <motion.div
                    key={trip._id}
                    variants={item}
                    className="group relative"
                  >
                    <Link href={`/trips/${trip.slug}`}>
                      <div className="relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                        {/* Background Image */}
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url(${trip.images[0]?.url})` }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-end">
                          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center gap-2 text-white/90 text-sm mb-1 font-medium">
                              <MapPin className="h-3 w-3 text-[#F15A24]" />
                              <span>{trip.location.state}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 shadow-sm truncate">
                              {trip.title}
                            </h3>

                            <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {trip.tags?.slice(0, 2).map((tag, i) => (
                                <span key={i} className="text-xs bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white capitalize">
                                  {tag.replace('-', ' ')}
                                </span>
                              )) || (
                                  <span className="text-xs bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white capitalize">
                                    {trip.category}
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-[#F15A24] dark:hover:border-[#F15A24] transition-all duration-300 shadow-sm"
          >
            View all trips
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
