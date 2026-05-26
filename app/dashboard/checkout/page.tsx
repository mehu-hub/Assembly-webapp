'use client';

import * as React from 'react';
import { ShoppingCart, CheckCircle, CreditCard, ArrowRight, Trash2, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export default function CheckoutPage() {
  const { items, removeFromCart, placeOrder } = useCart();
  const { user } = useAuth();
  const [isOrdered, setIsOrdered] = React.useState(false);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleConfirmOrder = () => {
    placeOrder(items, user?.email);
    setIsOrdered(true);
  };

  if (isOrdered) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center py-24 px-4 w-full">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
          <CheckCircle size={40} className="text-emerald-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground mb-3">Order Confirmed!</h2>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          Thank you for your purchase. Your order has been successfully placed and is now being processed by our assembly team.
        </p>
        <Link
          href="/dashboard/my-orders"
          className="px-6 py-3 bg-muted hover:bg-muted-hover border border-border text-foreground rounded-xl font-semibold transition-colors flex items-center gap-2"
        >
          View My Orders <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
          <ShoppingCart size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Cart & Checkout</h2>
          <p className="text-sm text-muted-foreground">
            {items.length === 0 ? 'Your cart is empty.' : `${items.length} item${items.length !== 1 ? 's' : ''} in your cart.`}
          </p>
        </div>
      </div>

      <Card className="border-border bg-card overflow-hidden p-6 shadow-xl">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Package size={28} className="text-slate-600" />
            </div>
            <p className="text-muted-foreground font-medium">No items in cart yet.</p>
            <Link
              href="/dashboard/products"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              Browse Products <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-4">Order Summary</h3>

            <div className="flex flex-col gap-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-muted border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-200 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Package size={18} />
                    </div>
                    <div>
                      <p className="text-foreground font-semibold text-sm">{item.name}</p>
                      <p className="text-muted-foreground text-xs">Custom Assembly</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-emerald-600 dark:text-emerald-400 font-extrabold">€{item.price.toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove from cart"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted border border-border">
              <p className="text-muted-foreground font-semibold">Total to pay</p>
              <p className="text-foreground text-2xl font-extrabold">€{total.toFixed(2)}</p>
            </div>

            <div className="pt-2 border-t border-border">
              <button
                onClick={handleConfirmOrder}
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/50 transition-all active:scale-95"
              >
                <CreditCard size={20} />
                Confirm Order
              </button>
              <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                <CheckCircle size={12} className="text-emerald-500" /> Secure checkout. No actual payment required.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
