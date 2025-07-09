"use client";
import React from "react";
import MobileLayout from "./MobileLayout";
import { ChartBarIcon, ArrowTrendingUpIcon, ClockIcon, StarIcon, ChartPieIcon } from "@heroicons/react/24/outline";

export default function MobileVerilerimPage() {
  const stats = {
    totalQuestions: 1247,
    correctAnswers: 1085,
    accuracy: 87,
    studyTime: "45 saat",
    streak: 12,
    rank: "1,234",
    weeklyProgress: 15,
    monthlyProgress: 23
  };

  const recentActivity = [
    { id: 1, subject: "Matematik", action: "10 soru çözdün", time: "2 saat önce", score: 8 },
    { id: 2, subject: "Fizik", action: "Test tamamladın", time: "4 saat önce", score: 7 },
    { id: 3, subject: "Kimya", action: "Konu tekrarı yaptın", time: "6 saat önce", score: 9 },
    { id: 4, subject: "Biyoloji", action: "5 soru çözdün", time: "1 gün önce", score: 6 },
  ];

  return (
    <MobileLayout currentPage="verilerim">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verilerim</h1>
          <p className="text-gray-600">Çalışma performansın ve istatistiklerin</p>
        </div>

        {/* Ana İstatistikler */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Soru</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Doğruluk Oranı</p>
                <p className="text-2xl font-bold text-gray-900">{stats.accuracy}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <StarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Çalışma Süresi</p>
                <p className="text-2xl font-bold text-gray-900">{stats.studyTime}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Günlük Seri</p>
                <p className="text-2xl font-bold text-gray-900">{stats.streak} gün</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Performans Grafiği */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Haftalık Performans</h3>
          <div className="space-y-3">
            {[85, 92, 78, 95, 88, 91, 87].map((value, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-8">
                  {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][index]}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8">{value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Son Aktiviteler */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Son Aktiviteler</h2>
          
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activity.score >= 8 ? 'bg-green-100' : 
                      activity.score >= 6 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <span className="text-sm font-bold">
                        {activity.score >= 8 ? '😊' : activity.score >= 6 ? '😐' : '😰'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{activity.subject}</p>
                      <p className="text-gray-600 text-sm">{activity.action}</p>
                      <p className="text-gray-500 text-xs">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.score >= 8 ? 'bg-green-100 text-green-700' : 
                      activity.score >= 6 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {activity.score}/10
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hedefler */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">Bu Ay Hedefin</h3>
              <p className="text-sky-100">500 soru çöz</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <ChartPieIcon className="w-6 h-6" />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">İlerleme</span>
              <span className="text-sm font-bold">{stats.monthlyProgress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-300"
                style={{ width: `${stats.monthlyProgress}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-sky-100 text-sm">
            {500 - Math.round((stats.monthlyProgress / 100) * 500)} soru kaldı
          </p>
        </div>

        {/* Sıralama */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sıralama</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Genel Sıralama</p>
              <p className="text-2xl font-bold text-gray-900">#{stats.rank}</p>
            </div>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
} 