import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
 
  Home, Package, Cpu, BarChart3, Wrench, List, Layers, Calculator, FileBarChart, Archive, DollarSign,
  Boxes, ClipboardList, CheckSquare
} from 'lucide-react';

export interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  {
    label: 'Products', icon: Package, href: '/dashboard/products-menu',
    children: [
      { label: 'Product List',      href: '/dashboard/products',           icon: List       },
      { label: 'Product Structure', href: '/dashboard/products/structure', icon: Layers     },
      { label: 'Product Assembly',  href: '/dashboard/products/assembly',  icon: Wrench     },
    ],
  },
  {
    label: 'Components', icon: Cpu, href: '/dashboard/components-menu',
    children: [
      { label: 'Component List',         href: '/dashboard/components',             icon: List },
      { label: 'Components in Workshop', href: '/dashboard/components/workshop',    icon: Wrench       },
      { label: 'Components in Storage',  href: '/dashboard/components/storage',     icon: Archive      },
      { label: 'Component Inventory',    href: '/dashboard/components/inventory',   icon: Boxes        },
    ],
  },
  {
    label: 'Stock', icon: Boxes, href: '/dashboard/stock-menu',
    children: [
      { label: 'Component Stock',  href: '/dashboard/stock/components', icon: Package    },
      { label: 'Stock Quantities', href: '/dashboard/stock/quantities', icon: BarChart3  },
      { label: 'Component Prices', href: '/dashboard/stock/prices',     icon: DollarSign },
    ],
  },
  {
    label: 'Assembly', icon: Wrench, href: '/dashboard/assembly-menu',
    children: [
      { label: 'Required Components',              href: '/dashboard/assembly/required',   icon: ClipboardList },
      { label: 'Products That Can Be Assembled',   href: '/dashboard/assembly/possible',   icon: CheckSquare   },
      { label: 'Assembly Calculator',              href: '/dashboard/assembly/calculator', icon: Calculator    },
    ],
  },
  {
    label: 'Reports', icon: FileBarChart, href: '/dashboard/reports-menu',
    adminOnly: true,
    children: [
      { label: 'Product Structure Report',      href: '/dashboard/reports',             icon: FileBarChart  },
      { label: 'Component Inventory Report',    href: '/dashboard/reports/inventory',   icon: Boxes         },
      { label: 'Assembly Possibility Report',   href: '/dashboard/reports/assembly',    icon: CheckSquare   },
    ],
  },
  {
    label: 'Data Entry', icon: ClipboardList, href: '/dashboard/data-entry',
    adminOnly: true,
  },
];

export function useSidebar() {
  const pathname = usePathname();

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>(() => {
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

  return { expanded, setExpanded, toggleGroup, isActive, navItems };
}
