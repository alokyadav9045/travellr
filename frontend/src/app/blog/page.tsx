'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search,
    Calendar,
    Clock,
    User,
    ArrowRight,
    Tag,
    TrendingUp,
    Bookmark
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Blog categories
const categories = [
    { name: 'All', count: 45 },
    { name: 'Travel Tips', count: 12 },
    { name: 'Destination Guides', count: 18 },
    { name: 'Adventure', count: 8 },
    { name: 'Culture', count: 10 },
    { name: 'Food & Cuisine', count: 7 },
    { name: 'Budget Travel', count: 6 },
];

// Sample blog posts
const blogPosts = [
    {
        id: '1',
        title: '10 Must-Visit Hidden Gems in Himachal Pradesh',
        slug: 'hidden-gems-himachal-pradesh',
        excerpt: 'Discover offbeat destinations in Himachal that most tourists miss. From secret valleys to untouched villages...',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
        category: 'Destination Guides',
        author: {
            name: 'Priya Sharma',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        },
        publishedAt: '2026-01-25',
        readTime: 8,
        featured: true,
        tags: ['Himachal', 'Mountains', 'Offbeat'],
    },
    {
        id: '2',
        title: 'Complete Guide to Backpacking in India Under ₹1000/Day',
        slug: 'backpacking-india-budget-guide',
        excerpt: 'Everything you need to know about traveling across India on a shoestring budget without compromising on experiences...',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
        category: 'Budget Travel',
        author: {
            name: 'Rahul Verma',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        },
        publishedAt: '2026-01-22',
        readTime: 12,
        featured: true,
        tags: ['Budget', 'Backpacking', 'Tips'],
    },
    {
        id: '3',
        title: 'The Ultimate Kerala Cuisine Guide: What to Eat and Where',
        slug: 'kerala-cuisine-guide',
        excerpt: 'From Appam to Karimeen, explore the rich culinary heritage of God\'s Own Country through its most authentic dishes...',
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80',
        category: 'Food & Cuisine',
        author: {
            name: 'Ananya Nair',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
        },
        publishedAt: '2026-01-20',
        readTime: 10,
        featured: false,
        tags: ['Kerala', 'Food', 'Culture'],
    },
    {
        id: '4',
        title: 'First-Time Trekker? Here\'s Your Complete Preparation Guide',
        slug: 'first-time-trekking-guide',
        excerpt: 'Everything from gear selection to physical preparation for your first Himalayan trek. Don\'t miss these essential tips...',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
        category: 'Adventure',
        author: {
            name: 'Amit Joshi',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
        },
        publishedAt: '2026-01-18',
        readTime: 15,
        featured: false,
        tags: ['Trekking', 'Adventure', 'Tips'],
    },
    {
        id: '5',
        title: 'Experiencing Holi in Mathura: A Complete Travel Guide',
        slug: 'holi-mathura-guide',
        excerpt: 'The most colorful festival in the world celebrated in its most authentic form. Here\'s everything you need to know...',
        image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80',
        category: 'Culture',
        author: {
            name: 'Neha Singh',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        },
        publishedAt: '2026-01-15',
        readTime: 7,
        featured: false,
        tags: ['Holi', 'Festival', 'Mathura'],
    },
    {
        id: '6',
        title: 'Solo Female Travel in India: Safety Tips and Best Destinations',
        slug: 'solo-female-travel-india',
        excerpt: 'Practical advice for women traveling alone in India, including the safest and most welcoming destinations...',
        image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80',
        category: 'Travel Tips',
        author: {
            name: 'Priya Sharma',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        },
        publishedAt: '2026-01-12',
        readTime: 11,
        featured: false,
        tags: ['Solo Travel', 'Women', 'Safety'],
    },
];

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const featuredPosts = blogPosts.filter(post => post.featured);

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
                            ✍️ Travel Stories & Guides
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            The Travellr Blog
                        </h1>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
                            Inspiration, tips, and stories to fuel your wanderlust
                        </p>

                        {/* Search */}
                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 rounded-full text-lg"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Featured Posts */}
                {featuredPosts.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-[#FF6B35]" />
                            <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {featuredPosts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={`/blog/${post.slug}`}>
                                        <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full group">
                                            <div className="relative h-64">
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <Badge className="absolute top-4 left-4 bg-[#FF6B35] text-white border-0">
                                                    Featured
                                                </Badge>
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                                                    <h3 className="text-xl font-bold text-white line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <CardContent className="p-4">
                                                <p className="text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                                            <Image
                                                                src={post.author.avatar}
                                                                alt={post.author.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <span className="text-sm text-gray-600">{post.author.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {post.readTime} min
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-6">
                        {/* Categories */}
                        <Card>
                            <CardContent className="p-5">
                                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.name}
                                            onClick={() => setSelectedCategory(cat.name)}
                                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors ${selectedCategory === cat.name
                                                ? 'bg-[#FF6B35] text-white'
                                                : 'hover:bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            <span>{cat.name}</span>
                                            <span className={`text-sm ${selectedCategory === cat.name ? 'text-white/80' : 'text-gray-400'
                                                }`}>
                                                {cat.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Popular Tags */}
                        <Card>
                            <CardContent className="p-5">
                                <h3 className="font-bold text-gray-900 mb-4">Popular Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Adventure', 'Budget', 'Mountains', 'Beach', 'Culture', 'Food', 'Solo Travel', 'Tips'].map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-[#FF6B35] hover:text-white transition-colors"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Newsletter */}
                        <Card className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] text-white">
                            <CardContent className="p-5">
                                <h3 className="font-bold mb-2">Subscribe to Newsletter</h3>
                                <p className="text-white/80 text-sm mb-4">
                                    Get travel tips and stories in your inbox
                                </p>
                                <Input
                                    type="email"
                                    placeholder="Your email"
                                    className="mb-3 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                />
                                <Button className="w-full bg-white text-[#FF6B35] hover:bg-gray-100">
                                    Subscribe
                                </Button>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Posts Grid */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
                            </h2>
                            <span className="text-gray-500 text-sm">{filteredPosts.length} articles</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredPosts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link href={`/blog/${post.slug}`}>
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                                            <div className="relative h-48">
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
                                                    {post.category}
                                                </Badge>
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#FF6B35] transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                                            <Image
                                                                src={post.author.avatar}
                                                                alt={post.author.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-500">{post.author.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <Clock className="w-3 h-3" />
                                                        {post.readTime} min read
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="text-center mt-10">
                            <Button variant="outline" size="lg" className="rounded-full">
                                Load More Articles
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
