import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gereklidir' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Supabase'den kullanıcı kontrolü
    const { data: user, error } = await supabase
      .from('users')
      .select('username, email, password')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Email veya şifre hatalı. Lütfen önce kayıt olun.' },
        { status: 401 }
      );
    }

    // Başarılı giriş
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