import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ComponentModel, BOMEntryModel, InventoryEntryModel } from '@/lib/models';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const component = await ComponentModel.findById(params.id).lean();
    if (!component) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({
      id: component._id.toString(),
      name: component.name,
      unit: component.unit,
      description: component.description,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, unit, description } = body;

    await ComponentModel.findByIdAndUpdate(params.id, { name, unit, description });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    await ComponentModel.findByIdAndDelete(params.id);
    await BOMEntryModel.deleteMany({ componentId: params.id });
    await InventoryEntryModel.deleteMany({ componentId: params.id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
