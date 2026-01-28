'use client';

import Link from 'next/link';
import {
    Home,
    MapPin,
    Compass,
    HelpCircle,
    FileText,
    Users,
    Shield,
    Briefcase
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const sitemapSections = [
    {
        title: 'Main Pages',
        icon: Home,
        links: [
            { name: 'Home', href: '/' },
            { name: 'Explore Trips', href: '/trips' },
            { name: 'Destinations', href: '/destinations' },
            { name: 'Categories', href: '/categories' },
            { name: 'Community', href: '/community' },
            { name: 'Blog', href: '/blog' },
            { name: 'About Us', href: '/about' },
            { name: 'Contact', href: '/contact' },
        ],
    },
    {
        title: 'Trip Categories',
        icon: Compass,
        links: [
            { name: 'Adventure', href: '/trips?category=adventure' },
            { name: 'Beach & Water', href: '/trips?category=beach' },
            { name: 'Nature & Wildlife', href: '/trips?category=nature' },
            { name: 'Camping', href: '/trips?category=camping' },
            { name: 'Wellness & Yoga', href: '/trips?category=wellness' },
            { name: 'Photography', href: '/trips?category=photography' },
            { name: 'Biking', href: '/trips?category=biking' },
            { name: 'Culinary', href: '/trips?category=culinary' },
        ],
    },
    {
        title: 'Support & Help',
        icon: HelpCircle,
        links: [
            { name: 'Help Center', href: '/faq' },
            { name: 'FAQs', href: '/faq' },
            { name: 'Contact Support', href: '/contact' },
            { name: 'Partner With Us', href: '/partner' },
        ],
    },
    {
        title: 'Legal',
        icon: Shield,
        links: [
            { name: 'Privacy Policy', href: '/privacy-policy' },
            { name: 'Terms of Service', href: '/terms-of-service' },
            { name: 'Cookie Policy', href: '/cookie-policy' },
        ],
    },
    {
        title: 'User Account',
        icon: Users,
        links: [
            { name: 'Login', href: '/login' },
            { name: 'Register', href: '/register' },
            { name: 'My Profile', href: '/profile' },
            { name: 'My Bookings', href: '/dashboard' },
            { name: 'Wishlist', href: '/wishlist' },
        ],
    },
    {
        title: 'Partners',
        icon: Briefcase,
        links: [
            { name: 'Partner Program', href: '/partner' },
            { name: 'Vendor Login', href: '/vendor/dashboard' },
            { name: 'Success Stories', href: '/partner#stories' },
        ],
    },
];

export default function SitemapPage() {
    const popularDestinations = [
        'Manali', 'Goa', 'Ladakh', 'Kerala', 'Rishikesh',
        'Jaipur', 'Udaipur', 'Varanasi', 'Coorg', 'Ooty'
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-32">
                <Breadcrumb
                    items={[
                        { label: 'Sitemap' }
                    ]}
                    className="mb-8"
                />

                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sitemap</h1>
                    <p className="text-gray-500">Overview of all pages on Travellr</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sitemapSections.map((section) => (
                        <Card key={section.title} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                                    <section.icon className="w-5 h-5 text-[#FF6B35]" />
                                </div>
                                <CardTitle className="text-xl">{section.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-gray-600 hover:text-[#FF6B35] transition-colors block py-1"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Special Destinations Section */}
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-[#FF6B35]" />
                            </div>
                            <CardTitle className="text-xl">Popular Destinations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                                {popularDestinations.map((dest) => (
                                    <Link
                                        key={dest}
                                        href={`/destinations/${dest.toLowerCase()}`}
                                        className="text-gray-600 hover:text-[#FF6B35] transition-colors py-1"
                                    >
                                        {dest}
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Link
                                    href="/destinations"
                                    className="text-[#FF6B35] font-medium hover:underline text-sm"
                                >
                                    View All Destinations &rarr;
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
