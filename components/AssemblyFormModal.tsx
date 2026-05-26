'use client';

import * as React from 'react';
import { Plus, Trash2, Save, Wrench, AlertCircle, Package, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useToast } from '@/components/ui/toast';
import { ToastStatus } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

function generateId(prefix: string) {
  return `${prefix}-` + String(Math.floor(Math.random() * 9000) + 1000);
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId?: string | null;
  onSuccess?: () => void;
}

export function AssemblyFormModal({ open, onOpenChange, editId, onSuccess }: Props) {
  const isAdmin = useIsAdmin();
  const { addToast } = useToast();

  const [productName, setProductName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [error, setError] = React.useState('');
  const [componentsList, setComponentsList] = React.useState<any[]>([]);
  const [productsList, setProductsList] = React.useState<any[]>([]);
  const [assemblyParts, setAssemblyParts] = React.useState([
    { id: 'temp-initial', componentId: '', quantity: 1 }
  ]);

  // Load components & products once, then load the product to edit when editId changes
  React.useEffect(() => {
    if (!open) return;

    fetch('/api/components')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setComponentsList(data); })
      .catch(() => {});

    fetch('/api/products')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setProductsList(data); })
      .catch(() => {});

    if (editId) {
      fetch(`/api/products/${editId}`)
        .then(r => r.json())
        .then(p => {
          if (p && !p.error) {
            setProductName(p.name ?? '');
            setPrice(p.price !== undefined ? String(p.price) : '');
            if (p.assemblyParts?.length > 0) {
              setAssemblyParts(
                p.assemblyParts.map((b: any) => ({
                  id: generateId('temp'),
                  componentId: b.componentId,
                  quantity: b.quantity,
                }))
              );
            }
          }
        })
        .catch(() => {});
    } else {
      // Reset for new form
      setProductName('');
      setPrice('');
      setError('');
      setAssemblyParts([{ id: generateId('temp'), componentId: '', quantity: 1 }]);
    }
  }, [open, editId]);

  function handleAddPart() {
    setAssemblyParts(prev => [...prev, { id: generateId('temp'), componentId: '', quantity: 1 }]);
  }

  function handleRemovePart(id: string) {
    if (assemblyParts.length <= 1) return;
    setAssemblyParts(prev => prev.filter(p => p.id !== id));
  }

  function handlePartChange(id: string, field: 'componentId' | 'quantity', value: any) {
    setAssemblyParts(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const name = productName.trim();
    if (!name) { setError('Product name is required.'); return; }

    const isDuplicate = productsList.some(
      p => p.name.toLowerCase() === name.toLowerCase() && p.id !== editId
    );
    if (isDuplicate) { setError('A product with this name already exists.'); return; }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) { setError('Please enter a valid price.'); return; }

    if (assemblyParts.some(p => !p.componentId)) { setError('Please select a component for all rows.'); return; }
    if (assemblyParts.some(p => p.quantity < 1)) { setError('Quantity must be at least 1.'); return; }

    const payload = {
      name,
      description: 'Assembled product',
      price: numPrice,
      assemblyParts: assemblyParts.map(p => ({ componentId: p.componentId, quantity: Number(p.quantity) })),
    };

    try {
      const url = editId ? `/api/products/${editId}` : '/api/products';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Failed to save');

      addToast({
        type: ToastStatus.SUCCESS,
        title: editId ? 'Assembly Updated' : isAdmin ? 'Assembly Created' : 'Added to Purchase',
        message: `${name} has been saved successfully.`,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <Wrench size={18} />
            </div>
            <div>
              <DialogTitle>{editId ? 'Edit Product Assembly' : 'Create Product Assembly'}</DialogTitle>
              <DialogDescription>
                {editId
                  ? 'Update the details and components for this product.'
                  : 'Define a product and map out its required components (BOM).'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-2">
          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg border border-red-500/20">
              <AlertCircle size={16} className="flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Product Details */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
              <Package size={14} /> Product Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oak Desk"
                  value={productName}
                  onChange={e => { setProductName(e.target.value); setError(''); }}
                  className="h-10 px-3 border border-border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Price (€) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={e => { setPrice(e.target.value); setError(''); }}
                  className="h-10 px-3 border border-border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Components / BOM */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
              <Wrench size={14} /> Components (BOM)
            </h3>
            <div className="bg-muted rounded-xl border border-border p-4 flex flex-col gap-3">
              {assemblyParts.map(part => (
                <div key={part.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-7">
                    <select
                      value={part.componentId}
                      onChange={e => handlePartChange(part.id, 'componentId', e.target.value)}
                      className="w-full h-9 px-3 border border-border bg-card text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      required
                    >
                      <option value="" disabled>Select component...</option>
                      {componentsList.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      min="1"
                      value={part.quantity}
                      onChange={e => handlePartChange(part.id, 'quantity', e.target.value)}
                      className="w-full h-9 px-3 border border-border bg-card text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      required
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemovePart(part.id)}
                      disabled={assemblyParts.length <= 1}
                      className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        assemblyParts.length === 1
                          ? 'text-slate-700 cursor-not-allowed'
                          : 'text-muted-foreground hover:text-red-600 dark:text-red-400 hover:bg-red-500/10'
                      )}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddPart}
                className="mt-1 flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 hover:bg-indigo-200 dark:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-300 dark:border-indigo-500/20 w-fit"
              >
                <Plus size={14} /> Add Component
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
            >
              {isAdmin ? (
                <><Save size={16} /> {editId ? 'Save Changes' : 'Save Assembly'}</>
              ) : (
                <><ShoppingCart size={16} /> Assemble &amp; Purchase</>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
