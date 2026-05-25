import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ComponentModel } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    const components = await ComponentModel.find({}).lean();
    const formatted = components.map(c => ({
      id: c._id.toString(),
      name: c.name,
      unit: c.unit,
      description: c.description
    }));
    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, unit, description } = body;

    const newComponent = await ComponentModel.create({ name, unit, description });
    return NextResponse.json({ success: true, id: newComponent._id });
  } catch (error: any) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
