// Shared enums — importable from both server and client code.
// Keep this file free of 'use server' / 'use client' directives.

export enum FormSection {
  Products   = 'products',
  Components = 'components',
  Stock      = 'stock',
  Assembly   = 'assembly',
  Reports    = 'reports',
}

export enum SubmitStatus {
  Idle    = 'idle',
  Success = 'success',
  Error   = 'error',
}

export enum ReportCategory {
  ProductStructure    = 'product-structure',
  Inventory           = 'inventory',
  AssemblyPossibility = 'assembly-possibility',
}

export interface FormState {
  status: SubmitStatus;
  errors: Record<string, string>;
  message?: string;
}

export const initialFormState: FormState = {
  status: SubmitStatus.Idle,
  errors: {},
};
