import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { StructuredData } from './StructuredData';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const breadcrumbItems = [{ name: 'Home', url: '/' }, ...items];

  return (
    <>
      <StructuredData
        type="BreadcrumbList"
        data={{ items: breadcrumbItems }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}
      >
        <Link
          href="/"
          className="hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {items.map((item, index) => (
          <div key={item.url} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {index === items.length - 1 ? (
              <span className="text-gray-900 font-medium">{item.name}</span>
            ) : (
              <Link
                href={item.url}
                className="hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
