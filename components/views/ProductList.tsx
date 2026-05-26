'use client';

import * as React from 'react';
import { Package, Trash2, Cpu, Zap, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { ToastStatus, type Product } from '@/lib/types';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useCart } from '@/lib/cart-context';

export default function ProductListPage() {
  const isAdmin = useIsAdmin();
  const { items: cartItems, addToCart, removeFromCart } = useCart();
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
        type: ToastStatus.SUCCESS,
        title: 'Product deleted',
        message: 'The product was successfully removed.',
      });
    } catch (error) {
      addToast({ type: ToastStatus.ERROR, title: 'Error', message: 'Failed to delete product.' });
    }
  }

  const totalBuildable = items.reduce((sum, p) => sum + (p.buildCapacity?.max || 0), 0);

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-3xl mx-auto w-full">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="text-indigo-400" size={26} />
            Product List
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} product{items.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {/* ── Minimal Tech Dashboard ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
        <Card className="border-border bg-card shadow-sm overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:border-indigo-500/20">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-indigo-100 dark:bg-indigo-500/10 rounded-full group-hover:scale-[2] transition-transform duration-700 ease-out z-0"></div>
          <div className="p-5 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Registered</p>
              <Package className="text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:-translate-y-1" size={18} />
            </div>
            <p className="text-3xl font-extrabold text-foreground">{items.length}</p>
          </div>
        </Card>
        
        <Card className="border-border bg-card shadow-sm overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:border-emerald-500/20">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full group-hover:scale-[2] transition-transform duration-700 ease-out z-0"></div>
          <div className="p-5 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ready to Build</p>
              <div className="relative">
                <Zap className="text-emerald-600 dark:text-emerald-400 relative z-10 transition-transform duration-300 group-hover:scale-110" size={18} />
                <div className="absolute inset-0 bg-emerald-400 blur-md opacity-30 animate-pulse"></div>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-foreground">{totalBuildable} <span className="text-sm font-bold text-muted-foreground ml-1">units</span></p>
          </div>
        </Card>

        <Card className="border-border bg-card shadow-sm overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:border-blue-500/20">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-100 dark:bg-blue-500/10 rounded-full group-hover:scale-[2] transition-transform duration-700 ease-out z-0"></div>
          <div className="p-5 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Component Types</p>
              <Cpu className="text-blue-600 dark:text-blue-400 animate-[spin_4s_linear_infinite]" size={18} />
            </div>
            <p className="text-3xl font-extrabold text-foreground">{componentsCount}</p>
          </div>
        </Card>
      </div>

      {/* ── Product list ── */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-sm font-medium text-muted-foreground">Loading products...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <Package size={26} className="text-slate-600" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No products yet</p>
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
                  <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                </div>

                {/* User actions */}
                {!isAdmin && (() => {
                  const inCart = cartItems.some(i => i.id === product.id);
                  return (
                    <button
                      onClick={() => inCart
                        ? removeFromCart(product.id)
                        : addToCart({ id: product.id, name: product.name, price: product.price ?? 0 })
                      }
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                        inCart
                          ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20'
                          : 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 hover:bg-emerald-500/20'
                      }`}
                    >
                      <ShoppingCart size={14} /> {inCart ? 'Remove' : 'Add'}
                    </button>
                  );
                })()}

                {/* Admin Delete */}
                {isAdmin && (
                  deleteId === product.id ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">Delete?</span>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="px-2.5 py-1 rounded-lg border border-border text-muted-foreground text-xs font-semibold hover:bg-muted transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`delete-${product.id}`}
                      onClick={() => setDeleteId(product.id)}
                      className="flex-shrink-0 p-2 rounded-lg text-slate-600 hover:text-red-600 dark:text-red-400 hover:bg-red-100 dark:bg-red-500/10 transition-all duration-150"
                      title="Delete product"
                    >
                      <Trash2 size={15} />
                    </button>
                  )
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
