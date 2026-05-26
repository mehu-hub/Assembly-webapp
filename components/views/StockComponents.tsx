'use client';

import * as React from 'react';
import { Package, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function StockComponents() {
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
      const totalQty = (inv.workshopQty || 0) + (inv.storageQty || 0);
      return { ...c, totalQty, inv };
    }).sort((a, b) => a.name.localeCompare(b.name));
  };

  const data = getCombinedData();

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-sm">
          <Package size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Component Stock</h2>
          <p className="text-sm text-slate-400">
            Overview of all components and their overall stock status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center text-slate-500 text-sm">
            Loading stock data...
          </div>
        ) : data.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center gap-3 bg-[#0f1117] rounded-xl border border-white/6">
            <Package size={32} className="text-slate-600" />
            <p className="text-slate-400 text-sm">No components found.</p>
          </div>
        ) : (
          data.map(item => (
            <Card key={item.id} className="border-white/6 bg-[#0f1117] hover:border-indigo-500/20 transition-all duration-300">
              <CardHeader className="pb-3 border-b border-white/6 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-200 truncate pr-2">{item.name}</CardTitle>
                {item.totalQty === 0 ? (
                  <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
                ) : item.totalQty < 10 ? (
                  <AlertTriangle size={18} className="text-amber-400 flex-shrink-0" />
                ) : (
                  <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                )}
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Total Stock</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-extrabold ${item.totalQty === 0 ? 'text-red-400' : 'text-slate-200'}`}>
                      {item.totalQty}
                    </span>
                    <span className="text-xs text-slate-500">{item.unit}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Status</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    item.totalQty === 0 ? 'bg-red-500/10 text-red-400' : 
                    item.totalQty < 10 ? 'bg-amber-500/10 text-amber-400' : 
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {item.totalQty === 0 ? 'Out of Stock' : item.totalQty < 10 ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
