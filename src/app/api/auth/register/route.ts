import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Debug logları
    console.log('Gelen username:', username);
    console.log('Gelen email:', email);
    console.log('Gelen password:', password);
    console.log('Supabase URL:', process.env.SUPABASE_URL);
    console.log('Supabase ANON KEY:', process.env.SUPABASE_ANON_KEY);

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
      return NextResponse.json({ error: 'Bu email ile zaten bir kullanıcı var.' }, { status: 400 });
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

    return NextResponse.json({ success: true, user: { username: data.username, email: data.email } });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json({ 
      error: 'Sunucu hatası',
      detail: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 