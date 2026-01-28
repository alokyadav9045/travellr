'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Mountain, Waves, Camera, Footprints, Heart, 
  Tent, Compass, TreePine, ArrowRight 
} from 'lucide-react';

const categories = [
  {
    name: 'Adventure',
    slug: 'adventure',
    icon: Mountain,
    trips: 85,
    gradient: 'from-red-500 to-orange-600',
  },
  {
    name: 'Beach & Island',
    slug: 'beach',
    icon: Waves,
    trips: 62,
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    name: 'Cultural',
    slug: 'cultural',
    icon: Camera,
    trips: 48,
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    name: 'Trekking',
    slug: 'trekking',
    icon: Footprints,
    trips: 56,
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    name: 'Romantic',
    slug: 'romantic',
    icon: Heart,
    trips: 34,
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    name: 'Camping',
    slug: 'camping',
    icon: Tent,
    trips: 29,
    gradient: 'from-amber-500 to-yellow-600',
  },
  {
    name: 'Wildlife',
    slug: 'wildlife',
    icon: TreePine,
    trips: 41,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Road Trips',
    slug: 'road-trip',
    icon: Compass,
    trips: 37,
    gradient: 'from-orange-500 to-red-600',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

export function CategorySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#FF6B35] font-medium mb-2"
          >
            🎯 Browse by Category
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            What kind of trip are you looking for?
          </motion.h2>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.slug} variants={item}>
              <Link href={`/trips?category=${category.slug}`}>
                <div className={`group relative h-48 md:h-56 rounded-2xl overflow-hidden bg-gradient-to-br ${category.gradient}`}>
                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                  </div>
                  
                  {/* Icon */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <category.icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {category.trips} trips available
                    </p>
                  </div>

                  {/* Arrow on hover */}
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/0 group-hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <ArrowRight className="h-5 w-5 text-gray-900" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
