'use client';

import * as React from 'react';
import { Package, Trash2, Cpu, Zap, Server } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import type { Product } from '@/lib/types';

export default function ProductListPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [componentsCount, setComponentsCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const { addToast } = useToast();

  React.useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }
        setIsLoading(false);
      }).catch(() => {
        setItems([]);
        setIsLoading(false);
      });
      
    fetch('/api/components')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setComponentsCount(data.length);
        }
      }).catch(() => setComponentsCount(0));
  }, []);

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setItems(items.filter(p => p.id !== id));
      setDeleteId(null);
      addToast({
        type: 'success',
        title: 'Product deleted',
        message: 'The product was successfully removed.',
      });
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to delete product.' });
    }
  }

  const totalBuildable = items.reduce((sum, p) => sum + (p.buildCapacity?.max || 0), 0);

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-3xl mx-auto w-full">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="text-indigo-400" size={26} />
            Product List
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {items.length} product{items.length !== 1 ? 's' : ''} registered
          </p>
        </div>
      </div>

      {/* ── Minimal Tech Dashboard ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
        <Card className="border-white/6 bg-[#0f1117] shadow-sm overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:border-indigo-500/20">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-indigo-500/10 rounded-full group-hover:scale-[2] transition-transform duration-700 ease-out z-0"></div>
          <div className="p-5 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered</p>
              <Package className="text-indigo-400 transition-transform duration-300 group-hover:-translate-y-1" size={18} />
            </div>
            <p className="text-3xl font-extrabold text-white">{items.length}</p>
          </div>
        </Card>
        
        <Card className="border-white/6 bg-[#0f1117] shadow-sm overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:border-emerald-500/20">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-emerald-500/10 rounded-full group-hover:scale-[2] transition-transform duration-700 ease-out z-0"></div>
          <div className="p-5 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ready to Build</p>
              <div className="relative">
                <Zap className="text-emerald-400 relative z-10 transition-transform duration-300 group-hover:scale-110" size={18} />
                <div className="absolute inset-0 bg-emerald-400 blur-md opacity-30 animate-pulse"></div>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">{totalBuildable} <span className="text-sm font-bold text-slate-500 ml-1">units</span></p>
          </div>
        </Card>

        <Card className="border-white/6 bg-[#0f1117] shadow-sm overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:border-blue-500/20">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-500/10 rounded-full group-hover:scale-[2] transition-transform duration-700 ease-out z-0"></div>
          <div className="p-5 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Component Types</p>
              <Cpu className="text-blue-400 animate-[spin_4s_linear_infinite]" size={18} />
            </div>
            <p className="text-3xl font-extrabold text-white">{componentsCount}</p>
          </div>
        </Card>
      </div>

      {/* ── Product list ── */}
      <Card className="border-white/6 bg-[#0f1117] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-sm font-medium text-slate-500">Loading products...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
              <Package size={26} className="text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-500">No products yet</p>
            <p className="text-xs text-slate-600">Go to Product Assembly to create a new product.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/4">
            {items.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-4 px-5 py-4 group hover:bg-white/3 transition-colors"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 truncate">{product.name}</p>
                </div>

                {/* Delete */}
                {deleteId === product.id ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-500">Delete?</span>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setDeleteId(null)}
                      className="px-2.5 py-1 rounded-lg border border-white/10 text-slate-400 text-xs font-semibold hover:bg-white/5 transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    id={`delete-${product.id}`}
                    onClick={() => setDeleteId(product.id)}
                    className="flex-shrink-0 p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
                    title="Delete product"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
