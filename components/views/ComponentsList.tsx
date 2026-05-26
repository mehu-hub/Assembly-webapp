'use client';

import * as React from 'react';
import { Cpu, Edit2, Save, X } from 'lucide-react';
import { DeleteButton } from '@/components/ui/delete-button';
import { Card } from '@/components/ui/card';
import { Controller } from 'react-hook-form';
import { useComponentsManager } from '@/hooks/useComponentsManager';
import { useIsAdmin } from '@/hooks/useIsAdmin';

export default function ComponentListPage() {
  const isAdmin = useIsAdmin();
  const {
    components,
    isLoading,
    editingId,
    form: { control, handleSubmit, formState: { errors } },
    resetForm,
    handleEdit,
    handleSave,
    handleDelete
  } = useComponentsManager();

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Cpu className="text-indigo-400" size={26} />
            Component List
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Manage hardware components used in product assemblies.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm bg-card overflow-hidden p-6">
        {isAdmin && (
          <form onSubmit={handleSubmit(handleSave)} className="flex flex-col sm:flex-row gap-4 items-start border-b border-border pb-6 mb-6">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Name</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input 
                    {...field}
                    className={`h-10 px-3 border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.name ? 'border-red-500/50' : 'border-border'}`} 
                    placeholder="Component name"
                  />
                )}
              />
              {errors.name && <span className="text-[10px] text-red-400">{errors.name.message}</span>}
            </div>
            <div className="w-24 flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Unit</label>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <input 
                    {...field}
                    className={`h-10 px-3 border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.unit ? 'border-red-500/50' : 'border-border'}`} 
                    placeholder="e.g. pcs"
                  />
                )}
              />
              {errors.unit && <span className="text-[10px] text-red-400">{errors.unit.message}</span>}
            </div>
            <div className="flex-2 flex flex-col gap-2 w-full sm:w-auto sm:flex-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Description</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <input 
                    {...field}
                    value={field.value || ''}
                    className={`h-10 px-3 border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.description ? 'border-red-500/50' : 'border-border'}`} 
                    placeholder="Optional description" 
                  />
                )}
              />
              {errors.description && <span className="text-[10px] text-red-400">{errors.description.message}</span>}
            </div>
            <div className="flex gap-2 w-full sm:w-auto mt-6 sm:mt-6">
              {editingId && (
                <button type="button" onClick={resetForm} className="h-10 px-4 flex items-center justify-center bg-muted-hover hover:bg-white/20 text-foreground rounded-lg transition-colors">
                  <X size={18} />
                </button>
              )}
              <button type="submit" className="h-10 px-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm transition-colors flex-1 sm:flex-none">
                <Save size={18} /> {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading components...</div>
        ) : components.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-muted">
            No components found. Add one above.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {components.map(comp => (
              <div key={comp.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:border-indigo-500/30 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{comp.name} <span className="text-[10px] font-normal text-muted-foreground ml-2 bg-muted-hover px-2 py-0.5 rounded">{comp.unit}</span></h4>
                  <p className="text-xs text-muted-foreground mt-1">{comp.description || 'No description'}</p>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(comp)} className="p-2 text-muted-foreground hover:text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:bg-indigo-500/10 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <DeleteButton onConfirm={() => handleDelete(comp.id)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
