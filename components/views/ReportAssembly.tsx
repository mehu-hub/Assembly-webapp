'use client';

import * as React from 'react';
import { CheckSquare, Printer, Check, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReportAssembly() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-5xl mx-auto w-full print:max-w-none print:m-0 print:bg-white print:text-black">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-sm">
            <CheckSquare size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Assembly Possibility Report</h2>
            <p className="text-sm text-slate-400">
              Overview of build capacities and limiting constraints for all products.
            </p>
          </div>
        </div>
        <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
          <Printer size={16} className="mr-2" /> Print Report
        </Button>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-8 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold">Assembly Possibility Report</h1>
        <p className="text-gray-500 mt-2">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
      </div>

      <Card className="border-white/6 bg-[#0f1117] overflow-hidden print:border-gray-300 print:bg-white print:shadow-none">
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="py-12 flex justify-center text-slate-500 text-sm print:hidden">
              Loading report data...
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 flex justify-center text-slate-500 text-sm print:hidden">
              No products found.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 print:bg-gray-100 text-xs text-slate-400 print:text-black uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3 border-b border-white/5 print:border-gray-300">Product Name</th>
                  <th className="px-4 py-3 border-b border-white/5 print:border-gray-300 text-right">Max Capacity</th>
                  <th className="px-4 py-3 border-b border-white/5 print:border-gray-300 text-center">Status</th>
                  <th className="px-4 py-3 border-b border-white/5 print:border-gray-300">Limiting Component</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-gray-200">
                {products.map((product) => {
                  const capacity = product.buildCapacity?.max || 0;
                  const limiting = product.buildCapacity?.limitingComponent;
                  const isZero = capacity === 0;

                  return (
                    <tr key={product.id} className="hover:bg-white/2 transition-colors print:hover:bg-transparent">
                      <td className="px-4 py-3 font-bold text-slate-200 print:text-black">{product.name}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-lg font-extrabold ${isZero ? 'text-red-400' : 'text-emerald-400'} print:text-black`}>
                          {capacity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isZero ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs font-bold print:border print:border-red-400">
                            <AlertTriangle size={12} className="print:hidden" /> Blocked
                          </span>
                        ) : limiting ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-bold print:border print:border-yellow-600 print:text-yellow-700">
                            <AlertTriangle size={12} className="print:hidden" /> Limited
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold print:border print:border-green-600 print:text-green-700">
                            <Check size={12} className="print:hidden" /> Ready
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-400 print:text-black text-xs font-medium">
                        {limiting ? limiting : <span className="text-emerald-500/50 print:text-gray-500 italic">No constraints</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
