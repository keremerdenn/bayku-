"use client";
import React, { useState, useEffect } from "react";
import MobileLayout from "./MobileLayout";
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon, 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

const USER_KEY = "sinavPusulasiUser";

interface User {
  email: string;
  username?: string;
}

export default function MobileAdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
          const userData: User = JSON.parse(userStr);
          setIsAdmin(userData.email === "keremerdeen@gmail.com");
        }
      } catch {
        console.error("Kullanıcı bilgisi alınamadı");
      }
    }
  }, []);

  if (!isAdmin) {
    return (
      <MobileLayout currentPage="admin">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmuyor.</p>
        </div>
      </MobileLayout>
    );
  }

  const adminStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalQuestions: 15420,
    totalRooms: 156,
    systemHealth: 98,
    lastBackup: "2 saat önce"
  };

  const recentActivities = [
    { id: 1, action: "Yeni kullanıcı kaydoldu", user: "ahmet@email.com", time: "5 dakika önce", type: "success" },
    { id: 2, action: "Sistem yedeklemesi tamamlandı", user: "Sistem", time: "2 saat önce", type: "info" },
    { id: 3, action: "Yeni soru eklendi", user: "admin", time: "3 saat önce", type: "success" },
    { id: 4, action: "Sohbet odası silindi", user: "kerem@email.com", time: "5 saat önce", type: "warning" },
  ];

  return (
    <MobileLayout currentPage="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
          <p className="text-gray-600">Sistem yönetimi ve istatistikler</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Soru</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.totalQuestions}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sohbet Odaları</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.totalRooms}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sistem Durumu */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sistem Durumu</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Sistem Sağlığı</span>
              </div>
              <span className="font-semibold text-green-600">{adminStats.systemHealth}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Son Yedekleme</span>
              </div>
              <span className="font-semibold text-blue-600">{adminStats.lastBackup}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Veritabanı</span>
              </div>
              <span className="font-semibold text-green-600">Aktif</span>
            </div>
          </div>
        </div>

        {/* Hızlı İşlemler */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Hızlı İşlemler</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-sky-500 text-white p-4 rounded-2xl shadow-lg hover:bg-sky-600 transition-all duration-200 active:scale-95">
              <div className="flex flex-col items-center space-y-2">
                <UserGroupIcon className="w-8 h-8" />
                <span className="font-semibold text-sm">Kullanıcı Yönetimi</span>
              </div>
            </button>
            
            <button className="bg-green-500 text-white p-4 rounded-2xl shadow-lg hover:bg-green-600 transition-all duration-200 active:scale-95">
              <div className="flex flex-col items-center space-y-2">
                <ChartBarIcon className="w-8 h-8" />
                <span className="font-semibold text-sm">İstatistikler</span>
              </div>
            </button>
            
            <button className="bg-purple-500 text-white p-4 rounded-2xl shadow-lg hover:bg-purple-600 transition-all duration-200 active:scale-95">
              <div className="flex flex-col items-center space-y-2">
                <CogIcon className="w-8 h-8" />
                <span className="font-semibold text-sm">Sistem Ayarları</span>
              </div>
            </button>
            
            <button className="bg-orange-500 text-white p-4 rounded-2xl shadow-lg hover:bg-orange-600 transition-all duration-200 active:scale-95">
              <div className="flex flex-col items-center space-y-2">
                <ShieldCheckIcon className="w-8 h-8" />
                <span className="font-semibold text-sm">Güvenlik</span>
              </div>
            </button>
          </div>
        </div>

        {/* Son Aktiviteler */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Son Aktiviteler</h2>
          
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            {recentActivities.map((activity, index) => (
              <div key={activity.id} className={`p-4 ${index !== recentActivities.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sistem Uyarıları */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Sistem Uyarıları</h3>
          </div>
          <p className="text-yellow-700 text-sm">
            Sistem performansı normal seviyede. Herhangi bir kritik uyarı bulunmuyor.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
} 