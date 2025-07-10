"use client";
import React, { useEffect, useState } from "react";
import MobileLayout from "./MobileLayout";
import MobileTopicsPage from "./MobileTopicsPage";

interface Lesson {
  id: string;
  name: string;
  description?: string;
}

export default function MobileDerslerimPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [username, setUsername] = useState("");
  const [formError, setFormError] = useState("");

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
      const data = await res.json();
      setLessons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLesson(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!name.trim()) {
      setFormError("Ders adı boş olamaz.");
      return;
    }
    if (name.length > 40) {
      setFormError("Ders adı 40 karakterden uzun olamaz.");
      return;
    }
    if (!/^[a-zA-Z0-9ğüşöçıİĞÜŞÖÇ\s]+$/.test(name)) {
      setFormError("Ders adı sadece harf, rakam ve boşluk içerebilir.");
      return;
    }
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error("Ders eklenemedi");
      setName("");
      setDescription("");
      await fetchLessons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ders eklenemedi");
    } finally {
      setAdding(false);
    }
  }

  if (selectedLesson) {
    return <MobileTopicsPage lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />;
  }

  // SVG Pattern for background
  const svgPattern = (
    <svg className="absolute inset-0 w-full h-full" style={{zIndex:0}} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="6" fill="#e0e7ff" fillOpacity="0.25" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern-circles)" />
    </svg>
  );

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white pb-20 overflow-x-hidden">
      {svgPattern}
      <MobileLayout currentPage="derslerim">
        <div className="relative z-10 space-y-6 p-4 pt-8">
          <div className="mb-4 text-center">
            <h2 className="text-3xl font-extrabold text-sky-700 mb-2 tracking-tight flex items-center justify-center gap-2 drop-shadow-lg">
              <svg width='36' height='36' fill='none' viewBox='0 0 24 24'><path d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' stroke='#0ea5e9' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/></svg>
              Hoş geldin, {username}!
            </h2>
            <div className="text-lg text-sky-600 font-semibold mt-2 animate-fade-in">Bugün hangi dersi çalışmak istersin?</div>
          </div>
          <div className="bg-gradient-to-br from-white via-fuchsia-50 to-sky-50 rounded-3xl p-6 shadow-2xl border-2 border-sky-100 text-center animate-fade-in">
            <h2 className="text-3xl font-extrabold text-sky-700 mb-4 tracking-tight">Derslerim</h2>
            <form onSubmit={handleAddLesson} className="mb-6 space-y-3 bg-gradient-to-r from-sky-50 to-fuchsia-50 p-4 rounded-2xl border border-sky-100 shadow-md text-left animate-pop-in">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ders adı"
                className="w-full p-3 rounded-xl border-2 border-sky-200 bg-white text-gray-900 focus:ring-2 focus:ring-sky-400 focus:outline-none transition mb-2"
                required
              />
              {formError && <div className="text-red-500 text-center font-semibold mb-2 animate-fade-in">{formError}</div>}
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Açıklama (opsiyonel)"
                className="w-full p-3 rounded-xl border-2 border-sky-200 bg-white text-gray-900 focus:ring-2 focus:ring-sky-400 focus:outline-none transition mb-2"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow hover:from-fuchsia-500 hover:to-sky-500 active:scale-97 transition-all duration-200 w-full disabled:opacity-50 animate-fade-in"
                disabled={adding || !name.trim()}
              >
                {adding ? "Ekleniyor..." : "Ders Ekle"}
              </button>
            </form>
            {loading && <div className="flex flex-col items-center justify-center py-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500 mb-2"></div><span className="text-sky-700">Yükleniyor...</span></div>}
            {error && <div className="text-red-500 text-center mb-4 animate-fade-in">{error}</div>}
            {!loading && lessons.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 animate-fade-in">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="mt-4 text-lg">Henüz hiç ders yok.</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="bg-gradient-to-br from-sky-100 via-fuchsia-50 to-white rounded-2xl shadow-xl border-2 border-sky-200 text-left cursor-pointer active:scale-97 transition-all duration-200 aspect-square flex flex-col justify-center items-center group hover:shadow-2xl animate-pop-in" onClick={() => setSelectedLesson(lesson)}>
                  <h3 className="font-bold text-base text-sky-700 tracking-tight flex items-center gap-2 text-center pointer-events-none group-hover:scale-105 transition-transform duration-200">{lesson.name}</h3>
                  {lesson.description && <span className="inline-block mt-2 px-2 py-1 rounded-lg bg-gradient-to-r from-fuchsia-200 to-sky-100 text-sky-800 font-semibold text-xs shadow pointer-events-none group-hover:scale-105 transition-transform duration-200 animate-bounce">{lesson.description}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </MobileLayout>
      {/* Animasyonlar için ek CSS */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in {
          animation: pop-in 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .aspect-square {
          aspect-ratio: 1 / 1;
        }
      `}</style>
    </div>
  );
} 