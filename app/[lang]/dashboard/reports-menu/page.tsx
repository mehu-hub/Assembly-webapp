import React from 'react';
import { FileBarChart, Boxes, CheckSquare } from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Card } from '@/components/ui/card';
import { useDictionary } from '@/components/DictionaryProvider';

export default function Page() {
  const dict = useDictionary();
  const menuItems = [
    { label: dict?.nav?.productStructureReport || 'Product Structure Report', href: '/dashboard/reports', icon: FileBarChart, desc: dict?.menu?.repDescStruct || 'Generate reports detailing product BOMs.' },
    { label: dict?.nav?.componentInventoryReport || 'Component Inventory Report', href: '/dashboard/reports/inventory', icon: Boxes, desc: dict?.menu?.repDescInv || 'Generate detailed inventory level reports.' },
    { label: dict?.nav?.assemblyPossibilityReport || 'Assembly Possibility Report', href: '/dashboard/reports/assembly', icon: CheckSquare, desc: dict?.menu?.repDescPoss || 'Generate reports on assembly capacity based on current stock.' },
  ];

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileBarChart className="text-indigo-400" size={26} />
            {dict?.menu?.reportsMenu || 'Reports Menu'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{dict?.menu?.reportsDesc || 'Select a report to generate and view.'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.label}>
            <Card className="p-6 h-full flex items-start gap-4 hover:border-indigo-500/50 hover:bg-muted/50 transition-all cursor-pointer">
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500">
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
