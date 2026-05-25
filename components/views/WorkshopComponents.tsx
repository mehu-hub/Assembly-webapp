'use client';

import * as React from 'react';
import { Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function WorkshopComponents() {
  const [inventory, setInventory] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    fetch('/api/inventory')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInventory(data.filter(inv => inv.workshopQty > 0));
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wrench className="text-indigo-400" size={26} />
            Components in Workshop
          </h2>
          <p className="text-sm text-slate-400 mt-1">View components currently available on the workshop floor.</p>
        </div>
      </div>

      <Card className="border-white/6 shadow-sm bg-[#0f1117] overflow-hidden p-6">
        {isLoading ? (
          <div className="py-8 text-center text-slate-500">Loading workshop inventory...</div>
        ) : inventory.length === 0 ? (
          <div className="py-8 text-center text-slate-500 border border-dashed border-white/10 rounded-xl bg-white/5">
            No components currently in the workshop.
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
                    Workshop Qty: <span className="text-indigo-400 font-bold ml-1">{inv.workshopQty}</span>
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
