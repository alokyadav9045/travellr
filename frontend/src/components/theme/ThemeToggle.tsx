'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                disabled
            >
                <Sun className="h-5 w-5 text-yellow-500" />
                <span className="sr-only">Toggle theme</span>
            </button>
        );
    }

    return (
        <button
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500 transition-transform hover:rotate-180 duration-300" aria-hidden="true" />
            ) : (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-400 transition-transform hover:-rotate-12 duration-300" aria-hidden="true" />
            )}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
