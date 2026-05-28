'use client';

import * as React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import {
  Cpu, ChevronDown, ChevronRight,
  X, Menu, Hexagon, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useSidebar, type NavItem } from '@/hooks/useSidebar';
import { useDictionary } from '@/components/DictionaryProvider';

// ─── Types ───────────────────────────────────────────────────────────────────
interface SidebarContentProps {
  user: { name: string; email: string; role: 'ADMIN' | 'USER' } | null;
  logout: () => void;
  onMobileClose: () => void;
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  toggleGroup: (label: string) => void;
  isActive: (href: string) => boolean;
  navItems: NavItem[];
}

// ─── Sidebar inner content (must live OUTSIDE of the Sidebar fn) ─────────────
function SidebarContent({
  user, logout, onMobileClose, expanded, setExpanded, toggleGroup, isActive, navItems, dict
}: SidebarContentProps & { dict: any }) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 shadow-lg shadow-indigo-200 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent"></div>
            <Hexagon className="absolute text-white/20 w-8 h-8 rotate-90 transition-transform duration-700 group-hover:rotate-180" strokeWidth={1.5} />
            <Cpu size={20} className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300 leading-none">
              AMS
            </span>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mt-1 leading-none">
              Assembly
            </span>
          </div>
        </Link>
        <button
          className="ml-auto lg:hidden p-1 text-muted-foreground hover:text-muted-foreground"
          onClick={onMobileClose}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map(item => {
          if (item.adminOnly && user && user.role !== 'ADMIN') return null;

          if (!item.children) {
            const active = isActive(item.href!);
            return (
              <Link
                key={item.label}
                href={item.href!}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5',
                  active
                    ? 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-muted-foreground hover:bg-white/4 hover:text-foreground'
                )}
              >
                <item.icon size={17} className={active ? 'text-indigo-400' : 'text-muted-foreground'} />
                {item.label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              </Link>
            );
          }

          const isOpen = expanded[item.label];
          const hasActive = item.children.some(child => isActive(child.href ?? ''));

          return (
            <div
              key={item.label}
              className="mb-0.5 group/navItem"
              onMouseEnter={() => setExpanded(prev => ({ ...prev, [item.label]: true }))}
              onMouseLeave={() => setExpanded(prev => ({ ...prev, [item.label]: false }))}
            >
              <button
                onClick={() => toggleGroup(item.label)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  hasActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/8'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                aria-expanded={isOpen}
              >
                <item.icon size={17} className={hasActive ? 'text-indigo-400' : 'text-muted-foreground'} />
                <span className="flex-1 text-left">{item.label}</span>
                {isOpen
                  ? <ChevronDown size={15} className="text-muted-foreground" />
                  : <ChevronRight size={15} className="text-muted-foreground" />
                }
              </button>

              {isOpen && (
                <div className="ml-4 pl-3 border-l-2 border-border mt-0.5 mb-1 space-y-0.5">
                  {item.children.map(child => {
                    if (user && child.adminOnly && user.role !== 'ADMIN') return null;
                    const active = isActive(child.href ?? '');
                    return (
                      <Link
                        key={child.label}
                        href={child.href!}
                        onClick={onMobileClose}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                          active
                            ? 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-400'
                            : 'text-muted-foreground hover:bg-white/4 hover:text-foreground'
                        )}
                      >
                        <child.icon size={14} className={active ? 'text-indigo-400' : 'text-muted-foreground'} />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        {user ? (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-500/20">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-muted-foreground hover:text-red-600 dark:text-red-400 transition-colors p-1 rounded hover:bg-muted"
              title="Log Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] text-muted-foreground text-center mb-0.5">Sign in to access the dashboard</p>
            <Link href="/auth?mode=login" onClick={onMobileClose} className="w-full">
              <Button variant="outline" className="w-full h-8 text-xs border-border hover:bg-indigo-100 dark:bg-indigo-500/10 hover:border-indigo-500/30 text-muted-foreground">
                {dict?.auth?.login || 'Log In'}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar shell ────────────────────────────────────────────────────────────
interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const dict = useDictionary();
  const { expanded, setExpanded, toggleGroup, isActive, navItems } = useSidebar(dict);

  // Hide sidebar entirely for unauthenticated visitors
  if (!user) return null;

  const contentProps: SidebarContentProps = {
    user, logout, onMobileClose, expanded, setExpanded, toggleGroup, isActive, navItems
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-[260px] flex-shrink-0 bg-background border-r border-border h-screen sticky top-0 overflow-hidden"
        style={{ boxShadow: '2px 0 12px 0 rgb(0 0 0 / 0.4)' }}
      >
        <SidebarContent {...contentProps} dict={dict} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className="relative z-10 flex flex-col w-[260px] h-full bg-background shadow-2xl">
            <SidebarContent {...contentProps} dict={dict} />
          </aside>
        </div>
      )}
    </>
  );
}

// ─── Mobile menu button ───────────────────────────────────────────────────────
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      aria-label="Open navigation"
    >
      <Menu size={20} />
    </button>
  );
}
