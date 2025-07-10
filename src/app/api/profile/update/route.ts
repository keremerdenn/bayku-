import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, profileImage, bio } = await request.json();

    console.log('=== PROFILE UPDATE API DEBUG ===');
    console.log('Gelen email:', email);
    console.log('Gelen profileImage:', profileImage ? 'SET' : 'NOT SET');
    console.log('Gelen bio:', bio);

    if (!email) {
      return NextResponse.json(
        { error: 'Email gereklidir' },
        { status: 400 }
      );
    }

    // Kullanıcıyı güncelle - şimdilik sadece username güncelle
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ 
        username: bio || null // Geçici olarak bio'yu username'e kaydet
      })
      .eq('email', email)
      .select()
      .single();

    console.log('Supabase update result:', updatedUser);
    console.log('Supabase error:', error);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { error: 'Veritabanı hatası: ' + error.message },
        { status: 500 }
      );
    }

    console.log('Profile update başarılı:', updatedUser.username);
    return NextResponse.json({
      success: true,
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        profileImage: profileImage, // Frontend'den gelen veriyi kullan
        bio: bio // Frontend'den gelen veriyi kullan
      }
    });

  } catch (error) {
    console.error('Profile update API error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') },
      { status: 500 }
    );
  }
} 