"use client";
import React, { useState } from "react";
import MobileLayout from "./MobileLayout";

interface MobileTopicsPageProps {
  lesson: { id: string; name: string; description?: string };
  onBack: () => void;
  staticTopics?: Record<string, { id: string; name: string; description?: string }[]>;
}

export default function MobileTopicsPage({ lesson, onBack, staticTopics }: MobileTopicsPageProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState("");

  // Statik konuları al
  const staticTopicsForLesson = staticTopics?.[lesson.id] || [];

  // DEBUG: Konsola bilgileri yazdır
  console.log('🔍 DEBUG MobileTopicsPage:', {
    lessonId: lesson.id,
    lessonName: lesson.name,
    staticTopicsKeys: staticTopics ? Object.keys(staticTopics) : 'undefined',
    staticTopicsForLesson: staticTopicsForLesson,
    staticTopicsForLessonLength: staticTopicsForLesson.length,
    staticTopicsObject: staticTopics
  });

  async function handleAddTopic(e: React.FormEvent) {
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
    <MobileLayout currentPage="derslerim">
      <div className="space-y-6">
        <button onClick={onBack} className="mb-2 text-sky-600 hover:underline">&larr; Geri</button>
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{lesson.name} - Konular</h2>
          <p className="text-gray-600 mb-4">{lesson.description}</p>
          
          {/* DEBUG: Debug bilgileri - Daha belirgin */}
          <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 mb-4 text-left">
            <h3 className="font-bold text-red-800 mb-2 text-sm">🔍 DEBUG BİLGİLERİ:</h3>
            <p className="text-red-700 text-xs mb-1">Ders ID: <strong>{lesson.id}</strong></p>
            <p className="text-red-700 text-xs mb-1">Ders Adı: <strong>{lesson.name}</strong></p>
            <p className="text-red-700 text-xs mb-1">StaticTopics Anahtarları: <strong>{staticTopics ? Object.keys(staticTopics).join(', ') : 'undefined'}</strong></p>
            <p className="text-red-700 text-xs mb-1">Bulunan Konular: <strong>{staticTopicsForLesson.length}</strong></p>
            <p className="text-red-700 text-xs mb-1">Konular: <strong>{staticTopicsForLesson.map(t => t.name).join(', ')}</strong></p>
            <p className="text-red-700 text-xs">StaticTopics Objesi: <strong>{staticTopics ? 'Mevcut' : 'Yok'}</strong></p>
          </div>
          
          <form onSubmit={handleAddTopic} className="mb-6 space-y-2 bg-sky-50 p-4 rounded-xl border text-left">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Konu adı"
              className="w-full p-2 rounded border mb-2 bg-white text-gray-900"
              required
            />
            {formError && <div className="text-red-500 text-center font-semibold mb-2">{formError}</div>}
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Açıklama (opsiyonel)"
              className="w-full p-2 rounded border mb-2 bg-white text-gray-900"
            />
            <button
              type="submit"
              className="bg-sky-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-sky-600 transition-all duration-200 w-full disabled:opacity-50"
              disabled={adding || !name.trim()}
            >
              {adding ? "Ekleniyor..." : "Konu Ekle"}
            </button>
          </form>
          
          {/* Statik Konular - Her zaman göster */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 text-gray-800 text-center">2025 Müfredat Konuları</h3>
            {staticTopicsForLesson.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {staticTopicsForLesson.map((topic) => (
                  <div key={topic.id} className="relative aspect-square flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl border-4 border-transparent bg-clip-padding hover:border-green-400 hover:scale-105 transition-all duration-300 group overflow-hidden cursor-pointer select-none">
                    <h3 className="font-bold text-lg text-green-700 tracking-tight flex items-center gap-2 text-center pointer-events-none">{topic.name}</h3>
                    {topic.description && <p className="text-xs text-green-600 text-center mt-2 pointer-events-none">{topic.description}</p>}
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-yellow-600">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-yellow-800 font-medium text-sm">Bu ders için henüz konular tanımlanmamış.</span>
                </div>
                <p className="text-yellow-700 text-xs mt-2">Ders ID: {lesson.id}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
} 