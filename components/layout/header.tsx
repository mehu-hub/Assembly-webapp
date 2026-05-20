'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, Search, User } from 'lucide-react';
import { MobileMenuButton } from './sidebar';
import { useAuth } from '@/lib/auth-context';

// ─── Breadcrumb logic ─────────────────────────────────────────────────────────
const routeLabels: Record<string, string> = {
  '':           'Home',
  'products':   'Products',
  'structure':  'Product Structure',
  'assembly':   'Product Assembly',
  'components': 'Components',
  'workshop':   'Workshop',
  'storage':    'Storage',
  'inventory':  'Inventory',
  'stock':      'Stock',
  'quantities': 'Stock Quantities',
  'prices':     'Component Prices',
  'required':   'Required Components',
  'possible':   'Products Assemblable',
  'calculator': 'Assembly Calculator',
  'reports':    'Reports',
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = [{ label: 'Home', href: '/' }];
  let path = '';
  for (const seg of segments) {
    path += `/${seg}`;
    crumbs.push({ label: routeLabels[seg] ?? seg, href: path });
  }
  return crumbs;
}

function getPageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) return 'Home';
  const last = segments[segments.length - 1];
  return routeLabels[last] ?? last;
}

// ─── Header ───────────────────────────────────────────────────────────────────
interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export function Header({ onMobileMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const crumbs = useBreadcrumbs();
  const pageTitle = getPageTitle(pathname);
  const { user } = useAuth();

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-6 h-16 bg-white/90 border-b border-slate-200 backdrop-blur-md"
      style={{ boxShadow: '0 1px 4px 0 rgb(0 0 0 / 0.05)' }}
    >
      {/* Mobile menu trigger */}
      <MobileMenuButton onClick={onMobileMenuOpen} />

      {/* Page title + breadcrumb */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-slate-900 truncate leading-tight">{pageTitle}</h1>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 mt-0.5">
          {crumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              {i > 0 && <ChevronRight size={12} className="text-slate-300 flex-shrink-0" />}
              {i === crumbs.length - 1 ? (
                <span className="text-xs text-slate-500 truncate">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* Search */}
            <button
              className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-400 hover:bg-white hover:border-slate-300 transition-colors w-48"
              aria-label="Search"
            >
              <Search size={14} />
              <span>Search...</span>
              <kbd className="ml-auto text-[10px] font-mono bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* User avatar */}
            <button
              className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="User profile"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                {user.name[0]}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700">{user.name}</span>
            </button>
          </>
        ) : (
          <>
            <Link href="/auth?mode=login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100">
              Login
            </Link>
            <Link href="/auth?mode=signup" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-lg shadow-sm">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
