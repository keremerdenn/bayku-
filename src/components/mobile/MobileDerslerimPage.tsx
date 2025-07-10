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
  const [email, setEmail] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);

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
          setEmail(user.email || "");
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

  async function handleDeleteLesson(id: string) {
    setLessonToDelete(id);
    setShowDeleteModal(true);
  }

  async function confirmDeleteLesson() {
    if (!lessonToDelete) return;
    
    const res = await fetch("/api/lessons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lessonToDelete, email }),
    });
    if (res.ok) {
      await fetchLessons();
    } else {
      const data = await res.json();
      alert(data.error || "Silme işlemi başarısız oldu.");
    }
    setShowDeleteModal(false);
    setLessonToDelete(null);
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
            className="w-full p-2 rounded border border-gray-200 !text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm"
            required
          />
          {formError && <div className="text-red-500 text-center font-medium text-xs mb-1">{formError}</div>}
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Açıklama (opsiyonel)"
            className="w-full p-2 rounded border border-gray-200 !text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm"
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
            <div key={lesson.id} className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition shadow-sm relative" onClick={() => setSelectedLesson(lesson)}>
              {email === "keremerdeen@gmail.com" && (
                <button
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                  title="Dersi Sil"
                  onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }}
                >
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
              <h3 className="font-medium text-gray-800 text-sm mb-1">{lesson.name}</h3>
              {lesson.description && <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-xs">{lesson.description}</span>}
            </div>
          ))}
        </div>

        {/* Ders Silme Onay Modal'ı */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                    <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Dersi Sil</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Bu dersi silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm konular ve testler silinecektir.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowDeleteModal(false); setLessonToDelete(null); }}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={confirmDeleteLesson}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                  >
                    Evet, Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
} 