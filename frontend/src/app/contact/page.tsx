'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    Clock,
    Send,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    HeadphonesIcon
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { contactApi } from '@/lib/api/contact';

// Contact options
const contactOptions = [
    {
        icon: Phone,
        // ... (omitting lines for brevity in match if possible, but replace_file_content needs exact match or smartness. I'll stick to a smaller context if possible)
        // Wait, I can't use smaller context if I am replacing a block.
        // I'll replace just import line and just usage line using multi_replace_file_content or separate replace calls.
        // Using replace_file_content for imports first.

        title: 'Call Us',
        description: 'Speak with our travel experts',
        info: '+91 1800 123 4567',
        subInfo: 'Toll-free, 24/7',
        color: 'bg-green-100 text-green-600',
    },
    {
        icon: Mail,
        title: 'Email Us',
        description: 'Send us your queries',
        info: 'support@travellr.com',
        subInfo: 'Response within 24 hours',
        color: 'bg-blue-100 text-blue-600',
    },
    {
        icon: MessageCircle,
        title: 'Live Chat',
        description: 'Chat with our support',
        info: 'Start a conversation',
        subInfo: 'Available 24/7',
        color: 'bg-purple-100 text-purple-600',
    },
    {
        icon: HeadphonesIcon,
        title: 'WhatsApp',
        description: 'Message us on WhatsApp',
        info: '+91 98765 43210',
        subInfo: 'Quick responses',
        color: 'bg-emerald-100 text-emerald-600',
    },
];

// Office locations
const offices = [
    {
        city: 'Delhi (HQ)',
        address: '123 Connaught Place, New Delhi - 110001',
        phone: '+91 11 4567 8901',
        email: 'delhi@travellr.com',
    },
    {
        city: 'Mumbai',
        address: '456 Bandra West, Mumbai - 400050',
        phone: '+91 22 3456 7890',
        email: 'mumbai@travellr.com',
    },
    {
        city: 'Bangalore',
        address: '789 Indiranagar, Bangalore - 560038',
        phone: '+91 80 2345 6789',
        email: 'bangalore@travellr.com',
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await contactApi.submitContact(formData);
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#2D3436] via-[#636E72] to-[#2D3436] pt-32 pb-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Badge className="bg-white/10 text-white border-white/20 mb-4">
                            <Mail className="w-4 h-4 mr-2" />
                            Get In Touch
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Contact Us
                        </h1>
                        <p className="text-xl text-white/70">
                            Have questions? We're here to help you plan your perfect trip
                        </p>
                    </motion.div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 py-12">
                {/* Contact Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactOptions.map((option, index) => (
                        <motion.div
                            key={option.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="text-center hover:shadow-lg transition-shadow h-full">
                                <CardContent className="p-6">
                                    <div className={`w-14 h-14 ${option.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                        <option.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">{option.title}</h3>
                                    <p className="text-gray-500 text-sm mb-3">{option.description}</p>
                                    <p className="font-semibold text-gray-900">{option.info}</p>
                                    <p className="text-xs text-gray-400">{option.subInfo}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                                <p className="text-gray-600 mb-8">
                                    Fill out the form below and we'll get back to you within 24 hours
                                </p>

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
                                                placeholder="Your name"
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
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <Input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Subject *
                                            </label>
                                            <Select
                                                value={formData.subject}
                                                onValueChange={(value) => setFormData({ ...formData, subject: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a subject" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="booking">Booking Inquiry</SelectItem>
                                                    <SelectItem value="support">Customer Support</SelectItem>
                                                    <SelectItem value="feedback">Feedback</SelectItem>
                                                    <SelectItem value="partnership">Partnership</SelectItem>
                                                    <SelectItem value="press">Press/Media</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <Textarea
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Tell us how we can help..."
                                            rows={5}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full bg-[#FF6B35] hover:bg-[#E55A2B]"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            'Sending...'
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Office Locations */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-[#FF6B35]" />
                                    Our Offices
                                </h3>
                                <div className="space-y-6">
                                    {offices.map((office) => (
                                        <div key={office.city} className="pb-4 border-b last:border-0 last:pb-0">
                                            <h4 className="font-semibold text-gray-900 mb-2">{office.city}</h4>
                                            <p className="text-gray-600 text-sm mb-2">{office.address}</p>
                                            <p className="text-gray-500 text-sm">{office.phone}</p>
                                            <p className="text-gray-500 text-sm">{office.email}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business Hours */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[#FF6B35]" />
                                    Business Hours
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Monday - Friday</span>
                                        <span className="text-gray-900 font-medium">9:00 AM - 8:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Saturday</span>
                                        <span className="text-gray-900 font-medium">10:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sunday</span>
                                        <span className="text-gray-900 font-medium">10:00 AM - 4:00 PM</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-4">
                                    * Customer support available 24/7
                                </p>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
                                <div className="flex gap-3">
                                    <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#FF6B35] hover:text-white transition-colors">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#FF6B35] hover:text-white transition-colors">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#FF6B35] hover:text-white transition-colors">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#FF6B35] hover:text-white transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#FF6B35] hover:text-white transition-colors">
                                        <Youtube className="w-5 h-5" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Map Section */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Find Us</h2>
                    <div className="bg-gray-200 rounded-2xl h-[400px] flex items-center justify-center">
                        <p className="text-gray-500">
                            Interactive map would be displayed here (Google Maps integration)
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
