'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { tripApi } from '@/lib/api/trips';
import { useQuery } from '@tanstack/react-query';
import type { Trip } from '@/types';
import { cleanImageUrl } from '@/lib/utils/images';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
};

export function BudgetFriendlySection() {
    const { data, isLoading } = useQuery({
        queryKey: ['trips', 'budget-stays'],
        queryFn: () => tripApi.getTrips({ tags: 'budget-stay', limit: 8 })
    });

    const trips = data?.data || [];

    if (isLoading) {
        return (
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-6 overflow-hidden">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="min-w-[300px] h-[350px] bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (trips.length === 0) return null;

    return (
        <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 text-[#F15A24] font-black uppercase tracking-[0.2em] text-xs mb-3"
                        >
                            <div className="h-px w-8 bg-[#F15A24]" />
                            Smart Travel
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-black text-gray-900 dark:text-white leading-tight"
                        >
                            Budget Friendly <span className="text-[#F15A24]">Stays</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-500 dark:text-gray-400 mt-3 text-lg"
                        >
                            Premium experiences at pocket-friendly prices
                        </motion.p>
                    </div>
                    <Link href="/stays?type=budget" className="group flex items-center gap-2 text-[#F15A24] font-bold hover:gap-3 transition-all">
                        View All Deals
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex gap-8 overflow-x-auto pb-12 snap-x no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
                >
                    {trips.map((trip: Trip) => (
                        <motion.div
                            key={trip._id}
                            variants={item}
                            transition={{ duration: 0.5 }}
                            whileHover={{ y: -8 }}
                            className="min-w-[300px] md:min-w-[360px] snap-center"
                        >
                            <Link href={`/stays/${trip._id}`} className="group block">
                                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/60 z-10" />
                                    <Image
                                        src={cleanImageUrl(trip.images[0]?.url) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                                        alt={trip.title}
                                        fill
                                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 360px"
                                    />
                                    <div className="absolute top-6 right-6 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-sm font-bold shadow-xl">
                                        <Star className="h-4 w-4 fill-[#F15A24] text-[#F15A24]" />
                                        <span className="text-gray-900 dark:text-white">{trip.stats?.rating || 4.5}</span>
                                    </div>

                                    <div className="absolute bottom-8 left-8 z-20">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-white/80 text-xs font-bold uppercase tracking-widest">
                                                <MapPin className="h-3 w-3" />
                                                {typeof trip.location === 'object' ? trip.location.city : trip.location}
                                            </div>
                                            <h3 className="text-2xl font-black text-white leading-tight">
                                                {trip.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-2 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Starting from</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="font-black text-2xl text-gray-900 dark:text-white">₹{trip.price.amount}</span>
                                            <span className="text-xs text-gray-400 font-medium">/night</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[#F15A24] group-hover:text-white transition-all duration-300">
                                        <ArrowRight className="h-6 w-6" />
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
