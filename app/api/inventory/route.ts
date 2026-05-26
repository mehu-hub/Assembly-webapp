import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { InventoryEntryModel, ComponentModel } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    const inventory = await InventoryEntryModel.find().lean();
    const components = await ComponentModel.find().lean();

    const formatted = inventory.map(inv => {
      const component = components.find(c => c._id.toString() === inv.componentId.toString());
      return {
        id: inv._id.toString(),
        componentId: inv.componentId.toString(),
        componentName: component?.name || 'Unknown',
        workshopQty: inv.workshopQty,
        storageQty: inv.storageQty,
        unitPrice: inv.unitPrice,
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

import { z } from 'zod';

const inventorySchema = z.object({
  componentId: z.string().min(1, "Component ID is required"),
  workshopQty: z.coerce.number().min(0),
  storageQty: z.coerce.number().min(0),
  unitPrice: z.coerce.number().min(0)
});

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Server-side validation
    const parsed = inventorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Validation error' }, { status: 400 });
    }
    
    const { componentId, workshopQty, storageQty, unitPrice } = parsed.data;

    const newInventory = await InventoryEntryModel.create({ componentId, workshopQty, storageQty, unitPrice });
    if (!newInventory) throw new Error("Failed to create inventory entry");
    return NextResponse.json({ success: true, id: newInventory._id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
