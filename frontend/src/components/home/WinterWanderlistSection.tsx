'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Snowflake, ThermometerSnowflake } from 'lucide-react';
import { tripApi } from '@/lib/api/trips';
import { useQuery } from '@tanstack/react-query';
import type { Trip } from '@/types';
import Image from 'next/image';
import { cleanImageUrl } from '@/lib/utils/images';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const item = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    show: { opacity: 1, scale: 1, y: 0 }
};

export function WinterWanderlistSection() {
    const { data } = useQuery({
        queryKey: ['trips', 'winter'],
        queryFn: () => tripApi.getTrips({ tags: 'winter', limit: 4 })
    });

    const trips = data?.data || [];

    if (trips.length === 0) return null;

    return (
        <section className="py-24 bg-gradient-to-b from-[#F0F9FF] to-white dark:from-[#0B1120] dark:to-gray-950 relative overflow-hidden transition-colors duration-300">
            {/* Animated Particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, 400],
                            x: [0, 20, -20, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            delay: i * 2,
                            ease: "linear"
                        }}
                        className="absolute text-blue-200 dark:text-gray-800"
                        style={{
                            top: -50,
                            left: `${15 + i * 15}%`,
                        }}
                    >
                        <Snowflake size={20 + i * 5} />
                    </motion.div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 bg-blue-100 dark:bg-blue-900/30 px-6 py-2 rounded-full mb-6 border border-blue-200 dark:border-blue-800"
                    >
                        <ThermometerSnowflake className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        <span className="text-blue-700 dark:text-blue-300 font-black tracking-widest text-xs uppercase underline decoration-blue-400 decoration-2 underline-offset-4">Seasonal Specials</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-black text-gray-950 dark:text-white mb-8"
                    >
                        Winter <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Wanderlist</span> ❄️
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-xl font-medium leading-relaxed"
                    >
                        Embrace the chill with these magical winter escapes. From snowy peaks to cozy retreats, find your cold-weather paradise.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {trips.map((trip: Trip) => (
                        <motion.div
                            key={trip._id}
                            variants={item}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        >
                            <Link href={`/trips/${trip.slug}`}>
                                <div className="group relative aspect-[3/4.5] rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-blue-500/10 dark:hover:shadow-blue-900/10">
                                    <Image
                                        src={cleanImageUrl(trip.images[0]?.url) || 'https://images.unsplash.com/photo-1548013146-72479768bada'}
                                        alt={trip.title}
                                        fill
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80" />

                                    {/* Glass Morphism Filter */}
                                    <div className="absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-2 mb-4 bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/30">
                                            <MapPin className="h-3.5 w-3.5 text-blue-400" />
                                            <span className="text-white font-black uppercase tracking-widest text-[10px]">
                                                {typeof trip.location === 'object' ? trip.location.state : 'Wonderland'}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-2 leading-tight group-hover:text-blue-300 transition-colors">
                                            {typeof trip.location === 'object' ? trip.location.city : trip.location}
                                        </h3>
                                        <div className="flex items-center gap-3 text-white/60">
                                            <div className="h-px w-10 bg-blue-500" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Experience Winter</span>
                                        </div>
                                    </div>

                                    {/* Frosted Glass Glow */}
                                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rotate-45 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
