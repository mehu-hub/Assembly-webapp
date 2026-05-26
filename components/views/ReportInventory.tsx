'use client';

import * as React from 'react';
import { Boxes, Printer, Coins } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReportInventory() {
  const [inventory, setInventory] = React.useState<any[]>([]);
  const [components, setComponents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      fetch('/api/components').then(r => r.json()),
      fetch('/api/inventory').then(r => r.json())
    ]).then(([compsData, invData]) => {
      if (Array.isArray(compsData)) setComponents(compsData);
      if (Array.isArray(invData)) setInventory(invData);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const data = React.useMemo(() => {
    return components.map(c => {
      const inv = inventory.find(i => i.componentId === c.id) || {};
      const unitPrice = inv.unitPrice || 0;
      const workshopQty = inv.workshopQty || 0;
      const storageQty = inv.storageQty || 0;
      const totalQty = workshopQty + storageQty;
      const totalValue = unitPrice * totalQty;
      return { ...c, unitPrice, workshopQty, storageQty, totalQty, totalValue };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [components, inventory]);

  const grandTotal = data.reduce((sum, item) => sum + item.totalValue, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-5xl mx-auto w-full print:max-w-none print:m-0 print:bg-white print:text-black">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
            <Boxes size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Inventory Report</h2>
            <p className="text-sm text-muted-foreground">
              Comprehensive valuation and location breakdown of current stock.
            </p>
          </div>
        </div>
        <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
          <Printer size={16} className="mr-2" /> Print Report
        </Button>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-6 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold">Inventory Valuation Report</h1>
        <p className="text-gray-700 dark:text-gray-500 mt-2">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 print:flex print:justify-between print:mb-6">
        <Card className="md:col-span-1 border-border bg-card p-5 print:border-gray-300 print:bg-gray-50 print:shadow-none">
          <p className="text-xs font-bold text-muted-foreground uppercase mb-2 print:text-black">Total Valuation</p>
          <div className="flex items-center gap-2">
            <Coins className="text-amber-600 dark:text-amber-400 print:text-black" size={24} />
            <span className="text-3xl font-extrabold text-foreground print:text-black">
              €{grandTotal.toFixed(2)}
            </span>
          </div>
        </Card>
      </div>

      <Card className="border-border bg-card overflow-hidden print:border-gray-300 print:bg-white print:shadow-none">
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="py-12 flex justify-center text-muted-foreground text-sm print:hidden">
              Loading report data...
            </div>
          ) : data.length === 0 ? (
            <div className="py-12 flex justify-center text-muted-foreground text-sm print:hidden">
              No inventory found.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted print:bg-gray-100 text-xs text-muted-foreground print:text-black uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3 border-b border-border print:border-gray-300">Component</th>
                  <th className="px-4 py-3 border-b border-border print:border-gray-300 text-right">Workshop</th>
                  <th className="px-4 py-3 border-b border-border print:border-gray-300 text-right">Storage</th>
                  <th className="px-4 py-3 border-b border-border print:border-gray-300 text-right">Total Qty</th>
                  <th className="px-4 py-3 border-b border-border print:border-gray-300 text-right">Unit Price</th>
                  <th className="px-4 py-3 border-b border-border print:border-gray-300 text-right">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-gray-200">
                {data.map((item, i) => (
                  <tr key={i} className="hover:bg-white/2 transition-colors print:hover:bg-transparent">
                    <td className="px-4 py-2.5 font-medium text-foreground print:text-black">{item.name}</td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground print:text-black">{item.workshopQty}</td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground print:text-black">{item.storageQty}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-amber-600 dark:text-amber-400 print:text-black">{item.totalQty} {item.unit}</td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground print:text-black">€{item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-right font-extrabold text-foreground print:text-black">€{item.totalValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-white/2 print:bg-gray-50 border-t border-border print:border-gray-400">
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-right font-bold text-muted-foreground print:text-black uppercase tracking-wider text-xs">Grand Total</td>
                  <td className="px-4 py-4 text-right font-extrabold text-amber-600 dark:text-amber-400 print:text-black text-lg">€{grandTotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
