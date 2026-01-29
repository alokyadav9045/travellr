'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Calendar,
    Clock,
    User,
    Heart,
    MessageCircle,
    Share2,
    Bookmark,
    Facebook,
    Twitter,
    Linkedin,
    Link2,
    ChevronLeft,
    Tag,
    ArrowRight
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Textarea } from '@/components/ui/textarea';

// Sample blog post (in production, this would be fetched by slug)
const blogPost = {
    id: '1',
    title: '10 Must-Visit Hidden Gems in Himachal Pradesh',
    slug: 'hidden-gems-himachal-pradesh',
    category: 'Destination Guides',
    featuredImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80',
    author: {
        name: 'Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        bio: 'Travel writer and photographer with 10+ years exploring India. Loves mountains, local food, and offbeat destinations.',
        followers: 12500,
    },
    publishedAt: 'January 25, 2026',
    readTime: 8,
    likes: 234,
    comments: 45,
    tags: ['Himachal Pradesh', 'Mountains', 'Offbeat', 'Travel Tips'],
    content: `
    <p class="lead">Himachal Pradesh is known for its popular destinations like Manali, Shimla, and Dharamshala. But beyond these tourist hotspots lie hidden valleys, untouched villages, and serene landscapes that offer a more authentic Himalayan experience. Here are 10 must-visit hidden gems that most tourists miss.</p>

    <h2>1. Chitkul - India's Last Village</h2>
    <p>Nestled at 3,450 meters on the Indo-Tibet border, Chitkul is the last inhabited village near the Indo-China border. The journey itself through Kinnaur valley is breathtaking, with apple orchards, wooden houses, and the mighty Baspa River accompanying you.</p>
    <p><strong>Best time to visit:</strong> May to October<br/>
    <strong>Getting there:</strong> Drive from Shimla (260 km) via Reckong Peo</p>

    <h2>2. Prashar Lake - The Floating Island Mystery</h2>
    <p>This high-altitude lake at 2,730 meters houses a floating island that mysteriously changes position. The 8th-century pagoda-style temple dedicated to sage Prashar adds to its mystical charm.</p>
    <p><strong>Best time to visit:</strong> March to June, September to November<br/>
    <strong>Getting there:</strong> Trek from Baggi village (8 km)</p>

    <h2>3. Barot Valley - The Hidden Gem of Mandi</h2>
    <p>A peaceful valley known for trout fishing and camping by the Uhl River. Barot remains largely undiscovered despite its proximity to popular destinations.</p>

    <h2>4. Jibhi - The Village of Waterfalls</h2>
    <p>With traditional wooden houses, pine forests, and hidden waterfalls, Jibhi offers the perfect escape from crowded hill stations. The Great Himalayan National Park is just a short drive away.</p>

    <h2>5. Kalpa - Apple Orchards & Kinner Kailash Views</h2>
    <p>Wake up to stunning views of the sacred Kinner Kailash peak. The ancient Hu-Bu-Lan-Kar monastery and traditional Kinnauri architecture make this a photographer's paradise.</p>

    <h2>6. Malana - The World's Oldest Democracy</h2>
    <p>This ancient village claims to have the world's oldest democracy, with unique customs and traditions that date back centuries. Note: Photography is restricted and visitors must follow strict guidelines.</p>

    <h2>7. Sangla Valley - The Valley of Eternal Peace</h2>
    <p>Often overlooked for Spiti, Sangla Valley offers similar beauty with fewer tourists. The Kamru Fort and traditional villages are worth exploring.</p>

    <h2>8. Shoja - Gateway to Jalori Pass</h2>
    <p>A tiny village with just a few guesthouses, Shoja offers stunning views, century-old deodar forests, and easy access to the historic Jalori Pass.</p>

    <h2>9. Bir Billing - Paragliding Paradise</h2>
    <p>While gaining popularity, Bir still maintains its laid-back vibe. Known as India's paragliding capital, it also offers great cafes, Tibetan monasteries, and tea gardens.</p>

    <h2>10. Gushaini - Riverside Serenity</h2>
    <p>Located in the Tirthan Valley, Gushaini is perfect for those seeking solitude. Fishing, nature walks, and riverside camping are the main attractions.</p>

    <h2>Travel Tips for Offbeat Himachal</h2>
    <ul>
      <li>Book accommodations in advance, especially during peak season</li>
      <li>Carry cash as ATMs are rare in remote areas</li>
      <li>Respect local customs and dress modestly</li>
      <li>Be prepared for unpredictable weather</li>
      <li>Support local businesses and homestays</li>
    </ul>

    <p>Each of these destinations offers a unique glimpse into the authentic Himalayan way of life. Whether you're seeking adventure, spirituality, or simply peace, Himachal's hidden gems have something special to offer.</p>
  `,
};

// Related posts
const relatedPosts = [
    {
        id: '2',
        title: 'Complete Guide to Backpacking in India Under ₹1000/Day',
        slug: 'backpacking-india-budget-guide',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80',
        category: 'Budget Travel',
        readTime: 12,
    },
    {
        id: '3',
        title: 'First-Time Trekker? Here\'s Your Complete Preparation Guide',
        slug: 'first-time-trekking-guide',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
        category: 'Adventure',
        readTime: 15,
    },
    {
        id: '4',
        title: 'Solo Female Travel in India: Safety Tips and Best Destinations',
        slug: 'solo-female-travel-india',
        image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400&q=80',
        category: 'Travel Tips',
        readTime: 11,
    },
];

export default function BlogPostPage() {
    const params = useParams();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            <Header />

            {/* Hero Image */}
            <div className="relative h-[50vh] md:h-[60vh]">
                <Image
                    src={blogPost.featuredImage}
                    alt={blogPost.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>

            <main className="max-w-4xl mx-auto px-4 -mt-32 relative z-10">
                {/* Article Card */}
                <article className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden mb-12 border border-gray-100 dark:border-gray-800">
                    {/* Header */}
                    <div className="p-6 md:p-10">
                        {/* Breadcrumb */}
                        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Link href="/blog" className="hover:text-[#FF6B35]">Blog</Link>
                            <span>/</span>
                            <Link href={`/blog?category=${blogPost.category}`} className="hover:text-[#FF6B35]">{blogPost.category}</Link>
                            <span>/</span>
                            <span className="text-gray-900 dark:text-gray-200 truncate max-w-[200px]">{blogPost.title}</span>
                        </div>

                        {/* Category & Meta */}
                        <Badge className="bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20 mb-4 hover:bg-[#FF6B35]/20">{blogPost.category}</Badge>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            {blogPost.title}
                        </h1>

                        {/* Author & Meta */}
                        <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12 border border-gray-200 dark:border-gray-700">
                                    <AvatarImage src={blogPost.author.avatar} />
                                    <AvatarFallback>{blogPost.author.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{blogPost.author.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {blogPost.author.followers.toLocaleString()} followers
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {blogPost.publishedAt}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {blogPost.readTime} min read
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                    <Heart className="w-5 h-5" />
                                    <span>{blogPost.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                    <span>{blogPost.comments}</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <Bookmark className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none py-8"
                            dangerouslySetInnerHTML={{ __html: blogPost.content }}
                        />

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <Tag className="w-4 h-4 text-gray-400" />
                            {blogPost.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="dark:bg-gray-800 dark:text-gray-300">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        {/* Share */}
                        <div className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Share:</span>
                            <Button variant="outline" size="icon" className="rounded-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                                <Facebook className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                                <Twitter className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                                <Linkedin className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                                <Link2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Author Bio */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-10 border-t border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">About the Author</h3>
                        <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16 border border-gray-200 dark:border-gray-700">
                                <AvatarImage src={blogPost.author.avatar} />
                                <AvatarFallback>{blogPost.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">{blogPost.author.name}</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{blogPost.author.bio}</p>
                                <Button size="sm" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">Follow</Button>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="p-6 md:p-10 border-t border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                            Comments ({blogPost.comments})
                        </h3>

                        <div className="mb-6">
                            <Textarea
                                placeholder="Write a comment..."
                                className="mb-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
                                rows={3}
                            />
                            <Button className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white">
                                Post Comment
                            </Button>
                        </div>

                        <p className="text-gray-500 dark:text-gray-500 text-center py-8">
                            Sign in to view and post comments
                        </p>
                    </div>
                </article>

                {/* Related Posts */}
                <section className="py-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`}>
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow group h-full dark:bg-gray-900 dark:border-gray-800">
                                    <div className="relative h-40">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <Badge className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-white">
                                            {post.category}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#FF6B35] transition-colors">
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            <Clock className="w-3 h-3" />
                                            {post.readTime} min read
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Back to Blog */}
                <div className="text-center pb-12">
                    <Link href="/blog">
                        <Button variant="outline" size="lg" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Button>
                    </Link>
                </div>
            </main>

            <Footer />

            {/* Prose styles */}
            <style jsx global>{`
        .prose p.lead {
          font-size: 1.25rem;
          color: #4b5563;
          line-height: 1.75;
        }
        .dark .prose p.lead {
          color: #9ca3af;
        }
        .prose h2 {
          color: #1f2937;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .dark .prose h2 {
          color: #f3f4f6;
        }
        .prose p {
          color: #4b5563;
          line-height: 1.75;
          margin-bottom: 1rem;
        }
        .dark .prose p {
          color: #9ca3af;
        }
        .prose ul {
          margin-left: 1.5rem;
          list-style-type: disc;
        }
        .dark .prose ul {
          color: #9ca3af;
        }
        .prose li {
          color: #4b5563;
          margin-bottom: 0.5rem;
        }
        .dark .prose li {
         color: #9ca3af;
        }
        .prose strong {
          color: #1f2937;
        }
        .dark .prose strong {
          color: #f3f4f6;
        }
      `}</style>
        </div>
    );
}
