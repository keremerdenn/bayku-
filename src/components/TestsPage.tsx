import React from "react";
import { useSession } from '@supabase/auth-helpers-react';

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
  const session = useSession();

  const handleDelete = async (id: string) => {
    if (!session?.user?.email) return;
    await fetch('/api/tests', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, email: session.user.email }),
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pb-20">
      <button onClick={onBack} className="mb-4 text-sky-600 hover:underline">&larr; Geri</button>
      <h1 className="text-2xl font-bold mb-2">{topic.name} - Testler</h1>
      <p className="text-gray-600 mb-4">{topic.description}</p>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {exampleTests.map((test) => (
          <div key={test.id} className="relative bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-sky-200 transition-all duration-300 cursor-pointer select-none p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 tracking-tight">{test.name}</h3>
            </div>
            {test.description && <p className="text-sm text-gray-600 mb-3">{test.description}</p>}
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-600 font-medium">Test</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            {session?.user?.email === 'keremerdeen@gmail.com' && (
              <button onClick={() => handleDelete(String(test.id))} className="ml-2 text-red-500 hover:underline">Sil</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 