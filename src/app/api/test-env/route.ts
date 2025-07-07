import { NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export async function GET() {
  return NextResponse.json({
    supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
    supabaseKey: supabaseKey ? 'SET' : 'NOT SET',
    urlLength: supabaseUrl?.length || 0,
    keyLength: supabaseKey?.length || 0
  });
} 