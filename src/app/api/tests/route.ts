import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const topicId = request.nextUrl.searchParams.get('topic_id');
  let query = supabase.from('tests').select('*');
  if (topicId) query = query.eq('topic_id', topicId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { topic_id, name, description, difficulty } = body;
  const { data, error } = await supabase.from('tests').insert([{ topic_id, name, description, difficulty }]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
} 