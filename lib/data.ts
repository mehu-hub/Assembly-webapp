'use client';

import type { Product, Component, BOMEntry, InventoryEntry } from './types';

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
export let products: Product[] = [
  { id: 'PRD-001', name: 'Gaming PC', description: 'High-performance gaming desktop with RTX graphics' },
  { id: 'PRD-002', name: 'Office PC', description: 'Reliable office workstation for productivity tasks' },
  { id: 'PRD-003', name: 'Workstation', description: 'Professional workstation for rendering and computation' },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
export let components: Component[] = [
  { id: 'CMP-001', name: 'CPU Intel i5-12400', unit: 'pcs', description: '6-core 12-thread desktop processor 2.5GHz base' },
  { id: 'CMP-002', name: 'RAM 8GB DDR4', unit: 'pcs', description: 'DDR4-3200 desktop memory module' },
  { id: 'CMP-003', name: 'SSD 512GB NVMe', unit: 'pcs', description: 'M.2 PCIe 4.0 NVMe SSD 512GB capacity' },
  { id: 'CMP-004', name: 'Motherboard B660', unit: 'pcs', description: 'ATX LGA1700 motherboard with PCIe 4.0' },
  { id: 'CMP-005', name: 'Power Supply 500W', unit: 'pcs', description: '80+ Bronze certified modular PSU' },
  { id: 'CMP-006', name: 'Graphics Card RTX 3060', unit: 'pcs', description: 'NVIDIA RTX 3060 12GB GDDR6 GPU' },
  { id: 'CMP-007', name: 'Cooling Fan 120mm', unit: 'pcs', description: 'PWM 120mm case fan with RGB' },
];

// ─── BILL OF MATERIALS ───────────────────────────────────────────────────────
export let bomEntries: BOMEntry[] = [
  // Gaming PC
  { id: 'BOM-001', productId: 'PRD-001', componentId: 'CMP-001', quantityRequired: 1 },
  { id: 'BOM-002', productId: 'PRD-001', componentId: 'CMP-002', quantityRequired: 2 },
  { id: 'BOM-003', productId: 'PRD-001', componentId: 'CMP-003', quantityRequired: 1 },
  { id: 'BOM-004', productId: 'PRD-001', componentId: 'CMP-004', quantityRequired: 1 },
  { id: 'BOM-005', productId: 'PRD-001', componentId: 'CMP-005', quantityRequired: 1 },
  { id: 'BOM-006', productId: 'PRD-001', componentId: 'CMP-006', quantityRequired: 1 },
  { id: 'BOM-007', productId: 'PRD-001', componentId: 'CMP-007', quantityRequired: 2 },
  // Office PC
  { id: 'BOM-008', productId: 'PRD-002', componentId: 'CMP-001', quantityRequired: 1 },
  { id: 'BOM-009', productId: 'PRD-002', componentId: 'CMP-002', quantityRequired: 1 },
  { id: 'BOM-010', productId: 'PRD-002', componentId: 'CMP-003', quantityRequired: 1 },
  { id: 'BOM-011', productId: 'PRD-002', componentId: 'CMP-004', quantityRequired: 1 },
  { id: 'BOM-012', productId: 'PRD-002', componentId: 'CMP-005', quantityRequired: 1 },
  { id: 'BOM-013', productId: 'PRD-002', componentId: 'CMP-007', quantityRequired: 1 },
  // Workstation
  { id: 'BOM-014', productId: 'PRD-003', componentId: 'CMP-001', quantityRequired: 2 },
  { id: 'BOM-015', productId: 'PRD-003', componentId: 'CMP-002', quantityRequired: 4 },
  { id: 'BOM-016', productId: 'PRD-003', componentId: 'CMP-003', quantityRequired: 2 },
  { id: 'BOM-017', productId: 'PRD-003', componentId: 'CMP-004', quantityRequired: 1 },
  { id: 'BOM-018', productId: 'PRD-003', componentId: 'CMP-005', quantityRequired: 1 },
  { id: 'BOM-019', productId: 'PRD-003', componentId: 'CMP-006', quantityRequired: 2 },
  { id: 'BOM-020', productId: 'PRD-003', componentId: 'CMP-007', quantityRequired: 3 },
];

// ─── INVENTORY ───────────────────────────────────────────────────────────────
export let inventory: InventoryEntry[] = [
  { id: 'INV-001', componentId: 'CMP-001', workshopQty: 5,  storageQty: 15, unitPrice: 199.99 },
  { id: 'INV-002', componentId: 'CMP-002', workshopQty: 10, storageQty: 30, unitPrice: 34.99  },
  { id: 'INV-003', componentId: 'CMP-003', workshopQty: 8,  storageQty: 20, unitPrice: 64.99  },
  { id: 'INV-004', componentId: 'CMP-004', workshopQty: 4,  storageQty: 12, unitPrice: 149.99 },
  { id: 'INV-005', componentId: 'CMP-005', workshopQty: 6,  storageQty: 18, unitPrice: 79.99  },
  { id: 'INV-006', componentId: 'CMP-006', workshopQty: 2,  storageQty: 8,  unitPrice: 399.99 },
  { id: 'INV-007', componentId: 'CMP-007', workshopQty: 15, storageQty: 40, unitPrice: 24.99  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
export function getProductById(id: string) {
  return products.find(p => p.id === id);
}

export function getComponentById(id: string) {
  return components.find(c => c.id === id);
}

export function getBOMForProduct(productId: string) {
  return bomEntries.filter(b => b.productId === productId);
}

export function getInventoryForComponent(componentId: string) {
  return inventory.find(i => i.componentId === componentId);
}

export function getTotalQty(componentId: string): number {
  const inv = getInventoryForComponent(componentId);
  return inv ? inv.workshopQty + inv.storageQty : 0;
}

export function calculateMaxAssemblies(productId: string): { max: number; limitingComponent: string } {
  const bom = getBOMForProduct(productId);
  if (!bom.length) return { max: 0, limitingComponent: 'N/A' };

  let min = Infinity;
  let limitingComponent = '';

  for (const entry of bom) {
    const totalQty = getTotalQty(entry.componentId);
    const possible = Math.floor(totalQty / entry.quantityRequired);
    if (possible < min) {
      min = possible;
      limitingComponent = getComponentById(entry.componentId)?.name ?? entry.componentId;
    }
  }

  return { max: min === Infinity ? 0 : min, limitingComponent };
}

export function getTotalInventoryValue(): number {
  return inventory.reduce((sum, inv) => {
    const totalQty = inv.workshopQty + inv.storageQty;
    return sum + totalQty * inv.unitPrice;
  }, 0);
}

export function getTotalWorkshopQty(): number {
  return inventory.reduce((sum, i) => sum + i.workshopQty, 0);
}

export function getTotalStorageQty(): number {
  return inventory.reduce((sum, i) => sum + i.storageQty, 0);
}

export function getLowStockComponents() {
  return inventory
    .map(inv => {
      const comp = getComponentById(inv.componentId);
      const total = inv.workshopQty + inv.storageQty;
      return { component: comp, inventory: inv, total };
    })
    .filter(item => item.total <= 10)
    .sort((a, b) => a.total - b.total);
}

// ─── MUTATION HELPERS (module-level state mutation for demo) ──────────────────
export function addProduct(p: Product) { products = [...products, p]; }
export function updateProduct(p: Product) { products = products.map(x => x.id === p.id ? p : x); }
export function deleteProduct(id: string) { products = products.filter(p => p.id !== id); }

export function addComponent(c: Component) { components = [...components, c]; }
export function updateComponent(c: Component) { components = components.map(x => x.id === c.id ? c : x); }
export function deleteComponent(id: string) { components = components.filter(c => c.id !== id); }

export function addBOMEntry(b: BOMEntry) { bomEntries = [...bomEntries, b]; }
export function updateBOMEntry(b: BOMEntry) { bomEntries = bomEntries.map(x => x.id === b.id ? b : x); }
export function deleteBOMEntry(id: string) { bomEntries = bomEntries.filter(b => b.id !== id); }
export function deleteBOMEntriesForProduct(productId: string) { bomEntries = bomEntries.filter(b => b.productId !== productId); }

export function updateInventory(inv: InventoryEntry) { inventory = inventory.map(x => x.id === inv.id ? inv : x); }
