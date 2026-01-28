'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronDown,
    ChevronUp,
    Search,
    MessageCircle,
    Phone,
    Mail,
    HelpCircle,
    CreditCard,
    Calendar,
    Shield,
    Users,
    MapPin,
    FileText
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// FAQ categories
const faqCategories = [
    { id: 'booking', name: 'Booking & Reservations', icon: Calendar },
    { id: 'payment', name: 'Payments & Pricing', icon: CreditCard },
    { id: 'trip', name: 'Trip Details', icon: MapPin },
    { id: 'cancellation', name: 'Cancellations & Refunds', icon: FileText },
    { id: 'safety', name: 'Safety & Insurance', icon: Shield },
    { id: 'vendor', name: 'For Vendors', icon: Users },
];

// FAQs
const faqs = [
    {
        id: '1',
        category: 'booking',
        question: 'How do I book a trip on Travellr?',
        answer: 'Booking is simple! Browse our trips, select your preferred dates, choose your travelers, and proceed to checkout. You\'ll receive instant confirmation via email. You can also save trips to your wishlist and book later.',
    },
    {
        id: '2',
        category: 'booking',
        question: 'Can I book for a group?',
        answer: 'Absolutely! Most trips support group bookings. Simply select the number of travelers during checkout. For very large groups (10+), we recommend contacting the vendor directly for special arrangements and potential discounts.',
    },
    {
        id: '3',
        category: 'booking',
        question: 'Do I need to create an account to book?',
        answer: 'While you can browse trips without an account, you\'ll need to create one to complete a booking. This helps us send you important trip updates, booking confirmations, and manage your travel history.',
    },
    {
        id: '4',
        category: 'payment',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), net banking, and EMI options on select cards. All payments are processed securely through Razorpay.',
    },
    {
        id: '5',
        category: 'payment',
        question: 'Is there a booking fee?',
        answer: 'No, Travellr does not charge any booking fees. The price you see is the price you pay. Some payment methods may have their own processing fees.',
    },
    {
        id: '6',
        category: 'payment',
        question: 'Can I pay in installments?',
        answer: 'Yes! We offer EMI options on trips above ₹5,000. During checkout, select your preferred EMI plan. Options include 3, 6, 9, and 12-month installments on partner bank cards.',
    },
    {
        id: '7',
        category: 'trip',
        question: 'What\'s included in a typical trip?',
        answer: 'Each trip listing clearly shows what\'s included and excluded. Typically, inclusions cover accommodation, meals (as specified), activities, local transportation, and guide services. Exclusions usually include travel to/from the destination, personal expenses, and tips.',
    },
    {
        id: '8',
        category: 'trip',
        question: 'What should I pack for my trip?',
        answer: 'Packing depends on the destination and activities. After booking, you\'ll receive a detailed packing list tailored to your specific trip. Generally, we recommend comfortable clothes, appropriate footwear, and any personal medications.',
    },
    {
        id: '9',
        category: 'trip',
        question: 'Are trips suitable for beginners?',
        answer: 'Each trip has a difficulty level (Easy, Moderate, Challenging) clearly marked. Easy trips are perfect for beginners with no prior experience. Check the "Requirements" section on each trip page for specific fitness and skill requirements.',
    },
    {
        id: '10',
        category: 'cancellation',
        question: 'What is your cancellation policy?',
        answer: 'Cancellation policies vary by trip and vendor. Generally: Full refund if cancelled 15+ days before, 50% refund if cancelled 7-14 days before, and no refund for cancellations within 7 days. Check the specific trip page for exact policies.',
    },
    {
        id: '11',
        category: 'cancellation',
        question: 'Can I reschedule my trip?',
        answer: 'Yes, subject to availability and vendor policies. Rescheduling requests made 7+ days before departure are usually accommodated without extra charges. Contact us through your booking page to request a reschedule.',
    },
    {
        id: '12',
        category: 'cancellation',
        question: 'What happens if the trip is cancelled by the vendor?',
        answer: 'If a vendor cancels a trip, you\'ll receive a full refund within 5-7 business days. We\'ll also help you find alternative trips on similar dates. In case of weather-related cancellations, vendors typically offer reschedule options.',
    },
    {
        id: '13',
        category: 'safety',
        question: 'Are trips insured?',
        answer: 'Basic travel insurance is included with most trips. For adventure activities, additional adventure sports insurance is recommended. You can add comprehensive travel insurance during checkout for enhanced coverage.',
    },
    {
        id: '14',
        category: 'safety',
        question: 'How are vendors verified?',
        answer: 'All vendors undergo a rigorous verification process including license verification, safety inspections, background checks, and review of past customer feedback. Look for the "Verified Vendor" badge on trip listings.',
    },
    {
        id: '15',
        category: 'safety',
        question: 'What safety measures are in place?',
        answer: 'All trips include trained guides, first-aid kits, emergency communication devices (for remote areas), and adherence to local safety guidelines. Adventure activities include proper safety gear and certified instructors.',
    },
    {
        id: '16',
        category: 'vendor',
        question: 'How do I become a vendor on Travellr?',
        answer: 'Visit our Partner page and fill out the application form. Our team will review your application, verify your credentials, and guide you through the onboarding process. Once approved, you can start listing your trips.',
    },
    {
        id: '17',
        category: 'vendor',
        question: 'What are the commission rates for vendors?',
        answer: 'Commission rates vary based on category and volume. New vendors start at competitive industry-standard rates. High-performing vendors with excellent ratings can qualify for reduced commission rates.',
    },
    {
        id: '18',
        category: 'vendor',
        question: 'How do I manage my listings?',
        answer: 'Once approved, you\'ll get access to the Vendor Dashboard where you can create and manage trips, set pricing and availability, respond to inquiries, manage bookings, and track earnings.',
    },
];

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (id: string) => {
        setOpenItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Help Center
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-white/70 mb-8">
                            Find answers to common questions about booking, payments, and more
                        </p>

                        {/* Search */}
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search for questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 rounded-full text-lg"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            <main className="max-w-5xl mx-auto px-4 py-12">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <Button
                        variant={selectedCategory === null ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(null)}
                        className={selectedCategory === null ? 'bg-[#FF6B35] hover:bg-[#E55A2B]' : ''}
                    >
                        All Topics
                    </Button>
                    {faqCategories.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={selectedCategory === cat.id ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={selectedCategory === cat.id ? 'bg-[#FF6B35] hover:bg-[#E55A2B]' : ''}
                        >
                            <cat.icon className="w-4 h-4 mr-2" />
                            {cat.name}
                        </Button>
                    ))}
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {filteredFaqs.length === 0 ? (
                        <div className="text-center py-12">
                            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No questions found matching your search.</p>
                        </div>
                    ) : (
                        filteredFaqs.map((faq, index) => (
                            <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                            >
                                <Card className="overflow-hidden">
                                    <button
                                        onClick={() => toggleItem(faq.id)}
                                        className="w-full p-5 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1 pr-4">
                                            <Badge variant="secondary" className="mb-2 text-xs">
                                                {faqCategories.find(c => c.id === faq.category)?.name}
                                            </Badge>
                                            <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                                        </div>
                                        <div className="flex-shrink-0 mt-1">
                                            {openItems.includes(faq.id) ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                    </button>
                                    {openItems.includes(faq.id) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-5 pb-5"
                                        >
                                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Still Need Help */}
                <section className="mt-16">
                    <Card className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white">
                        <CardContent className="p-8 text-center">
                            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
                            <p className="text-white/80 mb-6 max-w-lg mx-auto">
                                Our support team is here to help you 24/7. Reach out through any of these channels.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Button className="bg-white text-[#FF6B35] hover:bg-gray-100">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Live Chat
                                </Button>
                                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                                    <Phone className="w-4 h-4 mr-2" />
                                    +91 1800 123 4567
                                </Button>
                                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                                    <Mail className="w-4 h-4 mr-2" />
                                    support@travellr.com
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>

            <Footer />
        </div>
    );
}
