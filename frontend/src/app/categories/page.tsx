'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Mountain,
    Waves,
    Trees,
    Tent,
    Heart,
    Camera,
    Bike,
    Utensils,
    Sparkles,
    Users,
    ChevronRight,
    ArrowRight,
    Star,
    MapPin
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Trip categories
const categories = [
    {
        id: 'adventure',
        name: 'Adventure',
        icon: Mountain,
        color: 'from-orange-500 to-red-500',
        bgColor: 'bg-orange-100',
        iconColor: 'text-orange-600',
        description: 'Trekking, rock climbing, rafting & more',
        tripCount: 156,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
        popularTrips: [
            { name: 'Himalayan Trek', rating: 4.9 },
            { name: 'River Rafting Rishikesh', rating: 4.8 },
        ],
    },
    {
        id: 'beach',
        name: 'Beach & Water',
        icon: Waves,
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
        description: 'Beaches, islands, water sports & coastal adventures',
        tripCount: 98,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
        popularTrips: [
            { name: 'Goa Beach Holiday', rating: 4.7 },
            { name: 'Andaman Islands', rating: 4.9 },
        ],
    },
    {
        id: 'nature',
        name: 'Nature & Wildlife',
        icon: Trees,
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        description: 'Forests, safaris, bird watching & eco tours',
        tripCount: 87,
        image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&q=80',
        popularTrips: [
            { name: 'Jim Corbett Safari', rating: 4.8 },
            { name: 'Kerala Backwaters', rating: 4.9 },
        ],
    },
    {
        id: 'camping',
        name: 'Camping',
        icon: Tent,
        color: 'from-amber-500 to-yellow-500',
        bgColor: 'bg-amber-100',
        iconColor: 'text-amber-600',
        description: 'Glamping, stargazing, bonfires & outdoor stays',
        tripCount: 64,
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
        popularTrips: [
            { name: 'Jaisalmer Desert Camp', rating: 4.7 },
            { name: 'Rishikesh Riverside Camp', rating: 4.6 },
        ],
    },
    {
        id: 'wellness',
        name: 'Wellness & Yoga',
        icon: Heart,
        color: 'from-pink-500 to-rose-500',
        bgColor: 'bg-pink-100',
        iconColor: 'text-pink-600',
        description: 'Yoga retreats, meditation, spa & wellness',
        tripCount: 45,
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80',
        popularTrips: [
            { name: 'Rishikesh Yoga Retreat', rating: 4.9 },
            { name: 'Kerala Ayurveda', rating: 4.8 },
        ],
    },
    {
        id: 'photography',
        name: 'Photography Tours',
        icon: Camera,
        color: 'from-purple-500 to-indigo-500',
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
        description: 'Capture stunning landscapes & wildlife',
        tripCount: 32,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
        popularTrips: [
            { name: 'Ladakh Photo Expedition', rating: 4.9 },
            { name: 'Varanasi Photo Walk', rating: 4.7 },
        ],
    },
    {
        id: 'biking',
        name: 'Biking & Road Trips',
        icon: Bike,
        color: 'from-gray-600 to-gray-800',
        bgColor: 'bg-gray-100',
        iconColor: 'text-gray-600',
        description: 'Motorcycle tours, road trips & cycling',
        tripCount: 41,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        popularTrips: [
            { name: 'Ladakh Bike Expedition', rating: 4.8 },
            { name: 'Spiti Valley Road Trip', rating: 4.9 },
        ],
    },
    {
        id: 'culinary',
        name: 'Food & Culinary',
        icon: Utensils,
        color: 'from-red-500 to-orange-500',
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
        description: 'Food tours, cooking classes & culinary adventures',
        tripCount: 28,
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80',
        popularTrips: [
            { name: 'Old Delhi Food Walk', rating: 4.8 },
            { name: 'Kerala Cuisine Tour', rating: 4.7 },
        ],
    },
];

// Featured experiences
const featuredExperiences = [
    {
        id: '1',
        category: 'Adventure',
        title: 'Manali Adventure Trek',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80',
        location: 'Himachal Pradesh',
        price: 9999,
        rating: 4.8,
        reviews: 124,
    },
    {
        id: '2',
        category: 'Beach',
        title: 'Goa Beach Paradise',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80',
        location: 'Goa',
        price: 7499,
        rating: 4.6,
        reviews: 89,
    },
    {
        id: '3',
        category: 'Wellness',
        title: 'Rishikesh Yoga Retreat',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80',
        location: 'Uttarakhand',
        price: 14999,
        rating: 4.9,
        reviews: 156,
    },
];

export default function CategoriesPage() {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#2D3436] via-[#636E72] to-[#2D3436] pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <Badge className="bg-[#FF6B35]/20 text-[#FF6B35] border-[#FF6B35]/30 mb-4">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Browse by Interest
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            What's Your Travel Style?
                        </h1>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto">
                            From thrilling adventures to peaceful retreats, find experiences that match your soul
                        </p>
                    </motion.div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Categories Grid */}
                <section className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onMouseEnter={() => setHoveredCategory(category.id)}
                                onMouseLeave={() => setHoveredCategory(null)}
                            >
                                <Link href={`/trips?category=${category.id}`}>
                                    <Card className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer h-full">
                                        {/* Image */}
                                        <div className="relative h-48">
                                            <Image
                                                src={category.image}
                                                alt={category.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                            {/* Icon */}
                                            <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                                                <category.icon className="w-6 h-6 text-white" />
                                            </div>

                                            {/* Trip count */}
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                                                <p className="text-white/80 text-sm">{category.tripCount} trips available</p>
                                            </div>
                                        </div>

                                        <CardContent className="p-4">
                                            <p className="text-gray-600 text-sm mb-4">{category.description}</p>

                                            {/* Popular trips */}
                                            <div className="space-y-2">
                                                <p className="text-xs text-gray-400 uppercase font-medium">Popular:</p>
                                                {category.popularTrips.map((trip) => (
                                                    <div key={trip.name} className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-700">{trip.name}</span>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                            <span className="text-gray-500">{trip.rating}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 pt-4 border-t">
                                                <span className="text-[#FF6B35] font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Explore {category.name}
                                                    <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Featured Experiences */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Featured Experiences
                            </h2>
                            <p className="text-gray-600">Hand-picked trips across all categories</p>
                        </div>
                        <Link href="/trips">
                            <Button variant="outline">
                                View All
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredExperiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/trips/${exp.id}`}>
                                    <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
                                        <div className="relative h-56">
                                            <Image
                                                src={exp.image}
                                                alt={exp.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
                                                {exp.category}
                                            </Badge>
                                        </div>
                                        <CardContent className="p-5">
                                            <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#FF6B35] transition-colors">
                                                {exp.title}
                                            </h3>
                                            <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                                                <MapPin className="w-4 h-4" />
                                                {exp.location}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-bold text-[#FF6B35]">
                                                    ₹{exp.price.toLocaleString()}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-medium">{exp.rating}</span>
                                                    <span className="text-gray-400">({exp.reviews})</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Can't Find What You're Looking For?
                    </h2>
                    <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                        Let us help you plan a custom trip tailored to your preferences
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/trips">
                            <Button size="lg" className="bg-white text-[#FF6B35] hover:bg-gray-100">
                                Browse All Trips
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                            Contact Us
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
