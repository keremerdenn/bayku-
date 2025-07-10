"use client";
import React, { useEffect, useState } from "react";
import MobileLayout from "./MobileLayout";

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

export default function MobileSolvePage() {
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
    if (step === "lesson") {
      setLoading(true);
      fetch("/api/lessons")
        .then(res => res.json())
        .then(data => setLessons(data))
        .catch(() => setError("Dersler alınamadı"))
        .finally(() => setLoading(false));
    }
  }, [step]);

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

  function answerQuestion(idx: number) {
    setUserAnswers(prev => [...prev, idx]);
    if (currentQ + 1 < exampleQuestions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  }

  function goBack() {
    if (step === "test") {
      setStep("topic");
      setSelectedTopic(null);
      setCurrentQ(0);
      setUserAnswers([]);
      setShowResult(false);
    } else if (step === "topic") {
      setStep("lesson");
      setSelectedLesson(null);
    }
  }

  const correctCount = userAnswers.filter((ans, i) => ans === exampleQuestions[i].answer).length;

  // SVG Pattern for background
  const svgPattern = (
    <svg className="absolute inset-0 w-full h-full" style={{zIndex:0}} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="6" fill="#e0e7ff" fillOpacity="0.25" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern-circles)" />
    </svg>
  );

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white pb-20 overflow-x-hidden">
      {svgPattern}
      <MobileLayout currentPage="sorucozme">
        <div className="relative z-10 space-y-6 p-4 pt-8">
          <div className="mb-4 text-center">
            <h1 className="text-4xl font-extrabold mb-2 text-sky-700 tracking-tight flex items-center justify-center gap-2 drop-shadow-lg">
              <svg width='36' height='36' fill='none' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' stroke='#0ea5e9' strokeWidth='2'/><path d='M8 12h8M12 8v8' stroke='#0ea5e9' strokeWidth='2' strokeLinecap='round'/></svg>
              Hoş geldin, {username}!
            </h1>
            <div className="text-lg text-sky-600 font-semibold mt-2 animate-fade-in">Bugün hangi konudan test çözmek istersin?</div>
          </div>
          <h1 className="text-3xl font-extrabold text-sky-700 mb-6 text-center tracking-tight">Soru Çöz</h1>
          {step !== "lesson" && (
            <button onClick={goBack} className="mb-2 text-sky-600 font-semibold flex items-center gap-1 active:scale-95 transition-transform"><span className="text-2xl">←</span> Geri</button>
          )}
          {step === "lesson" && (
            <>
              <h2 className="text-xl font-bold mb-6 text-sky-700 text-center">Ders Seç</h2>
              {loading ? <div className="flex flex-col items-center justify-center py-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500 mb-2"></div><span className="text-sky-700">Yükleniyor...</span></div> : (
                <div className="grid grid-cols-2 gap-4">
                  {lessons.map(lesson => (
                    <div key={lesson.id} className="bg-gradient-to-br from-sky-100 via-fuchsia-50 to-white rounded-2xl shadow-xl border-2 border-sky-200 text-left cursor-pointer active:scale-97 transition-all duration-200 aspect-square flex flex-col justify-center items-center group hover:shadow-2xl" onClick={() => { setSelectedLesson(lesson); setStep("topic"); }}>
                      <h3 className="font-bold text-base text-sky-700 tracking-tight flex items-center gap-2 text-center pointer-events-none group-hover:scale-105 transition-transform duration-200">{lesson.name}</h3>
                      {lesson.description && <span className="inline-block mt-2 px-2 py-1 rounded-lg bg-gradient-to-r from-fuchsia-200 to-sky-100 text-sky-800 font-semibold text-xs shadow pointer-events-none group-hover:scale-105 transition-transform duration-200 animate-bounce">{lesson.description}</span>}
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
                <div className="grid grid-cols-2 gap-4">
                  {topics.map(topic => (
                    <div key={topic.id} className="bg-gradient-to-br from-sky-100 via-fuchsia-50 to-white rounded-2xl shadow-xl border-2 border-fuchsia-200 text-left cursor-pointer active:scale-97 transition-all duration-200 aspect-square flex flex-col justify-center items-center group hover:shadow-2xl" onClick={() => setSelectedTopic(topic)}>
                      <h3 className="font-bold text-base text-sky-700 tracking-tight flex items-center gap-2 text-center pointer-events-none group-hover:scale-105 transition-transform duration-200">{topic.name}</h3>
                      {topic.description && <span className="inline-block mt-2 px-2 py-1 rounded-lg bg-gradient-to-r from-fuchsia-200 to-sky-100 text-sky-800 font-semibold text-xs shadow pointer-events-none group-hover:scale-105 transition-transform duration-200 animate-bounce">{topic.description}</span>}
                    </div>
                  ))}
                </div>
              )}
              {/* Eğer bir konu seçildiyse, test kutusu göster */}
              {selectedTopic && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
                  <div className="relative w-80 flex flex-col items-center justify-center bg-gradient-to-br from-white via-fuchsia-50 to-sky-50 rounded-2xl shadow-2xl border-4 border-fuchsia-300 p-8 animate-pop-in">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-fuchsia-500 text-2xl font-bold" onClick={() => setSelectedTopic(null)}>&times;</button>
                    <h3 className="font-bold text-lg text-sky-700 tracking-tight flex items-center gap-2 text-center mb-2">{selectedTopic.name} Testi</h3>
                    <span className="inline-block mb-2 px-4 py-1 rounded-xl bg-gradient-to-r from-fuchsia-400 to-sky-400 text-white font-bold text-base shadow pointer-events-none animate-bounce">{exampleQuestions.length} Soru</span>
                    <button className="w-full bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white px-4 py-3 rounded-xl font-bold text-base shadow hover:from-fuchsia-500 hover:to-sky-500 active:scale-97 transition-all duration-200 mt-4 animate-fade-in" onClick={() => setStep('test')}>Teste Başla</button>
                  </div>
                </div>
              )}
            </>
          )}
          {step === "test" && selectedTopic && (
            <>
              <h2 className="text-xl font-bold mb-6 text-sky-700 text-center">Test ({selectedTopic.name})</h2>
              {!showResult ? (
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-sky-50 via-fuchsia-50 to-white rounded-2xl p-6 border-2 border-sky-200 shadow-xl flex flex-col items-center animate-fade-in">
                    <div className="font-semibold mb-2 text-sky-700">Soru {currentQ + 1} / {exampleQuestions.length}</div>
                    <div className="text-lg mb-6 text-gray-900 text-center font-bold">{exampleQuestions[currentQ].question}</div>
                    <div className="grid gap-3 w-full max-w-md">
                      {exampleQuestions[currentQ].options.map((opt, idx) => (
                        <button key={idx} className="w-full bg-white border-2 border-sky-200 rounded-xl p-3 font-semibold text-sky-700 hover:bg-sky-100 active:scale-97 transition-all duration-150 shadow animate-pop-in" onClick={() => answerQuestion(idx)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-green-50 via-fuchsia-50 to-white rounded-2xl p-8 border-2 border-green-200 text-center shadow-xl flex flex-col items-center animate-fade-in">
                  <div className="text-3xl font-extrabold text-green-700 mb-4">Test Sonucu</div>
                  <div className="text-lg text-gray-700 mb-6">{exampleQuestions.length} sorudan {correctCount} doğru!</div>
                  <button className="bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl font-bold hover:from-fuchsia-500 hover:to-sky-500 active:scale-97 transition-all duration-200 animate-pop-in" onClick={goBack}>Konuya Dön</button>
                </div>
              )}
            </>
          )}
          {error && <div className="text-red-500 mt-4 text-center animate-fade-in">{error}</div>}
        </div>
      </MobileLayout>
      {/* Animasyonlar için ek CSS */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in {
          animation: pop-in 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .aspect-square {
          aspect-ratio: 1 / 1;
        }
      `}</style>
    </div>
  );
} 