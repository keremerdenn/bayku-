import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  // API geçici olarak devre dışı - sadece statik konular kullanılıyor
  return NextResponse.json([]);
}

export async function POST(_request: NextRequest) {
  // API geçici olarak devre dışı - sadece statik konular kullanılıyor
  return NextResponse.json({ message: "API devre dışı" });
}

export async function DELETE(_request: Request) {
  // API geçici olarak devre dışı - sadece statik konular kullanılıyor
  return NextResponse.json({ message: "API devre dışı" });
} 