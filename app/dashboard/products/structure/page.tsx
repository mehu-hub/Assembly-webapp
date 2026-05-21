'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, ChevronRight, Search, Package, Edit2, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  products, bomEntries,
  getComponentById, getBOMForProduct, deleteProduct
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

            return (
              <Card key={product.id} className="border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md hover:border-indigo-200">
                {/* Card Header */}
                <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-br from-slate-50/50 to-white">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                      <Package size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base line-clamp-1">{product.name}</h3>
                      <p className="text-sm font-medium text-slate-500">
                        {product.price !== undefined ? `€${product.price.toFixed(2)}` : 'No price set'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body - Components */}
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Components Structure</p>
                  {bom.length === 0 ? (
                    <div className="py-4 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
                      <span className="text-xs text-slate-400 italic">No components assigned yet</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {bom.map(entry => {
                        const comp = getComponentById(entry.componentId);
                        return (
                          <Badge key={entry.id} variant="outline" className="bg-white border-slate-200 text-slate-700 font-medium px-2.5 py-1 shadow-sm">
                            <span className="truncate max-w-[120px] sm:max-w-[150px] inline-block align-bottom">{comp?.name ?? entry.componentId}</span>
                            <span className="text-indigo-600 font-bold ml-1.5 bg-indigo-50 px-1.5 rounded text-[10px]">×{entry.quantityRequired}</span>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Layers size={14} className="text-slate-400" />
                    <span className="text-sm font-semibold">{totalParts} <span className="text-xs font-normal text-slate-400">total parts</span></span>
                  </div>
                  
                  {/* Actions */}
                  <div>
                    {deleteId === product.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-red-500">Delete?</span>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => router.push(`/dashboard/products/assembly?editId=${product.id}`)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
