'use client';

import * as React from 'react';
import { DollarSign, Coins } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function StockPrices() {
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

  const getCombinedData = () => {
    return components.map(c => {
      const inv = inventory.find(i => i.componentId === c.id) || {};
      const unitPrice = inv.unitPrice || 0;
      const totalQty = (inv.workshopQty || 0) + (inv.storageQty || 0);
      const totalValue = unitPrice * totalQty;
      return { ...c, unitPrice, totalQty, totalValue };
    }).sort((a, b) => b.totalValue - a.totalValue);
  };

  const data = getCombinedData();
  const totalPortfolioValue = data.reduce((sum, item) => sum + item.totalValue, 0);

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
          <DollarSign size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Component Prices</h2>
          <p className="text-sm text-muted-foreground">
            View unit prices and total inventory value for all components.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <Card className="md:col-span-1 border-border bg-card p-5">
          <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Total Inventory Value</p>
          <div className="flex items-center gap-2">
            <Coins className="text-amber-400" size={24} />
            <span className="text-3xl font-extrabold text-foreground">
              €{totalPortfolioValue.toFixed(2)}
            </span>
          </div>
        </Card>
      </div>

      <Card className="border-border bg-card overflow-hidden">
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="py-12 flex justify-center text-muted-foreground text-sm">
              Loading price data...
            </div>
          ) : data.length === 0 ? (
            <div className="py-12 flex justify-center text-muted-foreground text-sm">
              No components found.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-xs text-muted-foreground uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Component</th>
                  <th className="px-4 py-3 text-right">Total Qty</th>
                  <th className="px-4 py-3 text-right">Unit Price (€)</th>
                  <th className="px-4 py-3 text-right">Total Value (€)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map((item, i) => (
                  <tr key={i} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{item.totalQty} {item.unit}</td>
                    <td className="px-4 py-3 text-right text-indigo-600 dark:text-indigo-400 font-medium">{item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-amber-400">
                      {item.totalValue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
