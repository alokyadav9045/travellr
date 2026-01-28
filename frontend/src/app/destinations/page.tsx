'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    MapPin,
    ChevronRight,
    Search,
    Filter,
    Thermometer,
    Calendar,
    TrendingUp,
    Star,
    Users,
    ArrowRight,
    X,
    Sun,
    Cloud,
    Snowflake
} from 'lucide-react';
import Header from '@/components/layout/Header';
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

// Destination data with real Unsplash images
const destinations = [
    {
        id: '1',
        name: 'Manali',
        slug: 'manali',
        state: 'Himachal Pradesh',
        country: 'India',
        description: 'Snow-capped mountains, adventure sports, and serene valleys await in this Himalayan paradise.',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
        tripCount: 45,
        trending: true,
        featured: true,
        rating: 4.8,
        reviewCount: 2340,
        bestTimeToVisit: 'October - June',
        weather: 'cold',
        temperature: '5°C - 25°C',
        activities: ['Trekking', 'Paragliding', 'Skiing', 'River Rafting'],
        priceRange: { min: 4999, max: 34999 },
    },
    {
        id: '2',
        name: 'Goa',
        slug: 'goa',
        state: 'Goa',
        country: 'India',
        description: 'Golden beaches, vibrant nightlife, and Portuguese heritage create an unforgettable coastal experience.',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
        tripCount: 62,
        trending: true,
        featured: true,
        rating: 4.7,
        reviewCount: 3890,
        bestTimeToVisit: 'November - February',
        weather: 'sunny',
        temperature: '20°C - 35°C',
        activities: ['Beach', 'Water Sports', 'Nightlife', 'Heritage Tours'],
        priceRange: { min: 3999, max: 24999 },
    },
    {
        id: '3',
        name: 'Rishikesh',
        slug: 'rishikesh',
        state: 'Uttarakhand',
        country: 'India',
        description: 'The yoga capital of the world, offering spiritual retreats and thrilling adventure activities.',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
        tripCount: 38,
        trending: true,
        featured: false,
        rating: 4.9,
        reviewCount: 1567,
        bestTimeToVisit: 'September - November',
        weather: 'moderate',
        temperature: '15°C - 30°C',
        activities: ['Yoga', 'Rafting', 'Bungee Jumping', 'Camping'],
        priceRange: { min: 2999, max: 18999 },
    },
    {
        id: '4',
        name: 'Ladakh',
        slug: 'ladakh',
        state: 'Ladakh',
        country: 'India',
        description: 'Land of high passes with breathtaking landscapes, ancient monasteries, and rugged terrain.',
        image: 'https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?w=800&q=80',
        tripCount: 28,
        trending: false,
        featured: true,
        rating: 4.9,
        reviewCount: 1234,
        bestTimeToVisit: 'May - September',
        weather: 'cold',
        temperature: '-5°C - 20°C',
        activities: ['Bike Expeditions', 'Monastery Tours', 'Trekking', 'Camping'],
        priceRange: { min: 15999, max: 49999 },
    },
    {
        id: '5',
        name: 'Kerala',
        slug: 'kerala',
        state: 'Kerala',
        country: 'India',
        description: 'God\'s Own Country with serene backwaters, lush tea plantations, and Ayurvedic wellness.',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
        tripCount: 52,
        trending: true,
        featured: true,
        rating: 4.8,
        reviewCount: 2890,
        bestTimeToVisit: 'September - March',
        weather: 'moderate',
        temperature: '22°C - 33°C',
        activities: ['Houseboat Cruise', 'Ayurveda', 'Wildlife Safari', 'Tea Plantation Tours'],
        priceRange: { min: 6999, max: 35999 },
    },
    {
        id: '6',
        name: 'Jaipur',
        slug: 'jaipur',
        state: 'Rajasthan',
        country: 'India',
        description: 'The Pink City filled with majestic palaces, vibrant bazaars, and rich royal heritage.',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
        tripCount: 35,
        trending: false,
        featured: false,
        rating: 4.6,
        reviewCount: 1890,
        bestTimeToVisit: 'October - March',
        weather: 'sunny',
        temperature: '15°C - 40°C',
        activities: ['Palace Tours', 'Shopping', 'Camel Safari', 'Food Tours'],
        priceRange: { min: 4999, max: 19999 },
    },
    {
        id: '7',
        name: 'Varanasi',
        slug: 'varanasi',
        state: 'Uttar Pradesh',
        country: 'India',
        description: 'One of the world\'s oldest cities, offering spiritual enlightenment along the sacred Ganges.',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
        tripCount: 22,
        trending: false,
        featured: false,
        rating: 4.7,
        reviewCount: 987,
        bestTimeToVisit: 'October - March',
        weather: 'moderate',
        temperature: '10°C - 35°C',
        activities: ['Ganga Aarti', 'Temple Tours', 'Boat Rides', 'Street Food Tours'],
        priceRange: { min: 3999, max: 14999 },
    },
    {
        id: '8',
        name: 'Andaman Islands',
        slug: 'andaman',
        state: 'Andaman & Nicobar',
        country: 'India',
        description: 'Pristine beaches, crystal-clear waters, and rich marine life in this tropical paradise.',
        image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80',
        tripCount: 18,
        trending: true,
        featured: true,
        rating: 4.9,
        reviewCount: 1456,
        bestTimeToVisit: 'November - May',
        weather: 'sunny',
        temperature: '23°C - 31°C',
        activities: ['Scuba Diving', 'Snorkeling', 'Beach Hopping', 'Island Tours'],
        priceRange: { min: 19999, max: 59999 },
    },
    {
        id: '9',
        name: 'Shimla',
        slug: 'shimla',
        state: 'Himachal Pradesh',
        country: 'India',
        description: 'Colonial charm meets mountain beauty in this popular hill station and former summer capital.',
        image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80',
        tripCount: 32,
        trending: false,
        featured: false,
        rating: 4.5,
        reviewCount: 2100,
        bestTimeToVisit: 'March - June, December',
        weather: 'cold',
        temperature: '2°C - 25°C',
        activities: ['Mall Road Walk', 'Toy Train', 'Trekking', 'Ice Skating'],
        priceRange: { min: 4999, max: 22999 },
    },
    {
        id: '10',
        name: 'Udaipur',
        slug: 'udaipur',
        state: 'Rajasthan',
        country: 'India',
        description: 'The City of Lakes with floating palaces, romantic sunsets, and regal Rajputana architecture.',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
        tripCount: 25,
        trending: false,
        featured: true,
        rating: 4.8,
        reviewCount: 1567,
        bestTimeToVisit: 'September - March',
        weather: 'sunny',
        temperature: '16°C - 38°C',
        activities: ['Lake Tours', 'Palace Visits', 'Cultural Shows', 'Vintage Car Rides'],
        priceRange: { min: 5999, max: 29999 },
    },
    {
        id: '11',
        name: 'Jaisalmer',
        slug: 'jaisalmer',
        state: 'Rajasthan',
        country: 'India',
        description: 'The Golden City rising from the Thar Desert with stunning sandstone architecture and desert safaris.',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
        tripCount: 20,
        trending: false,
        featured: false,
        rating: 4.7,
        reviewCount: 890,
        bestTimeToVisit: 'October - March',
        weather: 'sunny',
        temperature: '12°C - 42°C',
        activities: ['Desert Safari', 'Camel Camping', 'Fort Tours', 'Folk Performances'],
        priceRange: { min: 6999, max: 24999 },
    },
    {
        id: '12',
        name: 'Darjeeling',
        slug: 'darjeeling',
        state: 'West Bengal',
        country: 'India',
        description: 'Queen of the Hills with panoramic Himalayan views, tea gardens, and the famous toy train.',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
        tripCount: 15,
        trending: false,
        featured: false,
        rating: 4.6,
        reviewCount: 756,
        bestTimeToVisit: 'March - May, October - November',
        weather: 'cold',
        temperature: '5°C - 20°C',
        activities: ['Tea Garden Tours', 'Toy Train Ride', 'Tiger Hill Sunrise', 'Monasteries'],
        priceRange: { min: 5999, max: 19999 },
    },
];

const weatherIcons: Record<string, React.ReactNode> = {
    sunny: <Sun className="w-4 h-4 text-yellow-500" />,
    moderate: <Cloud className="w-4 h-4 text-gray-500" />,
    cold: <Snowflake className="w-4 h-4 text-blue-400" />,
};

const regions = ['All Regions', 'North India', 'South India', 'East India', 'West India', 'Islands'];
const tripTypes = ['All Types', 'Adventure', 'Cultural', 'Beach', 'Wellness', 'Wildlife'];

export default function DestinationsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('All Regions');
    const [selectedType, setSelectedType] = useState('All Types');
    const [sortBy, setSortBy] = useState('popular');
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const filteredDestinations = destinations
        .filter(dest => {
            const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dest.state.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'popular':
                    return b.tripCount - a.tripCount;
                case 'rating':
                    return b.rating - a.rating;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'trending':
                    return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
                default:
                    return 0;
            }
        });

    const trendingDestinations = destinations.filter(d => d.trending);
    const featuredDestinations = destinations.filter(d => d.featured);

    return (
        <div className="min-h-screen bg-gray-50">
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
                            🗺️ Explore {destinations.length}+ Destinations
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
                                className="w-full pl-12 pr-4 py-4 h-14 rounded-2xl border-0 shadow-xl text-lg"
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
                        className="bg-white shadow-md border-b"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regions.map(region => (
                                            <SelectItem key={region} value={region}>{region}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

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
                                        <SelectItem value="trending">Trending</SelectItem>
                                        <SelectItem value="name">A-Z</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedRegion('All Regions');
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
                {/* Trending Destinations */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-[#FF6B35]" />
                                <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wide">Hot Right Now</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trending Destinations</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            Array(4).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-64 rounded-2xl" />
                            ))
                        ) : (
                            trendingDestinations.slice(0, 4).map((destination, index) => (
                                <motion.div
                                    key={destination.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={`/destinations/${destination.slug}`}>
                                        <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer">
                                            <Image
                                                src={destination.image}
                                                alt={destination.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                            {/* Trending Badge */}
                                            <Badge className="absolute top-3 left-3 bg-[#FF6B35] text-white border-0">
                                                🔥 Trending
                                            </Badge>

                                            {/* Content */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <h3 className="text-white font-bold text-xl mb-1">{destination.name}</h3>
                                                <p className="text-white/80 text-sm flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {destination.state}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-white/90 text-sm">
                                                        {destination.tripCount} trips
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-white text-sm">{destination.rating}</span>
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
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">All Destinations</h2>
                            <p className="text-gray-600 mt-1">{filteredDestinations.length} destinations to explore</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoading ? (
                            Array(6).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-96 rounded-2xl" />
                            ))
                        ) : (
                            filteredDestinations.map((destination, index) => (
                                <motion.div
                                    key={destination.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    <Link href={`/destinations/${destination.slug}`}>
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={destination.image}
                                                alt={destination.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                                            {/* Badges */}
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                {destination.featured && (
                                                    <Badge className="bg-[#00B894] text-white border-0">Featured</Badge>
                                                )}
                                                {destination.trending && (
                                                    <Badge className="bg-[#FF6B35] text-white border-0">🔥 Hot</Badge>
                                                )}
                                            </div>

                                            {/* Trip Count */}
                                            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {destination.tripCount} trips
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#FF6B35] transition-colors">
                                                        {destination.name}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {destination.state}, {destination.country}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-semibold text-gray-900">{destination.rating}</span>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                                {destination.description}
                                            </p>

                                            {/* Info Row */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                <span className="flex items-center gap-1">
                                                    {weatherIcons[destination.weather]}
                                                    {destination.temperature}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {destination.bestTimeToVisit}
                                                </span>
                                            </div>

                                            {/* Activities */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {destination.activities.slice(0, 3).map(activity => (
                                                    <Badge key={activity} variant="secondary" className="text-xs">
                                                        {activity}
                                                    </Badge>
                                                ))}
                                                {destination.activities.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{destination.activities.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Price & CTA */}
                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div>
                                                    <p className="text-xs text-gray-500">Starting from</p>
                                                    <p className="text-lg font-bold text-[#FF6B35]">
                                                        ₹{destination.priceRange.min.toLocaleString()}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="bg-[#FF6B35] hover:bg-[#E55A2B] rounded-full"
                                                >
                                                    Explore <ArrowRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                {/* Stats Section */}
                <section className="mt-20 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-3xl p-8 md:p-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                            <div className="text-white/80">Unique Trips</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2">{destinations.length}+</div>
                            <div className="text-white/80">Destinations</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
                            <div className="text-white/80">Happy Travelers</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2">4.8</div>
                            <div className="text-white/80">Average Rating</div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
