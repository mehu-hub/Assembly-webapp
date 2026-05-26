import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ProductModel, BOMEntryModel, ComponentModel } from '@/lib/models';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const product = await (ProductModel as any).findById(params.id).lean();
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    
    const boms = await BOMEntryModel.find({ productId: params.id } as any).lean();
    const components = await ComponentModel.find().lean();

    return NextResponse.json({
      ...product,
      id: product._id.toString(),
      _id: undefined,
      assemblyParts: boms.map((b: any) => ({
        id: b._id.toString(),
        componentId: b.componentId,
        componentName: components.find((c: any) => c._id.toString() === b.componentId.toString())?.name || 'Unknown',
        quantity: b.quantityRequired
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, description, price, assemblyParts } = body;

    await (ProductModel as any).updateOne({ _id: params.id }, { name, description, price });
    
    if (assemblyParts) {
      await BOMEntryModel.deleteMany({ productId: params.id } as any);
      const bomsToCreate = assemblyParts.map((part: any) => ({
        productId: params.id,
        componentId: part.componentId,
        quantityRequired: part.quantity
      }));
      if (bomsToCreate.length > 0) {
        await BOMEntryModel.insertMany(bomsToCreate as any);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectToDatabase();
    await (ProductModel as any).deleteOne({ _id: params.id });
    await BOMEntryModel.deleteMany({ productId: params.id } as any);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
