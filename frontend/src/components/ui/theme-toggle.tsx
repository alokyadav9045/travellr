'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('system');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
        // Load saved theme
        const saved = localStorage.getItem('theme') as Theme;
        if (saved) {
            setTheme(saved);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        let resolved: 'light' | 'dark';
        if (theme === 'system') {
            resolved = systemPrefersDark ? 'dark' : 'light';
        } else {
            resolved = theme;
        }

        setResolvedTheme(resolved);

        // Apply theme to document
        if (resolved === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Save preference
        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    // Listen for system theme changes
    useEffect(() => {
        if (!mounted) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
                document.documentElement.classList.toggle('dark', mediaQuery.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, mounted]);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9"
                onClick={toggleMenu}
            >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border z-50 py-1">
                        <button
                            onClick={() => { setTheme('light'); setIsOpen(false); }}
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                        >
                            <Sun className="mr-2 h-4 w-4" />
                            Light
                            {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
                        </button>
                        <button
                            onClick={() => { setTheme('dark'); setIsOpen(false); }}
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                        >
                            <Moon className="mr-2 h-4 w-4" />
                            Dark
                            {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
                        </button>
                        <button
                            onClick={() => { setTheme('system'); setIsOpen(false); }}
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                        >
                            <Monitor className="mr-2 h-4 w-4" />
                            System
                            {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// Simple toggle button (alternative)
export function ThemeToggleSimple() {
    const { resolvedTheme, setTheme } = useTheme();

    const toggle = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="w-9 h-9"
        >
            {resolvedTheme === 'dark' ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

export default ThemeToggle;
