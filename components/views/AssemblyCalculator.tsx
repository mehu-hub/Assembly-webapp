'use client';

import * as React from 'react';
import { Calculator, Package, Check, AlertTriangle, Play, Coins } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AssemblyCalculator() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [inventory, setInventory] = React.useState<any[]>([]);
  
  const [selectedProduct, setSelectedProduct] = React.useState<string>('');
  const [targetQuantity, setTargetQuantity] = React.useState<number>(1);
  const [calculationResult, setCalculationResult] = React.useState<any>(null);

  React.useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/inventory').then(r => r.json())
    ]).then(([prodData, invData]) => {
      if (Array.isArray(prodData)) setProducts(prodData);
      if (Array.isArray(invData)) setInventory(invData);
    });
  }, []);

  const runCalculation = () => {
    if (!selectedProduct || targetQuantity <= 0) return;
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod || !prod.bom) return;

    let totalCost = 0;
    let isPossible = true;
    const details = prod.bom.map((b: any) => {
      const inv = inventory.find(i => i.componentId === b.componentId) || {};
      const price = inv.unitPrice || 0;
      const reqQty = b.quantityRequired * targetQuantity;
      const stock = b.totalStock;
      const missing = Math.max(0, reqQty - stock);
      const cost = reqQty * price;
      
      totalCost += cost;
      if (missing > 0) isPossible = false;

      return {
        name: b.componentName,
        reqQty,
        stock,
        missing,
        price,
        cost,
        unit: b.componentUnit
      };
    });

    setCalculationResult({
      isPossible,
      totalCost,
      details,
      productName: prod.name,
      targetQuantity,
      unitPrice: prod.price,
      revenue: prod.price * targetQuantity,
      profit: (prod.price * targetQuantity) - totalCost
    });
  };

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shadow-sm">
          <Calculator size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Assembly Cost Calculator</h2>
          <p className="text-sm text-slate-400">
            Simulate production runs to calculate exact component costs and potential profit margins.
          </p>
        </div>
      </div>

      <Card className="border-white/6 bg-[#0f1117] p-6">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-6 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Product to Calculate</label>
            <select
              className="h-10 px-3 bg-[#0a0d14] text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={selectedProduct}
              onChange={e => setSelectedProduct(e.target.value)}
            >
              <option value="" disabled>Select product...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-3 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Run Size</label>
            <input
              type="number"
              min="1"
              value={targetQuantity}
              onChange={e => setTargetQuantity(parseInt(e.target.value) || 0)}
              className="h-10 px-3 bg-[#0a0d14] text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="sm:col-span-3">
            <Button
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 font-bold"
              onClick={runCalculation}
              disabled={!selectedProduct || targetQuantity <= 0}
            >
              <Play size={16} className="mr-2" /> Calculate
            </Button>
          </div>
        </div>
      </Card>

      {calculationResult && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-white/6 bg-[#0f1117] p-5">
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Total BOM Cost</p>
              <div className="flex items-center gap-2">
                <Coins className="text-amber-400" size={24} />
                <span className="text-3xl font-extrabold text-white">
                  €{calculationResult.totalCost.toFixed(2)}
                </span>
              </div>
            </Card>
            <Card className="border-white/6 bg-[#0f1117] p-5">
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Est. Revenue</p>
              <div className="flex items-center gap-2">
                <Package className="text-indigo-400" size={24} />
                <span className="text-3xl font-extrabold text-white">
                  €{calculationResult.revenue.toFixed(2)}
                </span>
              </div>
            </Card>
            <Card className={`border-white/6 bg-[#0f1117] p-5 ${calculationResult.profit > 0 ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Gross Profit</p>
              <div className="flex items-center gap-2">
                <span className={`text-3xl font-extrabold ${calculationResult.profit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {calculationResult.profit > 0 ? '+' : ''}€{calculationResult.profit.toFixed(2)}
                </span>
              </div>
            </Card>
          </div>

          <Card className="border-white/6 bg-[#0f1117] overflow-hidden">
            <div className={`p-4 border-b border-white/6 flex items-center justify-between ${calculationResult.isPossible ? 'bg-emerald-500/5' : 'bg-red-500/5'}`}>
              <div className="flex items-center gap-2">
                {calculationResult.isPossible ? (
                  <Check size={20} className="text-emerald-400" />
                ) : (
                  <AlertTriangle size={20} className="text-red-400" />
                )}
                <h3 className="text-base font-bold text-white">
                  {calculationResult.isPossible ? 'Production Run Feasible' : 'Inventory Shortfall Detected'}
                </h3>
              </div>
              <span className="text-sm text-slate-400">
                Building {calculationResult.targetQuantity}x {calculationResult.productName}
              </span>
            </div>

            <div className="p-0 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-xs text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Component</th>
                    <th className="px-4 py-3 text-right">Req. Qty</th>
                    <th className="px-4 py-3 text-right">In Stock</th>
                    <th className="px-4 py-3 text-right">Missing</th>
                    <th className="px-4 py-3 text-right">Unit €</th>
                    <th className="px-4 py-3 text-right">Total €</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {calculationResult.details.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-200">{row.name}</td>
                      <td className="px-4 py-3 text-right text-indigo-400">{row.reqQty}</td>
                      <td className="px-4 py-3 text-right text-slate-400">{row.stock}</td>
                      <td className="px-4 py-3 text-right">
                        {row.missing > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
                            {row.missing}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400">{row.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-200">{row.cost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      )}
    </div>
  );
}
