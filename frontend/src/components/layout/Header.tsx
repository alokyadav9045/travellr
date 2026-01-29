'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Search, Heart, User, Bell, ChevronDown,
  MapPin, Calendar, LogOut, Settings, LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils/cn';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const navigation = [
  { name: 'Explore', href: '/trips' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Blog', href: '/blog' },
  { name: 'Partner', href: '/partner' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = pathname === '/';
  const headerBg = isHomePage && !isScrolled
    ? 'bg-transparent'
    : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800';

  const textColor = isHomePage && !isScrolled
    ? 'text-white'
    : 'text-gray-900 dark:text-gray-100';

  const logoColor = isHomePage && !isScrolled
    ? 'text-white'
    : 'text-[#F15A24]';

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      headerBg
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className={cn(
              'text-2xl lg:text-3xl font-bold tracking-tight transition-colors',
              logoColor
            )}>
              Travellr
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-[#FF6B35]',
                  textColor,
                  pathname === item.href && 'text-[#FF6B35]'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className={cn('hover:bg-white/10', textColor)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <>
                <Link href="/wishlist">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('hover:bg-white/10 relative', textColor)}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className={cn('hover:bg-white/10 relative', textColor)}
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                      3
                    </span>
                  </Button>

                  <AnimatePresence>
                    {isNotificationOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                          <Link href="/notifications" className="text-xs text-[#FF6B35] hover:underline" onClick={() => setIsNotificationOpen(false)}>
                            View all
                          </Link>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {[
                            { id: 1, title: 'Booking Confirmed!', desc: 'Your trip to Manali is confirmed.', time: '2h ago', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                            { id: 2, title: 'New Message', desc: 'Vendor replied to your query.', time: '5h ago', icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { id: 3, title: 'Trip Reminder', desc: 'Your flight leaves in 24 hours.', time: '1d ago', icon: MapPin, color: 'text-[#FF6B35]', bg: 'bg-[#FF6B35]/10' },
                          ].map(notif => (
                            <div key={notif.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0">
                              <div className="flex gap-4">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", notif.bg)}>
                                  <notif.icon className={cn("w-5 h-5", notif.color)} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{notif.title}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{notif.desc}</p>
                                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">{notif.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(!isUserMenuOpen);
                      setIsNotificationOpen(false);
                    }}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-full transition-colors',
                      isHomePage && !isScrolled
                        ? 'hover:bg-white/10'
                        : 'hover:bg-gray-100'
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className={cn('h-4 w-4', textColor)} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>

                        <div className="py-2">
                          {user?.role === 'vendor' && (
                            <Link
                              href="/vendor/dashboard"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <LayoutDashboard className="h-4 w-4 mr-3" />
                              Vendor Dashboard
                            </Link>
                          )}
                          {user?.role === 'admin' && (
                            <Link
                              href="/admin/dashboard"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <LayoutDashboard className="h-4 w-4 mr-3" />
                              Admin Panel
                            </Link>
                          )}
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <User className="h-4 w-4 mr-3" />
                            My Profile
                          </Link>
                          <Link
                            href="/bookings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <Calendar className="h-4 w-4 mr-3" />
                            My Bookings
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <Settings className="h-4 w-4 mr-3" />
                            Settings
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className={cn(textColor)}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn('lg:hidden p-2', textColor)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
          >
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-[#FF6B35]"
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-base font-medium text-gray-900 dark:text-gray-100"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/bookings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-base font-medium text-gray-900 dark:text-gray-100"
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block py-2 text-base font-medium text-red-600 dark:text-red-400"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full dark:border-gray-700 dark:text-white dark:hover:bg-gray-800">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
