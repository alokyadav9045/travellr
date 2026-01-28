'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

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
    color: 'bg-pink-500',
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

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#FF6B35] font-medium mb-2"
          >
            💬 Traveler Stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            What our travelers say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Real experiences from real travelers. See why thousands choose Travellr for their adventures.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-6">
                <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                  <Quote className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 pt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Trip Info */}
              <div className="text-sm text-gray-500 mb-4">
                Trip: <span className="text-[#FF6B35] font-medium">{testimonial.tripName}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center`}>
                  <span className="text-white font-semibold text-lg">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">4.8/5</div>
            <div className="text-sm text-gray-500">Average Rating</div>
          </div>
          <div className="h-12 w-px bg-gray-200" />
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">10,000+</div>
            <div className="text-sm text-gray-500">Reviews</div>
          </div>
          <div className="h-12 w-px bg-gray-200" />
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">98%</div>
            <div className="text-sm text-gray-500">Happy Travelers</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
