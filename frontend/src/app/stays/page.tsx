'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { tripApi } from '@/lib/api/trips';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, Search, Wifi, BedDouble, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Trip } from '@/types';

export default function StaysPage() {
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type');
    const [searchQuery, setSearchQuery] = useState('');

    // Use API to fetch stays
    // We can filter by 'budget-stay' tag if type is budget, or just fetch all 'other' category trips that act as stays
    // For now, defaulting to 'budget-stay' if type=budget
    const tags = typeParam === 'budget' ? 'budget-stay' : undefined;

    const { data, isLoading } = useQuery({
        queryKey: ['trips', 'stays', typeParam, searchQuery],
        queryFn: () => tripApi.getTrips({
            tags,
            q: searchQuery || undefined,
            limit: 20
        })
    });

    const stays = data?.data || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <Header />

            {/* Hero / Filter Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-24 pb-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {typeParam === 'budget' ? 'Budget Friendly Stays' : 'Find Your Stay'}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                {stays.length} properties available
                            </p>
                        </div>

                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : stays.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">No stays found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stays.map((stay: Trip, index: number) => (
                            <motion.div
                                key={stay._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-300 group border border-transparent dark:border-gray-800"
                            >
                                <Link href={`/stays/${stay._id}`}>
                                    {/* Image */}
                                    <div className="relative h-64 overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${stay.images[0]?.url || '/placeholder-trip.jpg'})` }}
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-white">
                                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                            {stay.stats?.rating || 4.5}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-2">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {stay.location.city}, {stay.location.state}
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#FF6B35] dark:group-hover:text-[#FF6B35] transition-colors">
                                            {stay.title}
                                        </h3>

                                        {/* Amenities Preview */}
                                        <div className="flex items-center gap-3 mb-4 text-gray-400">
                                            <div className="flex items-center gap-1 text-xs">
                                                <Wifi className="h-3.5 w-3.5" /> Wifi
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <BedDouble className="h-3.5 w-3.5" /> AC
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <Coffee className="h-3.5 w-3.5" /> Breakfast
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex items-center justify-between">
                                            <div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 block">Starts from</span>
                                                <span className="text-xl font-bold text-[#FF6B35]">₹{stay.price.amount}</span>
                                                <span className="text-xs text-gray-400">/night</span>
                                            </div>
                                            <Button variant="outline" size="sm" className="rounded-full group-hover:bg-[#FF6B35] group-hover:text-white group-hover:border-[#FF6B35] dark:border-gray-700 dark:text-gray-300 dark:group-hover:text-white">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
