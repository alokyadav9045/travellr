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
    Search,
    Filter,
    Plus,
    Star,
    ChevronRight,
    UserPlus,
    Globe,
    TrendingUp
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Travel stories data
const travelStories = [
    {
        id: '1',
        author: {
            name: 'Priya Sharma',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
            trips: 12,
            followers: 2340,
            verified: true,
        },
        title: 'My Solo Adventure Through Ladakh',
        content: 'The most transformative 10 days of my life. From Khardung La to Pangong Lake, every moment was magical. I want to share some tips for anyone planning a solo trip...',
        images: [
            'https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?w=600&q=80',
            'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=600&q=80',
        ],
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
            followers: 1560,
            verified: false,
        },
        title: 'Kerala Backwaters: A Floating Paradise',
        content: 'Waking up on a houseboat to the sound of water lapping against the hull. This is the Kerala dream that everyone talks about...',
        images: [
            'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
        ],
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
            followers: 4200,
            verified: true,
        },
        title: 'Finding Peace in Rishikesh',
        content: 'A week of yoga, meditation, and self-discovery by the Ganges. Sometimes you need to disconnect to reconnect with yourself...',
        images: [
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
        ],
        destination: 'Rishikesh',
        date: '1 week ago',
        likes: 312,
        comments: 67,
    },
];

// Upcoming events
const upcomingEvents = [
    {
        id: '1',
        title: 'Full Moon Party - Goa',
        description: 'Join fellow travelers for an epic beach party under the stars',
        date: 'Feb 12, 2026',
        time: '8:00 PM',
        location: 'Arambol Beach, Goa',
        attendees: 156,
        maxAttendees: 200,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
        price: 'Free',
        organizer: 'Travellr Community',
    },
    {
        id: '2',
        title: 'Sunrise Trek to Triund',
        description: 'Early morning trek with experienced guides and new friends',
        date: 'Feb 18, 2026',
        time: '4:00 AM',
        location: 'McLeodganj, HP',
        attendees: 42,
        maxAttendees: 50,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
        price: '₹1,500',
        organizer: 'Adventure Club',
    },
    {
        id: '3',
        title: 'Holi Festival Celebration',
        description: 'Experience the colors of Holi at the most iconic location',
        date: 'Mar 14, 2026',
        time: '10:00 AM',
        location: 'Mathura, UP',
        attendees: 289,
        maxAttendees: 500,
        image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&q=80',
        price: '₹2,999',
        organizer: 'Cultural Tours India',
    },
    {
        id: '4',
        title: 'Photography Walk - Varanasi Ghats',
        description: 'Capture the essence of Varanasi with photography experts',
        date: 'Feb 25, 2026',
        time: '5:30 AM',
        location: 'Dashashwamedh Ghat, Varanasi',
        attendees: 28,
        maxAttendees: 30,
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&q=80',
        price: '₹800',
        organizer: 'Photo Walks India',
    },
];

// Travel buddies looking for partners
const travelBuddies = [
    {
        id: '1',
        name: 'Arjun Kumar',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
        age: 28,
        location: 'Delhi',
        destination: 'Manali',
        tripTitle: 'Looking for Manali trip buddy',
        dates: 'Feb 20-25, 2026',
        tripType: 'Adventure',
        interests: ['Trekking', 'Photography', 'Camping'],
        budget: '₹8,000 - ₹12,000',
        description: 'Planning a 5-day trip to Manali. Looking for someone who loves trekking and is okay with budget stays.',
    },
    {
        id: '2',
        name: 'Neha Singh',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        age: 25,
        location: 'Mumbai',
        destination: 'Goa',
        tripTitle: 'Group trip to Goa',
        dates: 'Mar 5-10, 2026',
        tripType: 'Beach',
        interests: ['Beach', 'Nightlife', 'Water Sports'],
        budget: '₹15,000 - ₹20,000',
        description: 'Already have 3 people confirmed. Looking for 2 more for a fun beach vacation!',
    },
    {
        id: '3',
        name: 'Amit Joshi',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
        age: 32,
        location: 'Bangalore',
        destination: 'Ladakh',
        tripTitle: 'Ladakh bike expedition team',
        dates: 'Apr 15-25, 2026',
        tripType: 'Adventure',
        interests: ['Biking', 'Adventure', 'Mountains'],
        budget: '₹30,000 - ₹40,000',
        description: 'Experienced rider looking for fellow bikers for the ultimate Ladakh expedition.',
    },
    {
        id: '4',
        name: 'Shreya Menon',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
        age: 27,
        location: 'Chennai',
        destination: 'Kerala',
        tripTitle: 'Kerala backwaters & wellness',
        dates: 'Mar 1-7, 2026',
        tripType: 'Wellness',
        interests: ['Yoga', 'Ayurveda', 'Nature'],
        budget: '₹20,000 - ₹25,000',
        description: 'Looking for calm souls for a rejuvenating Kerala trip with houseboat stays and ayurvedic spa.',
    },
];

// Top creators
const topCreators = [
    {
        name: 'Wandering Souls',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        followers: '45K',
        posts: 234,
        verified: true,
    },
    {
        name: 'Mountain Tales',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        followers: '32K',
        posts: 189,
        verified: true,
    },
    {
        name: 'Beach Bum India',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        followers: '28K',
        posts: 156,
        verified: false,
    },
];

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState('stories');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <Badge className="bg-white/10 text-white border-white/20 mb-4">
                            <Users className="w-4 h-4 mr-2" />
                            50,000+ Travelers
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Travellr Community
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                            Connect with fellow travelers, share stories, find trip buddies, and join exciting events
                        </p>

                        {/* Search */}
                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search community..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 rounded-full text-lg"
                            />
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap justify-center gap-8 mt-10">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">50K+</div>
                                <div className="text-white/70 text-sm">Members</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">12K+</div>
                                <div className="text-white/70 text-sm">Stories Shared</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">500+</div>
                                <div className="text-white/70 text-sm">Events Hosted</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">3K+</div>
                                <div className="text-white/70 text-sm">Trip Buddies Made</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="mb-8 w-full justify-start">
                                <TabsTrigger value="stories" className="flex-1 md:flex-none">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Stories
                                </TabsTrigger>
                                <TabsTrigger value="events" className="flex-1 md:flex-none">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Events
                                </TabsTrigger>
                                <TabsTrigger value="buddies" className="flex-1 md:flex-none">
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Find Buddies
                                </TabsTrigger>
                            </TabsList>

                            {/* Stories Tab */}
                            <TabsContent value="stories" className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Travel Stories</h2>
                                    <Button className="bg-purple-600 hover:bg-purple-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Share Story
                                    </Button>
                                </div>

                                {travelStories.map((story, index) => (
                                    <motion.div
                                        key={story.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="overflow-hidden">
                                            <CardContent className="p-6">
                                                {/* Author */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-12 h-12">
                                                            <AvatarImage src={story.author.avatar} />
                                                            <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-gray-900">{story.author.name}</span>
                                                                {story.author.verified && (
                                                                    <Badge className="bg-blue-100 text-blue-700 text-xs">Verified</Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                {story.author.trips} trips • {story.author.followers.toLocaleString()} followers
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm">Follow</Button>
                                                </div>

                                                {/* Content */}
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">{story.title}</h3>
                                                <p className="text-gray-600 mb-4">{story.content}</p>

                                                {/* Images */}
                                                {story.images.length > 0 && (
                                                    <div className={`grid gap-2 mb-4 ${story.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                                        {story.images.map((img, i) => (
                                                            <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                                                                <Image src={img} alt="" fill className="object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Meta */}
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Badge variant="secondary">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {story.destination}
                                                    </Badge>
                                                    <span className="text-sm text-gray-500">{story.date}</span>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-6 pt-4 border-t">
                                                    <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                                                        <Heart className="w-5 h-5" />
                                                        <span>{story.likes}</span>
                                                    </button>
                                                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                                                        <MessageCircle className="w-5 h-5" />
                                                        <span>{story.comments}</span>
                                                    </button>
                                                    <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors ml-auto">
                                                        <Share2 className="w-5 h-5" />
                                                        Share
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}

                                <div className="text-center">
                                    <Button variant="outline" size="lg">Load More Stories</Button>
                                </div>
                            </TabsContent>

                            {/* Events Tab */}
                            <TabsContent value="events" className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                                    <Button className="bg-purple-600 hover:bg-purple-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Event
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {upcomingEvents.map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                                <div className="relative h-48">
                                                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                                                    <Badge className="absolute top-3 right-3 bg-white text-gray-900">{event.price}</Badge>
                                                </div>
                                                <CardContent className="p-5">
                                                    <h3 className="font-bold text-gray-900 text-lg mb-2">{event.title}</h3>
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                                                    <div className="space-y-2 text-sm mb-4">
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Calendar className="w-4 h-4 text-purple-600" />
                                                            {event.date} at {event.time}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <MapPin className="w-4 h-4 text-purple-600" />
                                                            {event.location}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Users className="w-4 h-4 text-purple-600" />
                                                            {event.attendees}/{event.maxAttendees} attending
                                                        </div>
                                                    </div>

                                                    {/* Progress bar */}
                                                    <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                                                        <div
                                                            className="h-2 bg-purple-600 rounded-full"
                                                            style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                                                        />
                                                    </div>

                                                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Join Event</Button>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Buddies Tab */}
                            <TabsContent value="buddies" className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Find Travel Buddies</h2>
                                    <Button className="bg-purple-600 hover:bg-purple-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Post Trip
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {travelBuddies.map((buddy, index) => (
                                        <motion.div
                                            key={buddy.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Card className="hover:shadow-lg transition-shadow">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <Avatar className="w-14 h-14">
                                                            <AvatarImage src={buddy.avatar} />
                                                            <AvatarFallback>{buddy.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="font-bold text-gray-900">{buddy.name}</h3>
                                                                <Badge variant="secondary">{buddy.tripType}</Badge>
                                                            </div>
                                                            <p className="text-sm text-gray-500">{buddy.age} years • {buddy.location}</p>
                                                        </div>
                                                    </div>

                                                    <h4 className="font-semibold text-purple-600 mb-2">{buddy.tripTitle}</h4>
                                                    <p className="text-gray-600 text-sm mb-4">{buddy.description}</p>

                                                    <div className="space-y-2 text-sm mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            <span className="text-gray-600">Destination: {buddy.destination}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span className="text-gray-600">{buddy.dates}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-600">Budget: {buddy.budget}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {buddy.interests.map((interest) => (
                                                            <Badge key={interest} variant="outline" className="text-xs">
                                                                {interest}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button variant="outline" className="flex-1">View Profile</Button>
                                                        <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                                                            <MessageCircle className="w-4 h-4 mr-2" />
                                                            Connect
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Top Creators */}
                        <Card>
                            <CardContent className="p-5">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    Top Creators
                                </h3>
                                <div className="space-y-4">
                                    {topCreators.map((creator) => (
                                        <div key={creator.name} className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={creator.avatar} />
                                                <AvatarFallback>{creator.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium text-gray-900 text-sm">{creator.name}</span>
                                                    {creator.verified && (
                                                        <Badge className="bg-blue-100 text-blue-700 text-[10px] px-1">✓</Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500">{creator.followers} followers</p>
                                            </div>
                                            <Button variant="outline" size="sm" className="text-xs">Follow</Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Join CTA */}
                        <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
                            <CardContent className="p-5">
                                <Globe className="w-8 h-8 mb-3" />
                                <h3 className="font-bold text-lg mb-2">Become a Creator</h3>
                                <p className="text-white/80 text-sm mb-4">
                                    Share your travel stories, inspire others, and earn rewards
                                </p>
                                <Button className="w-full bg-white text-purple-700 hover:bg-gray-100">
                                    Apply Now
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Trending Destinations */}
                        <Card>
                            <CardContent className="p-5">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                    Trending Now
                                </h3>
                                <div className="space-y-2">
                                    {['Manali', 'Goa Beaches', 'Ladakh', 'Kerala Backwaters'].map((place, i) => (
                                        <Link key={place} href={`/destinations/${place.toLowerCase().replace(' ', '-')}`}>
                                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                <span className="text-lg font-bold text-gray-400">#{i + 1}</span>
                                                <span className="text-gray-700">{place}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}
