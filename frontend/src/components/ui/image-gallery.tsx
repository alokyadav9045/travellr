'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface ImageGalleryProps {
    images: { url: string; alt?: string }[];
    initialIndex?: number;
    className?: string;
}

export function ImageGallery({ images, initialIndex = 0, className }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);

    // Keyboard navigation
    useEffect(() => {
        if (!isFullscreen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft':
                    setActiveIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
                    break;
                case 'ArrowRight':
                    setActiveIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
                    break;
                case 'Escape':
                    setIsFullscreen(false);
                    break;
                case '+':
                    setZoom(prev => Math.min(prev + 0.5, 3));
                    break;
                case '-':
                    setZoom(prev => Math.max(prev - 0.5, 1));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, images.length]);

    // Prevent body scroll when fullscreen
    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isFullscreen]);

    const nextImage = () => {
        setActiveIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
        setZoom(1);
    };

    const prevImage = () => {
        setActiveIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
        setZoom(1);
    };

    if (images.length === 0) return null;

    return (
        <>
            {/* Main Gallery */}
            <div className={cn('space-y-4', className)}>
                {/* Main Image */}
                <div
                    className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => setIsFullscreen(true)}
                >
                    <Image
                        src={images[activeIndex].url}
                        alt={images[activeIndex].alt || `Image ${activeIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        priority
                    />

                    {/* Overlay with icon */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                            <Maximize2 className="w-6 h-6 text-gray-900" />
                        </div>
                    </div>

                    {/* Image counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                        {activeIndex + 1} / {images.length}
                    </div>

                    {/* Navigation arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={cn(
                                    'relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all',
                                    index === activeIndex
                                        ? 'ring-2 ring-[#FF6B35] ring-offset-2'
                                        : 'opacity-60 hover:opacity-100'
                                )}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.alt || `Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
                    >
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/50 to-transparent">
                            <div className="text-white text-sm">
                                {activeIndex + 1} / {images.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20"
                                    onClick={() => setZoom(prev => Math.max(prev - 0.5, 1))}
                                    disabled={zoom <= 1}
                                >
                                    <ZoomOut className="w-5 h-5" />
                                </Button>
                                <span className="text-white text-sm min-w-[50px] text-center">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20"
                                    onClick={() => setZoom(prev => Math.min(prev + 0.5, 3))}
                                    disabled={zoom >= 3}
                                >
                                    <ZoomIn className="w-5 h-5" />
                                </Button>
                                <a
                                    href={images[activeIndex].url}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-white hover:bg-white/20"
                                    >
                                        <Download className="w-5 h-5" />
                                    </Button>
                                </a>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20"
                                    onClick={() => { setIsFullscreen(false); setZoom(1); }}
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>

                        {/* Main Image */}
                        <div
                            className="relative w-full h-full flex items-center justify-center overflow-hidden"
                            onClick={() => { setIsFullscreen(false); setZoom(1); }}
                        >
                            <motion.div
                                style={{ scale: zoom }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src={images[activeIndex].url}
                                    alt={images[activeIndex].alt || `Image ${activeIndex + 1}`}
                                    width={1200}
                                    height={800}
                                    className="max-h-[90vh] w-auto object-contain"
                                    priority
                                />
                            </motion.div>
                        </div>

                        {/* Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Thumbnails Strip */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-xl backdrop-blur-sm max-w-[90vw] overflow-x-auto">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => { setActiveIndex(index); setZoom(1); }}
                                    className={cn(
                                        'relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all',
                                        index === activeIndex
                                            ? 'ring-2 ring-[#FF6B35]'
                                            : 'opacity-50 hover:opacity-100'
                                    )}
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt || `Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default ImageGallery;
