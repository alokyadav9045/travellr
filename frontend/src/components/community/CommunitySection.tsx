'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Users,
    MessageCircle,
    Heart,
    Share2,
    MapPin,
    Calendar,
    ChevronRight,
    Sparkles,
    UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Sample community data
const travelStories = [
    {
        id: '1',
        author: {
            name: 'Priya Sharma',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
            trips: 12,
        },
        title: 'My Solo Adventure Through Ladakh',
        excerpt: 'The most transformative 10 days of my life. From Khardung La to Pangong Lake, every moment was magical...',
        image: 'https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?w=600&q=80',
        destination: 'Ladakh',
        date: '2 days ago',
        likes: 234,
        comments: 45,
    },
    {
        id: '2',
        author: {
            name: 'Rahul Verma',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
            trips: 8,
        },
        title: 'Kerala Backwaters: A Floating Paradise',
        excerpt: 'Waking up on a houseboat to the sound of water lapping against the hull. This is the Kerala dream...',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
        destination: 'Kerala',
        date: '5 days ago',
        likes: 189,
        comments: 32,
    },
    {
        id: '3',
        author: {
            name: 'Ananya Patel',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
            trips: 15,
        },
        title: 'Finding Peace in Rishikesh',
        excerpt: 'A week of yoga, meditation, and self-discovery by the Ganges. Sometimes you need to disconnect to reconnect...',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
        destination: 'Rishikesh',
        date: '1 week ago',
        likes: 312,
        comments: 67,
    },
];

const upcomingEvents = [
    {
        id: '1',
        title: 'Full Moon Party - Goa',
        date: 'Feb 12, 2026',
        location: 'Arambol Beach, Goa',
        attendees: 156,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    },
    {
        id: '2',
        title: 'Sunrise Trek - Triund',
        date: 'Feb 18, 2026',
        location: 'McLeodganj, HP',
        attendees: 42,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
    },
    {
        id: '3',
        title: 'Holi Festival Celebration',
        date: 'Mar 14, 2026',
        location: 'Mathura, UP',
        attendees: 289,
        image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&q=80',
    },
];

const travelBuddies = [
    {
        id: '1',
        name: 'Arjun Kumar',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
        destination: 'Looking for Manali trip buddy',
        dates: 'Feb 20-25',
        interests: ['Trekking', 'Photography'],
    },
    {
        id: '2',
        name: 'Neha Singh',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        destination: 'Planning Goa group trip',
        dates: 'Mar 5-10',
        interests: ['Beach', 'Nightlife'],
    },
    {
        id: '3',
        name: 'Amit Joshi',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
        destination: 'Ladakh bike expedition team',
        dates: 'Apr 15-25',
        interests: ['Biking', 'Adventure'],
    },
];

export function CommunitySection() {
    const [activeTab, setActiveTab] = useState<'stories' | 'events' | 'buddies'>('stories');

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full mb-4"
                    >
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">Travellr Community</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        Connect with Fellow Travelers
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Share stories, find travel buddies, and join exciting events with our vibrant community
                    </motion.p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center gap-2 mb-10">
                    {[
                        { id: 'stories', label: 'Travel Stories', icon: MessageCircle },
                        { id: 'events', label: 'Events', icon: Calendar },
                        { id: 'buddies', label: 'Find Buddies', icon: UserPlus },
                    ].map((tab) => (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? 'default' : 'outline'}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`rounded-full ${activeTab === tab.id
                                ? 'bg-[#FF6B35] hover:bg-[#E55A2B] text-white'
                                : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            suppressHydrationWarning
                        >
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </Button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'stories' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {travelStories.map((story, index) => (
                            <motion.div
                                key={story.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full dark:bg-gray-900 dark:border-gray-800">
                                    {/* Image */}
                                    <div className="relative h-48">
                                        <Image
                                            src={story.image}
                                            alt={story.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                        <Badge className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {story.destination}
                                        </Badge>
                                    </div>

                                    <CardContent className="p-5">
                                        {/* Author */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src={story.author.avatar} />
                                                <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{story.author.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{story.author.trips} trips • {story.date}</p>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {story.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                            {story.excerpt}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t dark:border-gray-800">
                                            <div className="flex items-center gap-4">
                                                <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" suppressHydrationWarning>
                                                    <Heart className="w-4 h-4" />
                                                    <span className="text-sm">{story.likes}</span>
                                                </button>
                                                <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" suppressHydrationWarning>
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span className="text-sm">{story.comments}</span>
                                                </button>
                                            </div>
                                            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" suppressHydrationWarning>
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {upcomingEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="overflow-hidden hover:shadow-xl transition-shadow dark:bg-gray-900 dark:border-gray-800">
                                    <div className="relative h-40">
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <h3 className="text-white font-bold text-lg">{event.title}</h3>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4 text-[#FF6B35]" />
                                                {event.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <MapPin className="w-4 h-4 text-[#FF6B35]" />
                                                {event.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Users className="w-4 h-4 text-[#FF6B35]" />
                                                {event.attendees} attending
                                            </div>
                                        </div>
                                        <Button className="w-full mt-4 bg-[#FF6B35] hover:bg-[#E55A2B] text-white">
                                            Join Event
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === 'buddies' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {travelBuddies.map((buddy, index) => (
                            <motion.div
                                key={buddy.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-6 hover:shadow-xl transition-shadow dark:bg-gray-900 dark:border-gray-800">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="w-14 h-14">
                                            <AvatarImage src={buddy.avatar} />
                                            <AvatarFallback>{buddy.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{buddy.name}</h3>
                                            <p className="text-[#FF6B35] font-medium text-sm mb-2">{buddy.destination}</p>
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-3">
                                                <Calendar className="w-4 h-4" />
                                                {buddy.dates}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {buddy.interests.map((interest) => (
                                                    <Badge key={interest} variant="secondary" className="text-xs dark:bg-gray-800 dark:text-gray-300">
                                                        {interest}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full mt-4 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Connect
                                    </Button>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link href="/community">
                        <Button size="lg" variant="outline" className="rounded-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white" suppressHydrationWarning>
                            Explore Community
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export default CommunitySection;
