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
  function startTest(topic: Topic) {
    setSelectedTopic(topic);
    setStep("test");
    setCurrentQ(0);
    setUserAnswers([]);
    setShowResult(false);
  }

  // Cevap ver
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
                  <div key={lesson.id} className="relative aspect-square flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl border-4 border-transparent bg-clip-padding hover:border-fuchsia-400 hover:scale-105 transition-all duration-300 group overflow-hidden cursor-pointer select-none" onClick={() => { setSelectedLesson(lesson); setStep('topic'); }} tabIndex={0} role="button" aria-pressed="false">
                    <h3 className="font-bold text-2xl text-sky-700 group-hover:underline tracking-tight flex items-center gap-2 text-center pointer-events-none">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {lesson.name}
                    </h3>
                    {lesson.description && <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-200 to-sky-200 text-sky-800 font-semibold text-sm shadow text-center pointer-events-none">{lesson.description}</span>}
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
                  <div key={topic.id} className="relative aspect-square flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl border-4 border-transparent bg-clip-padding hover:border-fuchsia-400 hover:scale-105 transition-all duration-300 group overflow-hidden cursor-pointer select-none" onClick={() => setSelectedTopic(topic)} tabIndex={0} role="button" aria-pressed="false">
                    <h3 className="font-bold text-2xl text-sky-700 tracking-tight flex items-center gap-2 text-center pointer-events-none">
                      {topic.name}
                    </h3>
                    {topic.description && <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-200 to-sky-200 text-sky-800 font-semibold text-sm shadow text-center pointer-events-none">{topic.description}</span>}
                  </div>
                ))}
              </div>
            )}
            {/* Eğer bir konu seçildiyse, test kutusu göster */}
            {selectedTopic && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="relative aspect-square w-80 flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl border-4 border-fuchsia-400 p-8">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-fuchsia-500 text-2xl" onClick={() => setSelectedTopic(null)}>&times;</button>
                  <h3 className="font-bold text-2xl text-sky-700 tracking-tight flex items-center gap-2 text-center mb-4">
                    {selectedTopic.name} Testi
                  </h3>
                  <span className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-200 to-sky-200 text-sky-800 font-semibold text-lg shadow text-center pointer-events-none">
                    {exampleQuestions.length} Soru
                  </span>
                  <button className="w-full bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow hover:from-fuchsia-500 hover:to-sky-500 active:scale-105 transition-all duration-200 mt-4" onClick={() => setStep('test')}>Teste Başla</button>
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