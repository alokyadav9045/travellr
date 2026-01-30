'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { tripApi } from '@/lib/api/trips';
import { useQuery } from '@tanstack/react-query';
import type { Trip } from '@/types';
import { cleanImageUrl } from '@/lib/utils/images';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const item = {
    hidden: { opacity: 0, scale: 0.9, rotateX: -10 },
    show: { opacity: 1, scale: 1, rotateX: 0 }
};

export function TrendingDestinations() {
    const { data } = useQuery({
        queryKey: ['trips', 'trending'],
        queryFn: () => tripApi.getTrips({ tags: 'trending', limit: 3 })
    });

    const trips = data?.data || [];

    if (trips.length === 0) return null;

    return (
        <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 bg-[#F15A24]/10 px-4 py-2 rounded-full mb-6 border border-[#F15A24]/20"
                    >
                        <TrendingUp className="h-5 w-5 text-[#F15A24]" />
                        <span className="text-[#F15A24] font-black tracking-widest uppercase text-xs">Trending Now</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight"
                    >
                        Most <span className="text-[#F15A24]">Loved</span> Destinations
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 dark:text-gray-400 mt-6 max-w-2xl text-lg font-medium"
                    >
                        Discover the places that are capturing the hearts of travelers right now.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000"
                >
                    {trips.map((trip: Trip) => (
                        <motion.div
                            key={trip._id}
                            variants={item}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -15, rotateY: 5, transition: { duration: 0.4 } }}
                            className="relative h-[450px] rounded-[3rem] overflow-hidden group shadow-2xl"
                        >
                            <Link href={`/trips/${trip.slug}`} className="block w-full h-full relative">
                                <Image
                                    src={cleanImageUrl(trip.images[0]?.url) || 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3'}
                                    alt={trip.title}
                                    fill
                                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 33vw"
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-60 transition-opacity" />

                                <div className="absolute inset-0 flex flex-col items-center justify-end p-12 text-center">
                                    <div className="mb-6 transform transition-transform duration-500 group-hover:-translate-y-4">
                                        <div className="flex items-center justify-center gap-1 mb-3 text-[#F15A24]">
                                            <Sparkles className="h-4 w-4 fill-current" />
                                            <span className="text-xs font-black uppercase tracking-widest text-[#F15A24]">Top Rated</span>
                                        </div>
                                        <h3 className="text-4xl font-black text-white mb-2 leading-tight drop-shadow-2xl">
                                            {typeof trip.location === 'object' ? trip.location.city : trip.location}
                                        </h3>
                                        <p className="text-white/80 font-bold tracking-[0.2em] text-xs uppercase">
                                            {typeof trip.location === 'object' ? trip.location.state : ''}
                                        </p>
                                    </div>

                                    <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <span className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-[1.5rem] font-black text-sm hover:bg-[#F15A24] hover:text-white transition-all transform hover:scale-105 shadow-xl">
                                            Plan Adventure
                                            <ArrowRight className="h-5 w-5" />
                                        </span>
                                    </div>
                                </div>

                                {/* Diagonal Badge */}
                                <div className="absolute top-8 right-[-40px] rotate-45 bg-[#F15A24] text-white px-12 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    Must Visit
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <style jsx>{`
               .perspective-1000 {
                 perspective: 1000px;
               }
            `}</style>
        </section>
    );
}
