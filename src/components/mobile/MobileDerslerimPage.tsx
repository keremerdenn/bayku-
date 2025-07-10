"use client";
import React from "react";
import MobileLayout from "./MobileLayout";

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

  return (
    <MobileLayout currentPage="derslerim">
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Derslerim</h2>
          <p className="text-gray-500">Henüz dersiniz yok.</p>
        </div>
      </div>
    </MobileLayout>
  );
} 