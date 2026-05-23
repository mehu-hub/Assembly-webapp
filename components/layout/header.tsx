'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Package, Cpu, Archive, Wrench, FileBarChart,
  List, Layers, Boxes, DollarSign, ClipboardList,
  CheckSquare, Calculator, BarChart3, ChevronDown,
  Bell, Home as HomeIcon, ChevronRight, Hexagon
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

// ─── Nav config ───────────────────────────────────────────────────────────────
interface NavChild {
  label: string;
  href: string;
  icon: React.ElementType;
}
interface NavGroup {
  label: string;
  icon: React.ElementType;
  children: NavChild[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Products', icon: Package,
    children: [
      { label: 'Product List',      href: '/dashboard/products',           icon: List    },
      { label: 'Product Structure', href: '/dashboard/products/structure', icon: Layers  },
      { label: 'Product Assembly',  href: '/dashboard/products/assembly',  icon: Wrench  },
    ],
  },
  {
    label: 'Components', icon: Cpu,
    children: [
      { label: 'Component List', href: '/dashboard/components',           icon: List    },
      { label: 'In Workshop',    href: '/dashboard/components/workshop',  icon: Wrench  },
      { label: 'In Storage',     href: '/dashboard/components/storage',   icon: Archive },
      { label: 'Inventory',      href: '/dashboard/components/inventory', icon: Boxes   },
    ],
  },
  {
    label: 'Stock', icon: Archive,
    children: [
      { label: 'Component Stock',  href: '/dashboard/stock',            icon: Boxes      },
      { label: 'Quantities',       href: '/dashboard/stock/quantities', icon: BarChart3  },
      { label: 'Prices',           href: '/dashboard/stock/prices',     icon: DollarSign },
    ],
  },
  {
    label: 'Assembly', icon: Wrench,
    children: [
      { label: 'Required Components', href: '/dashboard/assembly/required',   icon: ClipboardList },
      { label: 'Assemblable',         href: '/dashboard/assembly/possible',   icon: CheckSquare   },
      { label: 'Calculator',          href: '/dashboard/assembly/calculator', icon: Calculator    },
    ],
  },
  {
    label: 'Reports', icon: FileBarChart,
    children: [
      { label: 'Product Structure Report', href: '/dashboard/reports',           icon: FileBarChart },
      { label: 'Inventory Report',         href: '/dashboard/reports/inventory', icon: Boxes        },
      { label: 'Assembly Possibility',     href: '/dashboard/reports/assembly',  icon: CheckSquare  },
    ],
  },
];

// ─── Route labels for breadcrumb ──────────────────────────────────────────────
const routeLabels: Record<string, string> = {
  '': 'Home', dashboard: 'Dashboard', products: 'Products',
  structure: 'Structure', assembly: 'Assembly', components: 'Components',
  workshop: 'Workshop', storage: 'Storage', inventory: 'Inventory',
  stock: 'Stock', quantities: 'Quantities', prices: 'Prices',
  required: 'Required', possible: 'Assemblable', calculator: 'Calculator',
  reports: 'Reports',
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
  return routeLabels[segments[segments.length - 1]] ?? segments[segments.length - 1];
}

// ─── Dropdown menu item ────────────────────────────────────────────────────────
function NavDropdown({ group }: { group: NavGroup }) {
  const pathname = usePathname();
  const isGroupActive = group.children.some(c => pathname.startsWith(c.href));

  return (
    <div className="relative group">
      <button
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors
          ${isGroupActive
            ? 'text-indigo-400 bg-indigo-500/10'
            : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }`}
      >
        <group.icon size={15} />
        {group.label}
        <ChevronDown size={13} className="mt-0.5 transition-transform duration-200 group-hover:rotate-180" />
      </button>

      {/* Dropdown panel */}
      <div className="absolute top-full left-0 mt-1 w-52 bg-[#0f1117] border border-white/8 rounded-xl shadow-2xl shadow-black/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 py-1.5">
        {group.children.map(child => {
          const isActive = pathname === child.href || pathname.startsWith(child.href + '/');
          return (
            <Link
              key={child.href}
              href={child.href}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors mx-1.5 rounded-lg
                ${isActive
                  ? 'text-indigo-400 bg-indigo-500/10 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 font-medium'
                }`}
            >
              <child.icon size={15} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
              {child.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────
export function Header({ onMobileMenuOpen }: { onMobileMenuOpen: () => void }) {
  const pathname = usePathname();
  const crumbs = useBreadcrumbs();
  const pageTitle = getPageTitle(pathname);
  const { user } = useAuth();

  return (
    <header
      className="sticky top-0 z-30 w-full bg-[#0a0d14]/95 border-b border-white/6 backdrop-blur-md"
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
            <span className="text-base font-extrabold tracking-tight text-white">
              AMS
            </span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.18em] mt-0.5">
              Assembly
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="hidden lg:block w-px h-6 bg-white/8 flex-shrink-0" />

        {/* ── Desktop nav groups with hover dropdowns ── */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors
              ${pathname === '/' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}
          >
            <HomeIcon size={15} />
            Home
          </Link>
          {navGroups.map(group => (
            <NavDropdown key={group.label} group={group} />
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
          onClick={onMobileMenuOpen}
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* ── Right: Breadcrumb + divider + auth ── */}
        <div className="flex items-center gap-3 ml-auto flex-shrink-0">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1 text-sm">
            <Link href="/" className="flex items-center justify-center w-7 h-7 rounded-md text-indigo-400 hover:bg-indigo-500/10 transition-colors" aria-label="Home">
              <HomeIcon size={14} />
            </Link>
            {crumbs.map((crumb, i) => (
              <React.Fragment key={crumb.href}>
                <span className="text-slate-600">/</span>
                {i === crumbs.length - 1 ? (
                  <span className="text-slate-500 text-xs font-medium px-1">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-xs text-slate-500 hover:text-indigo-400 font-medium px-1 transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="hidden md:block w-px h-5 bg-white/8" />

          {/* Auth */}
          {user ? (
            <>
              <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors" aria-label="Notifications">
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-[#0a0d14]" />
              </button>
              <button className="flex items-center gap-2 h-8 px-1 rounded-lg hover:bg-white/5 transition-colors" aria-label="Profile">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                  {user.name[0]}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-slate-300 pr-1">{user.name}</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/auth?mode=login" className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
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
