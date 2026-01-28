'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Clock,
    MapPin,
    Star,
    X,
    ChevronRight,
    History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RecentlyViewedItem {
    id: string;
    type: 'trip' | 'destination';
    title: string;
    image: string;
    location?: string;
    price?: number;
    rating?: number;
    viewedAt: string;
}

// Storage key
const STORAGE_KEY = 'travellr_recently_viewed';

// Hook to manage recently viewed items
export function useRecentlyViewed() {
    const [items, setItems] = useState<RecentlyViewedItem[]>([]);

    useEffect(() => {
        // Load from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing recently viewed:', e);
            }
        }
    }, []);

    const addItem = (item: Omit<RecentlyViewedItem, 'viewedAt'>) => {
        setItems(prev => {
            // Remove if already exists
            const filtered = prev.filter(i => i.id !== item.id);
            // Add to beginning with timestamp
            const newItems = [
                { ...item, viewedAt: new Date().toISOString() },
                ...filtered
            ].slice(0, 10); // Keep max 10 items

            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
            return newItems;
        });
    };

    const removeItem = (id: string) => {
        setItems(prev => {
            const filtered = prev.filter(i => i.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            return filtered;
        });
    };

    const clearAll = () => {
        setItems([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return { items, addItem, removeItem, clearAll };
}

// Component to display recently viewed items
export function RecentlyViewedSection() {
    const { items, removeItem, clearAll } = useRecentlyViewed();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Load from localStorage for display
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setIsVisible(parsed.length > 0);
            } catch (e) {
                console.error('Error parsing recently viewed:', e);
            }
        }
    }, []);

    if (!isVisible || items.length === 0) return null;

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-full flex items-center justify-center">
                            <History className="w-5 h-5 text-[#FF6B35]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
                            <p className="text-sm text-gray-500">Continue where you left off</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Clear All
                    </Button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    <AnimatePresence>
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex-shrink-0 w-64"
                            >
                                <Link href={item.type === 'trip' ? `/trips/${item.id}` : `/destinations/${item.id}`}>
                                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group relative">
                                        {/* Remove Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeItem(item.id);
                                            }}
                                            className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3 text-white" />
                                        </button>

                                        {/* Image */}
                                        <div className="relative h-32">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                            <Badge className="absolute bottom-2 left-2 bg-white/90 text-gray-800 text-xs">
                                                {item.type === 'trip' ? 'Trip' : 'Destination'}
                                            </Badge>
                                        </div>

                                        {/* Content */}
                                        <div className="p-3">
                                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1 group-hover:text-[#FF6B35] transition-colors">
                                                {item.title}
                                            </h3>
                                            {item.location && (
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                                                    <MapPin className="w-3 h-3" />
                                                    {item.location}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                {item.price && (
                                                    <span className="text-[#FF6B35] font-bold text-sm">
                                                        ₹{item.price.toLocaleString()}
                                                    </span>
                                                )}
                                                {item.rating && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-xs text-gray-600">{item.rating}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

// Floating widget for recently viewed (shows on side of screen)
export function RecentlyViewedWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<RecentlyViewedItem[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing recently viewed:', e);
            }
        }
    }, []);

    if (items.length === 0) return null;

    return (
        <>
            {/* Trigger Button */}
            <motion.button
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#FF6B35] text-white px-3 py-4 rounded-l-lg shadow-lg hover:bg-[#E55A2B] transition-colors z-40"
                onClick={() => setIsOpen(!isOpen)}
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
                <History className="w-4 h-4 mb-2" />
                Recently ({items.length})
            </motion.button>

            {/* Sidebar Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/30 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
                        >
                            <div className="p-4 border-b sticky top-0 bg-white">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg">Recently Viewed</h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                {items.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.type === 'trip' ? `/trips/${item.id}` : `/destinations/${item.id}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{item.title}</h4>
                                                {item.location && (
                                                    <p className="text-xs text-gray-500 mt-1">{item.location}</p>
                                                )}
                                                {item.price && (
                                                    <p className="text-[#FF6B35] font-semibold text-sm mt-1">
                                                        ₹{item.price.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="p-4 border-t">
                                <Link href="/trips">
                                    <Button className="w-full bg-[#FF6B35] hover:bg-[#E55A2B]">
                                        Browse All Trips
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default RecentlyViewedSection;
