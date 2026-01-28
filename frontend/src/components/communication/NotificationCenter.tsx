'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BellRing,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Calendar,
  MessageSquare,
  CreditCard,
  Star,
  MapPin,
  Users,
  Gift,
  Zap,
  Archive,
  Settings,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'message' | 'review' | 'reminder' | 'offer' | 'system' | 'emergency';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isImportant: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    bookingId?: string;
    tripId?: string;
    userId?: string;
    amount?: number;
    rating?: number;
  };
  sender?: {
    name: string;
    avatar?: string;
    role: 'system' | 'user' | 'vendor' | 'support';
  };
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  categories: {
    booking: boolean;
    payment: boolean;
    messages: boolean;
    offers: boolean;
    reviews: boolean;
    reminders: boolean;
    emergency: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface NotificationCenterProps {
  userId: string;
  onNotificationClick?: (notification: Notification) => void;
  onSettingsChange?: (settings: NotificationSettings) => void;
  className?: string;
}

const notificationTypes = {
  booking: { 
    icon: Calendar, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50', 
    label: 'Booking'
  },
  payment: { 
    icon: CreditCard, 
    color: 'text-green-600', 
    bg: 'bg-green-50', 
    label: 'Payment'
  },
  message: { 
    icon: MessageSquare, 
    color: 'text-purple-600', 
    bg: 'bg-purple-50', 
    label: 'Message'
  },
  review: { 
    icon: Star, 
    color: 'text-yellow-600', 
    bg: 'bg-yellow-50', 
    label: 'Review'
  },
  reminder: { 
    icon: Bell, 
    color: 'text-orange-600', 
    bg: 'bg-orange-50', 
    label: 'Reminder'
  },
  offer: { 
    icon: Gift, 
    color: 'text-pink-600', 
    bg: 'bg-pink-50', 
    label: 'Offer'
  },
  system: { 
    icon: Info, 
    color: 'text-gray-600', 
    bg: 'bg-gray-50', 
    label: 'System'
  },
  emergency: { 
    icon: AlertCircle, 
    color: 'text-red-600', 
    bg: 'bg-red-50', 
    label: 'Emergency'
  }
};

export default function NotificationCenter({
  userId,
  onNotificationClick,
  onSettingsChange,
  className
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'important'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    categories: {
      booking: true,
      payment: true,
      messages: true,
      offers: true,
      reviews: true,
      reminders: true,
      emergency: true
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  // Load notifications
  useEffect(() => {
    loadNotifications();
  }, [userId]);

  // Filter notifications based on active filters
  useEffect(() => {
    let filtered = notifications;

    // Filter by tab
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (activeTab === 'important') {
      filtered = filtered.filter(n => n.isImportant);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(n => n.type === selectedType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.sender?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, activeTab, selectedType, searchQuery]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from your API
      // const response = await fetch(`/api/notifications/${userId}`);
      // const data = await response.json();
      
      // Mock notifications
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'booking',
          title: 'Booking Confirmed',
          message: 'Your Manali Adventure trip has been confirmed for March 15-18, 2024.',
          timestamp: new Date(Date.now() - 300000), // 5 mins ago
          isRead: false,
          isImportant: true,
          actionUrl: '/bookings/123',
          actionText: 'View Booking',
          metadata: { bookingId: 'B123', tripId: 'T456' },
          sender: { name: 'Mountain Adventures', avatar: '/avatars/vendor1.jpg', role: 'vendor' }
        },
        {
          id: '2',
          type: 'payment',
          title: 'Payment Successful',
          message: 'Your payment of ₹12,500 has been processed successfully.',
          timestamp: new Date(Date.now() - 900000), // 15 mins ago
          isRead: false,
          isImportant: false,
          metadata: { amount: 12500, bookingId: 'B123' },
          sender: { name: 'Travellr Payments', role: 'system' }
        },
        {
          id: '3',
          type: 'message',
          title: 'New Message',
          message: 'You have a new message from Kerala Holidays regarding your booking.',
          timestamp: new Date(Date.now() - 1800000), // 30 mins ago
          isRead: true,
          isImportant: false,
          actionUrl: '/messages/conv2',
          actionText: 'Read Message',
          sender: { name: 'Kerala Holidays', avatar: '/avatars/vendor2.jpg', role: 'vendor' }
        },
        {
          id: '4',
          type: 'review',
          title: 'Review Request',
          message: 'How was your Goa Beach trip? Share your experience with other travelers.',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          isRead: true,
          isImportant: false,
          actionUrl: '/reviews/write/T789',
          actionText: 'Write Review',
          metadata: { tripId: 'T789' },
          sender: { name: 'Travellr', role: 'system' }
        },
        {
          id: '5',
          type: 'offer',
          title: 'Special Offer',
          message: 'Limited time: 20% off on all Rajasthan tours. Book now!',
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          isRead: false,
          isImportant: true,
          actionUrl: '/offers/rajasthan20',
          actionText: 'View Offer',
          sender: { name: 'Travellr Offers', role: 'system' }
        },
        {
          id: '6',
          type: 'reminder',
          title: 'Trip Reminder',
          message: 'Your Kerala trip starts tomorrow. Check your itinerary and packing list.',
          timestamp: new Date(Date.now() - 10800000), // 3 hours ago
          isRead: false,
          isImportant: true,
          actionUrl: '/trips/T456/itinerary',
          actionText: 'View Itinerary',
          metadata: { tripId: 'T456' },
          sender: { name: 'Travellr', role: 'system' }
        },
        {
          id: '7',
          type: 'emergency',
          title: 'Weather Alert',
          message: 'Heavy rainfall expected in your destination. Check latest updates.',
          timestamp: new Date(Date.now() - 14400000), // 4 hours ago
          isRead: true,
          isImportant: true,
          actionUrl: '/trips/T456/alerts',
          actionText: 'View Updates',
          metadata: { tripId: 'T456' },
          sender: { name: 'Weather Service', role: 'system' }
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // In a real app, this would update the server
      // await fetch(`/api/notifications/${notificationId}/read`, { method: 'PATCH' });
      
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // await fetch(`/api/notifications/${userId}/read-all`, { method: 'PATCH' });
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // await fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' });
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    onNotificationClick?.(notification);
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const importantCount = notifications.filter(n => n.isImportant && !n.isRead).length;

  const renderNotification = (notification: Notification) => {
    const typeConfig = notificationTypes[notification.type];
    const TypeIcon = typeConfig.icon;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className={cn(
          "p-4 border-l-4 cursor-pointer transition-colors hover:bg-gray-50",
          !notification.isRead ? "bg-blue-50/50 border-l-blue-500" : "border-l-transparent",
          notification.isImportant && "border-l-red-500"
        )}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="flex items-start space-x-3">
          {/* Notification Icon */}
          <div className={cn("p-2 rounded-full flex-shrink-0", typeConfig.bg)}>
            <TypeIcon className={cn("w-4 h-4", typeConfig.color)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h4 className={cn(
                "text-sm font-medium truncate",
                !notification.isRead ? "text-gray-900" : "text-gray-700"
              )}>
                {notification.title}
              </h4>
              
              <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                {notification.isImportant && (
                  <AlertCircle className="w-3 h-3 text-red-500" />
                )}
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {notification.message}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span>{formatTimestamp(notification.timestamp)}</span>
                <Badge variant="secondary" className="text-xs">
                  {typeConfig.label}
                </Badge>
                {notification.sender && (
                  <div className="flex items-center space-x-1">
                    {notification.sender.avatar && (
                      <Avatar className="w-4 h-4">
                        <AvatarImage src={notification.sender.avatar} />
                        <AvatarFallback className="text-xs">
                          {notification.sender.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <span>{notification.sender.name}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-1">
                {notification.actionText && (
                  <Button variant="outline" size="sm" className="text-xs h-6 px-2">
                    {notification.actionText}
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <span className="sr-only">Options</span>
                      <span className="text-gray-400">⋮</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {!notification.isRead && (
                      <DropdownMenuItem onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}>
                        <Check className="w-4 h-4 mr-2" />
                        Mark as Read
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}>
                      <X className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSettings = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Notification Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Methods */}
        <div>
          <h4 className="font-medium mb-3">Delivery Methods</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked: boolean) => 
                  setSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked: boolean) => 
                  setSettings(prev => ({ ...prev, pushNotifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <Switch
                id="sms-notifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked: boolean) =>
                  setSettings(prev => ({ ...prev, smsNotifications: checked }))
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <h4 className="font-medium mb-3">Notification Types</h4>
          <div className="space-y-3">
            {Object.entries(settings.categories).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="capitalize">{key}</span>
                  {key === 'emergency' && (
                    <Badge variant="danger" className="text-xs">Required</Badge>
                  )}
                </div>
                <Switch
                  checked={enabled}
                  disabled={key === 'emergency'}
                  onCheckedChange={(checked: boolean) => 
                    setSettings(prev => ({
                      ...prev,
                      categories: { ...prev.categories, [key]: checked }
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Quiet Hours */}
        <div>
          <h4 className="font-medium mb-3">Quiet Hours</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
              <Switch
                id="quiet-hours"
                checked={settings.quietHours.enabled}
                onCheckedChange={(checked: boolean) => 
                  setSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, enabled: checked }
                  }))
                }
              />
            </div>
            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="quiet-start" className="text-sm">From</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => 
                      setSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, start: e.target.value }
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="quiet-end" className="text-sm">To</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => 
                      setSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, end: e.target.value }
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onSettingsChange?.(settings)}>
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-12", className)}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 text-blue-600"
        >
          <Bell className="w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Bell className="w-6 h-6" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white ml-2">
                {unreadCount}
              </Badge>
            )}
          </h2>
          <p className="text-gray-600">Stay updated with your travel activities</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'important', label: 'Important', count: importantCount }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Type</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedType('all')}>
                All Types
              </DropdownMenuItem>
              {Object.entries(notificationTypes).map(([key, config]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setSelectedType(key)}
                  className="flex items-center space-x-2"
                >
                  <config.icon className={cn("w-4 h-4", config.color)} />
                  <span>{config.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <Card>
          <ScrollArea className="h-[600px]">
            <div className="divide-y">
              <AnimatePresence>
                {filteredNotifications.map((notification) => (
                  <motion.div key={notification.id}>
                    {renderNotification(notification)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notifications found
          </h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search criteria.' : 'You\'re all caught up!'}
          </p>
        </Card>
      )}

      {/* Settings Panel */}
      {showSettings && renderSettings()}
    </div>
  );
}
