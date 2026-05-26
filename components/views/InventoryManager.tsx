'use client';

import * as React from 'react';
import { Boxes, Edit2, Save, X } from 'lucide-react';
import { DeleteButton } from '@/components/ui/delete-button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { Controller } from 'react-hook-form';
import { useInventoryManager } from '@/hooks/useInventoryManager';
import { useIsAdmin } from '@/hooks/useIsAdmin';

export default function InventoryPage() {
  const isAdmin = useIsAdmin();
  const {
    inventory,
    components,
    isLoading,
    editingId,
    form: { control, handleSubmit, formState: { errors } },
    resetForm,
    handleEdit,
    handleSave,
    handleDelete
  } = useInventoryManager();

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Boxes className="text-indigo-400" size={26} />
            Inventory List
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Manage component stock across workshop and storage.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm bg-card overflow-hidden p-6">
        {isAdmin && (
          <form onSubmit={handleSubmit(handleSave)} className="flex flex-col sm:flex-row gap-4 items-start border-b border-border pb-6 mb-6">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Component</label>
              <Controller
                name="componentId"
                control={control}
                render={({ field }) => (
                  <select 
                    {...field}
                    className={`h-10 px-3 border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.componentId ? 'border-red-500/50' : 'border-border'}`} 
                  >
                    <option value="" disabled>Select Component...</option>
                    {components.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
              />
              {errors.componentId && <span className="text-[10px] text-red-400">{errors.componentId.message}</span>}
            </div>
            <div className="w-24 flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Workshop</label>
              <Controller
                name="workshopQty"
                control={control}
                render={({ field }) => (
                  <input 
                    type="number" min="0" 
                    {...field}
                    className={`h-10 px-3 border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.workshopQty ? 'border-red-500/50' : 'border-border'}`} 
                  />
                )}
              />
              {errors.workshopQty && <span className="text-[10px] text-red-400">{errors.workshopQty.message}</span>}
            </div>
            <div className="w-24 flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Storage</label>
              <Controller
                name="storageQty"
                control={control}
                render={({ field }) => (
                  <input 
                    type="number" min="0" 
                    {...field}
                    className={`h-10 px-3 border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.storageQty ? 'border-red-500/50' : 'border-border'}`} 
                  />
                )}
              />
              {errors.storageQty && <span className="text-[10px] text-red-400">{errors.storageQty.message}</span>}
            </div>
            <div className="w-24 flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Unit Price</label>
              <Controller
                name="unitPrice"
                control={control}
                render={({ field }) => (
                  <input 
                    type="number" step="0.01" min="0" 
                    {...field}
                    className={`h-10 px-3 border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.unitPrice ? 'border-red-500/50' : 'border-border'}`} 
                  />
                )}
              />
              {errors.unitPrice && <span className="text-[10px] text-red-400">{errors.unitPrice.message}</span>}
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
          <div className="py-8 text-center text-muted-foreground">Loading inventory...</div>
        ) : inventory.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-muted">
            No inventory found. Add one above.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {inventory.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:border-indigo-500/30 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{inv.componentName}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Workshop: <span className="text-muted-foreground font-semibold">{inv.workshopQty}</span> | 
                    Storage: <span className="text-muted-foreground font-semibold">{inv.storageQty}</span> | 
                    Total: <span className="text-indigo-300 font-semibold">{inv.workshopQty + inv.storageQty}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-emerald-400">€{inv.unitPrice.toFixed(2)}</span>
                  {isAdmin && (
                    <div className="flex items-center gap-2 border-l border-border pl-4">
                      <button onClick={() => handleEdit(inv)} className="p-2 text-muted-foreground hover:text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:bg-indigo-500/10 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <DeleteButton onConfirm={() => handleDelete(inv.id)} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
