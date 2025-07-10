import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const testId = request.nextUrl.searchParams.get('test_id');
  let query = supabase.from('questions').select('*');
  if (testId) query = query.eq('test_id', testId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { test_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation } = body;
  const { data, error } = await supabase.from('questions').insert([
    { test_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation }
  ]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
} 