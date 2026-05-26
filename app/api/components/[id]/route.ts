import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ComponentModel, BOMEntryModel, InventoryEntryModel } from '@/lib/models';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectToDatabase();
    // @ts-ignore
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

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, unit, description } = body;

    // @ts-ignore
    await ComponentModel.findByIdAndUpdate(params.id, { name, unit, description });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectToDatabase();
    // @ts-ignore
    await ComponentModel.findByIdAndDelete(params.id);
    // @ts-ignore
    await BOMEntryModel.deleteMany({ componentId: params.id });
    // @ts-ignore
    await InventoryEntryModel.deleteMany({ componentId: params.id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
