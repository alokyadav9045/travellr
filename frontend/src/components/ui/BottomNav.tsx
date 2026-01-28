'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Compass,
  Heart,
  MessageSquare,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  LayoutDashboard,
  HelpCircle,
  Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils/cn';
import { Button } from './button';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const publicNavItems: NavItem[] = [
  { name: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
  { name: 'Explore', href: '/trips', icon: <Compass className="w-5 h-5" /> },
  { name: 'Wishlist', href: '/wishlist', icon: <Heart className="w-5 h-5" /> },
];

const authenticatedNavItems: NavItem[] = [
  { name: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
  { name: 'Trips', href: '/trips', icon: <Compass className="w-5 h-5" /> },
  { name: 'Wishlist', href: '/wishlist', icon: <Heart className="w-5 h-5" /> },
  { name: 'Messages', href: '/messages', icon: <MessageSquare className="w-5 h-5" /> },
  { name: 'Profile', href: '/profile', icon: <User className="w-5 h-5" /> },
];

const vendorNavItems: NavItem[] = [
  { name: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
  { name: 'Dashboard', href: '/vendor/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'My Trips', href: '/vendor/trips', icon: <Compass className="w-5 h-5" /> },
  { name: 'Messages', href: '/messages', icon: <MessageSquare className="w-5 h-5" /> },
  { name: 'Profile', href: '/profile', icon: <User className="w-5 h-5" /> },
];

interface BottomNavProps {
  showOnDesktop?: boolean;
}

export function BottomNav({ showOnDesktop = false }: BottomNavProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine which nav items to show
  const navItems = isAuthenticated && user?.role === 'vendor' 
    ? vendorNavItems 
    : isAuthenticated 
    ? authenticatedNavItems 
    : publicNavItems;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push('/');
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation - Always visible on mobile */}
      <nav className={cn(
        'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40',
        'lg:hidden'
      )}>
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="flex flex-col items-center justify-center w-full h-full group relative"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'flex flex-col items-center gap-1 text-xs font-medium',
                    isActive ? 'text-[#FF6B35]' : 'text-gray-600 group-hover:text-gray-900'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-lg transition-colors',
                    isActive ? 'bg-orange-100' : 'group-hover:bg-gray-100'
                  )}>
                    {item.icon}
                  </div>
                  <span className="text-xs">{item.name}</span>
                </motion.div>
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B35] to-orange-500"
                  />
                )}
              </Link>
            );
          })}

          {/* Menu toggle button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-900 p-2 relative"
          >
            <div className="p-2 rounded-lg hover:bg-gray-100">
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </div>
            <span className="text-xs">Menu</span>
          </button>
        </div>

        {/* Mobile Menu - Slides up from bottom */}
        {isMenuOpen && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            className="absolute bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {isAuthenticated && (
                <>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg mb-3">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={handleNavClick}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium">Profile Settings</span>
                  </Link>

                  {user?.role === 'vendor' && (
                    <>
                      <Link
                        href="/vendor/dashboard"
                        onClick={handleNavClick}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <LayoutDashboard className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium">Vendor Dashboard</span>
                      </Link>
                      <Link
                        href="/vendor/settings"
                        onClick={handleNavClick}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium">Vendor Settings</span>
                      </Link>
                    </>
                  )}

                  <Link
                    href="/notifications"
                    onClick={handleNavClick}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium">Notifications</span>
                  </Link>

                  <div className="border-t border-gray-200 my-2" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <div className="space-y-2">
                  <Link href="/login" onClick={handleNavClick}>
                    <Button variant="default" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={handleNavClick}>
                    <Button variant="outline" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}

              <div className="border-t border-gray-200 my-2" />

              <Link
                href="/help"
                onClick={handleNavClick}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Help & Support</span>
              </Link>

              <Link
                href="/about"
                onClick={handleNavClick}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium">About Us</span>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Desktop Navigation - Optional, controlled by showOnDesktop */}
      {showOnDesktop && (
        <nav className="hidden lg:flex fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 z-40 px-2 py-2">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all',
                    isActive 
                      ? 'bg-[#FF6B35] text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {item.icon}
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
