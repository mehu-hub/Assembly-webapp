'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, ChevronRight, Search, Package, Edit2, Trash2, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  products, bomEntries,
  getComponentById, getBOMForProduct, deleteProduct, calculateMaxAssemblies, getTotalQty
} from '@/lib/data';

export default function ProductStructurePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [liveProducts, setLiveProducts] = React.useState(products);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLiveProducts([...products]);
  }, []);

  const filteredProducts = liveProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleDelete(id: string) {
    deleteProduct(id);
    setLiveProducts([...products]);
    setDeleteId(null);
  }

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

      {/* Results as Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <Search className="mx-auto mb-3 text-slate-300" size={32} />
            <p className="text-base font-semibold text-slate-600">No products found matching "{searchTerm}"</p>
            <p className="text-sm text-slate-400">Try a different search term.</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const bom = getBOMForProduct(product.id);
            const totalParts = bom.reduce((acc, curr) => acc + curr.quantityRequired, 0);
            const buildCapacity = calculateMaxAssemblies(product.id);

            return (
              <div 
                key={product.id} 
                className="group relative bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative glowing gradient effect */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-indigo-500/8 to-purple-500/8 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500 pointer-events-none" />

                {/* Card Content with padding */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Top Row: ID Badge & Price tag */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                      {product.id}
                    </span>
                    <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      {product.price !== undefined ? `€${product.price.toFixed(2)}` : '€0.00'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[32px]">
                      {product.description || "No description provided for this product structure."}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-[1px] bg-slate-100 my-3" />

                  {/* Components List / Assembly Tree */}
                  <div className="mb-4 flex-1">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Wrench size={12} className="text-indigo-500" />
                        Required Components
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {bom.length} items
                      </span>
                    </div>

                    {bom.length === 0 ? (
                      <div className="py-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <span className="text-xs text-slate-400 italic">No components assigned yet</span>
                      </div>
                    ) : (
                      <div className="relative pl-3 border-l border-slate-150 flex flex-col gap-2.5 py-0.5">
                        {bom.map((entry) => {
                          const comp = getComponentById(entry.componentId);
                          const totalStock = getTotalQty(entry.componentId);
                          const isLowStock = totalStock < entry.quantityRequired;
                          
                          return (
                            <div key={entry.id} className="relative flex items-center justify-between text-xs">
                              {/* Dot on the timeline */}
                              <div className={`absolute -left-[16.5px] w-2 h-2 rounded-full border-2 bg-white transition-colors duration-300 ${
                                isLowStock 
                                  ? 'border-red-450 group-hover:bg-red-400' 
                                  : 'border-indigo-400 group-hover:bg-indigo-400'
                              }`} />
                              
                              <div className="flex flex-col pl-1 max-w-[70%]">
                                <span className="font-semibold text-slate-700 truncate">
                                  {comp?.name ?? entry.componentId}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  Stock: {totalStock} {comp?.unit ?? 'pcs'}
                                </span>
                              </div>

                              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                                isLowStock 
                                  ? 'bg-red-50 text-red-650 border border-red-100' 
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                x{entry.quantityRequired}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Build Capacity Card */}
                  <div className={`p-3 rounded-xl border mt-auto transition-all duration-300 ${
                    buildCapacity.max > 0 
                      ? 'bg-emerald-50/40 border-emerald-100/80 text-emerald-800' 
                      : 'bg-rose-50/40 border-rose-100/80 text-rose-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        {buildCapacity.max > 0 ? (
                          <CheckCircle2 size={13} className="text-emerald-500" />
                        ) : (
                          <AlertTriangle size={13} className="text-rose-500" />
                        )}
                        Build Capacity
                      </span>
                      <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                        buildCapacity.max > 0 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {buildCapacity.max} {buildCapacity.max === 1 ? 'unit' : 'units'}
                      </span>
                    </div>
                    {buildCapacity.max === 0 && buildCapacity.limitingComponent && (
                      <p className="text-[10px] text-rose-600 mt-1 font-medium leading-normal">
                        Shortage: <span className="font-bold">{buildCapacity.limitingComponent}</span>
                      </p>
                    )}
                    {buildCapacity.max > 0 && buildCapacity.limitingComponent && (
                      <p className="text-[10px] text-emerald-600/80 mt-1 font-medium leading-normal">
                        Limited by: <span className="font-semibold">{buildCapacity.limitingComponent}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer with different background color */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/80 border-t border-slate-100/80 group-hover:bg-slate-50/90 transition-all duration-300">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Layers size={13} className="text-slate-400" />
                    <span className="text-xs font-semibold">{totalParts} <span className="text-slate-400 font-normal">parts</span></span>
                  </div>

                  {/* Actions */}
                  <div>
                    {deleteId === product.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-red-500">Delete?</span>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-2 py-0.5 rounded bg-red-500 hover:bg-red-600 text-white text-[10px] font-extrabold transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-extrabold transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.push(`/dashboard/products/assembly?editId=${product.id}`)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Edit Assembly"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
