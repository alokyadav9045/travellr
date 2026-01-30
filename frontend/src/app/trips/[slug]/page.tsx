'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { tripApi } from '@/lib/api/trips';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  MapPin, Clock, Users, Star, Heart, Share2, ChevronLeft,
  Check, X, Calendar, Shield, BadgeCheck, MessageCircle
} from 'lucide-react';

// Gradient colors for trip cards
const gradients = [
  'from-orange-500 to-red-600',
  'from-blue-400 to-cyan-500',
  'from-purple-500 to-indigo-600',
  'from-green-500 to-emerald-600',
];

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: trip, isLoading, error } = useQuery({
    queryKey: ['trip', slug],
    queryFn: () => tripApi.getTripBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading trip details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">😔</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip not found</h2>
            <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist or has been removed.</p>
            <Link href="/trips">
              <Button className="bg-[#FF6B35] hover:bg-[#e55a2b]">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Trips
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBookNow = () => {
    if (!selectedDate || guests < 1) {
      alert('Please select date and number of guests');
      return;
    }
    router.push(`/checkout?trip=${trip._id}&date=${selectedDate}&guests=${guests}`);
  };

  const gradientIndex = Math.floor(Math.random() * gradients.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Image/Gradient */}
      <section className={`relative pt-16 lg:pt-20 h-[50vh] md:h-[60vh] bg-gradient-to-br ${gradients[gradientIndex]}`}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back Button & Actions */}
        <div className="absolute top-20 lg:top-24 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link href="/trips" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium">Back to Trips</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </button>
              <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <Share2 className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Trip Title on Hero */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                <MapPin className="h-4 w-4" />
                <span>{typeof trip.location === 'object' ? `${trip.location.city}, ${trip.location.country}` : trip.location}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{trip.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{trip.duration?.days || 3} Days / {trip.duration?.nights || 2} Nights</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>Max {trip.groupSize?.max || 15} guests</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{trip.stats?.rating?.toFixed(1) || '4.8'}</span>
                  <span className="text-white/70">({trip.stats?.reviewCount || 0} reviews)</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Trip</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {trip.description || 'Experience an unforgettable journey through breathtaking landscapes and immersive cultural experiences. Our expert guides will ensure your safety while you create memories that last a lifetime.'}
              </p>
            </motion.div>

            {/* Itinerary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary</h2>
              <div className="space-y-6">
                {(trip.itinerary && trip.itinerary.length > 0 ? trip.itinerary : [
                  { day: 1, title: 'Arrival & Welcome', description: 'Meet your group and guides, enjoy a welcome dinner.' },
                  { day: 2, title: 'Adventure Begins', description: 'Full day of activities and exploration.' },
                  { day: 3, title: 'Cultural Immersion', description: 'Experience local traditions and cuisine.' },
                ]).map((day: any, index: number) => (
                  <div key={index} className="relative pl-8 pb-6 border-l-2 border-[#FF6B35] last:pb-0 last:border-l-transparent">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {day.day || index + 1}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{day.title}</h3>
                    <p className="text-gray-600 text-sm">{day.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Inclusions/Exclusions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {(trip.inclusions && trip.inclusions.length > 0 ? trip.inclusions : [
                    'Professional guides', 'All meals', 'Accommodation', 'Transportation', 'Safety equipment'
                  ]).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  What's Not Included
                </h3>
                <ul className="space-y-3">
                  {(trip.exclusions && trip.exclusions.length > 0 ? trip.exclusions : [
                    'Flights', 'Travel insurance', 'Personal expenses', 'Tips'
                  ]).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg sticky top-24"
            >
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#FF6B35]">
                    ₹{(trip.price?.amount || 9999).toLocaleString()}
                  </span>
                  <span className="text-gray-500">/person</span>
                </div>
                {trip.originalPrice && trip.originalPrice > (trip.price?.amount || 0) && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 line-through">₹{trip.originalPrice.toLocaleString()}</span>
                    <span className="text-green-600 text-sm font-medium">Save {Math.round(((trip.originalPrice - (trip.price?.amount || 0)) / trip.originalPrice) * 100)}%</span>
                  </div>
                )}
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" /> Select Date
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="h-4 w-4 inline mr-1" /> Number of Guests
                  </label>
                  <Input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                    min={trip.groupSize?.min || 1}
                    max={trip.groupSize?.max || 20}
                  />
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">₹{(trip.price?.amount || 9999).toLocaleString()} × {guests} guests</span>
                    <span>₹{((trip.price?.amount || 9999) * guests).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#FF6B35]">₹{((trip.price?.amount || 9999) * guests).toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] h-12 text-base font-semibold"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  You won't be charged yet
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Secure payment with SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <BadgeCheck className="h-5 w-5 text-blue-500" />
                  <span>Verified vendor with excellent reviews</span>
                </div>
              </div>

              {/* Vendor Info */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">Hosted by</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                    {typeof trip.vendor === 'string' ? 'V' : trip.vendor?.businessName?.charAt(0) || 'V'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {typeof trip.vendor === 'string' ? 'Verified Vendor' : trip.vendor?.businessName || 'Travellr Vendor'}
                    </p>
                    <p className="text-sm text-gray-500">Verified Host</p>
                  </div>
                  <button className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50">
                    <MessageCircle className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
