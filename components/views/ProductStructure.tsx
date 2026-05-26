'use client';

import * as React from 'react';
import Link from 'next/link';
import { Layers, ChevronRight, Search, Plus } from 'lucide-react';
import { useProductStructure } from '@/hooks/useProductStructure';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { ProductStructureCard } from '@/components/ProductStructureCard';
import { AssemblyFormModal } from '@/components/AssemblyFormModal';

export default function ProductStructurePage() {
  const isAdmin = useIsAdmin();
  const {
    searchTerm,
    setSearchTerm,
    isLoading,
    deleteId,
    setDeleteId,
    filteredProducts,
    handleDelete,
    reload,
  } = useProductStructure();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  function openCreate() {
    setEditId(null);
    setModalOpen(true);
  }

  function openEdit(id: string) {
    setEditId(id);
    setModalOpen(true);
  }

  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Layers className="text-indigo-400" size={26} />
            Product Structure
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse product assemblies. {isAdmin ? 'Click + to add a new one.' : 'Add items to your cart.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/dashboard/products" className="text-indigo-600 dark:text-indigo-400 hover:underline">Products</Link>
            <ChevronRight size={12} />
            <span className="text-muted-foreground">Structure</span>
          </div>
          {isAdmin && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
            >
              <Plus size={16} /> Add Assembly
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search product by part of name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-card text-foreground placeholder:text-muted-foreground shadow-sm"
          autoFocus
        />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-16 text-center bg-card border border-border rounded-2xl shadow-sm">
            <p className="text-base font-semibold text-muted-foreground">Loading...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-card border border-border rounded-2xl shadow-sm">
            <Search className="mx-auto mb-3 text-muted-foreground" size={32} />
            <p className="text-base font-semibold text-muted-foreground">
              No products found{searchTerm ? ` matching "${searchTerm}"` : ''}
            </p>
            <p className="text-sm text-muted-foreground">
              {isAdmin ? 'Click "Add Assembly" to create one.' : 'Try a different search term.'}
            </p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductStructureCard
              key={product.id}
              product={product}
              deleteId={deleteId}
              setDeleteId={setDeleteId}
              handleDelete={handleDelete}
              onEditClick={openEdit}
            />
          ))
        )}
      </div>

      {/* Modal */}
      <AssemblyFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editId={editId}
        onSuccess={() => reload?.()}
      />
    </div>
  );
}
