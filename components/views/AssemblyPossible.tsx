'use client';

import * as React from 'react';
import { CheckSquare, AlertCircle, Package, Settings2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AssemblyPossible() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-sm">
          <CheckSquare size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Products Assemblable</h2>
          <p className="text-sm text-slate-400">
            Current build capacities based on your available workshop and storage inventory.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center text-slate-500 text-sm">
            Calculating capacities...
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center gap-3 bg-[#0f1117] rounded-xl border border-white/6">
            <Package size={32} className="text-slate-600" />
            <p className="text-slate-400 text-sm">No products configured yet.</p>
          </div>
        ) : (
          products.map(product => {
            const capacity = product.buildCapacity?.max || 0;
            const limiting = product.buildCapacity?.limitingComponent;
            const isZero = capacity === 0;

            return (
              <Card key={product.id} className="border-white/6 bg-[#0f1117] hover:border-indigo-500/20 transition-all duration-300 group">
                <CardHeader className="pb-3 border-b border-white/6">
                  <CardTitle className="text-lg font-bold text-slate-200 flex items-center justify-between">
                    <span className="truncate pr-4">{product.name}</span>
                    <Package size={18} className="text-indigo-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Max Assemblable</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold ${isZero ? 'text-red-400' : 'text-emerald-400'}`}>
                        {capacity}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 uppercase">units</span>
                    </div>
                  </div>

                  {limiting && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/4 border border-white/5">
                      <AlertCircle size={16} className={isZero ? "text-red-400 shrink-0 mt-0.5" : "text-amber-400 shrink-0 mt-0.5"} />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">Limiting Component</span>
                        <span className="text-sm font-medium text-slate-300">{limiting}</span>
                      </div>
                    </div>
                  )}

                  {!limiting && capacity > 0 && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <Settings2 size={16} className="text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-300">Sufficient stock for all parts</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
