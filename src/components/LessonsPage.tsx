"use client";
import React, { useEffect, useState } from "react";
import TopicsPage from "./TopicsPage";
import TestsPage from "./TestsPage";

interface Lesson {
  id: string;
  name: string;
  description?: string;
  examType?: string; // LGS, TYT, AYT, KPSS
}

interface Topic {
  id: string;
  name: string;
  description?: string;
}

interface ExamType {
  id: string;
  name: string;
  color: string;
  description: string;
}

export default function LessonsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [username, setUsername] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [email, setEmail] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
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

  useEffect(() => {
    fetchLessons();
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
      // const data = await res.json(); // Kaldırıldı
      // setLessons(data); // Kaldırıldı
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

  if (selectedTopic) {
    return <TestsPage topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
  }
  if (selectedLesson) {
    return <TopicsPage lesson={selectedLesson} onBack={() => setSelectedLesson(null)} onTopicSelect={setSelectedTopic} />;
  }

  if (currentView === 'examTypes') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pb-20">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-sky-500 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent tracking-tight flex items-center justify-center gap-2">
              <svg width='36' height='36' fill='none' viewBox='0 0 24 24'><path d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' stroke='#0ea5e9' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/></svg>
              Hoş geldin, {username}!
            </h1>
            <div className="text-lg text-sky-600 font-semibold mt-2 animate-fade-in">Hangi sınav için çalışmak istiyorsun?</div>
          </div>
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {examTypes.map((examType) => (
              <div 
                key={examType.id}
                onClick={() => {
                  setSelectedExamType(examType.id);
                  setCurrentView('lessons');
                }}
                className="relative bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-sky-200 transition-all duration-300 cursor-pointer p-6 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${examType.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className="text-white font-bold text-lg">{examType.name}</span>
                  </div>
                  <h2 className="font-bold text-lg text-gray-800 tracking-tight">{examType.name}</h2>
                </div>
                <p className="text-sm text-gray-600 mb-3">{examType.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-sky-600 font-medium">Sınav Türü</span>
                  <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pb-20">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="mb-8 text-center">
          <button 
            onClick={() => {
              setCurrentView('examTypes');
              setSelectedExamType("");
            }}
            className="mb-4 text-sky-600 hover:underline flex items-center gap-2"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Geri
          </button>
          <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-sky-500 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent tracking-tight flex items-center justify-center gap-2">
            <svg width='36' height='36' fill='none' viewBox='0 0 24 24'><path d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' stroke='#0ea5e9' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/></svg>
            {examTypes.find(et => et.id === selectedExamType)?.name} Dersleri
          </h1>
          <div className="text-lg text-sky-600 font-semibold mt-2 animate-fade-in">Hangi dersi çalışmak istersin?</div>
        </div>

        {loading && <div className="flex flex-col items-center justify-center py-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500 mb-2"></div><span className="text-sky-700">Yükleniyor...</span></div>}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {!loading && filteredLessons.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#a21caf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="mt-4 text-lg bg-gradient-to-r from-sky-500 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent font-bold">Henüz hiç ders yok.</span>
          </div>
        )}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredLessons.map((lesson) => (
            <div key={lesson.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition shadow-sm relative" onClick={() => setSelectedLesson({ id: lesson.id, name: lesson.name })}>
              <h3 className="font-medium text-gray-800 text-lg mb-1">{lesson.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Ders Silme Onay Modal'ı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Dersi Sil</h3>
              <p className="text-gray-600 mb-6">
                Bu dersi silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm konular ve testler silinecektir.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setLessonToDelete(null); }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDeleteLesson}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Evet, Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 