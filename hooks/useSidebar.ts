import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  Home, Package, Cpu, BarChart3, Wrench, List, Layers, Calculator, FileBarChart, Archive, DollarSign,
  Boxes, ClipboardList, CheckSquare, LayoutList
} from 'lucide-react';

export interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  children?: NavItem[];
}

export const getNavItems = (dict: any): NavItem[] => [
  { label: dict?.nav?.home || 'Home', href: '/', icon: Home },
  {
    label: dict?.nav?.products || 'Products', icon: Package, href: '/dashboard/products-menu',
    children: [
      { label: dict?.nav?.productList || 'Product List',      href: '/dashboard/products',           icon: List       },
      { label: dict?.nav?.productStructure || 'Product Structure', href: '/dashboard/products/structure', icon: Layers     },
      { label: dict?.nav?.productAssembly || 'Product Assembly',  href: '/dashboard/products/assembly',  icon: Wrench     },
    ],
  },
  {
    label: dict?.nav?.components || 'Components', icon: Cpu, href: '/dashboard/components-menu',
    children: [
      { label: dict?.nav?.componentList || 'Component List',         href: '/dashboard/components',             icon: List },
      { label: dict?.nav?.componentsWorkshop || 'Components in Workshop', href: '/dashboard/components/workshop',    icon: Wrench       },
      { label: dict?.nav?.componentsStorage || 'Components in Storage',  href: '/dashboard/components/storage',     icon: Archive      },
      { label: dict?.nav?.componentInventory || 'Component Inventory',    href: '/dashboard/components/inventory',   icon: Boxes        },
    ],
  },
  {
    label: dict?.nav?.stock || 'Stock', icon: Boxes, href: '/dashboard/stock-menu',
    children: [
      { label: dict?.nav?.componentStock || 'Component Stock',  href: '/dashboard/stock/components', icon: Package    },
      { label: dict?.nav?.stockQuantities || 'Stock Quantities', href: '/dashboard/stock/quantities', icon: BarChart3  },
      { label: dict?.nav?.componentPrices || 'Component Prices', href: '/dashboard/stock/prices',     icon: DollarSign },
    ],
  },
  {
    label: dict?.nav?.assembly || 'Assembly', icon: Wrench, href: '/dashboard/assembly-menu',
    children: [
      { label: dict?.nav?.requiredComponents || 'Required Components',              href: '/dashboard/assembly/required',   icon: ClipboardList },
      { label: dict?.nav?.productsAssembled || 'Products That Can Be Assembled',   href: '/dashboard/assembly/possible',   icon: CheckSquare   },
      { label: dict?.nav?.assemblyCalculator || 'Assembly Calculator',              href: '/dashboard/assembly/calculator', icon: Calculator    },
    ],
  },
  {
    label: dict?.nav?.reports || 'Reports', icon: FileBarChart, href: '/dashboard/reports-menu',
    adminOnly: true,
    children: [
      { label: dict?.nav?.productStructureReport || 'Product Structure Report',      href: '/dashboard/reports',             icon: FileBarChart  },
      { label: dict?.nav?.componentInventoryReport || 'Component Inventory Report',    href: '/dashboard/reports/inventory',   icon: Boxes         },
      { label: dict?.nav?.assemblyPossibilityReport || 'Assembly Possibility Report',   href: '/dashboard/reports/assembly',    icon: CheckSquare   },
    ],
  },
  {
    label: dict?.nav?.forms || 'Forms', icon: LayoutList, href: '/dashboard/forms',
    adminOnly: true,
    children: [
      { label: dict?.nav?.products || 'Products',   href: '/dashboard/forms/products',   icon: Package     },
      { label: dict?.nav?.components || 'Components', href: '/dashboard/forms/components', icon: Cpu         },
      { label: dict?.nav?.stock || 'Stock',      href: '/dashboard/forms/stock',      icon: Boxes       },
      { label: dict?.nav?.assembly || 'Assembly',   href: '/dashboard/forms/assembly',   icon: Wrench      },
      { label: dict?.nav?.reports || 'Reports',    href: '/dashboard/forms/reports',    icon: FileBarChart },
    ],
  },
];

export function useSidebar(dict: any) {
  const pathname = usePathname();
  const currentNavItems = getNavItems(dict);

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    currentNavItems.forEach(item => {
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
    if (href === '/') return pathname === '/' || pathname === '/en' || pathname === '/lt';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return { expanded, setExpanded, toggleGroup, isActive, navItems: currentNavItems };
}
