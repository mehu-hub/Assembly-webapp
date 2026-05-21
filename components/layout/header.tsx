'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Home, ChevronRight, Cpu, Search } from 'lucide-react';
import { MobileMenuButton } from './sidebar';
import { useAuth } from '@/lib/auth-context';

// ─── Route labels ─────────────────────────────────────────────────────────────
const routeLabels: Record<string, string> = {
  '':           'Home',
  'dashboard':  'Dashboard',
  'products':   'Products',
  'structure':  'Structure',
  'assembly':   'Assembly',
  'components': 'Components',
  'workshop':   'Workshop',
  'storage':    'Storage',
  'inventory':  'Inventory',
  'stock':      'Stock',
  'quantities': 'Quantities',
  'prices':     'Prices',
  'required':   'Required',
  'possible':   'Assemblable',
  'calculator': 'Calculator',
  'reports':    'Reports',
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
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
      className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 h-16 bg-white/95 border-b border-slate-200 backdrop-blur-md"
      style={{ boxShadow: '0 1px 4px 0 rgb(0 0 0 / 0.05)' }}
    >
      {/* Mobile menu trigger */}
      <MobileMenuButton onClick={onMobileMenuOpen} />

      {/* Brand — mobile only (desktop uses sidebar logo) */}
      <Link
        href="/"
        className="lg:hidden flex items-center gap-2 flex-shrink-0"
        aria-label="Home"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
          <Cpu size={15} className="text-white" />
        </div>
        <span className="hidden sm:block text-sm font-bold text-slate-800">
          PC <span className="text-indigo-600">Assembly</span>
        </span>
      </Link>

      {/* Page title — fills remaining space */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-bold text-slate-900 truncate">{pageTitle}</h1>
      </div>

      {/* ── Right side: Breadcrumb + divider + actions ── */}
      <div className="flex items-center gap-3 flex-shrink-0">

        {/* Breadcrumb with home icon */}
        <nav
          aria-label="Breadcrumb"
          className="hidden md:flex items-center gap-1.5 text-sm"
        >
          {/* Home icon link */}
          <Link
            href="/"
            className="flex items-center justify-center w-7 h-7 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
            aria-label="Home"
          >
            <Home size={15} />
          </Link>

          {crumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              <span className="text-slate-300 select-none">/</span>
              {i === crumbs.length - 1 ? (
                <span className="text-slate-400 text-sm font-medium px-1">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-slate-600 hover:text-indigo-600 font-medium px-1 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-slate-200" />

        {/* Auth / User actions */}
        {user ? (
          <>
            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* User avatar */}
            <button
              className="flex items-center gap-2 h-8 px-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="User profile"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                {user.name[0]}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-slate-700 pr-1">{user.name}</span>
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth?mode=login"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              Log in
            </Link>
            <Link
              href="/auth?mode=signup"
              className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all px-4 py-1.5 rounded-lg shadow-sm shadow-indigo-200 active:scale-95"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
