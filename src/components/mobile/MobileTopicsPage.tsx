"use client";
import React, { useEffect, useState } from "react";
import MobileLayout from "./MobileLayout";

interface Topic {
  id: string;
  name: string;
  description?: string;
}

interface MobileTopicsPageProps {
  lesson: { id: string; name: string; description?: string };
  onBack: () => void;
}

export default function MobileTopicsPage({ lesson, onBack }: MobileTopicsPageProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchTopics();
    // eslint-disable-next-line
  }, [lesson.id]);

  async function fetchTopics() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/topics?lesson_id=${lesson.id}`);
      if (!res.ok) throw new Error("Konular alınamadı");
      const data = await res.json();
      setTopics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: lesson.id, name, description }),
      });
      if (!res.ok) throw new Error("Konu eklenemedi");
      setName("");
      setDescription("");
      await fetchTopics();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Konu eklenemedi");
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
          {loading && <div>Yükleniyor...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && topics.length === 0 && <div>Henüz hiç konu yok.</div>}
          <div className="space-y-4 mt-4">
            {topics.map((topic) => (
              <div key={topic.id} className="bg-sky-50 rounded-xl p-4 border text-left">
                <h3 className="font-semibold text-lg text-sky-700">{topic.name}</h3>
                {topic.description && <p className="text-gray-600 mt-1">{topic.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
} 