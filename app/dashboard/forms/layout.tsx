'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package, Cpu, Boxes, Wrench, FileBarChart,
} from 'lucide-react';
import { FormSection } from '@/lib/form-enums';

const navItems = [
  { label: 'Products',   href: `/dashboard/forms/${FormSection.Products}`,   icon: Package    },
  { label: 'Components', href: `/dashboard/forms/${FormSection.Components}`, icon: Cpu        },
  { label: 'Stock',      href: `/dashboard/forms/${FormSection.Stock}`,      icon: Boxes      },
  { label: 'Assembly',   href: `/dashboard/forms/${FormSection.Assembly}`,   icon: Wrench     },
  { label: 'Reports',    href: `/dashboard/forms/${FormSection.Reports}`,    icon: FileBarChart },
];

export default function FormsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative z-10 flex flex-col gap-4 w-full">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Data Forms</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select a section to enter and submit data with server-side validation.
        </p>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div className="flex gap-6 min-h-[540px]">

        {/* Sidebar nav */}
        <aside className="w-52 flex-shrink-0">
          <nav className="flex flex-col gap-1 p-2 bg-card border border-border rounded-xl shadow-sm">
            {navItems.map(item => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${active
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  <item.icon size={15} className={active ? 'text-indigo-500' : 'text-muted-foreground'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
