'use client';

import { useActionState } from 'react';
import { submitProductForm } from '@/lib/form-actions';
import { initialFormState, SubmitStatus } from '@/lib/form-enums';
import { Package, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProductsFormPage() {
  const [state, action, pending] = useActionState(submitProductForm, initialFormState);

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
        <div className="p-2 rounded-lg bg-indigo-500/10">
          <Package size={18} className="text-indigo-500" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">New Product</h2>
          <p className="text-xs text-muted-foreground">Add a product to the catalog. All fields are validated on the server.</p>
        </div>
      </div>

      {/* Form */}
      <form action={action} className="p-6 flex flex-col gap-5">

        {/* Name */}
        <div>
          <label htmlFor="prod-name" className="block text-sm font-semibold text-foreground mb-1.5">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            id="prod-name"
            name="name"
            type="text"
            placeholder="e.g. Gaming PC Pro"
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
          {state.errors.name && (
            <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
              <AlertCircle size={12} /> {state.errors.name}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="prod-desc" className="block text-sm font-semibold text-foreground mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="prod-desc"
            name="description"
            rows={3}
            placeholder="Describe the product…"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
          />
          {state.errors.description && (
            <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
              <AlertCircle size={12} /> {state.errors.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="prod-price" className="block text-sm font-semibold text-foreground mb-1.5">
            Price (€) <span className="text-red-500">*</span>
          </label>
          <input
            id="prod-price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
          {state.errors.price && (
            <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
              <AlertCircle size={12} /> {state.errors.price}
            </p>
          )}
        </div>

        {/* Success / submit */}
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
          {pending ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : 'Save Product'}
        </button>
      </form>
    </div>
  );
}
