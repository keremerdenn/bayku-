"use client";
import React, { useEffect, useState } from "react";
import TopicsPage from "./TopicsPage";
import TestsPage from "./TestsPage";

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

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [username, setUsername] = useState("");
  const [formError, setFormError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

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

  if (selectedTopic) {
    return <TestsPage topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
  }
  if (selectedLesson) {
    return <TopicsPage lesson={selectedLesson} onBack={() => setSelectedLesson(null)} onTopicSelect={setSelectedTopic} />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pb-20">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-sky-500 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent tracking-tight flex items-center justify-center gap-2">
            <svg width='36' height='36' fill='none' viewBox='0 0 24 24'><path d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' stroke='#0ea5e9' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/></svg>
            Hoş geldin, {username}!
          </h1>
          <div className="text-lg text-sky-600 font-semibold mt-2 animate-fade-in">Bugün hangi dersi çalışmak istersin?</div>
        </div>
        <form onSubmit={handleAddLesson} className="mb-8 space-y-3 bg-gradient-to-r from-sky-50 to-fuchsia-50 p-6 rounded-2xl border-2 border-transparent bg-clip-padding shadow-xl hover:shadow-2xl transition-all duration-300">
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
          {formError && <div className="text-red-500 text-center font-semibold mb-2">{formError}</div>}
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
          <div className="flex flex-col items-center justify-center py-12">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#a21caf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="mt-4 text-lg bg-gradient-to-r from-sky-500 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent font-bold">Henüz hiç ders yok.</span>
          </div>
        )}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="relative aspect-square flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl border-4 border-transparent bg-clip-padding hover:border-fuchsia-400 hover:scale-105 transition-all duration-300 group overflow-hidden cursor-pointer" onClick={() => setSelectedLesson(lesson)}>
              <span className="absolute top-4 right-4 bg-gradient-to-r from-fuchsia-400 to-sky-400 text-white rounded-full p-2 shadow-lg">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="white" strokeWidth="2" strokeLinecap="round"/><path d="M6.5 17V6.75A2.75 2.75 0 0 1 9.25 4h7.5A2.75 2.75 0 0 1 19.5 6.75v10.25" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
              </span>
              <h2 className="font-bold text-2xl text-sky-700 group-hover:underline tracking-tight flex items-center gap-2 text-center">
                {lesson.name}
              </h2>
              {lesson.description && <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-200 to-sky-200 text-sky-800 font-semibold text-sm shadow text-center">{lesson.description}</span>}
              <div className="w-2/3 h-2 bg-sky-100 rounded-full mt-3 mx-auto">
                <div className="h-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-sky-400" style={{width:'40%'}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 