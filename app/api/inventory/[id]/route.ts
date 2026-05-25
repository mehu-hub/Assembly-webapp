import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { InventoryEntryModel } from '@/lib/models';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const body = await request.json();
    const { componentId, workshopQty, storageQty, unitPrice } = body;

    await InventoryEntryModel.findByIdAndUpdate(params.id, { componentId, workshopQty, storageQty, unitPrice });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectToDatabase();
    await InventoryEntryModel.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
