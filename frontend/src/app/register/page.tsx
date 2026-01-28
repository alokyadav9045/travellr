'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Mountain, CheckCircle } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    const { confirmPassword, ...registerData } = data;
    const credentials = {
      name: registerData.name,
      email: registerData.email,
      password: registerData.password
    };
    const result = await registerUser(credentials);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Registration failed');
    }

    setIsLoading(false);
  };

  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <Mountain className="h-8 w-8 text-[#FF6B35]" />
            <span className="text-2xl font-bold text-gray-900">Travellr</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of travelers discovering unique adventures
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-12 h-12 rounded-xl border-gray-200 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-12 h-12 rounded-xl border-gray-200 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-12 rounded-xl border-gray-200 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
              
              {/* Password Strength */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className={`h-4 w-4 ${hasMinLength ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={hasMinLength ? 'text-green-600' : 'text-gray-500'}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className={`h-4 w-4 ${hasUpperCase ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={hasUpperCase ? 'text-green-600' : 'text-gray-500'}>One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className={`h-4 w-4 ${hasNumber ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={hasNumber ? 'text-green-600' : 'text-gray-500'}>One number</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-12 rounded-xl border-gray-200 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="w-4 h-4 mt-1 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]" required />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-[#FF6B35] hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-[#FF6B35] hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <p className="text-center text-gray-600 mt-8">
              Already have an account?{' '}
              <Link href="/login" className="text-[#FF6B35] hover:text-[#e55a2b] font-semibold">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
      
      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#FF6B35] via-[#e55a2b] to-[#d14a1b] relative overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-white/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-yellow-500/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
        
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <Link href="/" className="absolute top-8 right-8 flex items-center gap-2">
            <Mountain className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold">Travellr</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="text-6xl mb-6">🌍</div>
            <h1 className="text-4xl font-bold mb-6">
              Start Your<br />
              <span className="text-white/90">Adventure Today</span>
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Join our community of adventurers and discover handpicked experiences from trusted local vendors.
            </p>
            
            {/* Features */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">✈️</div>
                <div>
                  <div className="font-semibold">500+ Unique Trips</div>
                  <div className="text-sm text-white/70">Curated by local experts</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">🛡️</div>
                <div>
                  <div className="font-semibold">Verified Vendors</div>
                  <div className="text-sm text-white/70">Safe & secure bookings</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">💰</div>
                <div>
                  <div className="font-semibold">Best Price Guarantee</div>
                  <div className="text-sm text-white/70">No hidden charges</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
