import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ComponentModel } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    const components = await ComponentModel.find().lean();
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

import { z } from 'zod';

const componentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unit: z.string().min(1, "Unit is required"),
  description: z.string().optional()
});

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Server-side validation
    const parsed = componentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Validation error' }, { status: 400 });
    }
    
    const { name, unit, description } = parsed.data;

    const newComponent = await ComponentModel.create({ name, unit, description });
    if (!newComponent) throw new Error("Failed to create component");
    return NextResponse.json({ success: true, id: newComponent._id });
  } catch (error: any) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
