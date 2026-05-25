'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, ChevronRight, Search, Package, Edit2, Trash2, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


export default function ProductStructurePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [liveProducts, setLiveProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLiveProducts(data);
        } else {
          setLiveProducts([]);
          console.error("API error:", data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setLiveProducts([]);
        setIsLoading(false);
      });
  }, []);

  const filteredProducts = liveProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDelete(id: string) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setLiveProducts(liveProducts.filter(p => p.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="text-indigo-400" size={26} />
            Product Structure
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Find product by part of name and view its combined structure.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/dashboard/products" className="text-indigo-400 hover:underline">Products</Link>
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
          className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-[#0f1117] text-white placeholder:text-slate-500 shadow-sm"
          autoFocus
        />
      </div>

      {/* Results as Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-[#0f1117] border border-white/6 rounded-2xl shadow-sm">
            <p className="text-base font-semibold text-slate-300">Loading...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-[#0f1117] border border-white/6 rounded-2xl shadow-sm">
            <Search className="mx-auto mb-3 text-slate-500" size={32} />
            <p className="text-base font-semibold text-slate-300">No products found matching "{searchTerm}"</p>
            <p className="text-sm text-slate-400">Try a different search term.</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const bom = product.bom || [];
            const totalParts = product.totalParts || 0;
            const buildCapacity = product.buildCapacity || { max: 0, limitingComponent: 'N/A' };

            return (
              <div 
                key={product.id} 
                className="group relative bg-[#0f1117] border border-white/6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative glowing gradient effect */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-indigo-500/8 to-purple-500/8 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500 pointer-events-none" />

                {/* Card Content with padding */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Top Row: ID Badge & Price tag */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/5 text-slate-400 rounded-md">
                      {product.id}
                    </span>
                    <span className="text-xs font-extrabold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                      {product.price !== undefined ? `€${product.price.toFixed(2)}` : '€0.00'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[32px]">
                      {product.description || "No description provided for this product structure."}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-[1px] bg-white/10 my-3" />

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
                      <div className="py-4 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                        <span className="text-xs text-slate-500 italic">No components assigned yet</span>
                      </div>
                    ) : (
                      <div className="relative pl-3 border-l border-white/10 flex flex-col gap-2.5 py-0.5">
                        {bom.map((entry: any) => {
                          const isLowStock = entry.isLowStock;
                          
                          return (
                            <div key={entry.id} className="relative flex items-center justify-between text-xs">
                              {/* Dot on the timeline */}
                              <div className={`absolute -left-[16.5px] w-2 h-2 rounded-full border-2 bg-white transition-colors duration-300 ${
                                isLowStock 
                                  ? 'border-red-450 group-hover:bg-red-400' 
                                  : 'border-indigo-400 group-hover:bg-indigo-400'
                              }`} />
                              
                              <div className="flex flex-col pl-1 max-w-[70%]">
                                <span className="font-semibold text-slate-200 truncate">
                                  {entry.componentName ?? entry.componentId}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  Stock: {entry.totalStock} {entry.componentUnit ?? 'pcs'}
                                </span>
                              </div>

                              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                                isLowStock 
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                  : 'bg-white/10 text-slate-300'
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
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
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
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {buildCapacity.max} {buildCapacity.max === 1 ? 'unit' : 'units'}
                      </span>
                    </div>
                    {buildCapacity.max === 0 && buildCapacity.limitingComponent && (
                      <p className="text-[10px] text-rose-400 mt-1 font-medium leading-normal">
                        Shortage: <span className="font-bold">{buildCapacity.limitingComponent}</span>
                      </p>
                    )}
                    {buildCapacity.max > 0 && buildCapacity.limitingComponent && (
                      <p className="text-[10px] text-emerald-400/80 mt-1 font-medium leading-normal">
                        Limited by: <span className="font-semibold">{buildCapacity.limitingComponent}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer with different background color */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-white/5 border-t border-white/10 group-hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Layers size={13} className="text-slate-500" />
                    <span className="text-xs font-semibold">{totalParts} <span className="text-slate-500 font-normal">parts</span></span>
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
                          className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[10px] font-extrabold transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.push(`/dashboard/products/assembly?editId=${product.id}`)}
                          className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                          title="Edit Assembly"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
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
