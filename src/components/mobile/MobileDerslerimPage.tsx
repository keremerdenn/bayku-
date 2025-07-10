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

  return (
    <MobileLayout currentPage="derslerim">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Derslerim</h2>
          <p className="text-sm text-gray-500">Hoş geldin, {username}!</p>
        </div>
        <form onSubmit={handleAddLesson} className="mb-4 space-y-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ders adı"
            className="w-full p-2 rounded border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm"
            required
          />
          {formError && <div className="text-red-500 text-center font-medium text-xs mb-1">{formError}</div>}
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Açıklama (opsiyonel)"
            className="w-full p-2 rounded border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded font-medium text-sm hover:bg-blue-600 active:scale-95 transition disabled:opacity-50"
            disabled={adding || !name.trim()}
          >
            {adding ? "Ekleniyor..." : "Ders Ekle"}
          </button>
        </form>
        {loading && <div className="flex flex-col items-center justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-2"></div><span className="text-gray-500">Yükleniyor...</span></div>}
        {error && <div className="text-red-500 text-center mb-2 text-xs">{error}</div>}
        {!loading && lessons.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="mt-2 text-sm">Henüz hiç ders yok.</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition shadow-sm" onClick={() => setSelectedLesson(lesson)}>
              <h3 className="font-medium text-gray-800 text-sm mb-1">{lesson.name}</h3>
              {lesson.description && <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-xs">{lesson.description}</span>}
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
} 