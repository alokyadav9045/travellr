'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Home,
    Search,
    Heart,
    User,
    MapPin,
    Plus,
    Calendar,
    Compass
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Compass, label: 'Explore', href: '/trips' },
    { icon: MapPin, label: 'Destinations', href: '/destinations' },
    { icon: Heart, label: 'Saved', href: '/wishlist' },
    { icon: User, label: 'Profile', href: '/profile' },
];

export function BottomNavigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Hide on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Hide on auth pages
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
    if (authPages.some(page => pathname.startsWith(page))) {
        return null;
    }

    // Hide on vendor/admin pages
    if (pathname.startsWith('/vendor') || pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
                >
                    {/* Background with blur */}
                    <div className="bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-lg">
                        <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;

                                // Handle protected routes
                                const handleClick = (e: React.MouseEvent) => {
                                    if ((item.href === '/wishlist' || item.href === '/profile') && !isAuthenticated) {
                                        e.preventDefault();
                                        router.push('/login?redirect=' + item.href);
                                    }
                                };

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={handleClick}
                                        className={cn(
                                            'flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all min-w-[60px]',
                                            isActive
                                                ? 'text-[#FF6B35]'
                                                : 'text-gray-500 hover:text-gray-700'
                                        )}
                                    >
                                        <motion.div
                                            whileTap={{ scale: 0.9 }}
                                            className="relative"
                                        >
                                            <item.icon
                                                className={cn(
                                                    'w-6 h-6 transition-all',
                                                    isActive && 'stroke-[2.5px]'
                                                )}
                                            />
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF6B35] rounded-full"
                                                />
                                            )}
                                        </motion.div>
                                        <span className={cn(
                                            'text-xs mt-1 font-medium',
                                            isActive && 'font-semibold'
                                        )}>
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}

export default BottomNavigation;
