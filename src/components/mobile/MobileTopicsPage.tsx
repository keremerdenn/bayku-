"use client";
import React, { useState, useEffect } from "react";
import MobileLayout from "./MobileLayout";

interface MobileTopicsPageProps {
  lesson: { id: string; name: string; description?: string };
  onBack: () => void;
}

export default function MobileTopicsPage({ lesson, onBack }: MobileTopicsPageProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState("");
  const [topics, setTopics] = useState<{ id: string; name: string; description?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Konuları API'den çek
  useEffect(() => {
    fetchTopics();
  }, [lesson.id, fetchTopics]);

  async function fetchTopics() {
    setLoading(true);
    try {
      const res = await fetch(`/api/topics?lessonId=${lesson.id}`);
      if (res.ok) {
        const data = await res.json();
        setTopics(data);
      } else {
        console.error('Konular alınamadı');
      }
    } catch (err) {
      console.error('Konular alınırken hata:', err);
    } finally {
      setLoading(false);
    }
  }

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
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          lessonId: lesson.id, 
          name: name.trim(), 
          description: description.trim() 
        }),
      });
      if (res.ok) {
        const newTopic = await res.json();
        setTopics(prev => [...prev, newTopic]);
        setName("");
        setDescription("");
      } else {
        console.error('Konu eklenemedi');
      }
    } catch (err) {
      console.error('Konu eklenirken hata:', err);
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
            {loading ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-yellow-800 font-medium text-sm">Konular yükleniyor...</span>
                </div>
                <p className="text-yellow-700 text-xs mt-2">Ders ID: {lesson.id}</p>
              </div>
            ) : topics.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {topics.map((topic) => (
                  <div key={topic.id} className="bg-white border border-gray-100 rounded-lg p-1 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition shadow-sm min-h-[56px] min-w-0">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md flex items-center justify-center mb-0">
                      <span className="text-white font-medium text-xs">{topic.name[0]}</span>
                    </div>
                    <h3 className="font-medium text-gray-800 text-xs mb-0 truncate w-full">{topic.name}</h3>
                    {topic.description && <p className="text-[9px] text-gray-500 text-center mt-0 pointer-events-none truncate w-full">{topic.description}</p>}
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