import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: 'Email parametresi gerekli' }, { status: 400 });
  }

  try {
    // Kullanıcının çözdüğü soruları al
    const { data: solvedQuestions, error: solvedError } = await supabase
      .from('user_answers')
      .select('*')
      .eq('user_email', email);

    if (solvedError) {
      console.error('Solved questions error:', solvedError);
      return NextResponse.json({ error: 'Veriler alınamadı' }, { status: 500 });
    }

    // Toplam soru sayısı
    const totalQuestions = solvedQuestions?.length || 0;

    // Doğru cevaplar
    const correctAnswers = solvedQuestions?.filter(q => q.is_correct)?.length || 0;

    // Başarı oranı
    const successRate = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100 * 10) / 10 : 0;

    // Bugün çözülen sorular
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayQuestions = solvedQuestions?.filter(q => {
      const questionDate = new Date(q.created_at);
      return questionDate >= today;
    })?.length || 0;

    // Bu hafta çözülen sorular
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekQuestions = solvedQuestions?.filter(q => {
      const questionDate = new Date(q.created_at);
      return questionDate >= weekAgo;
    })?.length || 0;

    // Bu ay çözülen sorular
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthQuestions = solvedQuestions?.filter(q => {
      const questionDate = new Date(q.created_at);
      return questionDate >= monthAgo;
    })?.length || 0;

    // Günlük seri (basit hesaplama)
    const dailyStreak = calculateDailyStreak(solvedQuestions || []);

    return NextResponse.json({
      totalQuestions,
      successRate,
      dailyStreak,
      todayQuestions,
      weekQuestions,
      monthQuestions
    });

  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

function calculateDailyStreak(solvedQuestions: any[]): number {
  if (!solvedQuestions || solvedQuestions.length === 0) return 0;

  // Soruları tarihe göre sırala
  const sortedQuestions = solvedQuestions.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Son 30 günü kontrol et
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(currentDate);
    checkDate.setDate(checkDate.getDate() - i);

    const hasQuestionOnDate = sortedQuestions.some(q => {
      const questionDate = new Date(q.created_at);
      questionDate.setHours(0, 0, 0, 0);
      return questionDate.getTime() === checkDate.getTime();
    });

    if (hasQuestionOnDate) {
      streak++;
    } else {
      break; // Seri kırıldı
    }
  }

  return streak;
} 