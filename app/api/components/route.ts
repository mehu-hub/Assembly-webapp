import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ComponentModel } from '@/lib/models';
import { components as mockComponents } from '@/lib/data';

export async function GET() {
  // Bypassed MongoDB entirely as per request: components will load manually from mock data first.
  return NextResponse.json(mockComponents);
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
