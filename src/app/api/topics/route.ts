import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  // API geçici olarak devre dışı - sadece statik konular kullanılıyor
  return NextResponse.json([]);
}

export async function POST(request: NextRequest) {
  // API geçici olarak devre dışı - sadece statik konular kullanılıyor
  return NextResponse.json({ message: "API devre dışı" });
}

export async function DELETE(request: Request) {
  // API geçici olarak devre dışı - sadece statik konular kullanılıyor
  return NextResponse.json({ message: "API devre dışı" });
} 