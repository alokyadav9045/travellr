'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    initials: 'PS',
    location: 'Delhi',
    rating: 5,
    text: 'The Ladakh trip was absolutely life-changing! The vendor was incredibly knowledgeable and took care of everything. Best travel experience ever!',
    tripName: 'Ladakh Adventure',
    date: '2024-01-15',
    color: 'bg-[#F15A24]',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    initials: 'RV',
    location: 'Mumbai',
    rating: 5,
    text: 'Booked a Kerala backwaters trip for my anniversary. The houseboat experience was magical. Travellr made the entire process so smooth!',
    tripName: 'Kerala Backwaters',
    date: '2024-02-20',
    color: 'bg-blue-500',
  },
  {
    id: 3,
    name: 'Ananya Patel',
    initials: 'AP',
    location: 'Bangalore',
    rating: 5,
    text: 'As a solo female traveler, I was hesitant at first. But the group trip to Rishikesh was amazing! Made lifelong friends and felt completely safe.',
    tripName: 'Rishikesh Yoga Retreat',
    date: '2024-03-10',
    color: 'bg-green-500',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 }
};

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-[#F15A24] font-black uppercase tracking-[0.2em] text-xs mb-4"
          >
            <div className="h-px w-8 bg-[#F15A24]" />
            Traveler Stories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight"
          >
            What our <span className="text-[#F15A24]">Community</span> says
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg font-medium"
          >
            Real experiences from real travelers. See why thousands choose Travellr for their life-changing adventures.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-10"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={item}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-[3rem] p-10 shadow-sm hover:shadow-2xl transition-all duration-500 relative border border-transparent hover:border-[#F15A24]/10"
            >
              <div className="absolute top-10 right-10">
                <Quote className="h-10 w-10 text-[#F15A24]/10" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-200 dark:text-gray-700'
                      }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-800 dark:text-gray-200 mb-10 text-xl font-medium leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* Author & Context */}
              <div className="flex flex-col gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${testimonial.color} flex items-center justify-center shadow-lg transform rotate-3`}>
                    <span className="text-white font-black text-xl">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <div className="font-black text-gray-900 dark:text-white flex items-center gap-1">
                      {testimonial.name}
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                      {testimonial.location}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-700 w-fit">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-tight block">Memory of</span>
                  <span className="text-[#F15A24] font-black text-xs uppercase tracking-widest">{testimonial.tripName}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dynamic Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-8 p-12 bg-[#F15A24] rounded-[4rem] text-white shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="text-center relative z-10">
            <div className="text-5xl md:text-6xl font-black mb-2">4.9</div>
            <div className="text-xs font-black uppercase tracking-widest text-[#F15A24]/10 opacity-60">Avg Traveler Rating</div>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-white" />)}
            </div>
          </div>
          <div className="text-center relative z-10 border-x border-white/20">
            <div className="text-5xl md:text-6xl font-black mb-2">12k+</div>
            <div className="text-xs font-black uppercase tracking-widest opacity-60">Verified Stories</div>
          </div>
          <div className="hidden md:block text-center relative z-10">
            <div className="text-5xl md:text-6xl font-black mb-2">99%</div>
            <div className="text-xs font-black uppercase tracking-widest opacity-60">Happiness Index</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
