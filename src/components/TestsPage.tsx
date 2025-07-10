import React from "react";

interface Topic {
  id: string;
  name: string;
  description?: string;
}

interface TestsPageProps {
  topic: Topic;
  onBack: () => void;
}

// Örnek test verisi
const exampleTests = [
  { id: 1, name: "Kolay Test", description: "10 soru - Başlangıç seviyesi" },
  { id: 2, name: "Orta Test", description: "15 soru - Orta seviye" },
  { id: 3, name: "Zor Test", description: "20 soru - Zor seviye" },
];

export default function TestsPage({ topic, onBack }: TestsPageProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pb-20">
      <button onClick={onBack} className="mb-4 text-sky-600 hover:underline">&larr; Geri</button>
      <h1 className="text-2xl font-bold mb-2">{topic.name} - Testler</h1>
      <p className="text-gray-600 mb-4">{topic.description}</p>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {exampleTests.map((test) => (
          <div key={test.id} className="relative aspect-square flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl border-4 border-transparent bg-clip-padding hover:border-fuchsia-400 hover:scale-105 transition-all duration-300 group overflow-hidden cursor-pointer select-none">
            <h3 className="font-bold text-2xl text-sky-700 group-hover:underline tracking-tight flex items-center gap-2 text-center pointer-events-none">
              {test.name}
            </h3>
            {test.description && <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-200 to-sky-200 text-sky-800 font-semibold text-sm shadow text-center pointer-events-none">{test.description}</span>}
          </div>
        ))}
      </div>
    </div>
  );
} 