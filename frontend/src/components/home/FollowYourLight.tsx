'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export function FollowYourLight() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative flex items-center justify-center"
                >
                    <div className="relative">
                        {/* Light Theme Image */}
                        <picture className="h-12 md:h-auto md:w-56 block dark:hidden">
                            <Image
                                src="/images/follow-your-light.avif"
                                alt="Follow Your Light"
                                width={224}
                                height={48}
                                className="h-12 md:h-auto md:w-56"
                                priority
                            />
                        </picture>

                        {/* Dark Theme Image */}
                        <picture className="h-12 md:h-auto md:w-56 hidden dark:block">
                            <Image
                                src="/images/follow-your-dark.avif"
                                alt="Follow Your Dark"
                                width={224}
                                height={48}
                                className="h-12 md:h-auto md:w-56"
                                priority
                            />
                        </picture>

                        {/* Heart Emoji */}
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                            className="absolute w-8 h-8 md:w-auto md:h-auto bottom-0 md:bottom-10 -right-5 md:-right-12 rotate-6"
                        >
                            <Image
                                src="/images/512.webp"
                                alt="❤"
                                width={108}
                                height={108}
                                className="w-8 h-8 md:w-[108px] md:h-[108px] animate-pulse"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
