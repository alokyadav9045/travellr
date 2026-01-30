'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Clock,
    MapPin,
    Star,
    TrendingDown,
    Zap,
    ArrowRight,
    Users,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { useQuery } from '@tanstack/react-query';
import { tripApi } from '@/lib/api/trips';
import { Trip } from '@/types';

// Countdown component
function DealCountdown({ hours }: { hours: number }) {
    const [timeLeft, setTimeLeft] = useState({
        hours: Math.floor(hours),
        minutes: Math.floor((hours % 1) * 60),
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-1 text-sm">
            <Clock className="w-4 h-4 text-red-500" />
            <span className="font-mono font-bold text-red-600">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
        </div>
    );
}

export function LastMinuteDeals() {
    const { data: tripsData, isLoading } = useQuery({
        queryKey: ['trips', 'featured'],
        queryFn: () => tripApi.getTrips({ limit: 4, sortBy: 'popular' })
    });

    const deals = ((tripsData as any)?.data || []).map((trip: Trip) => {
        const priceAmount = trip.price?.amount || 0;
        const originalPrice = trip.originalPrice || priceAmount * 1.4;
        const discount = Math.round(((originalPrice - priceAmount) / originalPrice) * 100);

        return {
            id: trip._id,
            title: trip.title,
            image: trip.images?.[0]?.url || '/placeholder-trip.jpg',
            location: trip.location,
            originalPrice: originalPrice,
            discountedPrice: priceAmount,
            discount: discount,
            duration: `${trip.duration?.days} Days`,
            departures: trip.dates?.[0] ? new Date(trip.dates[0].startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Flexible',
            spotsLeft: trip.dates?.[0]?.availableSeats || 5, // availableSeats from Departure type
            rating: trip.stats?.rating || 4.5,
            expiresIn: 48,
            slug: trip.slug
        };
    });

    if (isLoading) {
        return (
            <section className="py-16 bg-gradient-to-b from-red-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-10" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gradient-to-b from-red-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-3"
                        >
                            <Zap className="w-4 h-4 animate-pulse" />
                            <span className="text-sm font-semibold">Limited Time Only</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                        >
                            Last Minute Deals 🔥
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-600"
                        >
                            Grab these incredible deals before they expire!
                        </motion.p>
                    </div>
                    <Link href="/trips?sort=popular">
                        <Button variant="outline" className="mt-4 md:mt-0 rounded-full">
                            View All Deals
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>

                {/* Deals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {deals.map((deal: any, index: number) => (
                        <motion.div
                            key={deal.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden hover:shadow-xl transition-all group h-full">
                                {/* Image */}
                                <div className="relative h-48">
                                    <Image
                                        src={deal.image}
                                        alt={deal.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                                    {/* Discount Badge */}
                                    <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0 text-sm font-bold">
                                        <TrendingDown className="w-3 h-3 mr-1" />
                                        {deal.discount}% OFF
                                    </Badge>

                                    {/* Spots Left */}
                                    {deal.spotsLeft <= 10 && (
                                        <Badge className="absolute top-3 right-3 bg-orange-500 text-white border-0 text-xs">
                                            Only {deal.spotsLeft} left!
                                        </Badge>
                                    )}

                                    {/* Rating */}
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-semibold">{deal.rating}</span>
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    {/* Countdown */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs text-gray-500">Expires in:</span>
                                        <DealCountdown hours={deal.expiresIn} />
                                    </div>

                                    {/* Content */}
                                    <Link href={`/trips/${deal.slug || deal.id}`}>
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#FF6B35] transition-colors">
                                            {deal.title}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {typeof deal.location === 'object' ? `${deal.location.city}, ${deal.location.country}` : deal.location}
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {deal.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            {deal.departures}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <div>
                                            <span className="text-xs text-gray-400 line-through">₹{deal.originalPrice.toLocaleString()}</span>
                                            <div className="text-xl font-bold text-[#FF6B35]">
                                                ₹{deal.discountedPrice.toLocaleString()}
                                            </div>
                                        </div>
                                        <Link href={`/trips/${deal.slug || deal.id}`}>
                                            <Button size="sm" className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                                                Book Now
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default LastMinuteDeals;
