'use client';

import * as React from 'react';
import Link from 'next/link';
import { Layers, ChevronRight, Search, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  products, bomEntries,
  getComponentById, getBOMForProduct,
} from '@/lib/data';

export default function ProductStructurePage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [liveProducts, setLiveProducts] = React.useState(products);

  React.useEffect(() => {
    setLiveProducts([...products]);
  }, []);

  const filteredProducts = liveProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="text-indigo-600" size={26} />
            Product Structure
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Find product by part of name and view its combined structure.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/dashboard/products" className="text-indigo-600 hover:underline">Products</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">Structure</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search product by part of name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white shadow-sm"
          autoFocus
        />
      </div>

      {/* Unified Table */}
      <Card className="border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Product Name</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Price</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Components & Quantities</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">Total Parts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <Search className="mx-auto mb-3 text-slate-300" size={24} />
                    <p>No products found matching "{searchTerm}"</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const bom = getBOMForProduct(product.id);
                  const totalParts = bom.reduce((acc, curr) => acc + curr.quantityRequired, 0);

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                            <Package size={16} />
                          </div>
                          <span className="font-semibold text-slate-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-600">
                          {product.price !== undefined ? `€${product.price.toFixed(2)}` : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {bom.length === 0 ? (
                          <span className="text-xs text-slate-400 italic">No components</span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {bom.map(entry => {
                              const comp = getComponentById(entry.componentId);
                              return (
                                <Badge key={entry.id} variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 font-medium">
                                  {comp?.name ?? entry.componentId} <span className="text-indigo-600 ml-1">×{entry.quantityRequired}</span>
                                </Badge>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                          {totalParts}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
