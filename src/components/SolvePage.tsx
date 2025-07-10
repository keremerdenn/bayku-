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
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Soru Çöz</h1>
      {step !== "lesson" && (
        <button onClick={goBack} className="mb-4 text-sky-600 hover:underline">&larr; Geri</button>
      )}
      {step === "lesson" && (
        <>
          <h2 className="text-lg font-semibold mb-4">Ders Seç</h2>
          {loading ? <div>Yükleniyor...</div> : (
            <div className="grid gap-4">
              {lessons.map(lesson => (
                <div key={lesson.id} className="bg-white rounded-xl shadow p-4 border cursor-pointer hover:bg-sky-50 transition" onClick={() => { setSelectedLesson(lesson); setStep("topic"); }}>
                  <h3 className="font-semibold text-lg">{lesson.name}</h3>
                  {lesson.description && <p className="text-gray-600 mt-1">{lesson.description}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {step === "topic" && selectedLesson && (
        <>
          <h2 className="text-lg font-semibold mb-4">Konu Seç ({selectedLesson.name})</h2>
          {loading ? <div>Yükleniyor...</div> : (
            <div className="grid gap-4">
              {topics.map(topic => (
                <div key={topic.id} className="bg-white rounded-xl shadow p-4 border cursor-pointer hover:bg-sky-50 transition" onClick={() => startTest(topic)}>
                  <h3 className="font-semibold text-lg">{topic.name}</h3>
                  {topic.description && <p className="text-gray-600 mt-1">{topic.description}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {step === "test" && selectedTopic && (
        <>
          <h2 className="text-lg font-semibold mb-4">Test ({selectedTopic.name})</h2>
          {!showResult ? (
            <div className="space-y-6">
              <div className="bg-sky-50 rounded-xl p-4 border">
                <div className="font-semibold mb-2">Soru {currentQ + 1} / {exampleQuestions.length}</div>
                <div className="text-lg mb-4">{exampleQuestions[currentQ].question}</div>
                <div className="grid gap-2">
                  {exampleQuestions[currentQ].options.map((opt, idx) => (
                    <button key={idx} className="w-full bg-white border rounded p-2 hover:bg-sky-100" onClick={() => answerQuestion(idx)}>{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 rounded-xl p-6 border text-center">
              <div className="text-2xl font-bold text-green-700 mb-2">Test Sonucu</div>
              <div className="text-lg text-gray-700 mb-4">{exampleQuestions.length} sorudan {correctCount} doğru!</div>
              <button className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600" onClick={goBack}>Konuya Dön</button>
            </div>
          )}
        </>
      )}
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
} 