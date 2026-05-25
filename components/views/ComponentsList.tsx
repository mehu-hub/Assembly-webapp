'use client';

import * as React from 'react';
import { Cpu, Edit2, Save, X } from 'lucide-react';
import { DeleteButton } from '@/components/ui/delete-button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  unit: z.string().min(1, 'Unit is required'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ComponentListPage() {
  const [components, setComponents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  const { control, handleSubmit, reset, setValue, setFocus, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', unit: 'pcs', description: '' }
  });
  
  const { addToast } = useToast();

  const fetchComponents = () => {
    setIsLoading(true);
    fetch('/api/components')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setComponents(data);
        setIsLoading(false);
      })
      .catch(() => {
        setComponents([]);
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    fetchComponents();
  }, []);

  const resetForm = () => {
    reset({ name: '', unit: 'pcs', description: '' });
    setEditingId(null);
  };

  const handleEdit = (comp: any) => {
    setEditingId(comp.id);
    setValue('name', comp.name);
    setValue('unit', comp.unit);
    setValue('description', comp.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setFocus('name'), 100);
  };

  const handleSave = async (data: FormValues) => {
    const payload = { name: data.name, unit: data.unit, description: data.description };

    try {
      if (editingId) {
        const res = await fetch(`/api/components/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
        addToast({ type: 'success', title: 'Updated', message: 'Component updated successfully.' });
      } else {
        const res = await fetch('/api/components', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to create');
        addToast({ type: 'success', title: 'Created', message: 'Component created successfully.' });
      }
      resetForm();
      fetchComponents();
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save component.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/components/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete');
      addToast({ type: 'success', title: 'Deleted', message: 'Component removed.' });
      fetchComponents();
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to delete component.' });
    }
  };

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Cpu className="text-indigo-400" size={26} />
            Component List
          </h2>
          <p className="text-sm text-slate-400 mt-1">Manage hardware components used in product assemblies.</p>
        </div>
      </div>

      <Card className="border-white/6 shadow-sm bg-[#0f1117] overflow-hidden p-6">
        <form onSubmit={handleSubmit(handleSave)} className="flex flex-col sm:flex-row gap-4 items-start border-b border-white/10 pb-6 mb-6">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input 
                  {...field}
                  className={`h-10 px-3 border bg-[#0a0d14] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.name ? 'border-red-500/50' : 'border-white/10'}`} 
                  placeholder="Component name"
                />
              )}
            />
            {errors.name && <span className="text-[10px] text-red-400">{errors.name.message}</span>}
          </div>
          <div className="w-24 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Unit</label>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <input 
                  {...field}
                  className={`h-10 px-3 border bg-[#0a0d14] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.unit ? 'border-red-500/50' : 'border-white/10'}`} 
                  placeholder="e.g. pcs"
                />
              )}
            />
            {errors.unit && <span className="text-[10px] text-red-400">{errors.unit.message}</span>}
          </div>
          <div className="flex-2 flex flex-col gap-2 w-full sm:w-auto sm:flex-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <input 
                  {...field}
                  value={field.value || ''}
                  className={`h-10 px-3 border bg-[#0a0d14] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.description ? 'border-red-500/50' : 'border-white/10'}`} 
                  placeholder="Optional description" 
                />
              )}
            />
            {errors.description && <span className="text-[10px] text-red-400">{errors.description.message}</span>}
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
          <div className="py-8 text-center text-slate-500">Loading components...</div>
        ) : components.length === 0 ? (
          <div className="py-8 text-center text-slate-500 border border-dashed border-white/10 rounded-xl bg-white/5">
            No components found. Add one above.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {components.map(comp => (
              <div key={comp.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0a0d14] border border-white/5 hover:border-indigo-500/30 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{comp.name} <span className="text-[10px] font-normal text-slate-500 ml-2 bg-white/10 px-2 py-0.5 rounded">{comp.unit}</span></h4>
                  <p className="text-xs text-slate-500 mt-1">{comp.description || 'No description'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(comp)} className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <DeleteButton onConfirm={() => handleDelete(comp.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
