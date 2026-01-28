'use client';

import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-32">
                <Breadcrumb
                    items={[
                        { label: 'Terms of Service' }
                    ]}
                    className="mb-8"
                />

                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
                    <p className="text-gray-500 mb-8">Last updated: January 28, 2026</p>

                    <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600">
                        <p>
                            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the
                            https://travellr.com website (the "Service") operated by Travellr ("us", "we", or "our").
                        </p>

                        <h2>1. Accounts</h2>
                        <p>
                            When you create an account with us, you must provide us information that is accurate, complete,
                            and current at all times. Failure to do so constitutes a breach of the Terms, which may result
                            in immediate termination of your account on our Service.
                        </p>
                        <p>
                            You are responsible for safeguarding the password that you use to access the Service and for any
                            activities or actions under your password, whether your password is with our Service or a third-party service.
                        </p>

                        <h2>2. Bookings and Payments</h2>
                        <p>
                            <strong>2.1 Bookings:</strong> By booking a trip through Travellr, you agree to the specific terms
                            and conditions of the vendor providing the service. We act as an intermediary platform.
                        </p>
                        <p>
                            <strong>2.2 Payments:</strong> You agree to pay all charges associated with your booking. We use
                            secure third-party payment processors. Your payment information is subject to their privacy policies.
                        </p>
                        <p>
                            <strong>2.3 Cancellations:</strong> Cancellation policies vary by trip and vendor. Please review
                            the specific cancellation policy provided at the time of booking.
                        </p>

                        <h2>3. User Content</h2>
                        <p>
                            Our Service allows you to post, link, store, share and otherwise make available certain information,
                            text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post
                            to the Service, including its legality, reliability, and appropriateness.
                        </p>

                        <h2>4. Intellectual Property</h2>
                        <p>
                            The Service and its original content (excluding Content provided by users), features and functionality
                            are and will remain the exclusive property of Travellr and its licensors.
                        </p>

                        <h2>5. Links To Other Web Sites</h2>
                        <p>
                            Our Service may contain links to third-party web sites or services that are not owned or controlled
                            by Travellr. We have no control over, and assume no responsibility for, the content, privacy policies,
                            or practices of any third-party web sites or services.
                        </p>

                        <h2>6. Termination</h2>
                        <p>
                            We may terminate or suspend access to our Service immediately, without prior notice or liability,
                            for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>

                        <h2>7. Limitation of Liability</h2>
                        <p>
                            In no event shall Travellr, nor its directors, employees, partners, agents, suppliers, or affiliates,
                            be liable for any indirect, incidental, special, consequential or punitive damages, including without
                            limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>

                        <h2>8. Governing Law</h2>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of India, without regard to
                            its conflict of law provisions.
                        </p>

                        <h2>9. Changes</h2>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
                            is material we will try to provide at least 30 days notice prior to any new terms taking effect.
                        </p>

                        <h2>Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at legal@travellr.com.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
