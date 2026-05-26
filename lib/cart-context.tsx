'use client';

import * as React from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  placedAt: Date;
  status: 'pending' | 'processing' | 'completed';
  userId?: string;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (items: CartItem[], userId?: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);

  function addToCart(item: CartItem) {
    setItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }

  function removeFromCart(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  function placeOrder(orderItems: CartItem[], userId?: string) {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: orderItems,
      total: orderItems.reduce((sum, i) => sum + i.price, 0),
      placedAt: new Date(),
      status: 'pending',
      userId,
    };
    setOrders(prev => [newOrder, ...prev]);
    setItems([]);
  }

  function updateOrderStatus(orderId: string, status: Order['status']) {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, orders, placeOrder, updateOrderStatus }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
