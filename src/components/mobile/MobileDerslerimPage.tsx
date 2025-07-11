"use client";
import React, { useEffect, useState } from "react";
import MobileLayout from "./MobileLayout";
import MobileTopicsPage from "./MobileTopicsPage";

interface Lesson {
  id: string;
  name: string;
  description?: string;
  examType?: string;
}

interface ExamType {
  id: string;
  name: string;
  color: string;
  description: string;
}

export default function MobileDerslerimPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const [selectedExamType, setSelectedExamType] = useState("");
  const [currentView, setCurrentView] = useState<'examTypes' | 'lessons'>('examTypes');

  const examTypes: ExamType[] = [
    {
      id: 'lgs',
      name: 'LGS',
      color: 'from-green-500 to-emerald-500',
      description: 'Liselere Geçiş Sınavı'
    },
    {
      id: 'tyt',
      name: 'TYT',
      color: 'from-blue-500 to-cyan-500',
      description: 'Temel Yeterlilik Testi'
    },
    {
      id: 'ayt',
      name: 'AYT',
      color: 'from-purple-500 to-pink-500',
      description: 'Alan Yeterlilik Testi'
    },
    {
      id: 'kpss',
      name: 'KPSS',
      color: 'from-orange-500 to-red-500',
      description: 'Kamu Personel Seçme Sınavı'
    }
  ];

  const staticLessons: Record<string, { id: string; name: string }[]> = {
    lgs: [
      { id: 'lgs-mat', name: 'Matematik' },
      { id: 'lgs-turkce', name: 'Türkçe' },
      { id: 'lgs-fen', name: 'Fen Bilimleri' },
      { id: 'lgs-sosyal', name: 'Sosyal Bilgiler' },
      { id: 'lgs-ing', name: 'İngilizce' },
    ],
    tyt: [
      { id: 'tyt-mat', name: 'Matematik' },
      { id: 'tyt-turkce', name: 'Türkçe' },
      { id: 'tyt-fen', name: 'Fen Bilimleri' },
      { id: 'tyt-sosyal', name: 'Sosyal Bilimler' },
    ],
    ayt: [
      { id: 'ayt-mat', name: 'Matematik' },
      { id: 'ayt-fizik', name: 'Fizik' },
      { id: 'ayt-kimya', name: 'Kimya' },
      { id: 'ayt-biyoloji', name: 'Biyoloji' },
      { id: 'ayt-edebiyat', name: 'Türk Dili ve Edebiyatı' },
      { id: 'ayt-tarih', name: 'Tarih' },
      { id: 'ayt-cografya', name: 'Coğrafya' },
      { id: 'ayt-felsefe', name: 'Felsefe' },
    ],
    kpss: [
      { id: 'kpss-gy', name: 'Genel Yetenek' },
      { id: 'kpss-gk', name: 'Genel Kültür' },
      { id: 'kpss-egitim', name: 'Eğitim Bilimleri' },
      { id: 'kpss-oabt', name: 'ÖABT' },
    ],
  };
  const lessonColors: Record<string, string> = {
    lgs: 'from-green-500 to-emerald-500',
    tyt: 'from-blue-500 to-cyan-500',
    ayt: 'from-purple-500 to-pink-500',
    kpss: 'from-orange-500 to-red-500',
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("sinavPusulasiUser");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUsername(user.username || "Kullanıcı");
          setEmail(user.email || "");
        } catch {}
      }
    }
  }, []);

  async function fetchLessons() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/lessons");
      if (!res.ok) throw new Error("Dersler alınamadı");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDeleteLesson() {
    if (!lessonToDelete) return;
    
    const res = await fetch("/api/lessons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lessonToDelete, email }),
    });
    if (res.ok) {
      await fetchLessons();
    } else {
      const data = await res.json();
      alert(data.error || "Silme işlemi başarısız oldu.");
    }
    setShowDeleteModal(false);
    setLessonToDelete(null);
  }

  const filteredLessons: { id: string; name: string }[] = staticLessons[selectedExamType] || [];

  if (selectedLesson) {
    return <MobileTopicsPage lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />;
  }

  if (currentView === 'examTypes') {
    return (
      <MobileLayout currentPage="derslerim">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Hoş geldin, {username}!</h2>
            <p className="text-sm text-gray-500">Hangi sınav için çalışmak istiyorsun?</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {examTypes.map((examType) => (
              <div 
                key={examType.id}
                onClick={() => {
                  setSelectedExamType(examType.id);
                  setCurrentView('lessons');
                }}
                className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition shadow-sm"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${examType.color} rounded-lg flex items-center justify-center mb-2`}>
                  <span className="text-white font-bold text-sm">{examType.name}</span>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">{examType.name}</h3>
                <p className="text-xs text-gray-500">{examType.description}</p>
              </div>
            ))}
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout currentPage="derslerim">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="mb-4">
          <button 
            onClick={() => {
              setCurrentView('examTypes');
              setSelectedExamType("");
            }}
            className="text-blue-600 hover:underline flex items-center gap-1 text-sm mb-2"
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Geri
          </button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {examTypes.find(et => et.id === selectedExamType)?.name} Dersleri
            </h2>
            <p className="text-sm text-gray-500">Hangi dersi çalışmak istersin?</p>
          </div>
        </div>
        
        {loading && <div className="flex flex-col items-center justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-2"></div><span className="text-gray-500">Yükleniyor...</span></div>}
        {error && <div className="text-red-500 text-center mb-2 text-xs">{error}</div>}
        {!loading && filteredLessons.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="mt-2 text-sm">Henüz hiç ders yok.</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition shadow-sm relative group`}
              onClick={() => setSelectedLesson({ id: lesson.id, name: lesson.name })}
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${lessonColors[selectedExamType] || 'from-gray-300 to-gray-400'} rounded-lg flex items-center justify-center mb-1`}>
                <span className="text-white font-bold text-base">{lesson.name[0]}</span>
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-sky-600 transition-colors">{lesson.name}</h3>
            </div>
          ))}
        </div>

        {/* Ders Silme Onay Modal'ı */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                    <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Dersi Sil</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Bu dersi silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm konular ve testler silinecektir.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowDeleteModal(false); setLessonToDelete(null); }}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={confirmDeleteLesson}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
} 