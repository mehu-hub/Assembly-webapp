'use client';

import * as React from 'react';
import { ShoppingBag, Package, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCart, type Order } from '@/lib/cart-context';

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

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useCart();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
          <ShoppingBag size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Customer Orders</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            View all orders placed by users in this session.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card p-5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Orders</p>
          <p className="text-3xl font-extrabold text-foreground">{orders.length}</p>
        </Card>
        <Card className="border-border bg-card p-5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Items Ordered</p>
          <p className="text-3xl font-extrabold text-foreground">
            {orders.reduce((sum, o) => sum + o.items.length, 0)}
          </p>
        </Card>
        <Card className="border-border bg-card p-5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Revenue</p>
          <p className="text-3xl font-extrabold text-emerald-400">€{totalRevenue.toFixed(2)}</p>
        </Card>
      </div>

      {/* Orders list */}
      <Card className="border-border bg-card overflow-hidden">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag size={28} className="text-slate-600" />
            </div>
            <p className="text-muted-foreground font-medium">No orders yet.</p>
            <p className="text-xs text-slate-600">Orders will appear here when users complete checkout.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {orders.map(order => (
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
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      className="text-xs font-semibold bg-background border border-border text-muted-foreground rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <option value="pending">Set Pending</option>
                      <option value="processing">Set Processing</option>
                      <option value="completed">Set Completed</option>
                    </select>
                    {statusBadge(order.status)}
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 ml-2">€{order.total.toFixed(2)}</span>
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
