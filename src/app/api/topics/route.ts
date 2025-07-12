import { NextResponse } from 'next/server';

export async function GET() {
  // API geçici olarak devre dışı - sadece statik konular kullanılıyor
  return NextResponse.json([]);
}

export async function POST() {
  // API geçici olarak devre dışı - sadece statik konular kullanılıyor
  return NextResponse.json({ message: "API devre dışı" });
}

export async function DELETE() {
  // API geçici olarak devre dışı - sadece statik konular kullanılıyor
  return NextResponse.json({ message: "API devre dışı" });
} 