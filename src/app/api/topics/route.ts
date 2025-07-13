import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Environment variable kontrolü
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Supabase environment variables are not configured');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET - Konuları çek
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId gerekli' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Konular alınamadı' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// POST - Yeni konu ekle
export async function POST(request: NextRequest) {
  try {
    const { lessonId, name, description } = await request.json();

    if (!lessonId || !name) {
      return NextResponse.json({ error: 'lessonId ve name gerekli' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('topics')
      .insert([
        {
          lesson_id: lessonId,
          name: name.trim(),
          description: description?.trim() || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Konu eklenemedi' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function DELETE() {
  // API geçici olarak devre dışı - sadece statik konular kullanılıyor
  return NextResponse.json({ message: "API devre dışı" });
} 