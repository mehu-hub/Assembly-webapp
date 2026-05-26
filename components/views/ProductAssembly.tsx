'use client';

import * as React from 'react';
import { Wrench, Plus, Package, Layers, ShoppingCart } from 'lucide-react';
import { AssemblyFormModal } from '@/components/AssemblyFormModal';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Card } from '@/components/ui/card';

export default function ProductAssemblyPage() {
  const isAdmin = useIsAdmin();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <div className="relative z-10 flex flex-col gap-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
            <Wrench size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Product Assembly</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isAdmin
                ? 'Create and manage product assemblies with Bill of Materials.'
                : 'Build a custom product assembly for purchase.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-900/40 transition-all active:scale-95 text-sm"
        >
          {isAdmin ? <Plus size={18} /> : <ShoppingCart size={18} />}
          {isAdmin ? 'Create Assembly' : 'Assemble Products'}
        </button>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center">
            <Package size={18} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Step 1</p>
            <p className="text-sm font-semibold text-foreground mt-1">Name your product</p>
            <p className="text-xs text-muted-foreground mt-1">Give the assembly a unique name and set its price.</p>
          </div>
        </Card>

        <Card className="border-border bg-card p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
            <Wrench size={18} className="text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Step 2</p>
            <p className="text-sm font-semibold text-foreground mt-1">Add components</p>
            <p className="text-xs text-muted-foreground mt-1">Pick components and quantities for the Bill of Materials.</p>
          </div>
        </Card>

        <Card className="border-border bg-card p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
            <Layers size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Step 3</p>
            <p className="text-sm font-semibold text-foreground mt-1">{isAdmin ? 'Save to database' : 'Add to cart'}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {isAdmin ? 'The product is stored and visible in the product list.' : 'The assembled product is added to your cart for checkout.'}
            </p>
          </div>
        </Card>
      </div>

      {/* CTA banner */}
      <div
        className="relative flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl border border-indigo-300 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 overflow-hidden cursor-pointer group"
        onClick={() => setModalOpen(true)}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-100 dark:bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700 pointer-events-none" />
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-foreground mb-1">
            {isAdmin ? 'Ready to create a new assembly?' : 'Build your custom assembly'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? 'Click to open the form and define a product with its BOM.'
              : 'Click to configure your product and proceed to purchase.'}
          </p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); setModalOpen(true); }}
          className="relative z-10 flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/50 transition-all active:scale-95 text-sm"
        >
          {isAdmin ? <Plus size={18} /> : <ShoppingCart size={18} />}
          {isAdmin ? 'Open Assembly Form' : 'Assemble Products'}
        </button>
      </div>

      {/* Modal */}
      <AssemblyFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editId={null}
        onSuccess={() => setRefreshKey(k => k + 1)}
      />
    </div>
  );
}
