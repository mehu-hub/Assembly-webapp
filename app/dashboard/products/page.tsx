'use client';

import * as React from 'react';
import { Package, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { products, deleteProduct } from '@/lib/data';
import type { Product } from '@/lib/types';

export default function ProductListPage() {
  const [items, setItems] = React.useState<Product[]>(products);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const { addToast } = useToast();

  React.useEffect(() => {
    // Sync with global products on mount (in case it changed on another page)
    setItems([...products]);
  }, []);

  function handleDelete(id: string) {
    deleteProduct(id);
    setItems([...products]);
    setDeleteId(null);
    addToast({
      type: 'success',
      title: 'Product deleted',
      message: 'The product was successfully removed.',
    });
  }

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-3xl mx-auto w-full">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="text-indigo-600" size={26} />
            Product List
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {items.length} product{items.length !== 1 ? 's' : ''} registered
          </p>
        </div>
      </div>

      {/* ── Product list ── */}
      <Card className="border-slate-100 bg-white shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <Package size={26} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">No products yet</p>
            <p className="text-xs text-slate-400">Go to Product Assembly to create a new product.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {items.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-4 px-5 py-4 group hover:bg-slate-50/80 transition-colors"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
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
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    id={`delete-${product.id}`}
                    onClick={() => setDeleteId(product.id)}
                    className="flex-shrink-0 p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-150"
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
