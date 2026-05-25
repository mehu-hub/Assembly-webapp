import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ProductModel, BOMEntryModel, ComponentModel, InventoryEntryModel } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    
    const products = await ProductModel.find({}).lean();
    const boms = await BOMEntryModel.find({}).lean();
    
    // Load components and inventory manually from mock data
    const { components, inventory } = require('@/lib/data');

    // Helper functions for backend calculation
    const getBOM = (prodId: string) => boms.filter(b => b.productId.toString() === prodId.toString());
    const getComp = (compId: string) => components.find((c: any) => c.id === compId.toString());
    const getStock = (compId: string) => {
      const inv = inventory.find((i: any) => i.componentId === compId.toString());
      return inv ? (inv.workshopQty + inv.storageQty) : 0;
    };

    const enrichedProducts = products.map(prod => {
      const prodId = prod._id.toString();
      const prodBOMs = getBOM(prodId);
      
      let maxAssemblies = Infinity;
      let limitingComponent = '';
      
      const enrichedBOMs = prodBOMs.map(bom => {
        const compId = bom.componentId.toString();
        const comp = getComp(compId);
        const stock = getStock(compId);
        
        const possible = Math.floor(stock / bom.quantityRequired);
        if (possible < maxAssemblies) {
          maxAssemblies = possible;
          limitingComponent = comp?.name || compId;
        }

        return {
          id: bom._id.toString(),
          componentId: compId,
          componentName: comp?.name,
          componentUnit: comp?.unit,
          quantityRequired: bom.quantityRequired,
          totalStock: stock,
          isLowStock: stock < bom.quantityRequired
        };
      });

      if (prodBOMs.length === 0) {
        maxAssemblies = 0;
        limitingComponent = 'N/A';
      }

      return {
        id: prodId,
        name: prod.name,
        description: prod.description,
        price: prod.price,
        bom: enrichedBOMs,
        totalParts: prodBOMs.reduce((sum, b) => sum + b.quantityRequired, 0),
        buildCapacity: {
          max: maxAssemblies === Infinity ? 0 : maxAssemblies,
          limitingComponent
        }
      };
    });

    return NextResponse.json(enrichedProducts);
  } catch (error: any) {
    console.error('Failed to fetch from MongoDB, returning mock products:', error);
    // Dynamic import to avoid circular dependency issues if any
    const { products: mockProducts, bomEntries: mockBOMs, components: mockComps, inventory: mockInv } = require('@/lib/data');
    
    // Quick and dirty mock enrichment for fallback
    const enrichedMock = mockProducts.map((prod: any) => {
      const prodBOMs = mockBOMs.filter((b: any) => b.productId === prod.id);
      return {
        ...prod,
        bom: prodBOMs.map((bom: any) => {
          const comp = mockComps.find((c: any) => c.id === bom.componentId);
          return {
            id: bom.id || Math.random().toString(),
            componentId: bom.componentId,
            componentName: comp?.name || bom.componentId,
            quantityRequired: bom.quantityRequired,
            totalStock: 999,
            isLowStock: false
          };
        }),
        buildCapacity: { max: 999, limitingComponent: 'None' }
      };
    });
    
    return NextResponse.json(enrichedMock);
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, description, price, assemblyParts } = body;

    const newProduct = await ProductModel.create({ name, description, price });
    
    if (assemblyParts && Array.isArray(assemblyParts)) {
      const bomsToCreate = assemblyParts.map((part: any) => ({
        productId: newProduct._id,
        componentId: part.componentId,
        quantityRequired: part.quantity
      }));
      if (bomsToCreate.length > 0) {
        await BOMEntryModel.insertMany(bomsToCreate);
      }
    }

    return NextResponse.json({ success: true, id: newProduct._id });
  } catch (error: any) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
