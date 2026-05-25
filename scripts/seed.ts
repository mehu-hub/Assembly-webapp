import path from 'path';
import dns from 'dns';

// Fix for Node.js SRV record ECONNREFUSED on some Windows networks
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

import mongoose from 'mongoose';
import { ComponentModel, InventoryEntryModel, ProductModel, BOMEntryModel } from '../lib/models';
import { components, inventory, products, bomEntries } from '../lib/data';

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  // Clear existing data
  console.log('Clearing existing data...');
  await ComponentModel.deleteMany({});
  await InventoryEntryModel.deleteMany({});
  await ProductModel.deleteMany({});
  await BOMEntryModel.deleteMany({});

  const componentIdMap = new Map();
  
  console.log('Inserting components...');
  for (const comp of components) {
    const newComp = await ComponentModel.create({
      name: comp.name,
      unit: comp.unit,
      description: comp.description
    });
    componentIdMap.set(comp.id, newComp._id);
  }

  console.log('Inserting inventory...');
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

  const productIdMap = new Map();
  console.log('Inserting products...');
  for (const prod of products) {
    const newProd = await ProductModel.create({
      name: prod.name,
      description: prod.description,
      price: prod.price
    });
    productIdMap.set(prod.id, newProd._id);
  }

  console.log('Inserting BOMs...');
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

  console.log('Seeding completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
