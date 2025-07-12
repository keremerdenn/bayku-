"use client";
import React, { useState } from "react";
import MobileLayout from "./MobileLayout";

interface MobileTopicsPageProps {
  lesson: { id: string; name: string; description?: string };
  onBack: () => void;
  staticTopics?: Record<string, { id: string; name: string; description?: string }[]>;
}

export default function MobileTopicsPage({ lesson, onBack, staticTopics }: MobileTopicsPageProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState("");

  // Statik konuları al
  const staticTopicsForLesson = staticTopics?.[lesson.id] || [];

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
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: lesson.id, name, description }),
      });
      if (!res.ok) throw new Error("Konu eklenemedi");
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Konu eklenemedi:", err);
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
          {staticTopicsForLesson.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 text-gray-800 text-center">2025 Müfredat Konuları</h3>
              <div className="grid grid-cols-2 gap-3">
                {staticTopicsForLesson.map((topic) => (
                  <div key={topic.id} className="relative aspect-square flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl border-4 border-transparent bg-clip-padding hover:border-green-400 hover:scale-105 transition-all duration-300 group overflow-hidden cursor-pointer select-none">
                    <h3 className="font-bold text-lg text-green-700 tracking-tight flex items-center gap-2 text-center pointer-events-none">{topic.name}</h3>
                    {topic.description && <span className="inline-block mt-2 px-2 py-1 rounded-full bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 font-semibold text-xs shadow text-center pointer-events-none">{topic.description}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
} 