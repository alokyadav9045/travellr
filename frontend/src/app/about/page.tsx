'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Users,
    Target,
    Heart,
    Shield,
    Globe,
    Award,
    Star,
    MapPin,
    ChevronRight,
    Mail,
    Linkedin,
    Twitter,
    Check
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Team members
const teamMembers = [
    {
        name: 'Alok Sharma',
        role: 'Founder & CEO',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
        bio: 'Former adventure guide with 10+ years of experience. Passionate about making travel accessible to everyone.',
        linkedin: '#',
        twitter: '#',
    },
    {
        name: 'Priya Nair',
        role: 'Co-founder & COO',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
        bio: 'Travel enthusiast who has visited 40+ countries. Expertise in operations and customer experience.',
        linkedin: '#',
        twitter: '#',
    },
    {
        name: 'Rahul Mehta',
        role: 'CTO',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
        bio: 'Tech veteran with experience at leading startups. Building technology that simplifies travel planning.',
        linkedin: '#',
        twitter: '#',
    },
    {
        name: 'Ananya Desai',
        role: 'Head of Partnerships',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
        bio: 'Previously at top travel OTAs. Building India\'s largest network of verified travel vendors.',
        linkedin: '#',
        twitter: '#',
    },
];

// Values
const values = [
    {
        icon: Heart,
        title: 'Passion for Travel',
        description: 'We believe travel transforms lives. Every trip is an opportunity for growth and discovery.',
    },
    {
        icon: Shield,
        title: 'Trust & Safety',
        description: 'Verified vendors, secure payments, and 24/7 support to ensure worry-free travel.',
    },
    {
        icon: Users,
        title: 'Community First',
        description: 'Building connections between travelers and celebrating shared experiences.',
    },
    {
        icon: Globe,
        title: 'Responsible Tourism',
        description: 'Supporting local communities and promoting sustainable travel practices.',
    },
];

// Stats
const stats = [
    { value: '50,000+', label: 'Happy Travelers' },
    { value: '500+', label: 'Curated Trips' },
    { value: '200+', label: 'Verified Vendors' },
    { value: '100+', label: 'Destinations' },
];

// Timeline/milestones
const milestones = [
    { year: '2022', title: 'Founded', description: 'Started with a vision to transform travel experiences in India' },
    { year: '2023', title: 'First 100 Vendors', description: 'Built partnerships with verified travel operators across India' },
    { year: '2024', title: 'Community Launch', description: 'Launched our traveler community with 10,000+ members' },
    { year: '2025', title: '50K Travelers', description: 'Crossed 50,000 happy travelers with 4.8★ average rating' },
    { year: '2026', title: 'Expansion', description: 'Expanding to Southeast Asia and international destinations' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative py-32 bg-gradient-to-br from-[#2D3436] via-[#636E72] to-[#2D3436] overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF6B35]/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="bg-white/10 text-white border-white/20 mb-6">
                            Our Story
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Making Travel
                            <span className="text-[#FF6B35] block mt-2">Unforgettable</span>
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            We're on a mission to connect travelers with authentic experiences curated by local experts who know their destinations best.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-[#FF6B35] mb-1">{stat.value}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Badge className="bg-[#FF6B35]/10 text-[#FF6B35] mb-4">Our Story</Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Born from a Love of Exploration
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Travellr was born in 2022 when our founder, Alok, realized that finding authentic,
                                    well-organized trips in India was harder than it should be. Too many travelers were
                                    either overpaying for generic tours or struggling to plan everything themselves.
                                </p>
                                <p>
                                    We set out to build a platform that connects travelers directly with passionate local
                                    operators who truly understand their destinations. Every vendor on our platform is
                                    verified, every trip is curated, and every experience is designed to create lasting memories.
                                </p>
                                <p>
                                    Today, we're proud to have helped over 50,000 travelers discover incredible experiences
                                    across India, from Himalayan treks to Kerala backwaters, from desert safaris to yoga retreats.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="relative h-48 rounded-2xl overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80"
                                            alt="Mountains"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="relative h-64 rounded-2xl overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80"
                                            alt="Backwaters"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 mt-8">
                                    <div className="relative h-64 rounded-2xl overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80"
                                            alt="Beach"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="relative h-48 rounded-2xl overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?w=400&q=80"
                                            alt="Ladakh"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="bg-[#FF6B35]/10 text-[#FF6B35] mb-4">Our Values</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What We Stand For
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="w-14 h-14 bg-[#FF6B35]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <value.icon className="w-7 h-7 text-[#FF6B35]" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                                        <p className="text-gray-600 text-sm">{value.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="bg-[#FF6B35]/10 text-[#FF6B35] mb-4">Our Journey</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Milestones</h2>
                    </div>

                    <div className="relative">
                        {/* Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />

                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={milestone.year}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                                        }`}
                                >
                                    <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                        <span className="text-[#FF6B35] font-bold text-xl">{milestone.year}</span>
                                        <h3 className="text-lg font-bold text-gray-900">{milestone.title}</h3>
                                        <p className="text-gray-600 text-sm">{milestone.description}</p>
                                    </div>
                                    <div className="w-4 h-4 bg-[#FF6B35] rounded-full border-4 border-white shadow z-10" />
                                    <div className="flex-1" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="bg-[#FF6B35]/10 text-[#FF6B35] mb-4">Our Team</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Meet the Travelers Behind Travellr
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We're a team of passionate travelers building the future of travel experiences
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative h-64">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-5 text-center">
                                        <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                                        <p className="text-[#FF6B35] text-sm mb-3">{member.role}</p>
                                        <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                                        <div className="flex justify-center gap-3">
                                            <a href={member.linkedin} className="text-gray-400 hover:text-blue-600">
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                            <a href={member.twitter} className="text-gray-400 hover:text-blue-400">
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B]">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-white/80 text-lg mb-8">
                        Join 50,000+ travelers who have discovered amazing experiences with Travellr
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/trips">
                            <Button size="lg" className="bg-white text-[#FF6B35] hover:bg-gray-100">
                                Explore Trips
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/partner">
                            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                                Become a Partner
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
