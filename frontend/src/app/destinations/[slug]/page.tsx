'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    MapPin,
    Calendar,
    Thermometer,
    Star,
    Clock,
    Users,
    ChevronRight,
    Sun,
    Cloud,
    Snowflake,
    Info,
    Camera,
    Utensils,
    Plane,
    Heart,
    Share2,
    ArrowLeft
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Destination data (same as destinations page)
const destinationsData: Record<string, any> = {
    manali: {
        id: '1',
        name: 'Manali',
        slug: 'manali',
        state: 'Himachal Pradesh',
        country: 'India',
        tagline: 'Where Adventure Meets Paradise',
        description: 'Nestled in the mountains of Himachal Pradesh, Manali is a high-altitude Himalayan resort town that has become a popular tourist destination. Known for its stunning landscapes, adventure activities, and spiritual retreat spots, Manali offers something for every traveler.',
        fullDescription: `
      Manali is a breathtaking hill station situated at an altitude of 2,050 meters in the Kullu Valley. 
      The town is set on the Beas River and is known as a gateway for skiing in Solang Valley and trekking in Parvati Valley.
      
      From ancient temples to modern cafes, from challenging treks to relaxing hot springs, 
      Manali offers a perfect blend of adventure, spirituality, and natural beauty.
    `,
        heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80',
        images: [
            'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
            'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
            'https://images.unsplash.com/photo-1575986767340-5d17ae767ab0?w=800&q=80',
            'https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=800&q=80',
        ],
        tripCount: 45,
        rating: 4.8,
        reviewCount: 2340,
        bestTimeToVisit: 'October - June',
        weather: 'cold',
        temperature: '5°C - 25°C',
        altitude: '2,050 m',
        nearestAirport: 'Bhuntar Airport (52 km)',
        activities: ['Trekking', 'Paragliding', 'Skiing', 'River Rafting', 'Camping', 'Mountain Biking'],
        mustVisit: ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple', 'Old Manali', 'Jogini Waterfall'],
        cuisine: ['Siddu', 'Dham', 'Tibetan Momos', 'Thukpa', 'Trout Fish'],
        travelTips: [
            'Carry warm clothes even during summer',
            'Book permits for Rohtang Pass in advance',
            'Acclimatize properly before high-altitude treks',
            'Best to avoid during monsoon (July-August)',
        ],
        priceRange: { min: 4999, max: 34999 },
    },
    goa: {
        id: '2',
        name: 'Goa',
        slug: 'goa',
        state: 'Goa',
        country: 'India',
        tagline: 'Sun, Sand & Soul',
        description: 'India\'s smallest state packs a punch with golden beaches, Portuguese heritage, vibrant nightlife, and a laid-back vibe that keeps travelers coming back.',
        fullDescription: `
      Goa is India's premier beach destination, known for its stunning coastline, 
      Portuguese colonial heritage, and vibrant culture. From the buzzing beaches of North Goa 
      to the serene shores of the South, there's a beach for every mood.
    `,
        heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80',
        images: [
            'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
            'https://images.unsplash.com/photo-1587922546307-776227941871?w=800&q=80',
            'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800&q=80',
            'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80',
        ],
        tripCount: 62,
        rating: 4.7,
        reviewCount: 3890,
        bestTimeToVisit: 'November - February',
        weather: 'sunny',
        temperature: '20°C - 35°C',
        altitude: 'Sea level',
        nearestAirport: 'Dabolim Airport (Goa)',
        activities: ['Beach Hopping', 'Water Sports', 'Nightlife', 'Heritage Tours', 'Sunset Cruises', 'Spice Farm Tours'],
        mustVisit: ['Baga Beach', 'Fort Aguada', 'Old Goa Churches', 'Dudhsagar Falls', 'Anjuna Flea Market'],
        cuisine: ['Fish Curry Rice', 'Pork Vindaloo', 'Bebinca', 'Feni', 'Xacuti'],
        travelTips: [
            'Rent a scooter for best exploration',
            'Avoid peak season (Christmas/New Year) for budget travel',
            'North Goa for parties, South Goa for peace',
            'Carry sunscreen and stay hydrated',
        ],
        priceRange: { min: 3999, max: 24999 },
    },
};

// Default destination template
const defaultDestination = {
    name: 'Destination',
    tagline: 'Explore the Unknown',
    description: 'An amazing destination waiting to be discovered.',
    fullDescription: 'More details coming soon...',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
    images: [],
    tripCount: 0,
    rating: 4.5,
    reviewCount: 0,
    bestTimeToVisit: 'Year Round',
    weather: 'moderate',
    temperature: 'Varies',
    altitude: 'N/A',
    nearestAirport: 'N/A',
    activities: [],
    mustVisit: [],
    cuisine: [],
    travelTips: [],
    priceRange: { min: 0, max: 0 },
};

const weatherIcons: Record<string, React.ReactNode> = {
    sunny: <Sun className="w-5 h-5 text-yellow-500" />,
    moderate: <Cloud className="w-5 h-5 text-gray-500" />,
    cold: <Snowflake className="w-5 h-5 text-blue-400" />,
};

// Sample trips for destination
const sampleTrips = [
    {
        id: '1',
        title: 'Himalayan Adventure Trek',
        duration: '5 Days',
        price: 12999,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
    },
    {
        id: '2',
        title: 'Cultural Heritage Tour',
        duration: '3 Days',
        price: 8999,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    },
    {
        id: '3',
        title: 'Wellness Retreat',
        duration: '7 Days',
        price: 19999,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&q=80',
    },
];

export default function DestinationDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    const destination = destinationsData[slug] || { ...defaultDestination, name: slug };

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-20">
                    <Skeleton className="h-[60vh] w-full" />
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <Skeleton className="h-12 w-64 mb-4" />
                        <Skeleton className="h-6 w-96 mb-8" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Skeleton className="h-48" />
                            <Skeleton className="h-48" />
                            <Skeleton className="h-48" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px]">
                <Image
                    src={destination.heroImage}
                    alt={destination.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Back Button */}
                <div className="absolute top-24 left-4 md:left-8 z-20">
                    <Link href="/destinations">
                        <Button variant="ghost" className="text-white hover:bg-white/20">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Destinations
                        </Button>
                    </Link>
                </div>

                {/* Actions */}
                <div className="absolute top-24 right-4 md:right-8 z-20 flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full"
                        onClick={() => setIsSaved(!isSaved)}
                    >
                        <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full"
                    >
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge className="bg-[#FF6B35] text-white border-0 mb-4">
                                {destination.tripCount} Trips Available
                            </Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                                {destination.name}
                            </h1>
                            <p className="text-xl md:text-2xl text-white/90 mb-4">{destination.tagline}</p>
                            <div className="flex flex-wrap items-center gap-4 text-white/80">
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {destination.state}, {destination.country || 'India'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    {destination.rating} ({destination.reviewCount} reviews)
                                </span>
                                <span className="flex items-center gap-2">
                                    {weatherIcons[destination.weather]}
                                    {destination.temperature}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Quick Info Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-white shadow-lg border-0">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-[#FF6B35]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Best Time</p>
                                <p className="font-semibold text-gray-900 text-sm">{destination.bestTimeToVisit}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg border-0">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#00B894]/10 rounded-xl flex items-center justify-center">
                                <Thermometer className="w-5 h-5 text-[#00B894]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Temperature</p>
                                <p className="font-semibold text-gray-900 text-sm">{destination.temperature}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg border-0">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                <Plane className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Nearest Airport</p>
                                <p className="font-semibold text-gray-900 text-sm truncate">{destination.nearestAirport}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg border-0">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Starting From</p>
                                <p className="font-bold text-[#FF6B35]">₹{destination.priceRange?.min?.toLocaleString() || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="mb-6">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="activities">Activities</TabsTrigger>
                                <TabsTrigger value="tips">Travel Tips</TabsTrigger>
                                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>About {destination.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 leading-relaxed">{destination.description}</p>
                                        <p className="text-gray-600 leading-relaxed mt-4 whitespace-pre-line">
                                            {destination.fullDescription}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Camera className="w-5 h-5 text-[#FF6B35]" />
                                            Must Visit Places
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-3">
                                            {destination.mustVisit?.map((place: string, index: number) => (
                                                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                    <span className="w-6 h-6 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-gray-700">{place}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Utensils className="w-5 h-5 text-[#FF6B35]" />
                                            Local Cuisine
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {destination.cuisine?.map((item: string, index: number) => (
                                                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                                                    {item}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="activities" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Things to Do</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {destination.activities?.map((activity: string, index: number) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="p-4 bg-gradient-to-br from-[#FF6B35]/5 to-[#FF6B35]/10 rounded-xl text-center hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    <span className="font-medium text-gray-800">{activity}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="tips" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Info className="w-5 h-5 text-[#FF6B35]" />
                                            Travel Tips
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {destination.travelTips?.map((tip: string, index: number) => (
                                                <li key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                                                    <span className="text-yellow-600 font-bold">💡</span>
                                                    <span className="text-gray-700">{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="gallery" className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {destination.images?.map((image: string, index: number) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer"
                                        >
                                            <Image
                                                src={image}
                                                alt={`${destination.name} ${index + 1}`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* CTA Card */}
                        <Card className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] text-white border-0 shadow-xl">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">Ready to Explore?</h3>
                                <p className="text-white/80 mb-4">
                                    Discover {destination.tripCount} amazing trips in {destination.name}
                                </p>
                                <Link href={`/trips?destination=${destination.slug}`}>
                                    <Button className="w-full bg-white text-[#FF6B35] hover:bg-gray-100">
                                        View All Trips
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Popular Trips */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Popular Trips</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {sampleTrips.map((trip) => (
                                    <Link key={trip.id} href={`/trips/${trip.id}`}>
                                        <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={trip.image}
                                                    alt={trip.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{trip.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{trip.duration}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-[#FF6B35] font-bold text-sm">
                                                        ₹{trip.price.toLocaleString()}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-xs text-gray-600">{trip.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Weather Widget */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    {weatherIcons[destination.weather]}
                                    Weather Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Temperature</span>
                                        <span className="font-medium">{destination.temperature}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Best Time</span>
                                        <span className="font-medium">{destination.bestTimeToVisit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Altitude</span>
                                        <span className="font-medium">{destination.altitude}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
