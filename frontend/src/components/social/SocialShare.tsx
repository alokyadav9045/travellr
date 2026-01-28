'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Instagram,
  Link2,
  MessageCircle,
  Mail,
  Download,
  Heart,
  Bookmark,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  hashtags?: string[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface ShareOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  action: (url: string, title: string, description?: string) => void;
}

const shareOptions: ShareOption[] = [
  {
    id: 'facebook',
    label: 'Facebook',
    icon: <Facebook className="w-4 h-4" />,
    color: 'bg-blue-600 hover:bg-blue-700',
    action: (url, title, description) => {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  },
  {
    id: 'twitter',
    label: 'Twitter',
    icon: <Twitter className="w-4 h-4" />,
    color: 'bg-sky-500 hover:bg-sky-600',
    action: (url, title, description) => {
      const text = `${title} - ${description || 'Check out this amazing trip!'}`;
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: <MessageCircle className="w-4 h-4" />,
    color: 'bg-green-500 hover:bg-green-600',
    action: (url, title, description) => {
      const text = `${title}\n${description || ''}\n${url}`;
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(shareUrl, '_blank');
    }
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: <Instagram className="w-4 h-4" />,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    action: (url, title) => {
      toast.info('Instagram sharing - Copy the link and share it in your story!');
      navigator.clipboard.writeText(`${title}\n${url}`);
    }
  },
  {
    id: 'email',
    label: 'Email',
    icon: <Mail className="w-4 h-4" />,
    color: 'bg-gray-600 hover:bg-gray-700',
    action: (url, title, description) => {
      const subject = encodeURIComponent(title);
      const body = encodeURIComponent(`${description || 'Check out this amazing trip!'}\n\n${url}`);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    }
  }
];

export default function SocialShare({ 
  url, 
  title, 
  description, 
  image, 
  hashtags = [], 
  className,
  size = 'md'
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async (option: ShareOption) => {
    try {
      // Track sharing analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'share', {
          method: option.id,
          content_type: 'trip',
          content_id: url.split('/').pop()
        });
      }

      option.action(url, title, description);
      setIsOpen(false);
    } catch (error) {
      toast.error(`Failed to share via ${option.label}`);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || 'Check out this amazing trip!',
          url
        });
      } catch (error) {
        console.log('Native sharing cancelled or failed');
      }
    } else {
      setIsOpen(true);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  return (
    <div className={cn("relative", className)}>
      {/* Main Share Button */}
      <Button
        variant="outline"
        size={size === 'md' ? 'default' : size}
        onClick={handleNativeShare}
        className={cn(
          "flex items-center space-x-2 transition-all duration-200 hover:scale-105",
          sizeClasses[size]
        )}
      >
        <Share2 className={cn(
          size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
        )} />
        <span className={cn(
          size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
        )}>
          Share
        </span>
      </Button>

      {/* Share Options Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Share Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 min-w-80"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Share this trip</h3>
                  <p className="text-sm text-gray-600 mt-1">{title}</p>
                </div>

                {/* Social Options */}
                <div className="grid grid-cols-2 gap-3">
                  {shareOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      onClick={() => handleShare(option)}
                      className={cn(
                        "flex items-center space-x-2 h-12 justify-start transition-all duration-200 hover:scale-105",
                        option.color,
                        "text-white border-0"
                      )}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </Button>
                  ))}
                </div>

                {/* Copy Link */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <Link2 className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={url}
                        readOnly
                        className="flex-1 bg-transparent text-sm text-gray-600 border-0 outline-none"
                      />
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      className={cn(
                        "transition-all duration-200",
                        copied && "bg-green-500 hover:bg-green-600"
                      )}
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Hashtags */}
                {hashtags.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-500 mb-2">Suggested hashtags:</p>
                    <div className="flex flex-wrap gap-1">
                      {hashtags.map((hashtag) => (
                        <span
                          key={hashtag}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200"
                          onClick={() => {
                            navigator.clipboard.writeText(`#${hashtag}`);
                            toast.success(`#${hashtag} copied!`);
                          }}
                        >
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Quick Share Buttons Component (for inline usage)
export function QuickShareButtons({ 
  url, 
  title, 
  description,
  className,
  showLabels = false 
}: SocialShareProps & { showLabels?: boolean }) {
  const handleQuickShare = (option: ShareOption) => {
    option.action(url, title, description);
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: option.id,
        content_type: 'trip',
        content_id: url.split('/').pop()
      });
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {shareOptions.slice(0, 4).map((option) => (
        <Button
          key={option.id}
          variant="outline"
          size="sm"
          onClick={() => handleQuickShare(option)}
          className={cn(
            "transition-all duration-200 hover:scale-110",
            option.color,
            "text-white border-0",
            !showLabels && "p-2"
          )}
          title={`Share on ${option.label}`}
        >
          {option.icon}
          {showLabels && <span className="ml-1 text-xs">{option.label}</span>}
        </Button>
      ))}
    </div>
  );
}

// Save/Bookmark Component
export function SaveTripButton({ 
  tripId, 
  isSaved = false,
  onSave,
  className 
}: {
  tripId: string;
  isSaved?: boolean;
  onSave?: (saved: boolean) => void;
  className?: string;
}) {
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call to save/unsave trip would go here
      const newSavedState = !saved;
      setSaved(newSavedState);
      onSave?.(newSavedState);
      
      toast.success(newSavedState ? 'Trip saved to wishlist!' : 'Trip removed from wishlist');
      
      // Track analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', newSavedState ? 'add_to_wishlist' : 'remove_from_wishlist', {
          content_type: 'trip',
          content_id: tripId
        });
      }
    } catch (error) {
      toast.error('Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSave}
      disabled={loading}
      className={cn(
        "transition-all duration-200 hover:scale-110",
        saved ? "bg-red-500 hover:bg-red-600 text-white border-red-500" : "",
        className
      )}
    >
      <Heart className={cn(
        "w-4 h-4",
        saved ? "fill-current" : ""
      )} />
    </Button>
  );
}