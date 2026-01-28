'use client';

import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-32">
                <Breadcrumb
                    items={[
                        { label: 'Privacy Policy' }
                    ]}
                    className="mb-8"
                />

                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
                    <p className="text-gray-500 mb-8">Last updated: January 28, 2026</p>

                    <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600">
                        <p>
                            At Travellr, accessible from https://travellr.com, one of our main priorities is the privacy of our visitors.
                            This Privacy Policy document contains types of information that is collected and recorded by Travellr and how we use it.
                        </p>

                        <h2>Information We Collect</h2>
                        <p>
                            The personal information that you are asked to provide, and the reasons why you are asked to provide it,
                            will be made clear to you at the point we ask you to provide your personal information.
                        </p>
                        <ul>
                            <li><strong>Personal Identification Information:</strong> Name, email address, phone number, etc.</li>
                            <li><strong>Booking Information:</strong> Travel dates, destination preferences, identification documents for bookings.</li>
                            <li><strong>Payment Information:</strong> Credit card details (processed securely by our payment partners), billing address.</li>
                            <li><strong>Usage Data:</strong> Information on how you access and use the website.</li>
                        </ul>

                        <h2>How We Use Your Information</h2>
                        <p>We use the information we collect in various ways, including to:</p>
                        <ul>
                            <li>Provide, operate, and maintain our website</li>
                            <li>Improve, personalize, and expand our website</li>
                            <li>Understand and analyze how you use our website</li>
                            <li>Develop new products, services, features, and functionality</li>
                            <li>Communicate with you, either directly or through one of our partners</li>
                            <li>Process your transactions and manage your bookings</li>
                            <li>Send you emails regarding your bookings, updates, or promotional offers</li>
                            <li>Find and prevent fraud</li>
                        </ul>

                        <h2>Cookies and Web Beacons</h2>
                        <p>
                            Like any other website, Travellr uses 'cookies'. These cookies are used to store information including visitors' preferences,
                            and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience
                            by customizing our web page content based on visitors' browser type and/or other information.
                        </p>

                        <h2>Third Party Privacy Policies</h2>
                        <p>
                            Travellr's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective
                            Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions
                            about how to opt-out of certain options.
                        </p>

                        <h2>Data Protection Rights</h2>
                        <p>
                            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                        </p>
                        <ul>
                            <li>The right to access – You have the right to request copies of your personal data.</li>
                            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
                            <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
                            <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data.</li>
                            <li>The right to object to processing – You have the right to object to our processing of your personal data.</li>
                            <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you.</li>
                        </ul>

                        <h2>Contact Us</h2>
                        <p>
                            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at support@travellr.com.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
