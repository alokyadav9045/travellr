'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Loader2, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactApi } from '@/lib/api/contact';
import { toast } from 'sonner';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      await contactApi.subscribeNewsletter(email);
      setStatus('success');
      setEmail('');
      toast.success('Successfully subscribed to newsletter!');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      toast.error('Subscription failed. Please try again.');
    }
  };

  return (
    <section className="py-24 bg-[#F15A24] relative overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-2xl rounded-[4rem] p-8 md:p-20 border border-white/20 shadow-2xl overflow-hidden relative">
          {/* Decorative Sparkle */}
          <div className="absolute top-10 right-10">
            <Sparkles className="h-12 w-12 text-white/20 animate-pulse" />
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-white text-[#F15A24] rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-3">
                <Mail className="h-10 w-10" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight leading-tight">
                Join the <span className="underline decoration-white/30 underline-offset-8">Wanderlust</span> Club
              </h2>
              <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                Subscribe to our newsletter for hidden gems, local tips, and secret deals you won't find anywhere else.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="relative max-w-xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="flex-1 px-6 py-5 rounded-2xl bg-transparent text-white placeholder:text-white/40 focus:outline-none text-lg font-medium"
                  disabled={status === 'loading' || status === 'success'}
                  suppressHydrationWarning
                />
                <Button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="bg-white text-[#F15A24] hover:bg-white/90 px-10 py-5 h-auto font-black rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3"
                  suppressHydrationWarning
                >
                  {status === 'loading' ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : status === 'success' ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-6 w-6" />
                        Joined!
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <>
                      Subscribe
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap justify-center gap-8"
            >
              <div className="flex items-center gap-2 text-white/60 text-sm font-bold">
                <CheckCircle className="h-4 w-4 text-white/40" />
                No Spam Ever
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm font-bold">
                <CheckCircle className="h-4 w-4 text-white/40" />
                Unsubscribe Anytime
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
