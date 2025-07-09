"use client";
import React from "react";
import MobileLayout from "./MobileLayout";
import { BookOpenIcon, AcademicCapIcon, ClockIcon, StarIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Ders {
  id: string;
  name: string;
  description: string;
  progress: number;
  totalQuestions: number;
  completedQuestions: number;
  lastStudied: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
}

export default function MobileDerslerimPage() {
  const dersler: Ders[] = [
    {
      id: "1",
      name: "Matematik",
      description: "Temel matematik konuları",
      progress: 75,
      totalQuestions: 500,
      completedQuestions: 375,
      lastStudied: "2 saat önce",
      difficulty: "Orta"
    },
    {
      id: "2",
      name: "Fizik",
      description: "Mekanik ve elektrik konuları",
      progress: 45,
      totalQuestions: 300,
      completedQuestions: 135,
      lastStudied: "1 gün önce",
      difficulty: "Zor"
    },
    {
      id: "3",
      name: "Kimya",
      description: "Organik ve inorganik kimya",
      progress: 90,
      totalQuestions: 400,
      completedQuestions: 360,
      lastStudied: "3 saat önce",
      difficulty: "Kolay"
    },
    {
      id: "4",
      name: "Biyoloji",
      description: "Hücre ve sistemler",
      progress: 60,
      totalQuestions: 350,
      completedQuestions: 210,
      lastStudied: "5 saat önce",
      difficulty: "Orta"
    },
    {
      id: "5",
      name: "Türkçe",
      description: "Dil bilgisi ve anlam",
      progress: 85,
      totalQuestions: 250,
      completedQuestions: 212,
      lastStudied: "1 saat önce",
      difficulty: "Kolay"
    },
    {
      id: "6",
      name: "Tarih",
      description: "Osmanlı ve Cumhuriyet tarihi",
      progress: 30,
      totalQuestions: 200,
      completedQuestions: 60,
      lastStudied: "2 gün önce",
      difficulty: "Orta"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay': return 'bg-green-100 text-green-700';
      case 'Orta': return 'bg-yellow-100 text-yellow-700';
      case 'Zor': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay': return '😊';
      case 'Orta': return '😐';
      case 'Zor': return '😰';
      default: return '📚';
    }
  };

  return (
    <MobileLayout currentPage="derslerim">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Derslerim</h1>
          <p className="text-gray-600">Çalıştığın dersler ve ilerleme durumun</p>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Ders</p>
                <p className="text-2xl font-bold text-gray-900">{dersler.length}</p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ortalama İlerleme</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(dersler.reduce((acc, ders) => acc + ders.progress, 0) / dersler.length)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <StarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Dersler Listesi */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Dersler</h2>
          
          <div className="space-y-3">
            {dersler.map((ders) => (
              <div
                key={ders.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                      <AcademicCapIcon className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{ders.name}</h3>
                      <p className="text-gray-600 text-sm">{ders.description}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(ders.difficulty)}`}>
                    {getDifficultyIcon(ders.difficulty)} {ders.difficulty}
                  </div>
                </div>

                {/* İlerleme Barı */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">İlerleme</span>
                    <span className="text-sm font-bold text-sky-600">{ders.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-sky-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${ders.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Detaylar */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{ders.lastStudied}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-600">
                      {ders.completedQuestions}/{ders.totalQuestions} soru
                    </span>
                  </div>
                </div>

                {/* Çalış Butonu */}
                <button className="w-full mt-4 bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition-all duration-200 active:scale-95">
                  Çalışmaya Devam Et
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Yeni Ders Ekle */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">Yeni Ders Ekle</h3>
              <p className="text-sky-100">Çalışmak istediğin yeni dersleri ekle</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <PlusIcon className="w-6 h-6" />
            </div>
          </div>
          <button className="w-full mt-4 bg-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 active:scale-95">
            Ders Ekle
          </button>
        </div>
      </div>
    </MobileLayout>
  );
} 