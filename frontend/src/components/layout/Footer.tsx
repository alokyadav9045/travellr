'use client';

import React from 'react';
import Link from 'next/link';
import {
  Facebook, Twitter, Instagram, Youtube, Mail,
  Phone, MapPin, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerLinks = {
  explore: [
    { name: 'All Trips', href: '/trips' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Categories', href: '/categories' },
    { name: 'Community', href: '/community' },
    { name: 'Last Minute Deals', href: '/trips?deals=true' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Partner With Us', href: '/partner' },
    { name: 'Careers', href: '/about#careers' },
    { name: 'Press', href: '/about#press' },
  ],
  support: [
    { name: 'Help Center', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Cancellation Policy', href: '/faq#cancellation' },
    { name: 'Safety', href: '/faq#safety' },
  ],
  vendors: [
    { name: 'Become a Partner', href: '/partner' },
    { name: 'Vendor Login', href: '/vendor/dashboard' },
    { name: 'List Your Trip', href: '/vendor/trips/create' },
    { name: 'Vendor Dashboard', href: '/vendor/dashboard' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/travellr' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/travellr' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/travellr' },
  { name: 'Youtube', icon: Youtube, href: 'https://youtube.com/travellr' },
];

export function Footer() {
  const [email, setEmail] = React.useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-[#FF6B35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white">
                Subscribe to our newsletter
              </h3>
              <p className="text-white/80 mt-1">
                Get exclusive deals and travel inspiration delivered to your inbox
              </p>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full md:w-auto gap-3"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full md:w-80 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                required
              />
              <Button
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 text-white shrink-0"
              >
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-[#FF6B35]">Travellr</span>
            </Link>
            <p className="mt-4 text-gray-400 max-w-xs">
              Discover unique travel experiences curated by local experts around the world.
              Your next adventure awaits.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-3 text-[#FF6B35]" />
                <a href="mailto:support@travellr.com" className="hover:text-white transition">
                  support@travellr.com
                </a>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-3 text-[#FF6B35]" />
                <a href="tel:+1234567890" className="hover:text-white transition">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-start text-gray-400">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-[#FF6B35]" />
                <span>
                  123 Travel Street<br />
                  Adventure City, AC 12345
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#FF6B35] hover:text-white transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Support
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendor Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              For Vendors
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.vendors.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Travellr. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/privacy-policy"
                className="text-gray-400 text-sm hover:text-white transition"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-400 text-sm hover:text-white transition"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookie-policy"
                className="text-gray-400 text-sm hover:text-white transition"
              >
                Cookie Policy
              </Link>
              <Link
                href="/sitemap"
                className="text-gray-400 text-sm hover:text-white transition"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
