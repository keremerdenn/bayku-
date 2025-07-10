"use client";
import React, { useEffect, useState } from "react";

interface Topic {
  id: string;
  name: string;
  description?: string;
}

interface TopicsPageProps {
  lesson: { id: string; name: string; description?: string };
  onBack: () => void;
  onTopicSelect: (topic: Topic) => void;
}

export default function TopicsPage({ lesson, onBack, onTopicSelect }: TopicsPageProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState("");

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
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pb-20">
      <button onClick={onBack} className="mb-4 text-sky-600 hover:underline">&larr; Geri</button>
      <h1 className="text-2xl font-bold mb-2">{lesson.name} - Konular</h1>
      <p className="text-gray-600 mb-4">{lesson.description}</p>
      <form onSubmit={handleAddTopic} className="mb-6 space-y-2 bg-sky-50 p-4 rounded-xl border">
        <div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Konu adı"
            className="w-full p-2 rounded border bg-white text-gray-900"
            required
          />
        </div>
        <div>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Açıklama (opsiyonel)"
            className="w-full p-2 rounded border bg-white text-gray-900"
          />
        </div>
        {formError && <div className="text-red-500 text-center font-semibold mb-2">{formError}</div>}
        <button
          type="submit"
          className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 disabled:opacity-50"
          disabled={adding || !name.trim()}
        >
          {adding ? "Ekleniyor..." : "Konu Ekle"}
        </button>
      </form>
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && topics.length === 0 && <div>Henüz hiç konu yok.</div>}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {topics.map((topic) => (
          <div key={topic.id} className="relative bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-sky-200 transition-all duration-300 cursor-pointer select-none p-6" onClick={() => onTopicSelect(topic)} tabIndex={0} role="button" aria-pressed="false">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 tracking-tight">{topic.name}</h3>
            </div>
            {topic.description && <p className="text-sm text-gray-600 mb-3">{topic.description}</p>}
            <div className="flex items-center justify-between">
              <span className="text-xs text-fuchsia-600 font-medium">Konu</span>
              <div className="w-2 h-2 bg-fuchsia-500 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 