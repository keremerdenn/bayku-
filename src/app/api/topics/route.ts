import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const lessonId = request.nextUrl.searchParams.get('lesson_id');
  let query = supabase.from('topics').select('*');
  if (lessonId) query = query.eq('lesson_id', lessonId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { lesson_id, name, description } = body;
  const { data, error } = await supabase.from('topics').insert([{ lesson_id, name, description }]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
} 