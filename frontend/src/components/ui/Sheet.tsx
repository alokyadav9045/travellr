'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const SheetContext = React.createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => { } });

export function Sheet({
    children,
    open,
    onOpenChange,
}: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : uncontrolledOpen;
    const setOpen = isControlled ? onOpenChange! : setUncontrolledOpen;

    return (
        <SheetContext.Provider value={{ open: isOpen, setOpen }}>
            {children}
        </SheetContext.Provider>
    );
}

export function SheetTrigger({
    children,
    asChild,
}: {
    children: React.ReactNode;
    asChild?: boolean;
}) {
    const { setOpen } = React.useContext(SheetContext);

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: () => setOpen(true),
        });
    }

    return <button onClick={() => setOpen(true)}>{children}</button>;
}

export function SheetContent({
    children,
    side = 'right',
    className,
}: {
    children: React.ReactNode;
    side?: 'left' | 'right' | 'top' | 'bottom';
    className?: string;
}) {
    const { open, setOpen } = React.useContext(SheetContext);

    const variants = {
        closed: { x: side === 'left' ? '-100%' : '100%' },
        open: { x: 0 },
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={variants}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className={cn(
                            'fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 left-0 h-full border-r sm:max-w-sm',
                            className
                        )}
                    >
                        <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                            <X className="h-4 w-4 cursor-pointer" onClick={() => setOpen(false)} />
                            <span className="sr-only">Close</span>
                        </div>
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function SheetHeader({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}>
            {children}
        </div>
    );
}

export function SheetTitle({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <h2 className={cn('text-lg font-semibold text-foreground', className)}>
            {children}
        </h2>
    );
}
