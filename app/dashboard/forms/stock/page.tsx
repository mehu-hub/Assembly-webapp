'use client';

import { useActionState } from 'react';
import { submitStockForm } from '@/lib/form-actions';
import { initialFormState, SubmitStatus } from '@/lib/form-enums';
import { Boxes, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StockFormPage() {
  const [state, action, pending] = useActionState(submitStockForm, initialFormState);

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <Boxes size={18} className="text-emerald-500" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Stock Entry</h2>
          <p className="text-xs text-muted-foreground">Record inventory quantities and unit price for a component.</p>
        </div>
      </div>

      {/* Form */}
      <form action={action} className="p-6 flex flex-col gap-5">

        {/* Component ID */}
        <div>
          <label htmlFor="stock-compId" className="block text-sm font-semibold text-foreground mb-1.5">
            Component ID <span className="text-red-500">*</span>
          </label>
          <input
            id="stock-compId"
            name="componentId"
            type="text"
            placeholder="MongoDB ObjectId of the component"
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow font-mono"
          />
          {state.errors.componentId && (
            <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
              <AlertCircle size={12} /> {state.errors.componentId}
            </p>
          )}
        </div>

        {/* Workshop + Storage side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="stock-workshop" className="block text-sm font-semibold text-foreground mb-1.5">
              Workshop Qty <span className="text-red-500">*</span>
            </label>
            <input
              id="stock-workshop"
              name="workshopQty"
              type="number"
              min="0"
              placeholder="0"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            {state.errors.workshopQty && (
              <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
                <AlertCircle size={12} /> {state.errors.workshopQty}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="stock-storage" className="block text-sm font-semibold text-foreground mb-1.5">
              Storage Qty <span className="text-red-500">*</span>
            </label>
            <input
              id="stock-storage"
              name="storageQty"
              type="number"
              min="0"
              placeholder="0"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            {state.errors.storageQty && (
              <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
                <AlertCircle size={12} /> {state.errors.storageQty}
              </p>
            )}
          </div>
        </div>

        {/* Unit Price */}
        <div>
          <label htmlFor="stock-price" className="block text-sm font-semibold text-foreground mb-1.5">
            Unit Price (€) <span className="text-red-500">*</span>
          </label>
          <input
            id="stock-price"
            name="unitPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
          {state.errors.unitPrice && (
            <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
              <AlertCircle size={12} /> {state.errors.unitPrice}
            </p>
          )}
        </div>

        {/* Success */}
        {state.status === SubmitStatus.Success && state.message && (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
            <CheckCircle2 size={15} /> {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 h-10 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {pending ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : 'Save Stock Entry'}
        </button>
      </form>
    </div>
  );
}
