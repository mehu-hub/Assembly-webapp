import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { DataEntryModel } from '@/lib/models';

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    
    const deleted = await (DataEntryModel as any).deleteOne({ _id: params.id });
    
    if (!deleted) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
