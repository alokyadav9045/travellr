'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Star, Clock } from 'lucide-react';
import { tripApi } from '@/lib/api/trips';
import { useQuery } from '@tanstack/react-query';
import type { Trip } from '@/types';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
};

export function WeekendEscapesSection() {
    const { data, isLoading } = useQuery({
        queryKey: ['trips', 'weekend-escapes'],
        queryFn: () => tripApi.getTrips({ tags: 'weekend-escape', limit: 8 })
    });

    const trips = data?.data || [];

    if (isLoading) {
        return (
            <section className="py-24 bg-gray-50 dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-[2rem] animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (trips.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 text-[#F15A24] font-black uppercase tracking-[0.2em] text-xs mb-4"
                        >
                            <div className="h-px w-8 bg-[#F15A24]" />
                            Quick Getaways
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight"
                        >
                            Weekend <span className="text-[#F15A24]">Escapes</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-500 dark:text-gray-400 mt-4 text-lg"
                        >
                            Perfect destinations for a refreshing short break
                        </motion.p>
                    </div>
                    <Link href="/trips?tags=weekend-escape" className="group flex items-center gap-2 text-[#F15A24] font-bold hover:gap-4 transition-all">
                        Discover More
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {trips.map((trip: Trip) => (
                        <motion.div
                            key={trip._id}
                            variants={item}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -12 }}
                            className="group bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] dark:shadow-none transition-all duration-500 border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                        >
                            <Link href={`/trips/${trip.slug}`}>
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <Image
                                        src={trip.images[0]?.url || 'https://images.unsplash.com/photo-1590603784837-de409fd71ba9'}
                                        alt={trip.title}
                                        fill
                                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-1000"
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                    <div className="absolute top-6 left-6 z-20 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
                                        <Clock className="h-4 w-4" />
                                        {trip.duration.days} Days
                                    </div>

                                    <div className="absolute bottom-6 left-6 right-6 z-20">
                                        <div className="flex flex-col gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-[0.1em]">
                                                <MapPin className="h-3.5 w-3.5 text-[#F15A24]" />
                                                {typeof trip.location === 'object' ? trip.location.city : trip.location}
                                            </div>
                                            <h3 className="text-2xl font-black text-white leading-tight">
                                                {trip.title}
                                            </h3>

                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-white/60 font-black uppercase">From</span>
                                                    <span className="text-2xl font-black text-white">₹{trip.price.amount}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-[#F15A24] px-3 py-1.5 rounded-xl text-white text-xs font-black shadow-lg">
                                                    <Star className="h-3.5 w-3.5 fill-white" />
                                                    {trip.stats?.rating || 4.5}
                                                </div>
                                            </div>
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
