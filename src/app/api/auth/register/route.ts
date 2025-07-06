import { NextRequest, NextResponse } from 'next/server';

// Basit in-memory kullanıcı veritabanı (gerçek projede database kullanılır)
let users: Array<{username: string; email: string; password: string}> = [
  { username: 'test', email: 'test@test.com', password: '123456' }
];

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

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

    // Kullanıcı zaten kayıtlı mı kontrol et
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kayıtlı. Lütfen giriş yapın.' },
        { status: 409 }
      );
    }

    // Yeni kullanıcı kaydet
    const newUser = { username, email, password };
    users.push(newUser);

    // Başarılı kayıt
    return NextResponse.json({
      success: true,
      user: { username, email }
    });

  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 