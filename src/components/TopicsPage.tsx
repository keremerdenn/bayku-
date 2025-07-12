"use client";
import { useState } from "react";

interface Lesson {
  id: string;
  name: string;
  description?: string;
}

interface Topic {
  id: string;
  name: string;
  description?: string;
}

interface TopicsPageProps {
  lesson: Lesson;
  onBack: () => void;
  onTopicSelect: (topic: Topic) => void;
  staticTopics?: Record<string, { id: string; name: string; description?: string }[]>;
}

export default function TopicsPage({ lesson, onBack, onTopicSelect, staticTopics }: TopicsPageProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState("");

  // Statik konuları al
  const staticTopicsForLesson = staticTopics?.[lesson.id] || [];

  // DEBUG: Konsola bilgileri yazdır
  console.log('🔍 DEBUG TopicsPage:', {
    lessonId: lesson.id,
    lessonName: lesson.name,
    staticTopicsKeys: staticTopics ? Object.keys(staticTopics) : 'undefined',
    staticTopicsForLesson: staticTopicsForLesson,
    staticTopicsForLessonLength: staticTopicsForLesson.length,
    staticTopicsObject: staticTopics
  });

  async function handleAddTopic(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    if (!name.trim()) {
      setFormError("Konu adı boş olamaz.");
      return;
    }
    if (name.length > 60) {
      setFormError("Konu adı 60 karakterden uzun olamaz.");
      return;
    }
    if (!/^[a-zA-Z0-9ğüşöçıİĞÜŞÖÇ\s]+$/.test(name)) {
      setFormError("Konu adı sadece harf, rakam ve boşluk içerebilir.");
      return;
    }
    setAdding(true);
    try {
      // API çağrısı kaldırıldı - sadece statik konular kullanılıyor
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Konu eklenemedi:", err);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pb-20">
      <button onClick={onBack} className="mb-4 text-sky-600 hover:underline">&larr; Geri</button>
      <h1 className="text-2xl font-bold mb-2">{lesson.name} - Konular</h1>
      <p className="text-gray-600 mb-4">{lesson.description}</p>
      
      {/* DEBUG: Debug bilgileri - Daha belirgin */}
      <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 mb-4">
        <h3 className="font-bold text-red-800 mb-2 text-lg">🔍 DEBUG BİLGİLERİ:</h3>
        <p className="text-red-700 text-sm mb-1">Ders ID: <strong>{lesson.id}</strong></p>
        <p className="text-red-700 text-sm mb-1">Ders Adı: <strong>{lesson.name}</strong></p>
        <p className="text-red-700 text-sm mb-1">StaticTopics Anahtarları: <strong>{staticTopics ? Object.keys(staticTopics).join(', ') : 'undefined'}</strong></p>
        <p className="text-red-700 text-sm mb-1">Bulunan Konular: <strong>{staticTopicsForLesson.length}</strong></p>
        <p className="text-red-700 text-sm mb-1">Konular: <strong>{staticTopicsForLesson.map(t => t.name).join(', ')}</strong></p>
        <p className="text-red-700 text-sm">StaticTopics Objesi: <strong>{staticTopics ? 'Mevcut' : 'Yok'}</strong></p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">Yeni Konu Ekle</h3>
        </div>
        <form onSubmit={handleAddTopic}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konu Adı</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Örn: Matematik Temelleri"
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-fuchsia-400 focus:outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (Opsiyonel)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Konu hakkında kısa açıklama"
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-fuchsia-400 focus:outline-none transition"
            />
          </div>
          {formError && <div className="text-red-500 text-center font-semibold text-sm bg-red-50 p-3 rounded-lg border border-red-200">{formError}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-fuchsia-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={adding || !name.trim()}
          >
            {adding ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Ekleniyor...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Konu Ekle
              </div>
            )}
          </button>
        </form>
      </div>
      
      {/* Statik Konular - Her zaman göster */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800">2025 Müfredat Konuları</h3>
        {staticTopicsForLesson.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {staticTopicsForLesson.map((topic) => (
              <div key={topic.id} className="relative bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-sky-200 transition-all duration-300 cursor-pointer select-none p-6" onClick={() => onTopicSelect(topic)} tabIndex={0} role="button" aria-pressed="false">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 tracking-tight">{topic.name}</h3>
                </div>
                {topic.description && <p className="text-sm text-gray-600 mb-3">{topic.description}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">Müfredat Konusu</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-yellow-600">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-yellow-800 font-medium">Bu ders için henüz konular tanımlanmamış.</span>
            </div>
            <p className="text-yellow-700 text-sm mt-2">Ders ID: {lesson.id}</p>
          </div>
        )}
      </div>
    </div>
  );
} 