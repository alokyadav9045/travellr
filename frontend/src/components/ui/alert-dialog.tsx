import React, { useState } from 'react';

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
}

interface AlertDialogActionProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogCancelProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const AlertDialog = ({
  open,
  onOpenChange,
  children
}: AlertDialogProps) => {
  const [isOpen, setIsOpen] = useState(open || false);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <AlertDialogContext.Provider value={{ isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

export const AlertDialogTrigger = ({ children, ...props }: any) => (
  <div {...props}>{children}</div>
);

export const AlertDialogContent = ({
  children,
  className = ''
}: AlertDialogContentProps) => (
  <div
    className={`
      fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center
      ${className}
    `}
  >
    <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
      {children}
    </div>
  </div>
);

export const AlertDialogHeader = ({ children }: AlertDialogHeaderProps) => (
  <div className="px-6 pt-6">{children}</div>
);

export const AlertDialogFooter = ({ children }: AlertDialogFooterProps) => (
  <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
    {children}
  </div>
);

export const AlertDialogTitle = ({ children }: AlertDialogTitleProps) => (
  <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
);

export const AlertDialogDescription = ({
  children
}: AlertDialogDescriptionProps) => (
  <p className="mt-3 text-sm text-gray-600">{children}</p>
);

export const AlertDialogAction = ({
  onClick,
  children,
  className = ''
}: AlertDialogActionProps) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700
      transition-colors ${className}
    `}
  >
    {children}
  </button>
);

export const AlertDialogCancel = ({
  onClick,
  children,
  className = ''
}: AlertDialogCancelProps) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300
      transition-colors ${className}
    `}
  >
    {children}
  </button>
);

const AlertDialogContext = React.createContext<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  isOpen: false,
  onOpenChange: () => {}
});
