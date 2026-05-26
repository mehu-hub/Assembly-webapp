'use client';

import { useActionState } from 'react';
import { submitReportForm } from '@/lib/form-actions';
import { initialFormState, SubmitStatus, ReportCategory } from '@/lib/form-enums';
import { FileBarChart, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReportsFormPage() {
  const [state, action, pending] = useActionState(submitReportForm, initialFormState);

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <FileBarChart size={18} className="text-purple-500" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">New Report</h2>
          <p className="text-xs text-muted-foreground">Submit a report request. Category is validated via enum on the server.</p>
        </div>
      </div>

      {/* Form */}
      <form action={action} className="p-6 flex flex-col gap-5">

        {/* Title */}
        <div>
          <label htmlFor="rep-title" className="block text-sm font-semibold text-foreground mb-1.5">
            Report Title <span className="text-red-500">*</span>
          </label>
          <input
            id="rep-title"
            name="title"
            type="text"
            placeholder="e.g. Q2 Inventory Summary"
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
          {state.errors.title && (
            <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
              <AlertCircle size={12} /> {state.errors.title}
            </p>
          )}
        </div>

        {/* Category — values come from ReportCategory enum */}
        <div>
          <label htmlFor="rep-cat" className="block text-sm font-semibold text-foreground mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="rep-cat"
            name="category"
            defaultValue=""
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          >
            <option value="" disabled>Select a category…</option>
            <option value={ReportCategory.ProductStructure}>Product Structure</option>
            <option value={ReportCategory.Inventory}>Component Inventory</option>
            <option value={ReportCategory.AssemblyPossibility}>Assembly Possibility</option>
          </select>
          {state.errors.category && (
            <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
              <AlertCircle size={12} /> {state.errors.category}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="rep-content" className="block text-sm font-semibold text-foreground mb-1.5">
            Content / Notes <span className="text-red-500">*</span>
          </label>
          <textarea
            id="rep-content"
            name="content"
            rows={4}
            placeholder="Describe what this report should cover…"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
          />
          {state.errors.content && (
            <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1.5">
              <AlertCircle size={12} /> {state.errors.content}
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
          {pending ? <><Loader2 size={15} className="animate-spin" /> Submitting…</> : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
