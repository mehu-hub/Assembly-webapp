'use client';

import { useActionState } from 'react';
import { submitAssemblyForm } from '@/lib/form-actions';
import { initialFormState, SubmitStatus } from '@/lib/form-enums';
import { Wrench, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AssemblyFormPage() {
  const [state, action, pending] = useActionState(submitAssemblyForm, initialFormState);

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
        <div className="p-2 rounded-lg bg-amber-500/10">
          <Wrench size={18} className="text-amber-500" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Assembly Requirement</h2>
          <p className="text-xs text-muted-foreground">Link a component to a product with the required quantity.</p>
        </div>
      </div>

      {/* Form */}
      <form action={action} className="p-6 flex flex-col gap-5">

        {/* Product ID + Component ID */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="asm-prodId" className="block text-sm font-semibold text-foreground mb-1.5">
              Product ID <span className="text-red-500">*</span>
            </label>
            <input
              id="asm-prodId"
              name="productId"
              type="text"
              placeholder="Product ObjectId"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow font-mono"
            />
            {state.errors.productId && (
              <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
                <AlertCircle size={12} /> {state.errors.productId}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="asm-compId" className="block text-sm font-semibold text-foreground mb-1.5">
              Component ID <span className="text-red-500">*</span>
            </label>
            <input
              id="asm-compId"
              name="componentId"
              type="text"
              placeholder="Component ObjectId"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow font-mono"
            />
            {state.errors.componentId && (
              <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
                <AlertCircle size={12} /> {state.errors.componentId}
              </p>
            )}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="asm-qty" className="block text-sm font-semibold text-foreground mb-1.5">
            Quantity Required <span className="text-red-500">*</span>
          </label>
          <input
            id="asm-qty"
            name="quantity"
            type="number"
            min="1"
            placeholder="1"
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
          {state.errors.quantity && (
            <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
              <AlertCircle size={12} /> {state.errors.quantity}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="asm-notes" className="block text-sm font-semibold text-foreground mb-1.5">
            Notes <span className="text-muted-foreground text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="asm-notes"
            name="notes"
            rows={2}
            placeholder="Optional assembly notes…"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
          />
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
          {pending ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : 'Save Requirement'}
        </button>
      </form>
    </div>
  );
}
