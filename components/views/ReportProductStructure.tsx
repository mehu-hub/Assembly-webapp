'use client';

import * as React from 'react';
import { FileBarChart, Printer, Package, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReportProductStructure() {
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
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-sm">
            <Layers size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Product Structure Report</h2>
            <p className="text-sm text-slate-400">
              Complete catalog of products and their Bill of Materials.
            </p>
          </div>
        </div>
        <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
          <Printer size={16} className="mr-2" /> Print Report
        </Button>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-8 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold">Product Structure Report</h1>
        <p className="text-gray-500 mt-2">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
      </div>

      <div className="flex flex-col gap-8">
        {isLoading ? (
          <div className="py-12 flex justify-center text-slate-500 text-sm print:hidden">
            Loading report data...
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 flex justify-center text-slate-500 text-sm print:hidden">
            No products found.
          </div>
        ) : (
          products.map(product => (
            <Card key={product.id} className="border-white/6 bg-[#0f1117] overflow-hidden print:border-gray-300 print:bg-white print:shadow-none print:break-inside-avoid">
              <div className="p-4 border-b border-white/6 bg-white/5 print:bg-gray-100 print:border-gray-300 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-purple-400 print:text-black" />
                  <h3 className="text-lg font-bold text-white print:text-black">{product.name}</h3>
                </div>
                <div className="text-sm font-bold text-indigo-400 print:text-black">
                  Unit Price: €{product.price.toFixed(2)}
                </div>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/2 print:bg-gray-50 text-xs text-slate-400 print:text-gray-600 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3 border-b border-white/5 print:border-gray-300">Component Name</th>
                      <th className="px-4 py-3 border-b border-white/5 print:border-gray-300 text-right">Quantity Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 print:divide-gray-200">
                    {product.bom && product.bom.length > 0 ? (
                      product.bom.map((b: any, i: number) => (
                        <tr key={i} className="hover:bg-white/2 transition-colors print:hover:bg-transparent">
                          <td className="px-4 py-2 font-medium text-slate-200 print:text-black">{b.componentName}</td>
                          <td className="px-4 py-2 text-right text-purple-400 print:text-black font-semibold">
                            {b.quantityRequired} <span className="text-xs text-slate-500 print:text-gray-500 font-normal ml-1">{b.componentUnit}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-4 text-center text-slate-500 print:text-gray-500 italic">
                          No components defined for this product.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
