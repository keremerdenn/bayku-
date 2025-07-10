"use client";
import React, { useEffect, useState } from "react";
import TopicsPage from "./TopicsPage";

interface Lesson {
  id: string;
  name: string;
  description?: string;
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    fetchLessons();
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
    if (!name.trim()) return;
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
    return <TopicsPage lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-8 text-sky-700 text-center tracking-tight">Derslerim</h1>
      <form onSubmit={handleAddLesson} className="mb-8 space-y-3 bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-2xl border border-sky-100 shadow-md">
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ders adı"
            className="flex-1 p-3 rounded-xl border border-sky-200 bg-white text-gray-900 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
            required
          />
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Açıklama (opsiyonel)"
            className="flex-1 p-3 rounded-xl border border-sky-200 bg-white text-gray-900 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
          />
        </div>
        <button
          type="submit"
          className="w-full md:w-auto bg-sky-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow hover:bg-sky-600 active:scale-95 transition-all duration-200 disabled:opacity-50"
          disabled={adding || !name.trim()}
        >
          {adding ? "Ekleniyor..." : "Ders Ekle"}
        </button>
      </form>
      {loading && <div className="flex flex-col items-center justify-center py-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500 mb-2"></div><span className="text-sky-700">Yükleniyor...</span></div>}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {!loading && lessons.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="mt-4 text-lg">Henüz hiç ders yok.</span>
        </div>
      )}
      <div className="grid gap-6">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-gradient-to-r from-white to-sky-50 rounded-2xl shadow-lg p-6 border border-sky-100 cursor-pointer hover:scale-[1.02] hover:shadow-xl transition-all duration-200 group" onClick={() => setSelectedLesson(lesson)}>
            <h2 className="font-bold text-xl text-sky-700 group-hover:underline tracking-tight flex items-center gap-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {lesson.name}
            </h2>
            {lesson.description && <p className="text-gray-600 mt-2 text-base">{lesson.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
} 