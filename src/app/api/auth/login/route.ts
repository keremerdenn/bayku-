import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Debug logları
    console.log('Gelen email:', email);
    console.log('Gelen password:', password);
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase ANON KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    // Sorgu
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    console.log('Supabase user:', user);
    console.log('Supabase error:', error);

    if (error || !user) {
      return NextResponse.json(
        { error: 'Email veya şifre hatalı. Lütfen önce kayıt olun.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: { username: user.username, email: user.email }
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 