"use client";
import React, { useEffect, useState } from "react";

interface Lesson {
  id: string;
  name: string;
  description?: string;
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    fetchLessons();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Dersler</h1>
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && lessons.length === 0 && <div>Henüz hiç ders yok.</div>}
      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-xl shadow p-4 border">
            <h2 className="font-semibold text-lg">{lesson.name}</h2>
            {lesson.description && <p className="text-gray-600 mt-1">{lesson.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
} 