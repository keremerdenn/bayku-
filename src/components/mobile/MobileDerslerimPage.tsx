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
    <MobileLayout currentPage="derslerim">
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Derslerim</h2>
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