'use client';

import * as React from 'react';
import { ClipboardList, Plus, Trash2, ArrowRight, Package, Cpu } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AssemblyRequired() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [order, setOrder] = React.useState<{ productId: string; qty: number; id: string }[]>([
    { id: '1', productId: '', qty: 1 }
  ]);

  React.useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setProducts(data);
    });
  }, []);

  const addLine = () => {
    setOrder([...order, { id: Date.now().toString(), productId: '', qty: 1 }]);
  };

  const updateLine = (id: string, field: 'productId' | 'qty', value: any) => {
    setOrder(order.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const removeLine = (id: string) => {
    setOrder(order.filter(o => o.id !== id));
  };

  // Calculate aggregated BOM
  const aggregatedBOM = React.useMemo(() => {
    const reqs: Record<string, { name: string; required: number; stock: number; unit: string }> = {};

    order.forEach(item => {
      if (!item.productId || item.qty <= 0) return;
      const product = products.find(p => p.id === item.productId);
      if (!product || !product.bom) return;

      product.bom.forEach((bomItem: any) => {
        if (!reqs[bomItem.componentId]) {
          reqs[bomItem.componentId] = {
            name: bomItem.componentName,
            required: 0,
            stock: bomItem.totalStock,
            unit: bomItem.componentUnit
          };
        }
        reqs[bomItem.componentId].required += bomItem.quantityRequired * item.qty;
      });
    });

    return Object.values(reqs).sort((a, b) => a.name.localeCompare(b.name));
  }, [order, products]);

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-sm">
          <ClipboardList size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Required Components</h2>
          <p className="text-sm text-slate-400">
            Build a custom order and calculate the total Bill of Materials required.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Builder */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="border-white/6 bg-[#0f1117] overflow-hidden">
            <div className="p-4 border-b border-white/6 bg-white/5 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package size={18} className="text-indigo-400" />
                Target Production
              </h3>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {order.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-center bg-[#0a0d14] p-2 rounded-lg border border-white/5">
                  <select
                    className="flex-1 bg-transparent text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 rounded p-2"
                    value={item.productId}
                    onChange={e => updateLine(item.id, 'productId', e.target.value)}
                  >
                    <option value="" disabled className="bg-[#0f1117]">Select Product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#0f1117]">{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    className="w-20 bg-transparent text-center text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 rounded p-2 border-l border-white/5"
                    value={item.qty}
                    onChange={e => updateLine(item.id, 'qty', parseInt(e.target.value) || 0)}
                  />
                  <button
                    onClick={() => removeLine(item.id)}
                    disabled={order.length === 1}
                    className="p-2 text-slate-500 hover:text-red-400 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2 border-dashed border-white/20 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10"
                onClick={addLine}
              >
                <Plus size={16} className="mr-2" /> Add Another Product
              </Button>
            </div>
          </Card>
        </div>

        {/* Aggregated BOM */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Card className="border-white/6 bg-[#0f1117] overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-white/6 bg-white/5 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu size={18} className="text-blue-400" />
                Aggregated BOM Requirement
              </h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto min-h-[300px]">
              {aggregatedBOM.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                  <ArrowRight size={32} className="text-slate-600 opacity-50" />
                  <p className="text-sm">Select products to see requirements</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    <div className="col-span-6">Component</div>
                    <div className="col-span-3 text-right">Required</div>
                    <div className="col-span-3 text-right">Shortfall</div>
                  </div>
                  {aggregatedBOM.map(req => {
                    const shortfall = Math.max(0, req.required - req.stock);
                    return (
                      <div key={req.name} className="grid grid-cols-12 gap-2 items-center bg-[#0a0d14] px-3 py-3 rounded-lg border border-white/5 group hover:border-white/10 transition-colors">
                        <div className="col-span-6">
                          <p className="text-sm font-semibold text-slate-200">{req.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Stock: {req.stock} {req.unit}</p>
                        </div>
                        <div className="col-span-3 text-right">
                          <span className="text-sm font-bold text-indigo-400">{req.required}</span>
                          <span className="text-xs text-slate-500 ml-1">{req.unit}</span>
                        </div>
                        <div className="col-span-3 text-right">
                          {shortfall > 0 ? (
                            <span className="text-sm font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">
                              -{shortfall}
                            </span>
                          ) : (
                            <span className="text-sm font-bold text-emerald-400">
                              OK
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
