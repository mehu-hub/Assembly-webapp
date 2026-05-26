import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ComponentModel, InventoryEntryModel, ProductModel, BOMEntryModel } from '@/lib/models';
import { components, inventory, products, bomEntries } from '@/lib/data';

export async function POST() {
  try {
    await connectToDatabase();

    // Clear existing data
    await ComponentModel.deleteMany({});
    await InventoryEntryModel.deleteMany({});
    await ProductModel.deleteMany({});
    await BOMEntryModel.deleteMany({});

    // Map old IDs to new ObjectIds
    const componentIdMap = new Map();
    
    // 1. Insert Components
    for (const comp of components) {
      const newComp = await ComponentModel.create({
        name: comp.name,
        unit: comp.unit,
        description: comp.description
      });
      componentIdMap.set(comp.id, newComp._id);
    }

    // 2. Insert Inventory
    for (const inv of inventory) {
      const newComponentId = componentIdMap.get(inv.componentId);
      if (newComponentId) {
        await InventoryEntryModel.create({
          componentId: newComponentId,
          workshopQty: inv.workshopQty,
          storageQty: inv.storageQty,
          unitPrice: inv.unitPrice
        });
      }
    }

    // 3. Insert Products and BOMs
    const productIdMap = new Map();
    for (const prod of products) {
      const newProd = await ProductModel.create({
        name: prod.name,
        description: prod.description,
        price: prod.price
      });
      productIdMap.set(prod.id, newProd?._id);
    }

    for (const bom of bomEntries) {
      const newProductId = productIdMap.get(bom.productId);
      const newComponentId = componentIdMap.get(bom.componentId);
      if (newProductId && newComponentId) {
        await BOMEntryModel.create({
          productId: newProductId,
          componentId: newComponentId,
          quantityRequired: bom.quantityRequired
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
