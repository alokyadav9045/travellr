'use client';

import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-32">
                <Breadcrumb
                    items={[
                        { label: 'Cookie Policy' }
                    ]}
                    className="mb-8"
                />

                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
                    <p className="text-gray-500 mb-8">Last updated: January 28, 2026</p>

                    <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600">
                        <p>
                            This Cookie Policy explains how Travellr ("we", "us", and "our") uses cookies and similar technologies
                            to recognize you when you visit our website at https://travellr.com. It explains what these technologies are
                            and why we use them, as well as your rights to control our use of them.
                        </p>

                        <h2>What are cookies?</h2>
                        <p>
                            Cookies are small data files that are placed on your computer or mobile device when you visit a website.
                            Cookies are widely used by website owners in order to make their websites work, or to work more efficiently,
                            as well as to provide reporting information.
                        </p>

                        <h2>Why do we use cookies?</h2>
                        <p>
                            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons
                            in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies.
                            Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.
                        </p>

                        <h2>Types of Cookies We Use</h2>

                        <div className="not-prose my-8">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Essential Cookies</TableCell>
                                        <TableCell>
                                            These are strictly necessary to provide you with services available through our Website and to use
                                            some of its features, such as access to secure areas.
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Performance Cookies</TableCell>
                                        <TableCell>
                                            These cookies collect information that is used either in aggregate form to help us understand how
                                            our Website is being used or how effective our marketing campaigns are.
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Functionality Cookies</TableCell>
                                        <TableCell>
                                            These are used to enhance the performance and functionality of our Website but are non-essential
                                            to their use.
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Targeting Cookies</TableCell>
                                        <TableCell>
                                            These cookies function to serve ads that are relevant to your interests and to share information
                                            with advertisers so that ads you see are more relevant to you.
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        <h2>How can I control cookies?</h2>
                        <p>
                            You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls
                            to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access
                            to some functionality and areas of our website may be restricted.
                        </p>

                        <h2>Updates to this policy</h2>
                        <p>
                            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies
                            we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy
                            regularly to stay informed about our use of cookies and related technologies.
                        </p>

                        <h2>Contact Us</h2>
                        <p>
                            If you have any questions about our use of cookies or other technologies, please email us at privacy@travellr.com.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
