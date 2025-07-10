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

  return (
    <MobileLayout currentPage="sorucozme">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="mb-4 text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-1">Soru Çöz</h1>
          <p className="text-sm text-gray-500">Hoş geldin, {username}!</p>
        </div>
        {step !== "lesson" && (
          <button onClick={goBack} className="mb-3 text-blue-500 text-sm font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition">
            <span className="text-lg">←</span> Geri
          </button>
        )}
        {step === "lesson" && (
          <>
            <h2 className="text-base font-medium text-gray-700 mb-3 text-center">Ders Seç</h2>
            {loading ? <div className="flex flex-col items-center justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-2"></div><span className="text-gray-500">Yükleniyor...</span></div> : (
              <div className="grid grid-cols-2 gap-3">
                {lessons.map(lesson => (
                  <div key={lesson.id} className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition shadow-sm" onClick={() => { setSelectedLesson(lesson); setStep("topic"); }}>
                    <h3 className="font-medium text-gray-800 text-sm mb-1">{lesson.name}</h3>
                    {lesson.description && <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-xs">{lesson.description}</span>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {step === "topic" && selectedLesson && (
          <>
            <h2 className="text-base font-medium text-gray-700 mb-3 text-center">Konu Seç ({selectedLesson.name})</h2>
            {loading ? <div className="flex flex-col items-center justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-2"></div><span className="text-gray-500">Yükleniyor...</span></div> : (
              <div className="grid grid-cols-2 gap-3">
                {topics.map(topic => (
                  <div key={topic.id} className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition shadow-sm" onClick={() => setSelectedTopic(topic)}>
                    <h3 className="font-medium text-gray-800 text-sm mb-1">{topic.name}</h3>
                    {topic.description && <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-xs">{topic.description}</span>}
                  </div>
                ))}
              </div>
            )}
            {/* Eğer bir konu seçildiyse, test kutusu göster */}
            {selectedTopic && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                <div className="relative w-80 flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-blue-500 text-xl" onClick={() => setSelectedTopic(null)}>&times;</button>
                  <h3 className="font-medium text-gray-800 text-base text-center mb-2">{selectedTopic.name} Testi</h3>
                  <span className="inline-block mb-2 px-3 py-1 rounded bg-blue-100 text-blue-700 font-medium text-xs">{exampleQuestions.length} Soru</span>
                  <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm shadow hover:bg-blue-600 active:scale-95 transition mt-2" onClick={() => setStep('test')}>Teste Başla</button>
                </div>
              </div>
            )}
          </>
        )}
        {step === "test" && selectedTopic && (
          <>
            <h2 className="text-base font-medium text-gray-700 mb-3 text-center">Test ({selectedTopic.name})</h2>
            {!showResult ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col items-center">
                  <div className="font-medium mb-2 text-blue-700 text-sm">Soru {currentQ + 1} / {exampleQuestions.length}</div>
                  <div className="text-base mb-4 text-gray-900 text-center font-semibold">{exampleQuestions[currentQ].question}</div>
                  <div className="grid gap-2 w-full max-w-md">
                    {exampleQuestions[currentQ].options.map((opt, idx) => (
                      <button key={idx} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-medium text-gray-800 hover:bg-blue-50 active:scale-95 transition" onClick={() => answerQuestion(idx)}>{opt}</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 border border-gray-200 text-center shadow-sm flex flex-col items-center">
                <div className="text-xl font-bold text-green-600 mb-2">Test Sonucu</div>
                <div className="text-base text-gray-700 mb-4">{exampleQuestions.length} sorudan {correctCount} doğru!</div>
                <button className="bg-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 active:scale-95 transition" onClick={goBack}>Konuya Dön</button>
              </div>
            )}
          </>
        )}
        {error && <div className="text-red-500 mt-4 text-center text-sm">{error}</div>}
      </div>
    </MobileLayout>
  );
} 