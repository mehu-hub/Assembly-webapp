'use client';

import * as React from 'react';
import { ClipboardList, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DeleteButton } from '@/components/ui/delete-button';
import { Controller } from 'react-hook-form';
import { useDataEntryManager } from '@/hooks/useDataEntryManager';
import { useIsAdmin } from '@/hooks/useIsAdmin';

export default function DataEntryPage() {
  const isAdmin = useIsAdmin();
  const {
    entries,
    isLoading,
    form: { control, handleSubmit, formState: { errors } },
    handleSave,
    handleDelete
  } = useDataEntryManager();

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="text-indigo-400" size={26} />
            Data Entry Form
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Submit new records using the generic data form.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm bg-card overflow-hidden p-6">
        {isAdmin && (
          <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Title</label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <input 
                    {...field}
                    className={`h-10 px-3 border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.title ? 'border-red-500/50' : 'border-border'}`} 
                    placeholder="Enter title"
                  />
                )}
              />
              {errors.title && <span className="text-[10px] text-red-400">{errors.title.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <select 
                    {...field}
                    className={`h-10 px-3 border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.category ? 'border-red-500/50' : 'border-border'}`} 
                  >
                    <option value="" disabled>Select category...</option>
                    <option value="hardware">Hardware</option>
                    <option value="software">Software</option>
                    <option value="services">Services</option>
                  </select>
                )}
              />
              {errors.category && <span className="text-[10px] text-red-400">{errors.category.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Content</label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <textarea 
                    {...field}
                    rows={4}
                    className={`p-3 border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.content ? 'border-red-500/50' : 'border-border'}`} 
                    placeholder="Enter detailed content..."
                  />
                )}
              />
              {errors.content && <span className="text-[10px] text-red-400">{errors.content.message}</span>}
            </div>

            <div className="flex justify-end mt-4">
              <button type="submit" className="h-10 px-6 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm transition-colors">
                <Save size={18} /> Submit Data
              </button>
            </div>
          </form>
        )}

        {/* Entries List */}
        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Submitted Data Entries</h3>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading entries...</div>
          ) : entries.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-muted">
              No data entries found. Add one above.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {entries.map(entry => (
                <div key={entry.id} className="p-4 rounded-xl bg-background border border-border hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-foreground">{entry.title}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-100 dark:bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-wider border border-indigo-500/20">
                        {entry.category}
                      </span>
                      {isAdmin && <DeleteButton onConfirm={() => handleDelete(entry.id)} />}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
