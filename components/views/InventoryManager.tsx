'use client';

import * as React from 'react';
import { Boxes, Edit2, Save, X } from 'lucide-react';
import { DeleteButton } from '@/components/ui/delete-button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  componentId: z.string().min(1, 'Component is required'),
  workshopQty: z.coerce.number().min(0, 'Must be 0 or more'),
  storageQty: z.coerce.number().min(0, 'Must be 0 or more'),
  unitPrice: z.coerce.number().min(0, 'Must be 0 or more'),
});

type FormValues = z.infer<typeof formSchema>;

export default function InventoryPage() {
  const [inventory, setInventory] = React.useState<any[]>([]);
  const [components, setComponents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  const { control, handleSubmit, reset, setValue, setFocus, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { componentId: '', workshopQty: 0, storageQty: 0, unitPrice: 0 }
  });
  
  const { addToast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [invRes, compRes] = await Promise.all([
        fetch('/api/inventory'),
        fetch('/api/components')
      ]);
      const invData = await invRes.json();
      const compData = await compRes.json();
      
      if (Array.isArray(invData)) setInventory(invData);
      if (Array.isArray(compData)) setComponents(compData);
    } catch (e) {
      setInventory([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    reset({ componentId: '', workshopQty: 0, storageQty: 0, unitPrice: 0 });
    setEditingId(null);
  };

  const handleEdit = (inv: any) => {
    setEditingId(inv.id);
    setValue('componentId', inv.componentId);
    setValue('workshopQty', inv.workshopQty);
    setValue('storageQty', inv.storageQty);
    setValue('unitPrice', inv.unitPrice);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setFocus('componentId'), 100);
  };

  const handleSave = async (data: FormValues) => {
    const payload = data;

    try {
      if (editingId) {
        const res = await fetch(`/api/inventory/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
        addToast({ type: 'success', title: 'Updated', message: 'Inventory updated successfully.' });
      } else {
        const res = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to create');
        addToast({ type: 'success', title: 'Created', message: 'Inventory created successfully.' });
      }
      resetForm();
      fetchData();
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save inventory.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete');
      addToast({ type: 'success', title: 'Deleted', message: 'Inventory removed.' });
      fetchData();
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to delete inventory.' });
    }
  };

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Boxes className="text-indigo-400" size={26} />
            Inventory List
          </h2>
          <p className="text-sm text-slate-400 mt-1">Manage component stock across workshop and storage.</p>
        </div>
      </div>

      <Card className="border-white/6 shadow-sm bg-[#0f1117] overflow-hidden p-6">
        <form onSubmit={handleSubmit(handleSave)} className="flex flex-col sm:flex-row gap-4 items-start border-b border-white/10 pb-6 mb-6">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Component</label>
            <Controller
              name="componentId"
              control={control}
              render={({ field }) => (
                <select 
                  {...field}
                  className={`h-10 px-3 border bg-[#0a0d14] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.componentId ? 'border-red-500/50' : 'border-white/10'}`} 
                >
                  <option value="" disabled>Select Component...</option>
                  {components.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
            />
            {errors.componentId && <span className="text-[10px] text-red-400">{errors.componentId.message}</span>}
          </div>
          <div className="w-24 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Workshop</label>
            <Controller
              name="workshopQty"
              control={control}
              render={({ field }) => (
                <input 
                  type="number" min="0" 
                  {...field}
                  className={`h-10 px-3 border bg-[#0a0d14] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.workshopQty ? 'border-red-500/50' : 'border-white/10'}`} 
                />
              )}
            />
            {errors.workshopQty && <span className="text-[10px] text-red-400">{errors.workshopQty.message}</span>}
          </div>
          <div className="w-24 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Storage</label>
            <Controller
              name="storageQty"
              control={control}
              render={({ field }) => (
                <input 
                  type="number" min="0" 
                  {...field}
                  className={`h-10 px-3 border bg-[#0a0d14] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.storageQty ? 'border-red-500/50' : 'border-white/10'}`} 
                />
              )}
            />
            {errors.storageQty && <span className="text-[10px] text-red-400">{errors.storageQty.message}</span>}
          </div>
          <div className="w-24 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Unit Price</label>
            <Controller
              name="unitPrice"
              control={control}
              render={({ field }) => (
                <input 
                  type="number" step="0.01" min="0" 
                  {...field}
                  className={`h-10 px-3 border bg-[#0a0d14] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.unitPrice ? 'border-red-500/50' : 'border-white/10'}`} 
                />
              )}
            />
            {errors.unitPrice && <span className="text-[10px] text-red-400">{errors.unitPrice.message}</span>}
          </div>
          <div className="flex gap-2 w-full sm:w-auto mt-6 sm:mt-6">
            {editingId && (
              <button type="button" onClick={resetForm} className="h-10 px-4 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                <X size={18} />
              </button>
            )}
            <button type="submit" className="h-10 px-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm transition-colors flex-1 sm:flex-none">
              <Save size={18} /> {editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </form>

        {isLoading ? (
          <div className="py-8 text-center text-slate-500">Loading inventory...</div>
        ) : inventory.length === 0 ? (
          <div className="py-8 text-center text-slate-500 border border-dashed border-white/10 rounded-xl bg-white/5">
            No inventory found. Add one above.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {inventory.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0a0d14] border border-white/5 hover:border-indigo-500/30 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{inv.componentName}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Workshop: <span className="text-slate-300 font-semibold">{inv.workshopQty}</span> | 
                    Storage: <span className="text-slate-300 font-semibold">{inv.storageQty}</span> | 
                    Total: <span className="text-indigo-300 font-semibold">{inv.workshopQty + inv.storageQty}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-emerald-400">€{inv.unitPrice.toFixed(2)}</span>
                  <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                    <button onClick={() => handleEdit(inv)} className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <DeleteButton onConfirm={() => handleDelete(inv.id)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
