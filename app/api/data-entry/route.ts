import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { DataEntryModel } from '@/lib/models';
import { z } from 'zod';

const dataEntrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required")
});

export async function GET() {
  try {
    await connectToDatabase();
    const entries = await DataEntryModel.find({}).sort({ createdAt: -1 }).lean();
    
    const formatted = entries.map(e => ({
      id: e._id.toString(),
      title: e.title,
      category: e.category,
      content: e.content,
      createdAt: e.createdAt
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
    
    const parsed = dataEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    
    const { title, category, content } = parsed.data;
    const newEntry = await DataEntryModel.create({ title, category, content });
    
    return NextResponse.json({ success: true, id: newEntry._id });
  } catch (error: any) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
