export interface Product {
  id: string;
  name: string;
  description: string;
  price?: number;
}

export interface Component {
  id: string;
  name: string;
  unit: string;
  description: string;
}

export interface BOMEntry {
  id: string;
  productId: string;
  componentId: string;
  quantityRequired: number;
}

export interface InventoryEntry {
  id: string;
  componentId: string;
  workshopQty: number;
  storageQty: number;
  unitPrice: number;
}

export interface AssemblyResult {
  productId: string;
  productName: string;
  maxAssemblies: number;
  limitingComponent: string;
}

export interface ComponentStockInfo {
  component: Component;
  inventory: InventoryEntry;
  totalQty: number;
  totalValue: number;
  status: 'low' | 'warning' | 'ok';
}

export enum ToastStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}

export interface ToastMessage {
  id: string;
  type: ToastStatus;
  title: string;
  message?: string;
}
