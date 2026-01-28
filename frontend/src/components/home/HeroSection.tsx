'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ChevronDown, Sparkles, ArrowRight, X, Clock, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';

const popularDestinations = [
  { name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=200&q=80' },
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=200&q=80' },
  { name: 'Rishikesh', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&q=80' },
  { name: 'Ladakh', image: 'https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?w=200&q=80' },
  { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=200&q=80' },
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=200&q=80' },
];

// Deals banner data
const dealsBanner = {
  active: true,
  text: "🔥 Flash Sale: Get 30% OFF on all trips this week!",
  link: "/trips?sort=sale",
  endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
};

// Stats with counter animation
const stats = [
  { label: 'Unique Trips', value: 500, suffix: '+' },
  { label: 'Destinations', value: 100, suffix: '+' },
  { label: 'Happy Travelers', value: 50, suffix: 'K+' },
  { label: 'Expert Guides', value: 200, suffix: '+' },
];

// Animated Counter Component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-white mb-1">
      {count}{suffix}
    </div>
  );
}

// Countdown Timer Component
function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const diff = endTime.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => setTimeLeft(calculateTime()), 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center gap-1 text-sm font-mono">
      <span className="bg-white/20 px-2 py-0.5 rounded">{timeLeft.days}d</span>
      <span>:</span>
      <span className="bg-white/20 px-2 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>
      <span>:</span>
      <span className="bg-white/20 px-2 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
      <span>:</span>
      <span className="bg-white/20 px-2 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}s</span>
    </div>
  );
}

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [showDestinations, setShowDestinations] = useState(false);
  const [showDealsBanner, setShowDealsBanner] = useState(dealsBanner.active);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedDestination) params.set('location', selectedDestination);
    if (checkInDate) params.set('checkIn', checkInDate);
    if (checkOutDate) params.set('checkOut', checkOutDate);
    router.push(`/trips?${params.toString()}`);
  };

  return (
    <>
      {/* Deals Banner */}
      <AnimatePresence>
        {showDealsBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-[#FF6B35] via-[#E55A2B] to-[#FF6B35] text-white relative overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="font-medium">{dealsBanner.text}</span>
              </div>
              <CountdownTimer endTime={dealsBanner.endTime} />
              <Link href={dealsBanner.link}>
                <Button size="sm" className="bg-white text-[#FF6B35] hover:bg-gray-100 font-semibold h-8">
                  Book Now <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <button
                onClick={() => setShowDealsBanner(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Parallax */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          {/* Video Background (with fallback to gradient) */}
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
              className="w-full h-full object-cover"
            >
              <source src="https://player.vimeo.com/external/434045526.hd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=175" type="video/mp4" />
            </video>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#FF6B35]/30 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full filter blur-3xl" />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ y: textY }}
          className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-white/90 text-sm font-medium">Trusted by 50,000+ travelers</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your Next
              <span className="block mt-2 bg-gradient-to-r from-[#FF6B35] via-yellow-400 to-[#FF6B35] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Unforgettable Journey
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-12">
              Explore curated trips by local experts. From serene mountains to vibrant beaches,
              find experiences that match your wanderlust.
            </p>

            {/* Enhanced Search Box with Date Picker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search Input */}
                <div className="md:col-span-2 relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1 text-left">Where to?</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all text-gray-900"
                    />
                  </div>
                </div>

                {/* Check In */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1 text-left">Check In</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all text-gray-900 appearance-none"
                    />
                  </div>
                </div>

                {/* Check Out */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1 text-left">Check Out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all text-gray-900 appearance-none"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    className="w-full px-6 py-3 h-[50px] text-base font-semibold rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:shadow-lg hover:shadow-[#FF6B35]/25 transition-all"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Popular Destinations with Images */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-3 text-left">Popular destinations:</p>
                <div className="flex flex-wrap gap-2">
                  {popularDestinations.map((dest) => (
                    <button
                      key={dest.name}
                      onClick={() => router.push(`/destinations/${dest.name.toLowerCase()}`)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-[#FF6B35]/10 hover:border-[#FF6B35]/30 border border-gray-200 rounded-full transition-all group"
                    >
                      <div className="relative w-5 h-5 rounded-full overflow-hidden">
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-[#FF6B35]">{dest.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-white/80 text-sm">Verified Vendors</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-white/80 text-sm">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-white/80 text-sm">24/7 Support</span>
              </div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Add gradient animation keyframes */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
}
