import { NextResponse } from 'next/server';
import { components } from '@/lib/data';

export async function GET() {
  return NextResponse.json(components);
}
