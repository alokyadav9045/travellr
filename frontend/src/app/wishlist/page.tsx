'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Heart,
    Trash2,
    MapPin,
    Calendar,
    Star,
    Share2,
    ShoppingCart,
    AlertCircle,
    ChevronRight,
    Clock,
    Users
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';

// Sample wishlist data (in production, this would come from API/localStorage)
const sampleWishlistItems = [
    {
        id: '1',
        type: 'trip',
        title: 'Manali Adventure Trek',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
        location: 'Manali, Himachal Pradesh',
        duration: '5 Days',
        price: 12999,
        discountedPrice: 9999,
        rating: 4.8,
        reviewCount: 124,
        nextDeparture: 'Feb 15, 2026',
        spotsLeft: 6,
        addedAt: '2026-01-20',
    },
    {
        id: '2',
        type: 'trip',
        title: 'Goa Beach Paradise',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
        location: 'North Goa',
        duration: '4 Days',
        price: 8999,
        discountedPrice: 7499,
        rating: 4.6,
        reviewCount: 89,
        nextDeparture: 'Feb 10, 2026',
        spotsLeft: 12,
        addedAt: '2026-01-18',
    },
    {
        id: '3',
        type: 'trip',
        title: 'Kerala Backwaters Experience',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
        location: 'Alleppey, Kerala',
        duration: '3 Days',
        price: 15999,
        discountedPrice: 13999,
        rating: 4.9,
        reviewCount: 156,
        nextDeparture: 'Feb 22, 2026',
        spotsLeft: 4,
        addedAt: '2026-01-15',
    },
    {
        id: '4',
        type: 'destination',
        title: 'Ladakh',
        image: 'https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?w=600&q=80',
        location: 'Ladakh, India',
        tripCount: 28,
        rating: 4.9,
        addedAt: '2026-01-10',
    },
];

export default function WishlistPage() {
    const { isAuthenticated } = useAuth();
    const [wishlistItems, setWishlistItems] = useState(sampleWishlistItems);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const toggleSelect = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedItems.length === wishlistItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(wishlistItems.map(item => item.id));
        }
    };

    const removeItem = (id: string) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
        setSelectedItems(prev => prev.filter(i => i !== id));
    };

    const removeSelected = () => {
        setWishlistItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
    };

    const tripItems = wishlistItems.filter(item => item.type === 'trip');
    const destinationItems = wishlistItems.filter(item => item.type === 'destination');

    // if (!isAuthenticated) {
    //   return (
    //     <div className="min-h-screen bg-gray-50">
    //       <Header />
    //       <div className="max-w-2xl mx-auto px-4 py-32 text-center">
    //         <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
    //         <h1 className="text-2xl font-bold text-gray-900 mb-4">Save your favorites</h1>
    //         <p className="text-gray-600 mb-8">
    //           Sign in to save trips and destinations to your wishlist
    //         </p>
    //         <Link href="/login?redirect=/wishlist">
    //           <Button size="lg" className="bg-[#FF6B35] hover:bg-[#E55A2B]">
    //             Sign In to Continue
    //           </Button>
    //         </Link>
    //       </div>
    //       <Footer />
    //     </div>
    //   );
    // }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-2xl mx-auto px-4 py-32 text-center">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
                    <p className="text-gray-600 mb-8">
                        Start exploring and save trips you love for later
                    </p>
                    <Link href="/trips">
                        <Button size="lg" className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                            Explore Trips
                        </Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                        <p className="text-gray-600">{wishlistItems.length} saved items</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <Button
                            variant="outline"
                            onClick={selectAll}
                        >
                            {selectedItems.length === wishlistItems.length ? 'Deselect All' : 'Select All'}
                        </Button>
                        {selectedItems.length > 0 && (
                            <Button
                                variant="destructive"
                                onClick={removeSelected}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove ({selectedItems.length})
                            </Button>
                        )}
                    </div>
                </div>

                {/* Trips Section */}
                {tripItems.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-[#FF6B35]" />
                            Saved Trips ({tripItems.length})
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {tripItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${selectedItems.includes(item.id) ? 'ring-2 ring-[#FF6B35]' : ''
                                            }`}>
                                            {/* Image */}
                                            <div className="relative h-48">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                                                {/* Select Checkbox */}
                                                <div className="absolute top-3 left-3">
                                                    <Checkbox
                                                        checked={selectedItems.includes(item.id)}
                                                        onCheckedChange={() => toggleSelect(item.id)}
                                                        className="bg-white"
                                                    />
                                                </div>

                                                {/* Actions */}
                                                <div className="absolute top-3 right-3 flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="bg-white/90 hover:bg-white w-8 h-8"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="bg-white/90 hover:bg-white w-8 h-8"
                                                    >
                                                        <Share2 className="w-4 h-4 text-gray-600" />
                                                    </Button>
                                                </div>

                                                {/* Spots Left Warning */}
                                                {'spotsLeft' in item && item.spotsLeft !== undefined && item.spotsLeft <= 5 && (
                                                    <Badge className="absolute bottom-3 left-3 bg-orange-500 text-white border-0">
                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                        Only {item.spotsLeft} spots left!
                                                    </Badge>
                                                )}
                                            </div>

                                            <CardContent className="p-5">
                                                <Link href={`/trips/${item.id}`}>
                                                    <h3 className="font-bold text-gray-900 text-lg mb-2 hover:text-[#FF6B35] transition-colors">
                                                        {item.title}
                                                    </h3>
                                                </Link>

                                                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                                                    <MapPin className="w-4 h-4" />
                                                    {item.location}
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {item.duration}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        {item.rating} ({item.reviewCount})
                                                    </span>
                                                </div>

                                                {'nextDeparture' in item && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                                                        <Calendar className="w-4 h-4 text-[#FF6B35]" />
                                                        Next: {item.nextDeparture}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between pt-4 border-t">
                                                    <div>
                                                        {'discountedPrice' in item && item.discountedPrice && (
                                                            <span className="text-gray-400 line-through text-sm mr-2">
                                                                ₹{item.price.toLocaleString()}
                                                            </span>
                                                        )}
                                                        <span className="text-xl font-bold text-[#FF6B35]">
                                                            ₹{((item as any).discountedPrice || item.price).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <Link href={`/bookings/new?trip=${item.id}`}>
                                                        <Button size="sm" className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                                                            <ShoppingCart className="w-4 h-4 mr-1" />
                                                            Book
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>
                )}

                {/* Destinations Section */}
                {destinationItems.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#FF6B35]" />
                            Saved Destinations ({destinationItems.length})
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <AnimatePresence>
                                {destinationItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link href={`/destinations/${item.title.toLowerCase()}`}>
                                            <Card className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group ${selectedItems.includes(item.id) ? 'ring-2 ring-[#FF6B35]' : ''
                                                }`}>
                                                <div className="relative h-40">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                                    {/* Select Checkbox */}
                                                    <div
                                                        className="absolute top-3 left-3"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Checkbox
                                                            checked={selectedItems.includes(item.id)}
                                                            onCheckedChange={() => toggleSelect(item.id)}
                                                            className="bg-white"
                                                        />
                                                    </div>

                                                    {/* Remove Button */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-3 right-3 bg-white/90 hover:bg-white w-8 h-8"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            removeItem(item.id);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>

                                                    <div className="absolute bottom-3 left-3 right-3">
                                                        <h3 className="text-white font-bold text-lg">{item.title}</h3>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-white/80 text-sm">{(item as any).tripCount} trips</span>
                                                            <div className="flex items-center gap-1">
                                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                <span className="text-white text-sm">{item.rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>
                )}

                {/* Recommendations */}
                <section className="mt-16 pt-12 border-t">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">You might also like</h2>
                        <Link href="/trips">
                            <Button variant="ghost">
                                View All <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                    <p className="text-gray-500 text-center py-12">
                        Recommendations based on your wishlist coming soon...
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}
