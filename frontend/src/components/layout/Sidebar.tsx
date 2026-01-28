'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Map, Calendar, Users, DollarSign, 
  Star, Settings, HelpCircle, MessageSquare, BarChart3,
  FileText, Bell, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  type: 'vendor' | 'admin';
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const vendorNavItems = [
  { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
  { name: 'My Trips', href: '/vendor/trips', icon: Map },
  { name: 'Bookings', href: '/vendor/bookings', icon: Calendar },
  { name: 'Customers', href: '/vendor/customers', icon: Users },
  { name: 'Earnings', href: '/vendor/earnings', icon: DollarSign },
  { name: 'Reviews', href: '/vendor/reviews', icon: Star },
  { name: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
  { name: 'Messages', href: '/vendor/messages', icon: MessageSquare },
  { name: 'Documents', href: '/vendor/documents', icon: FileText },
  { name: 'Settings', href: '/vendor/settings', icon: Settings },
];

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Vendors', href: '/admin/vendors', icon: Map },
  { name: 'Trips', href: '/admin/trips', icon: Calendar },
  { name: 'Bookings', href: '/admin/bookings', icon: FileText },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Payouts', href: '/admin/payouts', icon: DollarSign },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar({ type, isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const navItems = type === 'vendor' ? vendorNavItems : adminNavItems;
  const dashboardTitle = type === 'vendor' ? 'Vendor Portal' : 'Admin Panel';

  return (
    <aside 
      className={cn(
        'fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-40',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-[#FF6B35]">Travellr</span>
            </Link>
          )}
          <button
            onClick={onToggle}
            className={cn(
              'p-2 rounded-lg hover:bg-gray-800 transition-colors',
              isCollapsed && 'mx-auto'
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Dashboard Title */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {dashboardTitle}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2.5 rounded-lg transition-colors',
                      isActive 
                        ? 'bg-[#FF6B35] text-white' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                      isCollapsed && 'justify-center'
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn('h-5 w-5 shrink-0', !isCollapsed && 'mr-3')} />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Help */}
        <div className="px-3 py-2 border-t border-gray-800">
          <Link
            href={type === 'vendor' ? '/vendor/help' : '/admin/help'}
            className={cn(
              'flex items-center px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors',
              isCollapsed && 'justify-center'
            )}
          >
            <HelpCircle className={cn('h-5 w-5 shrink-0', !isCollapsed && 'mr-3')} />
            {!isCollapsed && <span className="text-sm font-medium">Help & Support</span>}
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-gray-800">
          <div 
            className={cn(
              'flex items-center p-3 rounded-lg bg-gray-800',
              isCollapsed && 'justify-center'
            )}
          >
            <div className="w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-medium shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={logout}
            className={cn(
              'flex items-center w-full mt-2 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors',
              isCollapsed && 'justify-center'
            )}
          >
            <LogOut className={cn('h-5 w-5 shrink-0', !isCollapsed && 'mr-3')} />
            {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
