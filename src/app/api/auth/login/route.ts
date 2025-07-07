import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Debug logları
    console.log('=== LOGIN API DEBUG ===');
    console.log('Gelen email:', email);
    console.log('Gelen password:', password);
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
    console.log('Supabase ANON KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // Sorgu
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    console.log('Supabase user:', user);
    console.log('Supabase error:', error);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Veritabanı hatası: ' + error.message },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Email veya şifre hatalı. Lütfen önce kayıt olun.' },
        { status: 401 }
      );
    }

    console.log('Login başarılı:', user.username);
    return NextResponse.json({
      success: true,
      user: { username: user.username, email: user.email }
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') },
      { status: 500 }
    );
  }
} 