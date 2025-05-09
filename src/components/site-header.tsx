import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function SiteHeader() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
          <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
          <span>PneumoCheck</span>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
