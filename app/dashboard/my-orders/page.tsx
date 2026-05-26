'use client';

import * as React from 'react';
import { ShoppingBag, Package, Clock, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCart, type Order } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

function statusBadge(status: Order['status']) {
  const map = {
    pending:    { label: 'Pending',    class: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    processing: { label: 'Processing', class: 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
    completed:  { label: 'Completed',  class: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  };
  const s = map[status];
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${s.class}`}>
      {s.label}
    </span>
  );
}

export default function MyOrdersPage() {
  const { orders } = useCart();
  const { user } = useAuth();

  // Filter orders to only show those belonging to the current user
  const myOrders = orders.filter(o => o.userId === user?.id);

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
          <ShoppingBag size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Orders</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            View the status and history of your purchased custom assemblies.
          </p>
        </div>
      </div>

      {/* Orders list */}
      <Card className="border-border bg-card overflow-hidden">
        {myOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag size={28} className="text-slate-600" />
            </div>
            <p className="text-muted-foreground font-medium">You haven't placed any orders yet.</p>
            <Link
              href="/dashboard/products"
              className="px-4 py-2 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              Browse Products <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {myOrders.map(order => (
              <div key={order.id} className="p-5 hover:bg-white/2 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                      <ShoppingBag size={16} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock size={11} /> {order.placedAt.toLocaleTimeString()} · {order.placedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusBadge(order.status)}
                    <span className="text-base font-extrabold text-emerald-400">€{order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="ml-12 flex flex-col gap-1.5">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package size={12} className="text-slate-600" />
                        {item.name}
                      </div>
                      <span className="text-muted-foreground">€{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
