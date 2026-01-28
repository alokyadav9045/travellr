'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Chrome,
  Github,
  Mail,
  Facebook,
  Twitter,
  Apple,
  Shield,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface SocialAuthProps {
  mode: 'signin' | 'signup';
  onSuccess?: (provider: string, user: any) => void;
  onError?: (error: string) => void;
  className?: string;
  showEmail?: boolean;
}

interface SocialProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  scope?: string[];
}

const socialProviders: SocialProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: <Chrome className="w-4 h-4" />,
    color: 'bg-red-500 hover:bg-red-600 text-white border-red-500',
    scope: ['email', 'profile']
  },
  {
    id: 'facebook',
    name: 'Facebook', 
    icon: <Facebook className="w-4 h-4" />,
    color: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600',
    scope: ['email', 'public_profile']
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: <Github className="w-4 h-4" />,
    color: 'bg-gray-900 hover:bg-gray-800 text-white border-gray-900',
    scope: ['user:email']
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <Twitter className="w-4 h-4" />,
    color: 'bg-sky-500 hover:bg-sky-600 text-white border-sky-500',
    scope: ['email', 'profile']
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: <Apple className="w-4 h-4" />,
    color: 'bg-black hover:bg-gray-800 text-white border-black',
    scope: ['name', 'email']
  }
];

export default function SocialAuth({
  mode,
  onSuccess,
  onError,
  className,
  showEmail = false
}: SocialAuthProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(showEmail);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // Handle OAuth authentication
  const handleSocialAuth = async (provider: SocialProvider) => {
    setLoading(provider.id);
    
    try {
      // In a real app, this would redirect to OAuth provider
      if (provider.id === 'google') {
        // Google OAuth
        window.location.href = `/api/auth/google?mode=${mode}`;
      } else if (provider.id === 'facebook') {
        // Facebook OAuth
        window.location.href = `/api/auth/facebook?mode=${mode}`;
      } else if (provider.id === 'github') {
        // GitHub OAuth
        window.location.href = `/api/auth/github?mode=${mode}`;
      } else {
        // For demo purposes, simulate successful auth
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockUser = {
          id: `${provider.id}_123`,
          name: `${provider.name} User`,
          email: `user@${provider.id}.com`,
          avatar: `https://ui-avatars.com/api/?name=${provider.name}+User&background=667eea&color=fff`,
          provider: provider.id,
          verified: true
        };
        
        onSuccess?.(provider.id, mockUser);
        toast.success(`Successfully ${mode === 'signin' ? 'signed in' : 'signed up'} with ${provider.name}!`);
      }
    } catch (error) {
      const errorMessage = `Failed to ${mode === 'signin' ? 'sign in' : 'sign up'} with ${provider.name}`;
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  // Handle email/password auth
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setEmailLoading(true);

    try {
      // In a real app, this would be an API call
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const user = await response.json();
      
      onSuccess?.('email', user);
      toast.success(`Successfully ${mode === 'signin' ? 'signed in' : 'signed up'}!`);
    } catch (error) {
      const errorMessage = `Failed to ${mode === 'signin' ? 'sign in' : 'sign up'}`;
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Social Providers */}
      <div className="grid gap-3">
        {socialProviders.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            onClick={() => handleSocialAuth(provider)}
            disabled={loading !== null}
            className={cn(
              "relative h-11 transition-all duration-200",
              loading === provider.id ? provider.color : '',
              "hover:scale-105 active:scale-95"
            )}
          >
            {loading === provider.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <div className="absolute left-3">
                  {provider.icon}
                </div>
                <span className="font-medium">
                  Continue with {provider.name}
                </span>
              </>
            )}
          </Button>
        ))}
      </div>

      {/* Divider */}
      <div className="relative">
        <Separator className="my-6" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="bg-white px-4 text-xs uppercase tracking-wide text-gray-500 hover:text-gray-700"
          >
            {showEmailForm ? 'Hide' : 'Or continue with'} email
          </Button>
        </div>
      </div>

      {/* Email/Password Form */}
      <AnimatePresence>
        {showEmailForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleEmailAuth}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  minLength={8}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 hover:bg-transparent"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {mode === 'signup' && password && (
                <div className="text-xs text-gray-500">
                  {password.length < 8 && 'Must be at least 8 characters'}
                  {password.length >= 8 && '✓ Strong password'}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={emailLoading || !email || !password}
              className="w-full h-11"
            >
              {emailLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>

            {mode === 'signup' && (
              <p className="text-xs text-gray-500 text-center">
                By signing up, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">Secure Authentication</p>
            <p>
              We use industry-standard encryption and security measures to protect your data. 
              Your credentials are never stored in plain text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// OAuth callback handler hook
export function useOAuthCallback() {
  const handleOAuthCallback = (provider: string, params: URLSearchParams) => {
    const code = params.get('code');
    const error = params.get('error');
    const state = params.get('state');

    if (error) {
      toast.error(`${provider} authentication failed: ${error}`);
      return;
    }

    if (code) {
      // Exchange code for tokens
      fetch(`/api/auth/${provider}/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, state })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          toast.success(`Successfully authenticated with ${provider}!`);
          // Redirect to dashboard or intended page
          window.location.href = '/dashboard';
        } else {
          throw new Error(data.error || 'Authentication failed');
        }
      })
      .catch(error => {
        toast.error(error.message);
      });
    }
  };

  return { handleOAuthCallback };
}