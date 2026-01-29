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
    image: 'https://images.unsplash.com/photo-1533240332313-0dbdd3199061',
    color: 'from-orange-600/90 to-red-600/90',
  },
  {
    name: 'Beach & Island',
    slug: 'beach',
    icon: Waves,
    trips: 62,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    color: 'from-blue-500/90 to-cyan-500/90',
  },
  {
    name: 'Cultural',
    slug: 'cultural',
    icon: Camera,
    trips: 48,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada',
    color: 'from-purple-600/90 to-indigo-600/90',
  },
  {
    name: 'Trekking',
    slug: 'trekking',
    icon: Footprints,
    trips: 56,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
    color: 'from-green-600/90 to-emerald-600/90',
  },
  {
    name: 'Romantic',
    slug: 'romantic',
    icon: Heart,
    trips: 34,
    image: 'https://images.unsplash.com/photo-1510076857177-7470076d4098',
    color: 'from-pink-600/90 to-rose-600/90',
  },
  {
    name: 'Camping',
    slug: 'camping',
    icon: Tent,
    trips: 29,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
    color: 'from-amber-600/90 to-yellow-600/90',
  },
  {
    name: 'Wildlife',
    slug: 'wildlife',
    icon: TreePine,
    trips: 41,
    image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7',
    color: 'from-emerald-600/90 to-teal-600/90',
  },
  {
    name: 'Road Trips',
    slug: 'road-trip',
    icon: Compass,
    trips: 37,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
    color: 'from-orange-600/90 to-red-600/90',
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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export function CategorySection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-[#F15A24] font-black uppercase tracking-[0.2em] text-xs mb-4"
          >
            <div className="h-px w-8 bg-[#F15A24]" />
            Browse by Category
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6"
          >
            Find your perfect <span className="text-[#F15A24]">vibe</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Whether you want to climb mountains or relax on beaches, we have the perfect trip for you.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.slug} variants={item} transition={{ duration: 0.6, ease: "circOut" }}>
              <Link href={`/trips?category=${category.slug}`}>
                <div className="group relative h-[360px] rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/80" />

                  {/* Icon */}
                  <div className="absolute top-8 left-8 w-14 h-14 bg-white/20 backdrop-blur-xl rounded-[1.25rem] flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
                    <category.icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-8 left-8 right-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
                      {category.trips} Trips Available
                    </p>
                    <h3 className="text-3xl font-black text-white mb-4 leading-tight">
                      {category.name}
                    </h3>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white bg-[#F15A24] px-4 py-2 rounded-full shadow-lg transform -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                        Explore Now
                      </span>
                    </div>
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
