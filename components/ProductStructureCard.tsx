import * as React from 'react';
import { Layers, Edit2, Trash2, Wrench, AlertTriangle, CheckCircle2, PackageX, ShoppingCart } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useCart } from '@/lib/cart-context';

export function ProductStructureCard({
  product,
  deleteId,
  setDeleteId,
  handleDelete,
  onEditClick,
}: {
  product: any;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  handleDelete: (id: string) => void;
  onEditClick?: (id: string) => void;
}) {
  const bom = product.bom || [];
  const totalParts = product.totalParts || 0;
  const buildCapacity = product.buildCapacity || { max: 0, limitingComponent: 'N/A' };
  const isAdmin = useIsAdmin();
  const { items, addToCart, removeFromCart } = useCart();
  const isInCart = items.some(i => i.id === product.id);

  return (
    <div 
      className="group relative bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-indigo-500/8 to-purple-500/8 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500 pointer-events-none" />

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-muted text-muted-foreground rounded-md">
            {product.id}
          </span>
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full">
            {product.price !== undefined ? `€${product.price.toFixed(2)}` : '€0.00'}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-base font-bold text-foreground group-hover:text-indigo-600 dark:text-indigo-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[32px]">
            {product.description || "No description provided for this product structure."}
          </p>
        </div>

        <div className="h-[1px] bg-muted-hover my-3" />

        <div className="mb-4 flex-1">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Wrench size={12} className="text-indigo-500" />
              Required Components
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {bom.length} items
            </span>
          </div>

          {bom.length === 0 ? (
            <div className="py-4 text-center border border-dashed border-border rounded-xl bg-muted">
              <span className="text-xs text-muted-foreground italic">No components assigned yet</span>
            </div>
          ) : (
            <div className="relative pl-3 border-l border-border flex flex-col gap-2.5 py-0.5">
              {bom.map((entry: any) => {
                const isLowStock = entry.isLowStock;
                return (
                  <div key={entry.id} className="relative flex items-center justify-between text-xs">
                    <div className={`absolute -left-[16.5px] w-2 h-2 rounded-full border-2 bg-white transition-colors duration-300 ${
                      !entry.hasInventory ? 'border-amber-400 group-hover:bg-amber-400' :
                      entry.isLowStock ? 'border-red-450 group-hover:bg-red-400' : 'border-indigo-400 group-hover:bg-indigo-400'
                    }`} />
                    <div className="flex flex-col pl-1 max-w-[70%]">
                      <span className="font-semibold text-foreground truncate">
                        {entry.componentName ?? entry.componentId}
                      </span>
                      {!entry.hasInventory ? (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <PackageX size={10} /> No inventory record — add in Component Inventory
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">
                          Stock: {entry.totalStock} {entry.componentUnit ?? 'pcs'}
                        </span>
                      )}
                    </div>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      !entry.hasInventory ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                      entry.isLowStock ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' : 'bg-muted-hover text-muted-foreground'
                    }`}>
                      x{entry.quantityRequired}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={`p-3 rounded-xl border mt-auto transition-all duration-300 ${
          buildCapacity.max > 0 ? 'bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              {buildCapacity.max > 0 ? <CheckCircle2 size={13} className="text-emerald-500" /> : <AlertTriangle size={13} className="text-rose-500" />}
              Build Capacity
            </span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
              buildCapacity.max > 0 ? 'bg-emerald-200 dark:bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {buildCapacity.max} {buildCapacity.max === 1 ? 'unit' : 'units'}
            </span>
          </div>
          {buildCapacity.max === 0 && buildCapacity.limitingComponent && (
            <p className="text-[10px] text-rose-400 mt-1 font-medium leading-normal">
              Shortage: <span className="font-bold">{buildCapacity.limitingComponent}</span>
            </p>
          )}
          {buildCapacity.max > 0 && buildCapacity.limitingComponent && (
            <p className="text-[10px] text-emerald-400/80 mt-1 font-medium leading-normal">
              Limited by: <span className="font-semibold">{buildCapacity.limitingComponent}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-3.5 bg-muted border-t border-border group-hover:bg-muted-hover transition-all duration-300">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Layers size={13} className="text-muted-foreground" />
          <span className="text-xs font-semibold">{totalParts} <span className="text-muted-foreground font-normal">parts</span></span>
        </div>
        {isAdmin && (
          <div>
            {deleteId === product.id ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-red-500">Delete?</span>
                <button onClick={() => handleDelete(product.id)} className="px-2 py-0.5 rounded bg-red-500 hover:bg-red-600 text-white text-[10px] font-extrabold transition-colors">Yes</button>
                <button onClick={() => setDeleteId(null)} className="px-2 py-0.5 rounded bg-muted-hover hover:bg-white/20 text-muted-foreground text-[10px] font-extrabold transition-colors">No</button>
              </div>
            ) : (
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEditClick?.(product.id)} className="p-1.5 text-muted-foreground hover:text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:bg-indigo-500/10 rounded-lg transition-all" title="Edit Assembly"><Edit2 size={14} /></button>
                <button onClick={() => setDeleteId(product.id)} className="p-1.5 text-muted-foreground hover:text-red-600 dark:text-red-400 hover:bg-red-100 dark:bg-red-500/10 rounded-lg transition-all" title="Delete Product"><Trash2 size={14} /></button>
              </div>
            )}
          </div>
        )}
        {!isAdmin && (
          <button 
            onClick={() => isInCart
              ? removeFromCart(product.id)
              : addToCart({ id: product.id, name: product.name, price: product.price ?? 0 })
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
              isInCart 
                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20' 
                : 'bg-emerald-100 dark:bg-emerald-500/10 hover:bg-emerald-200 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            }`}
          >
            <ShoppingCart size={14} /> {isInCart ? 'Remove from Cart' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
}
