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
import { cleanImageUrl } from '@/lib/utils/images';

const popularDestinations = [
  { name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23' },
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2' },
  { name: 'Rishikesh', image: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190' },
  { name: 'Ladakh', image: 'https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1' },
  { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944' },
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41' },
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

  const [isMounted, setIsMounted] = React.useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <div className="flex items-center gap-1 text-sm font-mono opacity-0">...</div>;

  return (
    <div className="flex items-center gap-1 text-sm font-mono" suppressHydrationWarning>
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

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedDestination) params.set('location', selectedDestination);
    if (checkInDate) params.set('checkIn', checkInDate);
    if (checkOutDate) params.set('checkOut', checkOutDate);
    router.push(`/trips?${params.toString()}`);
  };

  const titleWords = "Discover Your Next Unforgettable Journey".split(" ");

  return (
    <>
      {/* Deals Banner */}
      <AnimatePresence>
        {showDealsBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-[#F15A24] via-[#E55A2B] to-[#F15A24] text-white relative overflow-hidden z-[60]"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="font-medium">{dealsBanner.text}</span>
              </div>
              <CountdownTimer endTime={dealsBanner.endTime} />
              <Link href={dealsBanner.link}>
                <Button size="sm" className="bg-white text-[#F15A24] hover:bg-gray-100 font-semibold h-8" suppressHydrationWarning>
                  Book Now <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <button
                onClick={() => setShowDealsBanner(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                suppressHydrationWarning
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
          {/* Video Background */}
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
              className="w-full h-full object-cover scale-110"
            >
              <source src="https://player.vimeo.com/external/434045526.hd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=175" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#F15A24]/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ y: textY }}
          className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="text-center">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20"
            >
              <TrendingUp className="w-4 h-4 text-[#F15A24]" />
              <span className="text-white text-sm font-semibold tracking-wide uppercase">Trusted by 50,000+ travelers</span>
            </motion.div>

            {/* Main Heading with Staggered Words */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight">
              {titleWords.slice(0, 3).map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1), duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block bg-gradient-to-r from-[#F15A24] via-yellow-400 to-[#F15A24] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
              >
                {titleWords.slice(3).join(" ")}
              </motion.span>
            </h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-14 font-medium leading-relaxed"
            >
              Explore curated trips by local experts. From serene mountains to vibrant beaches,
              find experiences that match your wanderlust.
            </motion.p>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative pb-20 z-50 max-w-5xl mx-auto"
            >
              <div className="flex relative z-[1] md:flex-row flex-col items-center gap-2 shadow-all-in-one dark:shadow-all-in-one-dark bg-light-background-primary dark:bg-dark-background-primary p-2 rounded-3xl md:rounded-full w-full md:w-auto">
                {/* Location Search */}
                <div role="button" tabIndex={0} className="cursor-text flex items-center gap-4 py-2 px-4 md:pl-3 md:pr-4 md:ml-1 hover:bg-light-background-secondary dark:hover:bg-white/5 rounded-2xl md:rounded-full flex-1 md:flex-none">
                  <span className="text-2xl">🧭</span>
                  <div className="flex flex-col items-start" role="button" aria-haspopup="dialog" aria-expanded="false" data-state="closed">
                    <span className="font-small text-light-text-secondary dark:text-gray-400">Where to?</span>
                    <input
                      className="font-body placeholder:font-body p-0 m-0 w-full md:w-60 placeholder:text-light-text-secondary dark:placeholder:text-gray-500 dark:text-light-text-primary focus:outline-none bg-transparent"
                      placeholder="Search Destination, Stay, or Trip"
                      autoComplete="off"
                      tabIndex={-1}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-full md:w-px md:h-8 h-px bg-light-stroke-primary dark:bg-dark-stroke-primary hidden md:block"></div>

                {/* Date Selection */}
                <div className="w-full md:w-[240px]">
                  <div className="flex w-full md:w-[240px] justify-between md:justify-start items-center gap-4 py-2 px-4 md:pl-3 md:pr-4 md:ml-1 hover:bg-light-background-secondary dark:hover:bg-white/5 rounded-2xl md:rounded-full cursor-pointer">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">🗓️</span>
                      <div className="flex flex-col text-left items-start w-16">
                        <span className="font-small text-light-text-secondary dark:text-gray-400">Check-in</span>
                        {/* Use input date overlay for functionality while keeping design */}
                        <div className="relative">
                          <input
                            type="date"
                            value={checkInDate}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          />
                          <span className="font-body dark:text-light-text-primary whitespace-nowrap">
                            {checkInDate ? new Date(checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Add Date'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-light-icon-viewonly fill-current w-4 h-4 hidden md:block">
                      <path fill="currentColor" fillRule="evenodd" d="M12.72 19.536a2 2 0 0 1-.256-2.816L14.73 14H5a2 2 0 1 1 0-4h9.73l-2.266-2.72a2 2 0 1 1 3.072-2.56l5 6a2 2 0 0 1 0 2.56l-5 6a2 2 0 0 1-2.816.256Z" clipRule="evenodd"></path>
                    </svg>

                    <div className="flex items-center gap-4 md:hidden">
                      <div className="flex flex-col text-left items-start w-16">
                        <span className="font-small text-light-text-secondary dark:text-gray-400">Check-out</span>
                        <div className="relative">
                          <input
                            type="date"
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          />
                          <span className="font-body dark:text-light-text-primary whitespace-nowrap">
                            {checkOutDate ? new Date(checkOutDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Add Date'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div role="button" tabIndex={0} onClick={handleSearch} className="cursor-pointer md:ml-3 bg-light-brand-zostel hover:bg-[#D44D1E] h-14 md:h-16 w-full md:w-32 flex items-center justify-center rounded-2xl md:rounded-full transition-colors shadow-lg shadow-orange-500/30">
                  <span className="font-bigbutton text-white">Search</span>
                </div>
              </div>

              {/* Banner/Badge */}
              <div className="absolute inset-x-0 top-[calc(100%-2rem)] md:top-14 pt-10 flex items-center justify-center gap-2 bg-light-status-progress dark:bg-dark-status-progress p-4 rounded-b-3xl md:rounded-b-4xl -z-10 mx-4 md:mx-10 shadow-sm">
                <span className="text-lg">🌟</span>
                <span className="font-subtitlefocus text-light-text-primary dark:text-dark-text-primary text-center leading-tight">Book directly and get best prices + enjoy early check-in, late check-out & exclusive deals*</span>
              </div>
            </motion.div>

            {/* Popular Destinations */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <span className="text-white/60 text-sm font-semibold uppercase tracking-widest my-auto mr-2">Top Picks:</span>
              {popularDestinations.map((dest, i) => (
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  key={dest.name}
                  onClick={() => router.push(`/destinations/${dest.name.toLowerCase()}`)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden relative">
                    <Image src={cleanImageUrl(dest.image)} alt={dest.name} fill sizes="24px" className="object-cover" />
                  </div>
                  <span className="text-white font-bold text-sm">{dest.name}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <div className="w-1 h-12 bg-gradient-to-b from-[#F15A24] to-transparent rounded-full" />
        </motion.div>
      </section>

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
