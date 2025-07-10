import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Debug logları
    console.log('=== REGISTER API DEBUG ===');
    console.log('Gelen username:', username);
    console.log('Gelen email:', email);
    console.log('Gelen password:', password);
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
    console.log('Supabase ANON KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Tüm alanlar gereklidir' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Kullanıcı adı en az 3 karakter olmalıdır' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    // Email zaten var mı?
    let existingUser, findError;
    try {
      const result = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      existingUser = result.data;
      findError = result.error;
    } catch (error) {
      console.log('Mevcut kullanıcı sorgu hatası:', error);
      findError = error;
    }
    
    console.log('Mevcut kullanıcı:', existingUser);
    console.log('Mevcut kullanıcı hata:', findError);
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email ile zaten bir kullanıcı var.' },
        { status: 400 }
      );
    }

    // Kayıt - retry mekanizması ile
    let data, error;
    for (let i = 0; i < 3; i++) {
      try {
        const result = await supabase
          .from('users')
          .insert([{ username, email, password }])
          .select()
          .single();
        data = result.data;
        error = result.error;
        break;
      } catch (retryError) {
        console.log(`Kayıt denemesi ${i + 1} başarısız:`, retryError);
        if (i === 2) {
          error = retryError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    
    console.log('Kayıt edilen kullanıcı:', data);
    console.log('Kayıt hatası:', error);
    
    if (error || !data) {
      return NextResponse.json({ 
        error: 'Kullanıcı kaydedilemedi', 
        detail: error,
        message: error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Bilinmeyen hata'
      }, { status: 500 });
    }

    console.log('Kayıt başarılı:', data.username);
    return NextResponse.json({ 
      success: true, 
      user: { 
        username: data.username, 
        email: data.email,
        profileImage: data.profile_image || null,
        bio: data.bio || null
      } 
    });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json({ 
      error: 'Sunucu hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata')
    }, { status: 500 });
  }
} 