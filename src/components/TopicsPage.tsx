"use client";
import { useState } from "react";

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

interface TopicsPageProps {
  lesson: Lesson;
  onBack: () => void;
  onTopicSelect: (topic: Topic) => void;
  staticTopics?: Record<string, { id: string; name: string; description?: string }[]>;
}

export default function TopicsPage({ lesson, onBack, onTopicSelect, staticTopics }: TopicsPageProps) {
  const [topics] = useState<Topic[]>([]);
  // const [loading, setLoading] = useState(true); // Artık gerekli değil
  // const [error, setError] = useState(""); // Artık gerekli değil
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState("");

  // Statik konuları al
  const staticTopicsForLesson = staticTopics?.[lesson.id] || [];
  
  // Debug için
  console.log('=== DEBUG INFO ===');
  console.log('Lesson ID:', lesson.id);
  console.log('Static Topics Keys:', Object.keys(staticTopics || {}));
  console.log('Static Topics for Lesson:', staticTopicsForLesson);
  console.log('Static Topics Object:', staticTopics);
  console.log('==================');

  // API çağrısını kaldırıyoruz, sadece statik konular gösterilecek
  // useEffect(() => {
  //   fetchTopics();
  //   // eslint-disable-next-line
  // }, [lesson.id]);

  // async function fetchTopics() {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const res = await fetch(`/api/topics?lesson_id=${lesson.id}`);
  //     if (!res.ok) throw new Error("Konular alınamadı");
  //     const data = await res.json();
  //     setTopics(data);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Bilinmeyen hata");
  //     // API hatası olsa bile statik konular gösterilmeli
  //     setTopics([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function handleAddTopic(e: React.FormEvent<HTMLFormElement>) {
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
    // setError(""); // Artık gerekli değil
    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: lesson.id, name, description }),
      });
      if (!res.ok) throw new Error("Konu eklenemedi");
      setName("");
      setDescription("");
      // await fetchTopics(); // Bu satır artık gerekli değil
    } catch (err) {
      // setError(err instanceof Error ? err.message : "Konu eklenemedi"); // Artık gerekli değil
      console.error("Konu eklenemedi:", err);
    } finally {
      setAdding(false);
    }
  }

  const handleDelete = async (id: string) => {
    await fetch('/api/topics', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pb-20">
      {/* Test Mesajı */}
      <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg border border-red-300">
        <b>TEST:</b> TopicsPage yüklendi! Lesson: {lesson.name} ({lesson.id})
      </div>
      
      <button onClick={onBack} className="mb-4 text-sky-600 hover:underline">&larr; Geri</button>
      <h1 className="text-2xl font-bold mb-2">{lesson.name} - Konular</h1>
      <p className="text-gray-600 mb-4">{lesson.description}</p>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">Yeni Konu Ekle</h3>
        </div>
        <form onSubmit={handleAddTopic}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konu Adı</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Örn: Matematik Temelleri"
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-fuchsia-400 focus:outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (Opsiyonel)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Konu hakkında kısa açıklama"
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-fuchsia-400 focus:outline-none transition"
            />
          </div>
          {formError && <div className="text-red-500 text-center font-semibold text-sm bg-red-50 p-3 rounded-lg border border-red-200">{formError}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-fuchsia-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={adding || !name.trim()}
          >
            {adding ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Ekleniyor...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Konu Ekle
              </div>
            )}
          </button>
        </form>
      </div>
      {/* loading && <div>Yükleniyor...</div> */}
      {/* error && <div className="text-red-500">{error}</div> */}
      
      {/* Statik Konular - Her zaman göster */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800">2025 Müfredat Konuları</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {staticTopicsForLesson.map((topic) => (
            <div key={topic.id} className="relative bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-sky-200 transition-all duration-300 cursor-pointer select-none p-6" onClick={() => onTopicSelect(topic)} tabIndex={0} role="button" aria-pressed="false">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <h3 className="font-bold text-lg text-gray-800 tracking-tight">{topic.name}</h3>
              </div>
              {topic.description && <p className="text-sm text-gray-600 mb-3">{topic.description}</p>}
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600 font-medium">Müfredat Konusu</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dinamik Konular */}
      {/* {!loading && topics.length === 0 && staticTopicsForLesson.length === 0 && <div>Henüz hiç konu yok.</div>} */}
      {topics.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Özel Konular</h3>
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
                  <span className="text-xs text-fuchsia-600 font-medium">Özel Konu</span>
                  <div className="w-2 h-2 bg-fuchsia-500 rounded-full"></div>
                </div>
                <button onClick={() => handleDelete(topic.id)} className="ml-2 text-red-500 hover:underline">Sil</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 