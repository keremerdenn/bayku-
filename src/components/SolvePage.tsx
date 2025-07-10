"use client";
import React, { useEffect, useState } from "react";

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

// Şimdilik örnek sorular
const exampleQuestions = [
  {
    id: 1,
    question: "2 + 2 kaçtır?",
    options: ["2", "3", "4", "5"],
    answer: 2,
  },
  {
    id: 2,
    question: "Türkiye'nin başkenti neresidir?",
    options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
    answer: 1,
  },
];

export default function SolvePage() {
  const [step, setStep] = useState<"lesson" | "topic" | "test">("lesson");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [username, setUsername] = useState("");

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

  // Dersleri çek
  useEffect(() => {
    if (step === "lesson") {
      setLoading(true);
      fetch("/api/lessons")
        .then(res => res.json())
        .then(data => setLessons(data))
        .catch(() => setError("Dersler alınamadı"))
        .finally(() => setLoading(false));
    }
  }, [step]);

  // Konuları çek
  useEffect(() => {
    if (step === "topic" && selectedLesson) {
      setLoading(true);
      fetch(`/api/topics?lesson_id=${selectedLesson.id}`)
        .then(res => res.json())
        .then(data => setTopics(data))
        .catch(() => setError("Konular alınamadı"))
        .finally(() => setLoading(false));
    }
  }, [step, selectedLesson]);

  // Test başlat
  function answerQuestion(idx: number) {
    setUserAnswers(prev => [...prev, idx]);
    if (currentQ + 1 < exampleQuestions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  }

  // Geri dön
  function goBack() {
    if (step === "test") {
      setStep("topic");
      setSelectedTopic(null);
    } else if (step === "topic") {
      setStep("lesson");
      setSelectedLesson(null);
    }
  }

  // Sonuç hesapla
  const correctCount = userAnswers.filter((ans, i) => ans === exampleQuestions[i].answer).length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pb-20">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-sky-500 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent tracking-tight flex items-center justify-center gap-2">
            <svg width='36' height='36' fill='none' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' stroke='#0ea5e9' strokeWidth='2'/><path d='M8 12h8M12 8v8' stroke='#0ea5e9' strokeWidth='2' strokeLinecap='round'/></svg>
            Hoş geldin, {username}!
          </h1>
          <div className="text-lg text-sky-600 font-semibold mt-2 animate-fade-in">Bugün hangi konudan test çözmek istersin?</div>
        </div>
        {step !== "lesson" && (
          <button onClick={goBack} className="mb-4 bg-gradient-to-r from-fuchsia-400 to-sky-400 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200">&larr; Geri</button>
        )}
        {step === "lesson" && (
          <>
            <h2 className="text-xl font-bold mb-6 text-sky-700 text-center">Ders Seç</h2>
            {loading ? <div className="flex flex-col items-center justify-center py-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500 mb-2"></div><span className="text-sky-700">Yükleniyor...</span></div> : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {lessons.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="mt-4 text-lg">Henüz hiç ders yok.</span>
                  </div>
                ) : lessons.map(lesson => (
                  <div key={lesson.id} className="relative bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-sky-200 transition-all duration-300 cursor-pointer select-none p-6" onClick={() => { setSelectedLesson(lesson); setStep('topic'); }} tabIndex={0} role="button" aria-pressed="false">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 tracking-tight">{lesson.name}</h3>
                    </div>
                    {lesson.description && <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-sky-600 font-medium">Ders</span>
                      <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {step === "topic" && selectedLesson && (
          <>
            <h2 className="text-xl font-bold mb-6 text-sky-700 text-center">Konu Seç ({selectedLesson.name})</h2>
            {loading ? <div className="flex flex-col items-center justify-center py-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500 mb-2"></div><span className="text-sky-700">Yükleniyor...</span></div> : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {topics.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span className="mt-4 text-lg">Henüz hiç konu yok.</span>
                  </div>
                ) : topics.map(topic => (
                  <div key={topic.id} className="relative bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-sky-200 transition-all duration-300 cursor-pointer select-none p-6" onClick={() => setSelectedTopic(topic)} tabIndex={0} role="button" aria-pressed="false">
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
            )}
            {/* Eğer bir konu seçildiyse, test kutusu göster */}
            {selectedTopic && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">{selectedTopic.name} Testi</h3>
                      <p className="text-sm text-gray-600">Teste başlamaya hazır mısın?</p>
                    </div>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-gray-600 transition-colors" 
                    onClick={() => setSelectedTopic(null)}
                  >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-fuchsia-200 to-sky-200 text-sky-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {exampleQuestions.length} Soru
                    </span>
                    <span className="text-sm text-gray-500">• Tahmini süre: {exampleQuestions.length * 2} dakika</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    className="flex-1 bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow hover:from-fuchsia-500 hover:to-sky-500 active:scale-105 transition-all duration-200" 
                    onClick={() => setStep('test')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Teste Başla
                    </div>
                  </button>
                  <button 
                    className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors" 
                    onClick={() => setSelectedTopic(null)}
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        {step === "test" && selectedTopic && (
          <>
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-sky-500 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent mb-2 tracking-tight">{selectedTopic.name} Testi</h2>
              <div className="w-full max-w-md flex items-center gap-4 mb-2">
                <span className="text-sky-700 font-bold">Soru {currentQ + 1} / {exampleQuestions.length}</span>
                <div className="flex-1 h-2 bg-sky-100 rounded-full">
                  <div className="h-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-sky-400 transition-all duration-500" style={{width: `${((currentQ+1)/exampleQuestions.length)*100}%`}}></div>
                </div>
              </div>
            </div>
            {!showResult ? (
              <div className="flex flex-col items-center w-full">
                <div className="bg-white rounded-3xl p-8 border-4 border-fuchsia-200 shadow-2xl flex flex-col items-center animate-fade-in w-full max-w-xl mb-8">
                  <div className="text-lg mb-6 text-gray-900 text-center font-bold">{exampleQuestions[currentQ].question}</div>
                  <div className="grid gap-4 w-full">
                    {exampleQuestions[currentQ].options.map((opt, idx) => (
                      <button key={idx} className={`w-full text-lg font-bold rounded-xl p-4 border-2 shadow-lg transition-all duration-200 flex items-center gap-3
                bg-gradient-to-r from-sky-100 to-fuchsia-100 border-sky-200 text-sky-700 hover:from-fuchsia-200 hover:to-sky-200 hover:scale-105
                ${userAnswers[currentQ] === idx ? 'ring-4 ring-fuchsia-400 scale-105 bg-gradient-to-r from-fuchsia-300 to-sky-200 text-white' : ''}`}
                onClick={() => answerQuestion(idx)}>
                {userAnswers[currentQ] === idx && (
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#a21caf" strokeWidth="3"/><path d="M8 12l2 2 4-4" stroke="#a21caf" strokeWidth="3" strokeLinecap="round"/></svg>
                )}
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="bg-gradient-to-br from-green-200 via-sky-100 to-fuchsia-100 rounded-3xl p-10 border-4 border-green-300 text-center shadow-2xl flex flex-col items-center animate-fade-in w-full max-w-xl mx-auto">
        <div className="text-5xl font-extrabold text-green-700 mb-4 flex items-center gap-3">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="3"/><path d="M8 12l2 2 4-4" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/></svg>
          Tebrikler!
        </div>
        <div className="text-2xl text-gray-700 mb-6 font-bold">{exampleQuestions.length} sorudan {correctCount} doğru!</div>
        <button className="bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-fuchsia-500 hover:to-sky-500 active:scale-105 transition-all duration-200 shadow-xl" onClick={goBack}>Konuya Dön</button>
      </div>
    )}
  </>
)}
        {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
      </div>
    </div>
  );
} 