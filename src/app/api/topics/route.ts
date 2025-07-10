import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

export async function DELETE(request: Request) {
  const { id, email } = await request.json();
  if (email !== "keremerdeen@gmail.com") {
    return new Response(JSON.stringify({ error: "Yetkisiz işlem" }), { status: 403 });
  }
  if (!id) {
    return new Response(JSON.stringify({ error: "Eksik id" }), { status: 400 });
  }
  const { error } = await supabase.from("topics").delete().eq("id", id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 