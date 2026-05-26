'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
 
 
 
 
  Home, Package, Cpu, Archive, Wrench, FileBarChart,
 
 
 
 
  List, Layers, Boxes, DollarSign, ClipboardList,
 
 
  CheckSquare, Calculator, BarChart3, ChevronDown,
  HelpCircle, Home as HomeIcon, ChevronRight, Hexagon, LogOut, ShoppingCart, ShoppingBag, Moon, Sun
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { useTheme } from 'next-themes';

import { navItems, type NavItem } from '@/hooks/useSidebar';

// Breadcrumbs removed as requested

function NavDropdown({ group }: { group: NavItem }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isGroupActive = pathname === group.href || (group.children && group.children.some(c => pathname.startsWith(c.href ?? '')));

  return (
    <div className="relative group">
      <Link href={group.href ?? '#'}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors
          ${isGroupActive
            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
            : 'text-muted-foreground hover:text-slate-100 hover:bg-muted'
          }`}
      >
        <group.icon size={15} />
        {group.label}
        {group.children && <ChevronDown size={13} className="mt-0.5 transition-transform duration-200 group-hover:rotate-180" />}
      </Link>

      {/* Dropdown panel */}
      {group.children && (
        <div className="absolute top-full left-0 mt-1 w-52 bg-card border border-white/8 rounded-xl shadow-2xl shadow-black/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 py-1.5">
          {group.children.map(child => {
            if (user && child.adminOnly && user.role !== 'ADMIN') return null;
            const childHref = child.href ?? '/';
            const isActive = pathname === childHref || pathname.startsWith(childHref + '/');
            return (
              <Link
                key={childHref}
                href={childHref}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors mx-1.5 rounded-lg
                  ${isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 font-semibold'
                    : 'text-muted-foreground hover:text-slate-100 hover:bg-muted font-medium'
                  }`}
              >
                <child.icon size={15} className={isActive ? 'text-indigo-400' : 'text-muted-foreground'} />
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────
export function Header({ onMobileMenuOpen }: { onMobileMenuOpen: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { items: cartItems, orders } = useCart();
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-30 w-full bg-background/95 border-b border-border backdrop-blur-md"
      style={{ boxShadow: '0 1px 12px 0 rgb(0 0 0 / 0.5)' }}
    >
      {/* ── Main row ── */}
      <div className="flex items-center gap-4 px-6 h-16 w-full">

        {/* Brand / Logo — always visible */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group mr-4" aria-label="Home">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-900/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
            <Hexagon className="absolute text-white/20 w-7 h-7 rotate-90 transition-transform duration-700 group-hover:rotate-180" strokeWidth={1.5} />
            <Cpu size={17} className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-extrabold tracking-tight text-foreground">
              AMS
            </span>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.18em] mt-0.5">
              Assembly
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="hidden lg:block w-px h-6 bg-white/8 flex-shrink-0" />

        {/* ── Desktop nav groups with hover dropdowns ── */}
        {user && (
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors
                ${pathname === '/' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' : 'text-muted-foreground hover:text-slate-100 hover:bg-muted'}`}
            >
              <HomeIcon size={15} />
              Home
            </Link>
            {navItems.map(group => {
              if (group.label === 'Home') return null;
              if (group.adminOnly && user.role !== 'ADMIN') return null;
              return <NavDropdown key={group.label} group={group} />;
            })}
          </nav>
        )}

        {/* Mobile menu button */}
        {user && (
          <button
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            onClick={onMobileMenuOpen}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}

        {/* ── Right: Auth ── */}
        <div className="flex items-center gap-3 ml-auto flex-shrink-0">



          {user && user.role === 'ADMIN' && (
            <Link
              href="/dashboard/orders"
              className="relative p-2 mr-1 rounded-lg text-muted-foreground hover:text-purple-600 dark:text-purple-400 hover:bg-muted transition-colors"
              aria-label="Orders"
              title="Customer Orders"
            >
              <ShoppingBag size={17} />
              {orders.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-purple-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </Link>
          )}

          {user && user.role !== 'ADMIN' && (
            <>
              <Link href="/dashboard/my-orders" className="relative p-2 mr-1 rounded-lg text-muted-foreground hover:text-purple-600 dark:text-purple-400 hover:bg-muted transition-colors" aria-label="My Orders" title="My Orders">
                <ShoppingBag size={17} />
              </Link>
              <Link href="/dashboard/checkout" className="relative p-2 mr-1 rounded-lg text-muted-foreground hover:text-emerald-600 dark:text-emerald-400 hover:bg-muted transition-colors" aria-label="Cart" title="Cart">
                <ShoppingCart size={17} />
                {cartItems.length > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                ) : (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500/40 rounded-full"></span>
                )}
              </Link>
            </>
          )}

          <Link href="/faq" className="p-2 mr-1 rounded-lg text-slate-700 dark:text-slate-500 hover:text-indigo-600 dark:text-indigo-400 hover:bg-muted transition-colors" aria-label="FAQ" title="FAQ">
            <HelpCircle size={17} />
          </Link>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 mr-2 rounded-lg text-slate-700 dark:text-slate-500 hover:text-yellow-600 dark:text-yellow-400 hover:bg-muted transition-colors"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Auth */}
          {user ? (
            <>
              <button className="flex items-center gap-2 h-8 px-1 rounded-lg hover:bg-muted transition-colors" aria-label="Profile">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                  {user.name[0]}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-muted-foreground pr-1">{user.name}</span>
              </button>
              <div className="w-px h-4 bg-muted-hover mx-1 hidden sm:block" />
              <button 
                onClick={logout}
                className="p-2 rounded-lg text-muted-foreground hover:text-red-600 dark:text-red-400 hover:bg-red-100 dark:bg-red-500/10 transition-colors"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link href="/auth?mode=login" className="text-sm font-medium text-muted-foreground hover:text-indigo-600 dark:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-muted">
                Log in
              </Link>
              <Link href="/auth?mode=signup" className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all px-4 py-1.5 rounded-lg shadow-sm shadow-indigo-900/50 active:scale-95">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
