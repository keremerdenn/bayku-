"use client";
import React, { useState, useEffect } from "react";
import MobileLayout from "./MobileLayout";
import { UserIcon, EnvelopeIcon, CalendarIcon, AcademicCapIcon, CogIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const USER_KEY = "sinavPusulasiUser";

interface User {
  email: string;
  username?: string;
  bio?: string;
}

export default function MobileProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: ""
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
          const userData: User = JSON.parse(userStr);
          setUser(userData);
          setFormData({
            username: userData.username || "",
            email: userData.email || "",
            bio: userData.bio || ""
          });
        }
      } catch {
        console.error("Kullanıcı bilgisi alınamadı");
      }
    }
  }, []);

  const handleSave = () => {
    // Burada gerçek API çağrısı yapılacak
    const updatedUser = { ...user, ...formData };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || ""
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <MobileLayout currentPage="profil">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout currentPage="profil">
      <div className="space-y-6">
        {/* Profil Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.username || "Kullanıcı"}</h1>
              <p className="text-sky-100">{user.email}</p>
              <p className="text-sky-100 text-sm">Baykuş Üyesi</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <CogIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Profil Bilgileri */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Profil Bilgileri</h2>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hakkımda</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Kendin hakkında kısa bir bilgi..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-sky-500 text-white py-3 rounded-2xl font-semibold hover:bg-sky-600 transition-all duration-200"
                >
                  Kaydet
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Kullanıcı Adı</p>
                  <p className="font-semibold text-gray-900">{user.username || "Belirtilmemiş"}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">E-posta</p>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Üyelik Tarihi</p>
                  <p className="font-semibold text-gray-900">Ocak 2024</p>
                </div>
              </div>
              
              {user.bio && (
                <div className="flex items-start space-x-3">
                  <AcademicCapIcon className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Hakkımda</p>
                    <p className="font-semibold text-gray-900">{user.bio}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Çözülen Soru</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Doğruluk Oranı</p>
                <p className="text-2xl font-bold text-gray-900">%87</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Ayarlar */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Ayarlar</h2>
          
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CogIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Hesap Ayarları</p>
                    <p className="text-sm text-gray-600">Şifre değiştir, bildirimler</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Güvenlik</p>
                    <p className="text-sm text-gray-600">İki faktörlü doğrulama</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Yardım</p>
                    <p className="text-sm text-gray-600">SSS, destek</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
} 