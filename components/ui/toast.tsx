'use client';

import * as React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ToastMessage } from '@/lib/types';

// ─── Context ─────────────────────────────────────────────────────────────────
interface ToastContextValue {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 pointer-events-none"
      >
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Item ────────────────────────────────────────────────────────────────────
const toastConfig = {
  success: { icon: CheckCircle, bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon: CheckCircle, iconColor: 'text-emerald-500' },
  error:   { icon: XCircle,     bg: 'bg-red-50 border-red-200',         text: 'text-red-800',     iconColor: 'text-red-500'     },
  warning: { icon: AlertCircle, bg: 'bg-amber-50 border-amber-200',     text: 'text-amber-800',   iconColor: 'text-amber-500'   },
  info:    { icon: Info,        bg: 'bg-indigo-50 border-indigo-200',   text: 'text-indigo-800',  iconColor: 'text-indigo-500'  },
} as const;

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const cfg = toastConfig[toast.type];
  const Icon = cfg.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto toast-enter',
        cfg.bg
      )}
      role="alert"
    >
      <Icon size={18} className={cn('mt-0.5 flex-shrink-0', cfg.iconColor)} />
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold', cfg.text)}>{toast.title}</p>
        {toast.message && <p className={cn('text-xs mt-0.5 opacity-80', cfg.text)}>{toast.message}</p>}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className={cn('flex-shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity', cfg.text)}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
