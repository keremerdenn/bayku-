import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Basit bir test sorgusu
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    return NextResponse.json({
      success: true,
      data: data,
      error: error,
      message: error ? 'Supabase bağlantı hatası' : 'Supabase bağlantısı başarılı'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error,
      message: 'Beklenmeyen hata'
    });
  }
} 