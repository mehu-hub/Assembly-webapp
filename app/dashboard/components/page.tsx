'use client';

import * as React from 'react';
import { Cpu, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

export default function ComponentListPage() {
  const [components, setComponents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  // Form states
  const [name, setName] = React.useState('');
  const [unit, setUnit] = React.useState('pcs');
  const [description, setDescription] = React.useState('');
  
  const { addToast } = useToast();

  React.useEffect(() => {
    fetchComponents();
  }, []);

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

  const resetForm = () => {
    setName('');
    setUnit('pcs');
    setDescription('');
    setEditingId(null);
  };

  const handleEdit = (comp: any) => {
    setEditingId(comp.id);
    setName(comp.name);
    setUnit(comp.unit);
    setDescription(comp.description || '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast({ type: 'error', title: 'Error', message: 'Name is required' });
      return;
    }

    const payload = { name, unit, description };

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
    if (!confirm('Are you sure you want to delete this component? This may affect products and inventory.')) return;
    
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
        <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-4 items-end border-b border-white/10 pb-6 mb-6">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Name</label>
            <input 
              value={name} onChange={e => setName(e.target.value)}
              className="h-10 px-3 border border-white/10 bg-[#0a0d14] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
              placeholder="Component name" required
            />
          </div>
          <div className="w-24 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Unit</label>
            <input 
              value={unit} onChange={e => setUnit(e.target.value)}
              className="h-10 px-3 border border-white/10 bg-[#0a0d14] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
              placeholder="e.g. pcs" required
            />
          </div>
          <div className="flex-2 flex flex-col gap-2 w-full sm:w-auto sm:flex-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Description</label>
            <input 
              value={description} onChange={e => setDescription(e.target.value)}
              className="h-10 px-3 border border-white/10 bg-[#0a0d14] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
              placeholder="Optional description" 
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
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
                  <button onClick={() => handleDelete(comp.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
