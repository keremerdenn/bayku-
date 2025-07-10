"use client";
import React, { useEffect, useState } from "react";
import MobileLayout from "./MobileLayout";

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

  return (
    <MobileLayout currentPage="derslerim">
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Derslerim</h2>
          <form onSubmit={handleAddLesson} className="mb-6 space-y-2 bg-sky-50 p-4 rounded-xl border text-left">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ders adı"
              className="w-full p-2 rounded border mb-2"
              required
            />
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Açıklama (opsiyonel)"
              className="w-full p-2 rounded border mb-2"
            />
            <button
              type="submit"
              className="bg-sky-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-sky-600 transition-all duration-200 w-full disabled:opacity-50"
              disabled={adding || !name.trim()}
            >
              {adding ? "Ekleniyor..." : "Ders Ekle"}
            </button>
          </form>
          {loading && <div>Yükleniyor...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && lessons.length === 0 && <div>Henüz hiç ders yok.</div>}
          <div className="space-y-4 mt-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-sky-50 rounded-xl p-4 border text-left">
                <h3 className="font-semibold text-lg text-sky-700">{lesson.name}</h3>
                {lesson.description && <p className="text-gray-600 mt-1">{lesson.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
} 