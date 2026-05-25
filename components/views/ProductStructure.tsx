'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
 
 
 
 
 
import { Layers, ChevronRight, Search, Package, Edit2, Trash2, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProductStructure } from '@/hooks/useProductStructure';
import { ProductStructureCard } from '@/components/ProductStructureCard';


export default function ProductStructurePage() {
  const router = useRouter();
  const {
    searchTerm,
    setSearchTerm,
    isLoading,
    deleteId,
    setDeleteId,
    filteredProducts,
    handleDelete
  } = useProductStructure();

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
            return (
              <ProductStructureCard 
                key={product.id}
                product={product}
                deleteId={deleteId}
                setDeleteId={setDeleteId}
                handleDelete={handleDelete}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
