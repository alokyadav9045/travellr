'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
    Building,
    Users,
    TrendingUp,
    Globe,
    Check,
    ArrowRight,
    Star,
    HandshakeIcon,
    Briefcase,
    Camera,
    Music,
    Send,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';

// Partnership types
const partnershipTypes = [
    {
        id: 'franchise',
        title: 'Open a Franchise',
        icon: Building,
        description: 'Start your own Travellr partner property in your destination',
        benefits: [
            'Established brand presence',
            'Marketing & technology support',
            'Training & operations guidance',
            'Revenue sharing model',
        ],
        color: 'from-[#FF6B35] to-[#E55A2B]',
    },
    {
        id: 'agency',
        title: 'Travel Agencies',
        icon: Briefcase,
        description: 'Partner with us to offer your tours on our platform',
        benefits: [
            'Access to millions of travelers',
            'Easy booking management',
            'Secure payment processing',
            'Marketing exposure',
        ],
        color: 'from-blue-500 to-blue-600',
    },
    {
        id: 'creator',
        title: 'Content Creators',
        icon: Camera,
        description: 'Create content, inspire travelers, and earn rewards',
        benefits: [
            'Free stays & trips',
            'Monetization opportunities',
            'Growing creator community',
            'Brand collaborations',
        ],
        color: 'from-purple-500 to-purple-600',
    },
    {
        id: 'artist',
        title: 'Artists & Performers',
        icon: Music,
        description: 'Perform at our properties and events across India',
        benefits: [
            'Regular performance slots',
            'Growing audience reach',
            'Network with travelers',
            'Performance fees',
        ],
        color: 'from-pink-500 to-pink-600',
    },
];

// Success metrics
const metrics = [
    { value: '100+', label: 'Partner Properties' },
    { value: '500+', label: 'Travel Agencies' },
    { value: '1000+', label: 'Creators' },
    { value: '₹50Cr+', label: 'Partner Revenue' },
];

// Testimonials
const testimonials = [
    {
        name: 'Rajesh Kumar',
        role: 'Franchise Owner, Manali',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        quote: 'Partnering with Travellr transformed my guesthouse into a thriving business. Their support is exceptional!',
        rating: 5,
    },
    {
        name: 'Priya Travels',
        role: 'Travel Agency, Delhi',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        quote: 'We\'ve seen 3x growth in bookings since listing our tours on Travellr. Amazing platform!',
        rating: 5,
    },
    {
        name: 'Wandering Souls',
        role: 'Content Creator',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        quote: 'Being a Travellr creator opened doors to incredible destinations and collaborations.',
        rating: 5,
    },
];

export default function PartnerPage() {
    const [selectedType, setSelectedType] = useState('franchise');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        location: '',
        partnerType: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success('Thank you for your interest! Our team will contact you within 24 hours.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            location: '',
            partnerType: '',
            message: '',
        });
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#2D3436] via-[#636E72] to-[#2D3436] pt-20">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF6B35]/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="bg-white/10 text-white border-white/20 mb-6">
                            <HandshakeIcon className="w-4 h-4 mr-2" />
                            Partner With Travellr
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Grow Your Business With
                            <span className="text-[#FF6B35] block mt-2">India's Leading Travel Platform</span>
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                            Join our ecosystem of partners and reach millions of travelers. From franchises to creators,
                            there's a partnership model for everyone.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white rounded-full">
                                Become a Partner
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 rounded-full">
                                Learn More
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Metrics */}
            <section className="py-12 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {metrics.map((metric, index) => (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-[#FF6B35] mb-1">{metric.value}</div>
                                <div className="text-gray-600">{metric.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partnership Types */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                        >
                            Choose Your Partnership Model
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-600 max-w-2xl mx-auto"
                        >
                            Multiple ways to partner with us and grow together
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {partnershipTypes.map((type, index) => (
                            <motion.div
                                key={type.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    className={`h-full cursor-pointer transition-all hover:shadow-xl ${selectedType === type.id ? 'ring-2 ring-[#FF6B35]' : ''
                                        }`}
                                    onClick={() => setSelectedType(type.id)}
                                >
                                    <CardContent className="p-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${type.color} flex items-center justify-center mb-4`}>
                                            <type.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                                        <ul className="space-y-2">
                                            {type.benefits.map((benefit, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Our Partners Say
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-1 mb-4">
                                            {Array(testimonial.rating).fill(0).map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                                <Image
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                                <p className="text-sm text-gray-500">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Get Started Today
                        </h2>
                        <p className="text-gray-600">
                            Fill out the form below and our partnership team will reach out within 24 hours
                        </p>
                    </div>

                    <Card>
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <Input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <Input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <Input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company/Business Name
                                        </label>
                                        <Input
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            placeholder="Your company name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location
                                        </label>
                                        <Input
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="City, State"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Partnership Type *
                                        </label>
                                        <Select
                                            value={formData.partnerType}
                                            onValueChange={(value) => setFormData({ ...formData, partnerType: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select partnership type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="franchise">Franchise Partner</SelectItem>
                                                <SelectItem value="agency">Travel Agency</SelectItem>
                                                <SelectItem value="creator">Content Creator</SelectItem>
                                                <SelectItem value="artist">Artist/Performer</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tell us about your interest
                                    </label>
                                    <Textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Share more about your business and why you want to partner with us..."
                                        rows={4}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-[#FF6B35] hover:bg-[#E55A2B]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        'Submitting...'
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Submit Partnership Request
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mb-3">
                                <Mail className="w-6 h-6 text-[#FF6B35]" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Email Us</h4>
                            <p className="text-gray-600">partners@travellr.com</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mb-3">
                                <Phone className="w-6 h-6 text-[#FF6B35]" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Call Us</h4>
                            <p className="text-gray-600">+91 1800 123 4567</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mb-3">
                                <MapPin className="w-6 h-6 text-[#FF6B35]" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Visit Us</h4>
                            <p className="text-gray-600">Delhi, Mumbai, Bangalore</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
