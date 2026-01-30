'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    MapPin,
    Search,
    Filter,
    TrendingUp,
    Star,
    ArrowRight,
    X,
    Calendar,
    Clock
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { tripApi } from '@/lib/api/trips';
import { useQuery } from '@tanstack/react-query';
import type { Trip } from '@/types';

// Categories for filtering
const tripTypes = ['All Types', 'Adventure', 'Cultural', 'Beach', 'Wellness', 'Wildlife', 'Mountain', 'Other'];

export default function DestinationsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All Types');
    const [sortBy, setSortBy] = useState('popular');
    const [showFilters, setShowFilters] = useState(false);

    // Fetch Trips
    const { data, isLoading } = useQuery({
        queryKey: ['trips', 'destinations-page', selectedType, sortBy, searchQuery],
        queryFn: () => tripApi.getTrips({
            q: searchQuery || undefined,
            category: selectedType === 'All Types' ? undefined : selectedType.toLowerCase(),
            sort: sortBy === 'rating' ? '-ratings' : sortBy === 'popular' ? '-bookings' : undefined,
            limit: 50 // Fetch more for browsing
        })
    });

    const allTrips = data?.data || [];
    const trendingTrips = allTrips.filter((t: Trip) => t.isFeatured || t.tags?.includes('trending'));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] bg-gradient-to-br from-[#2D3436] via-[#636E72] to-[#2D3436] pt-20">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF6B35]/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00B894]/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="bg-[#FF6B35]/20 text-[#FF6B35] border-[#FF6B35]/30 mb-4">
                            🗺️ Explore Realtime Destinations
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Discover Amazing
                            <span className="text-[#FF6B35] block">Destinations</span>
                        </h1>
                        <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
                            From snow-capped mountains to pristine beaches, find your perfect getaway
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full max-w-2xl"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search destinations, states, or experiences..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 h-14 rounded-2xl border-0 shadow-xl text-lg dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                            />
                            <Button
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FF6B35] hover:bg-[#E55A2B]"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Filters Section */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Trip Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tripTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Sort By" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                        <SelectItem value="rating">Highest Rated</SelectItem>
                                        <SelectItem value="latest">Newest</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedType('All Types');
                                        setSortBy('popular');
                                    }}
                                    className="text-gray-500"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Trending Destinations (Trips) */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-[#FF6B35]" />
                                <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wide">Hot Right Now</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Trending Destinations</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            Array(4).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-64 rounded-2xl dark:bg-gray-800" />
                            ))
                        ) : (
                            trendingTrips.slice(0, 4).map((trip: Trip, index: number) => (
                                <motion.div
                                    key={trip._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={`/trips/${trip.slug}`}>
                                        <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                                style={{ backgroundImage: `url(${trip.images[0]?.url})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                            {/* Trending Badge */}
                                            <Badge className="absolute top-3 left-3 bg-[#FF6B35] text-white border-0">
                                                🔥 Trending
                                            </Badge>

                                            {/* Content */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <h3 className="text-white font-bold text-xl mb-1 line-clamp-1">{trip.title}</h3>
                                                <p className="text-white/80 text-sm flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {typeof trip.location === 'object' ? `${trip.location.city}, ${trip.location.state}` : trip.location}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-white/90 text-sm">
                                                        ₹{trip.price.amount}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-white text-sm">{trip.stats?.rating || 4.5}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-[#FF6B35]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="bg-white text-[#FF6B35] font-semibold px-6 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    Explore
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                {/* All Destinations Grid */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">All Destinations</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Explore our collection of {allTrips.length} trips</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoading ? (
                            Array(6).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-96 rounded-2xl dark:bg-gray-800" />
                            ))
                        ) : (
                            allTrips.map((trip: Trip, index: number) => (
                                <motion.div
                                    key={trip._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl dark:shadow-gray-900/10 transition-all duration-300 group border border-transparent dark:border-gray-800"
                                >
                                    <Link href={`/trips/${trip.slug}`}>
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                style={{ backgroundImage: `url(${trip.images[0]?.url})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                                            {/* Badges */}
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                {trip.isFeatured && (
                                                    <Badge className="bg-[#00B894] text-white border-0">Featured</Badge>
                                                )}
                                                {trip.tags?.includes('budget-stay') && (
                                                    <Badge className="bg-blue-500 text-white border-0">Budget</Badge>
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    ₹{trip.price.amount}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#FF6B35] dark:group-hover:text-[#FF6B35] transition-colors line-clamp-1">
                                                        {trip.title}
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 mt-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {typeof trip.location === 'object' ? `${trip.location.city}, ${trip.location.state}` : trip.location}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-semibold text-gray-900 dark:text-white">{trip.stats?.rating || 4.5}</span>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                                {trip.description}
                                            </p>

                                            {/* Info Row */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {trip.duration.days} Days
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    Available Now
                                                </span>
                                            </div>

                                            {/* Price & CTA */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Starting from</p>
                                                    <p className="text-lg font-bold text-[#FF6B35]">
                                                        ₹{trip.price.amount.toLocaleString()}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="bg-[#FF6B35] hover:bg-[#E55A2B] rounded-full text-white"
                                                >
                                                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
