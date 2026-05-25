import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { components } = require('@/lib/data');
    console.log("IS ARRAY?", Array.isArray(components));
    console.log("FIRST ITEM:", typeof components[0], components[0]);
    // Fix: create a deep clone to strip any non-serializable getters/setters Next.js hot-reload might attach
    const safeData = JSON.parse(JSON.stringify(components));
    return NextResponse.json(safeData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
