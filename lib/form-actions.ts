'use server';

import { z } from 'zod';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import {
  ProductModel,
  ComponentModel,
  BOMEntryModel,
  InventoryEntryModel,
} from '@/lib/models';
import {
  SubmitStatus,
  ReportCategory,
  type FormState,
} from '@/lib/form-enums';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildErrors(issues: z.ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};
  issues.forEach(issue => {
    const key = String(issue.path[0]);
    if (key) errors[key] = issue.message;
  });
  return errors;
}

function errState(msg: string): FormState {
  return { status: SubmitStatus.Error, errors: { _form: msg } };
}

// ─── Products ────────────────────────────────────────────────────────────────

const productSchema = z.object({
  name:        z.string().min(2,  'Name must be at least 2 characters.'),
  description: z.string().min(5,  'Description must be at least 5 characters.'),
  price:       z.coerce.number().min(0.01, 'Price must be greater than 0.'),
});

export async function submitProductForm(
  prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = productSchema.safeParse({
    name:        formData.get('name'),
    description: formData.get('description'),
    price:       formData.get('price'),
  });
  if (!parsed.success) {
    return { status: SubmitStatus.Error, errors: buildErrors(parsed.error.issues) };
  }
  try {
    await connectToDatabase();
    const product = await ProductModel.create(parsed.data);
    return {
      status:  SubmitStatus.Success,
      errors:  {},
      message: `Product "${product.name}" saved. View it in Products → Product List.`,
    };
  } catch (e: any) {
    return errState(e.message || 'Database error saving product.');
  }
}

// ─── Components ──────────────────────────────────────────────────────────────

const componentSchema = z.object({
  name:        z.string().min(2, 'Name must be at least 2 characters.'),
  unit:        z.string().min(1, 'Unit is required (e.g. pcs, kg, m).'),
  description: z.string().optional(),
});

export async function submitComponentForm(
  prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = componentSchema.safeParse({
    name:        formData.get('name'),
    unit:        formData.get('unit'),
    description: formData.get('description'),
  });
  if (!parsed.success) {
    return { status: SubmitStatus.Error, errors: buildErrors(parsed.error.issues) };
  }
  try {
    await connectToDatabase();
    const comp = await ComponentModel.create(parsed.data);
    return {
      status:  SubmitStatus.Success,
      errors:  {},
      message: `Component "${comp.name}" saved. View it in Components → Component List.`,
    };
  } catch (e: any) {
    return errState(e.message || 'Database error saving component.');
  }
}

// ─── Stock (Inventory) ────────────────────────────────────────────────────────

const stockSchema = z.object({
  componentId:  z.string().min(1,  'Component ID is required.'),
  workshopQty:  z.coerce.number().int().min(0, 'Workshop quantity cannot be negative.'),
  storageQty:   z.coerce.number().int().min(0, 'Storage quantity cannot be negative.'),
  unitPrice:    z.coerce.number().min(0.01, 'Unit price must be greater than 0.'),
});

export async function submitStockForm(
  prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = stockSchema.safeParse({
    componentId:  formData.get('componentId'),
    workshopQty:  formData.get('workshopQty'),
    storageQty:   formData.get('storageQty'),
    unitPrice:    formData.get('unitPrice'),
  });
  if (!parsed.success) {
    return { status: SubmitStatus.Error, errors: buildErrors(parsed.error.issues) };
  }
  try {
    await connectToDatabase();
    // Upsert so editing stock doesn't create duplicates
    await (InventoryEntryModel as any).updateOne(
      { componentId: parsed.data.componentId },
      { $set: parsed.data },
      { upsert: true },
    );
    return {
      status:  SubmitStatus.Success,
      errors:  {},
      message: 'Stock entry saved. View it in Components → Component Inventory.',
    };
  } catch (e: any) {
    return errState(e.message || 'Database error saving stock entry.');
  }
}

// ─── Assembly (BOM entry) ─────────────────────────────────────────────────────

const assemblySchema = z.object({
  productId:   z.string().min(1, 'Product ID is required.'),
  componentId: z.string().min(1, 'Component ID is required.'),
  quantity:    z.coerce.number().int().min(1, 'Quantity must be at least 1.'),
  notes:       z.string().optional(),
});

export async function submitAssemblyForm(
  prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = assemblySchema.safeParse({
    productId:   formData.get('productId'),
    componentId: formData.get('componentId'),
    quantity:    formData.get('quantity'),
    notes:       formData.get('notes'),
  });
  if (!parsed.success) {
    return { status: SubmitStatus.Error, errors: buildErrors(parsed.error.issues) };
  }

  // Validate productId is a valid ObjectId
  if (!mongoose.isValidObjectId(parsed.data.productId)) {
    return { status: SubmitStatus.Error, errors: { productId: 'Not a valid Product ID. Copy it from the Product List page.' } };
  }

  try {
    await connectToDatabase();

    // Check product exists
    const product = await (ProductModel as any).findById(parsed.data.productId).lean();
    if (!product) {
      return { status: SubmitStatus.Error, errors: { productId: 'Product not found. Check the ID.' } };
    }

    // Upsert BOM entry so the same component isn't duplicated on the same product
    await (BOMEntryModel as any).updateOne(
      { productId: parsed.data.productId, componentId: parsed.data.componentId },
      { $set: { quantityRequired: parsed.data.quantity } },
      { upsert: true },
    );
    return {
      status:  SubmitStatus.Success,
      errors:  {},
      message: 'Assembly requirement saved. View it in Products → Product Structure.',
    };
  } catch (e: any) {
    return errState(e.message || 'Database error saving assembly requirement.');
  }
}

// ─── Reports (saved to DataEntry collection) ─────────────────────────────────

export enum ReportCategoryEnum {
  ProductStructure    = 'product-structure',
  Inventory           = 'inventory',
  AssemblyPossibility = 'assembly-possibility',
}

const reportSchema = z.object({
  title:    z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.nativeEnum(ReportCategory, { message: 'Please select a valid category.' }),
  content:  z.string().min(10, 'Content must be at least 10 characters.'),
});

// Inline DataEntry model access (already registered in models.ts)
import { DataEntryModel } from '@/lib/models';

export async function submitReportForm(
  prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = reportSchema.safeParse({
    title:    formData.get('title'),
    category: formData.get('category'),
    content:  formData.get('content'),
  });
  if (!parsed.success) {
    return { status: SubmitStatus.Error, errors: buildErrors(parsed.error.issues) };
  }
  try {
    await connectToDatabase();
    await DataEntryModel.create({
      title:    parsed.data.title,
      category: parsed.data.category,
      content:  parsed.data.content,
    });
    return {
      status:  SubmitStatus.Success,
      errors:  {},
      message: `Report "${parsed.data.title}" submitted successfully.`,
    };
  } catch (e: any) {
    return errState(e.message || 'Database error submitting report.');
  }
}
