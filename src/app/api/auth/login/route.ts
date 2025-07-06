import { NextRequest, NextResponse } from 'next/server';

// Basit in-memory kullanıcı veritabanı (gerçek projede database kullanılır)
let users: Array<{username: string; email: string; password: string}> = [
  { username: 'test', email: 'test@test.com', password: '123456' }
];

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

    // Kullanıcı kontrolü
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
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