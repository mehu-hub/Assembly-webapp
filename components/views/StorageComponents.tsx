'use client';

import * as React from 'react';
import { Archive } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function StorageComponents() {
  const [inventory, setInventory] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    fetch('/api/inventory')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInventory(data.filter(inv => inv.storageQty > 0));
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const totalStorageItems = inventory.reduce((sum, item) => sum + (item.storageQty || 0), 0);

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Archive className="text-indigo-400" size={26} />
            Components in Storage
          </h2>
          <p className="text-sm text-slate-400 mt-1">View components currently available in deep storage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <Card className="md:col-span-1 border-white/6 bg-[#0f1117] p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Items in Storage</p>
            <div className="text-3xl font-extrabold text-white">{totalStorageItems}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Archive size={24} />
          </div>
        </Card>
      </div>

      <Card className="border-white/6 shadow-sm bg-[#0f1117] overflow-hidden p-6">
        {isLoading ? (
          <div className="py-8 text-center text-slate-500">Loading storage inventory...</div>
        ) : inventory.length === 0 ? (
          <div className="py-8 text-center text-slate-500 border border-dashed border-white/10 rounded-xl bg-white/5">
            No components currently in storage.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {inventory.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0a0d14] border border-white/5 hover:border-indigo-500/30 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{inv.componentName}</h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-400">
                    Storage Qty: <span className="text-indigo-400 font-bold ml-1">{inv.storageQty}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
