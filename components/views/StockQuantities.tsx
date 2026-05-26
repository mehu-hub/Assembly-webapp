'use client';

import * as React from 'react';
import { BarChart3, Wrench, Archive } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function StockQuantities() {
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
      const workshopQty = inv.workshopQty || 0;
      const storageQty = inv.storageQty || 0;
      return { ...c, workshopQty, storageQty, totalQty: workshopQty + storageQty };
    }).sort((a, b) => b.totalQty - a.totalQty);
  };

  const data = getCombinedData();

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-sm">
          <BarChart3 size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Stock Quantities</h2>
          <p className="text-sm text-slate-400">
            Detailed breakdown of component quantities in workshop vs storage.
          </p>
        </div>
      </div>

      <Card className="border-white/6 bg-[#0f1117] overflow-hidden">
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="py-12 flex justify-center text-slate-500 text-sm">
              Loading quantity data...
            </div>
          ) : data.length === 0 ? (
            <div className="py-12 flex justify-center text-slate-500 text-sm">
              No components found.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-xs text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Component</th>
                  <th className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Wrench size={14} className="text-indigo-400" />
                      Workshop
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Archive size={14} className="text-emerald-400" />
                      Storage
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map((item, i) => (
                  <tr key={i} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200">{item.name}</td>
                    <td className="px-4 py-3 text-right text-indigo-400 font-bold">{item.workshopQty}</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-bold">{item.storageQty}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-white">
                      {item.totalQty} <span className="text-xs text-slate-500 ml-1 font-normal">{item.unit}</span>
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
