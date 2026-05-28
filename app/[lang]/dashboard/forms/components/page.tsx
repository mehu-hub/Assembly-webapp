'use client';

import { useActionState } from 'react';
import { submitComponentForm } from '@/lib/form-actions';
import { initialFormState, SubmitStatus } from '@/lib/form-enums';
import { Cpu, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ComponentsFormPage() {
  const [state, action, pending] = useActionState(submitComponentForm, initialFormState);

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Cpu size={18} className="text-blue-500" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">New Component</h2>
          <p className="text-xs text-muted-foreground">Register a raw component. Name and unit are required.</p>
        </div>
      </div>

      {/* Form */}
      <form action={action} className="p-6 flex flex-col gap-5">

        {/* Name */}
        <div>
          <label htmlFor="comp-name" className="block text-sm font-semibold text-foreground mb-1.5">
            Component Name <span className="text-red-500">*</span>
          </label>
          <input
            id="comp-name"
            name="name"
            type="text"
            placeholder="e.g. Intel Core i9-14900K"
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
          {state.errors.name && (
            <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
              <AlertCircle size={12} /> {state.errors.name}
            </p>
          )}
        </div>

        {/* Unit */}
        <div>
          <label htmlFor="comp-unit" className="block text-sm font-semibold text-foreground mb-1.5">
            Unit of Measure <span className="text-red-500">*</span>
          </label>
          <input
            id="comp-unit"
            name="unit"
            type="text"
            placeholder="e.g. pcs, kg, m"
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
          {state.errors.unit && (
            <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
              <AlertCircle size={12} /> {state.errors.unit}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="comp-desc" className="block text-sm font-semibold text-foreground mb-1.5">
            Description <span className="text-muted-foreground text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="comp-desc"
            name="description"
            rows={3}
            placeholder="Optional notes about this component…"
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
          {pending ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : 'Save Component'}
        </button>
      </form>
    </div>
  );
}
