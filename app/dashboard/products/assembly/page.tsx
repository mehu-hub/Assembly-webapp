'use client';

import * as React from 'react';
import { Plus, Trash2, Save, Wrench, AlertCircle, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import { products, components, addProduct, addBOMEntry } from '@/lib/data';
import type { Product, BOMEntry } from '@/lib/types';

function generateId(prefix: string) {
  return `${prefix}-` + String(Math.floor(Math.random() * 9000) + 1000);
}

export default function ProductAssemblyFormPage() {
  const { addToast } = useToast();

  // Form State
  const [productName, setProductName] = React.useState('');
  const [price, setPrice] = React.useState<string>('');
  const [error, setError] = React.useState('');

  // Dynamic Components List
  const [assemblyParts, setAssemblyParts] = React.useState([
    { id: generateId('temp'), componentId: '', quantity: 1 }
  ]);

  function handleAddPart() {
    setAssemblyParts((prev) => [
      ...prev,
      { id: generateId('temp'), componentId: '', quantity: 1 }
    ]);
  }

  function handleRemovePart(id: string) {
    if (assemblyParts.length === 1) return; // Keep at least one
    setAssemblyParts((prev) => prev.filter((p) => p.id !== id));
  }

  function handlePartChange(id: string, field: 'componentId' | 'quantity', value: any) {
    setAssemblyParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const name = productName.trim();
    if (!name) {
      setError('Product name is required.');
      return;
    }

    // Check for duplication
    const isDuplicate = products.some(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (isDuplicate) {
      setError('A product with this name already exists.');
      return;
    }

    // Validate Price
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setError('Please enter a valid price.');
      return;
    }

    // Validate Components
    const hasEmptyComponent = assemblyParts.some((p) => !p.componentId);
    if (hasEmptyComponent) {
      setError('Please select a component for all rows.');
      return;
    }

    const hasInvalidQty = assemblyParts.some((p) => p.quantity < 1);
    if (hasInvalidQty) {
      setError('Quantity must be at least 1 for all components.');
      return;
    }

    // Create Product
    const newProductId = generateId('PRD');
    const newProduct: Product = {
      id: newProductId,
      name,
      description: 'Assembled product',
      price: numPrice,
    };
    
    addProduct(newProduct);

    // Create BOM Entries
    assemblyParts.forEach((part) => {
      const bomEntry: BOMEntry = {
        id: generateId('BOM'),
        productId: newProductId,
        componentId: part.componentId,
        quantityRequired: Number(part.quantity),
      };
      addBOMEntry(bomEntry);
    });

    addToast({
      type: 'success',
      title: 'Assembly Created',
      message: `${name} and its components have been saved successfully.`,
    });

    // Reset Form
    setProductName('');
    setPrice('');
    setAssemblyParts([{ id: generateId('temp'), componentId: '', quantity: 1 }]);
  }

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
          <Wrench size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Create Product Assembly</h2>
          <p className="text-sm text-slate-500">
            Define a new product and map out its required components (Bill of Materials).
          </p>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex flex-col gap-8">
          
          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
              <AlertCircle size={18} className="flex-shrink-0 text-red-500" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Product Details Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Package size={18} className="text-slate-400" />
              1. Product Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oak Desk"
                  value={productName}
                  onChange={(e) => { setProductName(e.target.value); setError(''); }}
                  className="h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Price (€) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => { setPrice(e.target.value); setError(''); }}
                  className="h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>
            </div>
          </div>

          {/* Components Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Wrench size={18} className="text-slate-400" />
              2. Components (BOM)
            </h3>
            
            <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4">
              {/* Header row for larger screens */}
              <div className="hidden sm:grid grid-cols-12 gap-4 mb-2 px-2">
                <div className="col-span-8 text-xs font-semibold text-slate-500 uppercase">Component</div>
                <div className="col-span-3 text-xs font-semibold text-slate-500 uppercase">Quantity</div>
                <div className="col-span-1"></div>
              </div>

              <div className="flex flex-col gap-3">
                {assemblyParts.map((part, idx) => (
                  <div key={part.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white p-3 sm:p-2 rounded-lg border border-slate-200 sm:border-transparent sm:bg-transparent shadow-sm sm:shadow-none">
                    
                    {/* Component Dropdown */}
                    <div className="col-span-1 sm:col-span-8 flex flex-col sm:block gap-1">
                      <label className="sm:hidden text-xs font-semibold text-slate-500">Component</label>
                      <select
                        value={part.componentId}
                        onChange={(e) => handlePartChange(part.id, 'componentId', e.target.value)}
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white"
                        required
                      >
                        <option value="" disabled>Select a component...</option>
                        {components.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.id})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-1 sm:col-span-3 flex flex-col sm:block gap-1">
                      <label className="sm:hidden text-xs font-semibold text-slate-500">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={part.quantity}
                        onChange={(e) => handlePartChange(part.id, 'quantity', e.target.value)}
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white"
                        required
                      />
                    </div>

                    {/* Remove button */}
                    <div className="col-span-1 sm:col-span-1 flex justify-end sm:justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemovePart(part.id)}
                        disabled={assemblyParts.length === 1}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          assemblyParts.length === 1 
                            ? "text-slate-300 cursor-not-allowed" 
                            : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                        )}
                        title="Remove component"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddPart}
                className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <Plus size={16} />
                Add Component
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-indigo-200 transition-all active:scale-95"
            >
              <Save size={18} />
              Save Assembly
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
