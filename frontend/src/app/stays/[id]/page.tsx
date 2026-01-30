'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { tripApi } from '@/lib/api/trips';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, ArrowLeft, Wifi, BedDouble, Coffee, Car, Utensils, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function StayDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const stayId = params.id as string;

    const { data: stay, isLoading } = useQuery({
        queryKey: ['trip', stayId],
        queryFn: () => tripApi.getTripById(stayId)
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]" />
            </div>
        );
    }

    if (!stay) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Stay Not Found</h1>
                    <Button onClick={() => router.push('/stays')}>Back to Stays</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            <Header />

            <main className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#FF6B35] dark:hover:text-[#FF6B35] mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Stays
                    </button>

                    {/* Title Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{stay.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-[#FF6B35]" />
                                    {typeof stay.location === 'object' ? `${stay.location.city}, ${stay.location.state}` : stay.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    {stay.stats?.rating || 4.8} ({stay.stats?.reviewCount || 120} reviews)
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-3xl font-bold text-[#FF6B35]">₹{stay.price.amount}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">per night</div>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] md:h-[500px] mb-12 rounded-2xl overflow-hidden">
                        <div className="relative h-full">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${stay.images[0]?.url})` }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 h-full">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                    {stay.images[i + 1] ? (
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${stay.images[i + 1]?.url})` }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                            <ImageIcon className="w-8 h-8 opacity-20" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column: Details */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Description */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About this stay</h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {stay.description}
                                </p>
                            </section>

                            {/* Amenities */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                        { icon: Wifi, label: 'Free Wifi' },
                                        { icon: BedDouble, label: 'AC Rooms' },
                                        { icon: Coffee, label: 'Breakfast' },
                                        { icon: Car, label: 'Parking' },
                                        { icon: Utensils, label: 'Restaurant' },
                                        { icon: CheckCircle, label: 'Housekeeping' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-[#FF6B35] dark:hover:border-[#FF6B35] transition-colors bg-white dark:bg-gray-900">
                                            <item.icon className="h-5 w-5 text-gray-400" />
                                            <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Booking Card */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-black/20 p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Book your stay</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
                                            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Check-in</label>
                                            <input type="date" className="w-full text-sm outline-none bg-transparent text-gray-900 dark:text-white" />
                                        </div>
                                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
                                            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Check-out</label>
                                            <input type="date" className="w-full text-sm outline-none bg-transparent text-gray-900 dark:text-white" />
                                        </div>
                                    </div>
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
                                        <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Guests</label>
                                        <select className="w-full text-sm outline-none bg-transparent text-gray-900 dark:text-white">
                                            <option className="dark:bg-gray-800">1 Guest</option>
                                            <option className="dark:bg-gray-800">2 Guests</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                                    <span className="text-gray-600 dark:text-gray-400">Total (1 night)</span>
                                    <span className="font-bold text-gray-900 dark:text-white">₹{stay.price.amount}</span>
                                </div>

                                <Button className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-lg py-6 text-white">
                                    Reserve Now
                                </Button>
                                <p className="text-center text-xs text-gray-400 mt-3">You won't be charged yet</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
