'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video,
  Paperclip,
  Smile,
  MoreVertical,
  Search,
  Bell,
  BellOff,
  Star,
  Archive,
  Trash2,
  Info,
  Image as ImageIcon,
  File,
  MapPin,
  Calendar,
  CheckCheck,
  Check,
  Clock,
  Users,
  Shield,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OptimizedImage } from '@/components/ui/optimized-image';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  role: 'customer' | 'vendor' | 'support' | 'admin';
  isOnline: boolean;
  lastSeen?: Date;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'location' | 'booking' | 'system';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: Array<{
    type: 'image' | 'file' | 'location';
    url: string;
    name: string;
    size?: number;
    thumbnail?: string;
  }>;
  replyTo?: string;
  metadata?: any;
}

interface Conversation {
  id: string;
  participants: User[];
  type: 'direct' | 'group' | 'support';
  title?: string;
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  tripId?: string;
  bookingId?: string;
  tags?: string[];
}

interface ChatHubProps {
  currentUser: User;
  onConversationSelect?: (conversation: Conversation) => void;
  onNewMessage?: (message: Message) => void;
  className?: string;
}

const messageTypes = {
  text: { icon: MessageCircle, color: 'text-gray-600' },
  image: { icon: ImageIcon, color: 'text-blue-600' },
  file: { icon: File, color: 'text-purple-600' },
  location: { icon: MapPin, color: 'text-green-600' },
  booking: { icon: Calendar, color: 'text-orange-600' },
  system: { icon: Info, color: 'text-gray-500' }
};

const statusIcons = {
  sending: Clock,
  sent: Check,
  delivered: Check,
  read: CheckCheck
};

export default function ChatHub({
  currentUser,
  onConversationSelect,
  onNewMessage,
  className
}: ChatHubProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const [showConversationInfo, setShowConversationInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize conversations
  useEffect(() => {
    loadConversations();
  }, [currentUser.id]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      // In a real app, this would fetch from your API
      // const response = await fetch(`/api/conversations/${currentUser.id}`);
      // const data = await response.json();
      
      // Mock conversations
      const mockConversations: Conversation[] = [
        {
          id: '1',
          participants: [
            currentUser,
            { id: 'vendor1', name: 'Mountain Adventures', avatar: '/avatars/vendor1.jpg', role: 'vendor', isOnline: true }
          ],
          type: 'direct',
          lastMessage: {
            id: 'm1',
            senderId: 'vendor1',
            content: 'Your Manali trip booking has been confirmed! Check your email for details.',
            type: 'text',
            timestamp: new Date(Date.now() - 300000),
            status: 'read'
          },
          unreadCount: 0,
          isPinned: true,
          isMuted: false,
          isArchived: false,
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(Date.now() - 300000),
          tripId: 'trip1',
          bookingId: 'booking1'
        },
        {
          id: '2',
          participants: [
            currentUser,
            { id: 'support1', name: 'Customer Support', avatar: '/avatars/support.jpg', role: 'support', isOnline: true }
          ],
          type: 'support',
          title: 'Payment Issue',
          lastMessage: {
            id: 'm2',
            senderId: 'support1',
            content: 'I\'ll help you resolve the payment issue. Can you provide your booking reference?',
            type: 'text',
            timestamp: new Date(Date.now() - 1200000),
            status: 'delivered'
          },
          unreadCount: 1,
          isPinned: false,
          isMuted: false,
          isArchived: false,
          createdAt: new Date(Date.now() - 7200000),
          updatedAt: new Date(Date.now() - 1200000),
          tags: ['payment', 'urgent']
        },
        {
          id: '3',
          participants: [
            currentUser,
            { id: 'traveler1', name: 'Sarah Johnson', avatar: '/avatars/user1.jpg', role: 'customer', isOnline: false, lastSeen: new Date(Date.now() - 3600000) },
            { id: 'traveler2', name: 'Mike Chen', avatar: '/avatars/user2.jpg', role: 'customer', isOnline: true }
          ],
          type: 'group',
          title: 'Kerala Trip Group',
          lastMessage: {
            id: 'm3',
            senderId: 'traveler1',
            content: 'Can\'t wait for tomorrow! 📸',
            type: 'text',
            timestamp: new Date(Date.now() - 900000),
            status: 'read'
          },
          unreadCount: 2,
          isPinned: false,
          isMuted: false,
          isArchived: false,
          createdAt: new Date(Date.now() - 259200000),
          updatedAt: new Date(Date.now() - 900000),
          tripId: 'trip2'
        }
      ];
      
      setConversations(mockConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      // In a real app, this would fetch from your API
      // const response = await fetch(`/api/conversations/${conversationId}/messages`);
      // const data = await response.json();
      
      // Mock messages based on conversation
      const mockMessages: Message[] = conversationId === '1' ? [
        {
          id: '1',
          senderId: currentUser.id,
          content: 'Hi, I have a question about the Manali adventure package.',
          type: 'text',
          timestamp: new Date(Date.now() - 1800000),
          status: 'read'
        },
        {
          id: '2',
          senderId: 'vendor1',
          content: 'Hello! I\'d be happy to help. What would you like to know?',
          type: 'text',
          timestamp: new Date(Date.now() - 1740000),
          status: 'read'
        },
        {
          id: '3',
          senderId: currentUser.id,
          content: 'What\'s included in the adventure package?',
          type: 'text',
          timestamp: new Date(Date.now() - 1680000),
          status: 'read'
        },
        {
          id: '4',
          senderId: 'vendor1',
          content: 'Great question! The package includes river rafting, trekking, paragliding, accommodation, and all meals. Here\'s the detailed itinerary:',
          type: 'text',
          timestamp: new Date(Date.now() - 1620000),
          status: 'read'
        },
        {
          id: '5',
          senderId: 'vendor1',
          content: '',
          type: 'image',
          timestamp: new Date(Date.now() - 1560000),
          status: 'read',
          attachments: [{
            type: 'image',
            url: '/images/itinerary.jpg',
            name: 'Manali Itinerary.jpg',
            thumbnail: '/images/itinerary-thumb.jpg'
          }]
        },
        {
          id: '6',
          senderId: 'vendor1',
          content: 'Your Manali trip booking has been confirmed! Check your email for details.',
          type: 'text',
          timestamp: new Date(Date.now() - 300000),
          status: 'read'
        }
      ] : [];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      status: 'sending'
    };

    // Add message to UI immediately
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // In a real app, this would send to your API
      // const response = await fetch(`/api/conversations/${selectedConversation.id}/messages`, {
      //   method: 'POST',
      //   body: JSON.stringify(message)
      // });
      
      // Mock successful send
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, status: 'sent' } : m
        ));
        
        // Update conversation's last message
        setConversations(prev => prev.map(c => 
          c.id === selectedConversation.id 
            ? { ...c, lastMessage: message, updatedAt: new Date() }
            : c
        ));
        
        onNewMessage?.(message);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      // Handle send error
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
    onConversationSelect?.(conversation);
    
    // Mark as read
    if (conversation.unreadCount > 0) {
      setConversations(prev => prev.map(c => 
        c.id === conversation.id ? { ...c, unreadCount: 0 } : c
      ));
    }
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const getConversationTitle = (conversation: Conversation): string => {
    if (conversation.title) return conversation.title;
    if (conversation.type === 'support') return 'Customer Support';
    
    const otherParticipants = conversation.participants.filter(p => p.id !== currentUser.id);
    return otherParticipants.map(p => p.name).join(', ');
  };

  const getConversationAvatar = (conversation: Conversation): string => {
    if (conversation.avatar) return conversation.avatar;
    
    const otherParticipants = conversation.participants.filter(p => p.id !== currentUser.id);
    return otherParticipants[0]?.avatar || '/avatars/default.jpg';
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter(conversation => {
      const title = getConversationTitle(conversation).toLowerCase();
      const query = searchQuery.toLowerCase();
      return title.includes(query) || 
             conversation.participants.some(p => p.name.toLowerCase().includes(query)) ||
             conversation.lastMessage?.content.toLowerCase().includes(query);
    });
  }, [conversations, searchQuery, currentUser.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTextareaResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const renderMessage = (message: Message) => {
    const isOwn = message.senderId === currentUser.id;
    const sender = selectedConversation?.participants.find(p => p.id === message.senderId);
    const StatusIcon = statusIcons[message.status];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex", isOwn ? "justify-end" : "justify-start", "mb-4")}
      >
        <div className={cn("flex max-w-[70%]", isOwn ? "flex-row-reverse" : "flex-row")}>
          {!isOwn && (
            <Avatar className="w-8 h-8 mr-2 mt-auto">
              <AvatarImage src={sender?.avatar} />
              <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          
          <div className="space-y-1">
            {!isOwn && selectedConversation?.type === 'group' && (
              <p className="text-xs text-gray-500 ml-1">{sender?.name}</p>
            )}
            
            <div className={cn(
              "rounded-2xl px-4 py-2 max-w-full break-words",
              isOwn 
                ? "bg-blue-600 text-white rounded-br-md" 
                : "bg-gray-100 text-gray-900 rounded-bl-md"
            )}>
              {message.type === 'text' && (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
              
              {message.type === 'image' && message.attachments?.[0] && (
                <div className="space-y-2">
                  <div className="relative rounded-lg overflow-hidden">
                    <OptimizedImage
                      src={message.attachments[0].thumbnail || message.attachments[0].url}
                      alt="Shared image"
                      width={300}
                      height={200}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </div>
                  {message.content && (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              )}
              
              {message.type === 'file' && message.attachments?.[0] && (
                <div className="flex items-center space-x-2">
                  <File className="w-4 h-4" />
                  <div>
                    <p className="font-medium">{message.attachments[0].name}</p>
                    <p className="text-xs opacity-70">
                      {message.attachments[0].size ? `${(message.attachments[0].size / 1024).toFixed(1)} KB` : 'File'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className={cn(
              "flex items-center space-x-1 text-xs text-gray-500",
              isOwn ? "justify-end" : "justify-start"
            )}>
              <span>{formatTimestamp(message.timestamp)}</span>
              {isOwn && <StatusIcon className="w-3 h-3" />}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderConversationList = () => (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
              onClick={() => handleConversationSelect(conversation)}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                selectedConversation?.id === conversation.id && "bg-blue-50 border border-blue-200"
              )}
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={getConversationAvatar(conversation)} />
                  <AvatarFallback>
                    {conversation.type === 'support' ? (
                      <Headphones className="w-5 h-5" />
                    ) : conversation.type === 'group' ? (
                      <Users className="w-5 h-5" />
                    ) : (
                      getConversationTitle(conversation).charAt(0)
                    )}
                  </AvatarFallback>
                </Avatar>
                
                {/* Online indicator */}
                {conversation.participants.some(p => p.id !== currentUser.id && p.isOnline) && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {getConversationTitle(conversation)}
                  </h4>
                  <div className="flex items-center space-x-1">
                    {conversation.isPinned && <Star className="w-3 h-3 text-yellow-500" />}
                    {conversation.isMuted && <BellOff className="w-3 h-3 text-gray-400" />}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600 truncate max-w-[150px]">
                    {conversation.lastMessage?.type === 'image' ? '📷 Image' :
                     conversation.lastMessage?.type === 'file' ? '📎 File' :
                     conversation.lastMessage?.content || 'No messages'}
                  </p>
                  
                  <div className="flex items-center space-x-2 ml-2">
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessage && formatTimestamp(conversation.lastMessage.timestamp)}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-5 flex items-center justify-center">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {conversation.tags && conversation.tags.length > 0 && (
                  <div className="flex space-x-1 mt-2">
                    {conversation.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderChatArea = () => {
    if (!selectedConversation) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-gray-500">
          <MessageCircle className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
        </div>
      );
    }

    const otherParticipants = selectedConversation.participants.filter(p => p.id !== currentUser.id);
    const isOnline = otherParticipants.some(p => p.isOnline);

    return (
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={getConversationAvatar(selectedConversation)} />
              <AvatarFallback>
                {selectedConversation.type === 'support' ? (
                  <Headphones className="w-5 h-5" />
                ) : (
                  getConversationTitle(selectedConversation).charAt(0)
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">
                {getConversationTitle(selectedConversation)}
              </h3>
              <p className="text-xs text-gray-500">
                {selectedConversation.type === 'group' 
                  ? `${selectedConversation.participants.length} members`
                  : isOnline ? 'Online' : 'Last seen recently'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Video className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="p-2">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setShowConversationInfo(true)}>
                  <Info className="w-4 h-4 mr-2" />
                  Conversation Info
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-1">
            {messages.map((message) => renderMessage(message))}
            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2 rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-end space-x-2">
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" className="p-2">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTextareaResize();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="min-h-[40px] max-h-[120px] resize-none pr-12"
                rows={1}
              />
              <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1">
                <Smile className="w-4 h-4" />
              </Button>
            </div>

            <Button 
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("h-[600px] bg-white border rounded-lg overflow-hidden flex", className)}>
      {/* Sidebar */}
      <div className="w-80 border-r bg-gray-50">
        {renderConversationList()}
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {renderChatArea()}
      </div>

      {/* Conversation Info Modal */}
      <AnimatePresence>
        {showConversationInfo && selectedConversation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowConversationInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Conversation Info</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConversationInfo(false)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-3">
                    <AvatarImage src={getConversationAvatar(selectedConversation)} />
                    <AvatarFallback className="text-2xl">
                      {getConversationTitle(selectedConversation).charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="text-lg font-medium">{getConversationTitle(selectedConversation)}</h4>
                  <p className="text-sm text-gray-600">
                    {selectedConversation.participants.length} member{selectedConversation.participants.length > 1 ? 's' : ''}
                  </p>
                </div>

                <Separator />

                <div>
                  <h5 className="font-medium mb-2">Members</h5>
                  <div className="space-y-2">
                    {selectedConversation.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{participant.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{participant.role}</p>
                        </div>
                        {participant.isOnline && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedConversation.tripId && (
                  <>
                    <Separator />
                    <div>
                      <h5 className="font-medium mb-2">Related Trip</h5>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium">Trip #{selectedConversation.tripId}</p>
                        <p className="text-xs text-gray-600">View trip details</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}