'use client';

import * as React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
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

import { getNavItems, type NavItem } from '@/hooks/useSidebar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useDictionary } from '@/components/DictionaryProvider';

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
export function Header({ onMobileMenuOpen }: { onMobileMenuOpen?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { items: cartItems, orders } = useCart();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const dict = useDictionary();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              {dict?.nav?.home || 'Home'}
            </Link>
            {getNavItems(dict).map(group => {
              if (group.label === (dict?.nav?.home || 'Home') || group.label === 'Home') return null;
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





          <Link href="/faq" className="hidden sm:flex p-2 mr-1 rounded-lg text-slate-700 dark:text-slate-500 hover:text-indigo-600 dark:text-indigo-400 hover:bg-muted transition-colors" aria-label="FAQ" title="FAQ">
            <HelpCircle size={17} />
          </Link>

          <LanguageSwitcher />

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 mr-2 rounded-lg text-slate-700 dark:text-slate-500 hover:text-yellow-600 dark:text-yellow-400 hover:bg-muted transition-colors"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {mounted ? (theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />) : <Moon size={17} />}
          </button>

          {/* Auth */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2 h-8 px-1 pr-2 rounded-lg transition-colors border border-transparent ${profileOpen ? 'bg-muted border-border shadow-sm' : 'hover:bg-muted'}`} 
                aria-label="Profile"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                  {user.name[0]}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-foreground">{user.name}</span>
                <svg className={`hidden sm:block w-4 h-4 text-muted-foreground transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border shadow-lg rounded-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/dashboard/orders"
                        className="flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <ShoppingBag size={16} className="text-purple-500" />
                          <span>{dict?.nav?.orders || 'Orders'}</span>
                        </div>
                        {orders.length > 0 && (
                          <span className="bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {orders.length}
                          </span>
                        )}
                      </Link>
                    )}

                    {user.role !== 'ADMIN' && (
                      <>
                        <Link 
                          href="/dashboard/my-orders" 
                          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <ShoppingBag size={16} className="text-purple-500" />
                          <span>{dict?.nav?.myOrders || 'My Orders'}</span>
                        </Link>
                        <Link 
                          href="/dashboard/checkout" 
                          className="flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <div className="flex items-center gap-2">
                            <ShoppingCart size={16} className="text-emerald-500" />
                            <span>{dict?.nav?.cart || 'Cart'}</span>
                          </div>
                          {cartItems.length > 0 && (
                            <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {cartItems.length}
                            </span>
                          )}
                        </Link>
                      </>
                    )}
                  </div>
                  
                  <div className="border-t border-border pt-1">
                    <button 
                      onClick={logout}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>{dict?.auth?.logout || 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth?mode=login" className="text-sm font-medium text-muted-foreground hover:text-indigo-600 dark:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-muted">
                {dict?.auth?.login || 'Log in'}
              </Link>
              <Link href="/auth?mode=signup" className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all px-4 py-1.5 rounded-lg shadow-sm shadow-indigo-900/50 active:scale-95">
                {dict?.auth?.signup || 'Get Started'}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
