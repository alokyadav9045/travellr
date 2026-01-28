'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, HeadphonesIcon, CreditCard, RefreshCcw, 
  BadgeCheck, MapPin, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Your payments are protected with bank-level security and encryption.',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Vendors',
    description: 'All vendors are thoroughly vetted and verified for quality assurance.',
  },
  {
    icon: RefreshCcw,
    title: 'Easy Cancellation',
    description: 'Flexible cancellation policies with hassle-free refund process.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Round-the-clock assistance before, during, and after your trip.',
  },
  {
    icon: CreditCard,
    title: 'Best Price Guarantee',
    description: "Found a lower price? We'll match it and give you an extra discount.",
  },
  {
    icon: MapPin,
    title: 'Local Expertise',
    description: 'Trips designed by locals who know the hidden gems and best experiences.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#FF6B35] font-medium mb-4"
            >
              Why Travellr?
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Travel with confidence,{' '}
              <span className="text-[#FF6B35]">explore with joy</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg mb-8"
            >
              We connect travelers with verified local vendors to create authentic, 
              memorable experiences. Your safety and satisfaction are our top priorities.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/about">
                <Button className="gap-2" size="lg">
                  Learn More About Us
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800 transition-colors"
              >
                <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-[#FF6B35]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
