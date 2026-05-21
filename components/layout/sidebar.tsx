'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Package, Cpu, BarChart3, Wrench, ChevronDown, ChevronRight,
  List, Layers, Calculator, FileBarChart, Archive, DollarSign,
  Boxes, ClipboardList, CheckSquare, AlertTriangle, Settings, X, Menu, Hexagon, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

// ─── Nav config ──────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  {
    label: 'Products', icon: Package,
    children: [
      { label: 'Product List',      href: '/dashboard/products',           icon: List       },
      { label: 'Product Structure', href: '/dashboard/products/structure', icon: Layers     },
      { label: 'Product Assembly',  href: '/dashboard/products/assembly',  icon: Wrench     },
    ],
  },
  {
    label: 'Components', icon: Cpu,
    children: [
      { label: 'Component List',   href: '/dashboard/components',             icon: List         },
      { label: 'In Workshop',      href: '/dashboard/components/workshop',    icon: Wrench       },
      { label: 'In Storage',       href: '/dashboard/components/storage',     icon: Archive      },
      { label: 'Inventory',        href: '/dashboard/components/inventory',   icon: Boxes        },
    ],
  },
  {
    label: 'Stock', icon: Archive,
    children: [
      { label: 'Component Stock',  href: '/dashboard/stock',             icon: Boxes        },
      { label: 'Stock Quantities', href: '/dashboard/stock/quantities',  icon: BarChart3    },
      { label: 'Component Prices', href: '/dashboard/stock/prices',      icon: DollarSign   },
    ],
  },
  {
    label: 'Assembly', icon: Wrench,
    children: [
      { label: 'Required Components',       href: '/dashboard/assembly/required',   icon: ClipboardList },
      { label: 'Products Assemblable',      href: '/dashboard/assembly/possible',   icon: CheckSquare   },
      { label: 'Assembly Calculator',       href: '/dashboard/assembly/calculator', icon: Calculator    },
    ],
  },
  {
    label: 'Reports', icon: FileBarChart,
    children: [
      { label: 'Product Structure Report',   href: '/dashboard/reports',             icon: FileBarChart  },
      { label: 'Inventory Report',           href: '/dashboard/reports/inventory',   icon: Boxes         },
      { label: 'Assembly Possibility',       href: '/dashboard/reports/assembly',    icon: CheckSquare   },
    ],
  },
];

// ─── Sidebar component ────────────────────────────────────────────────────────
interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getHref = (originalHref: string) => originalHref;

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>(() => {
    // Auto-expand group that matches current path
    const state: Record<string, boolean> = {};
    navItems.forEach(item => {
      if (item.children) {
        const active = item.children.some(child => pathname.startsWith(child.href ?? ''));
        state[item.label] = active;
      }
    });
    return state;
  });

  const toggleGroup = (label: string) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 shadow-lg shadow-indigo-200 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent"></div>
            <Hexagon className="absolute text-white/20 w-8 h-8 rotate-90 transition-transform duration-700 group-hover:rotate-180" strokeWidth={1.5} />
            <Cpu size={20} className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 leading-none">
              AMS
            </span>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mt-1 leading-none">
              Assembly
            </span>
          </div>
        </Link>
        {/* Mobile close button */}
        <button
          className="ml-auto lg:hidden p-1 text-slate-400 hover:text-slate-600"
          onClick={onMobileClose}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map(item => {
          if (!item.children) {
            // Simple nav item
            const active = isActive(item.href!);
            return (
              <Link
                key={item.label}
                href={getHref(item.href!)}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5',
                  active
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon size={17} className={active ? 'text-indigo-600' : 'text-slate-400'} />
                {item.label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
              </Link>
            );
          }

          // Group
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
                    ? 'text-indigo-700 bg-indigo-50/50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
                aria-expanded={isOpen}
              >
                <item.icon size={17} className={hasActive ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="flex-1 text-left">{item.label}</span>
                {isOpen
                  ? <ChevronDown size={15} className="text-slate-400" />
                  : <ChevronRight size={15} className="text-slate-400" />
                }
              </button>

              {isOpen && (
                <div className="ml-4 pl-3 border-l-2 border-slate-100 mt-0.5 mb-1 space-y-0.5">
                  {item.children.map(child => {
                    const active = isActive(child.href ?? '');
                    return (
                      <Link
                        key={child.label}
                        href={getHref(child.href!)}
                        onClick={onMobileClose}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                          active
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        )}
                      >
                        <child.icon size={14} className={active ? 'text-indigo-500' : 'text-slate-400'} />
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
      <div className="px-4 py-4 border-t border-slate-100">
        {user ? (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded"
              title="Log Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] text-slate-400 text-center mb-0.5">Optional: sign in to save data</p>
            <Link href="/auth?mode=login" onClick={onMobileClose} className="w-full">
              <Button variant="outline" className="w-full h-8 text-xs border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-600">
                Log In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-[260px] flex-shrink-0 bg-white border-r border-slate-200 h-screen sticky top-0 overflow-hidden"
        style={{ boxShadow: '2px 0 8px 0 rgb(0 0 0 / 0.04)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <aside className="relative z-10 flex flex-col w-[260px] h-full bg-white shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}

// ─── Mobile menu button (exported for use in header) ─────────────────────────
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
      aria-label="Open navigation"
    >
      <Menu size={20} />
    </button>
  );
}
