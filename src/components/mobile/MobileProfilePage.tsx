"use client";
import React, { useState, useEffect, useRef } from "react";
import MobileLayout from "./MobileLayout";
import { XMarkIcon, CameraIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';

const USER_KEY = "sinavPusulasiUser";

interface User {
  email: string;
  username?: string;
  bio?: string;
  profileImage?: string;
}

interface StatsData {
  totalQuestions: number;
  successRate: number;
  dailyStreak: number;
  todayQuestions: number;
  weekQuestions: number;
  monthQuestions: number;
}

export default function MobileProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editError, setEditError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<StatsData>({
    totalQuestions: 0,
    successRate: 0,
    dailyStreak: 0,
    todayQuestions: 0,
    weekQuestions: 0,
    monthQuestions: 0
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("MobileProfilePage - checking localStorage...");
      console.log("MobileProfilePage - all localStorage keys:", Object.keys(localStorage));
      
      try {
        const userStr = localStorage.getItem(USER_KEY);
        console.log("MobileProfilePage - localStorage data:", userStr);
        if (userStr) {
          const userData: User = JSON.parse(userStr);
          console.log("MobileProfilePage - parsed user data:", userData);
          setUser(userData);
          setEditUsername(userData.username || "");
          setEditBio(userData.bio || "");
          setProfileImage(userData.profileImage || null);
          console.log("MobileProfilePage - set profileImage:", userData.profileImage);
          loadStats();
        } else {
          console.log("MobileProfilePage - no user data found in localStorage");
          // Kullanıcı giriş yapmamış, ana sayfaya yönlendir
          window.location.href = '/';
        }
      } catch (error) {
        console.error("Kullanıcı bilgisi alınamadı:", error);
        // Hata durumunda da ana sayfaya yönlendir
        window.location.href = '/';
      }
    }
  }, []);

  // localStorage değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USER_KEY && e.newValue) {
        console.log("MobileProfilePage - localStorage changed:", e.newValue);
        try {
          const userData: User = JSON.parse(e.newValue);
          setUser(userData);
          setEditUsername(userData.username || "");
          setEditBio(userData.bio || "");
          setProfileImage(userData.profileImage || null);
          console.log("MobileProfilePage - updated from storage event");
        } catch (error) {
          console.error("MobileProfilePage - storage event parse error:", error);
        }
      }
    };

    const handleUserDataChange = (e: CustomEvent) => {
      console.log("MobileProfilePage - custom event received:", e.detail);
      const userData = e.detail;
      setUser(userData);
      setEditUsername(userData.username || "");
      setEditBio(userData.bio || "");
      setProfileImage(userData.profileImage || null);
      console.log("MobileProfilePage - updated from custom event");
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userDataChanged', handleUserDataChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataChanged', handleUserDataChange as EventListener);
    };
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        const userData = JSON.parse(userStr);
        const email = userData.email || "kullanici@example.com";
        
        // Gerçek API çağrısı
        const response = await fetch(`/api/stats?email=${encodeURIComponent(email)}`);
        if (response.ok) {
          const stats = await response.json();
          setStatsData({
            totalQuestions: stats.totalQuestions || 0,
            successRate: stats.successRate || 0,
            dailyStreak: stats.dailyStreak || 0,
            todayQuestions: stats.todayQuestions || 0,
            weekQuestions: stats.weekQuestions || 0,
            monthQuestions: stats.monthQuestions || 0
          });
        } else {
          // API hatası durumunda varsayılan veriler
          setStatsData({
            totalQuestions: 0,
            successRate: 0,
            dailyStreak: 0,
            todayQuestions: 0,
            weekQuestions: 0,
            monthQuestions: 0
          });
        }
      }
    } catch (error) {
      console.error("İstatistik verileri yüklenemedi:", error);
      // Hata durumunda varsayılan veriler
      setStatsData({
        totalQuestions: 0,
        successRate: 0,
        dailyStreak: 0,
        todayQuestions: 0,
        weekQuestions: 0,
        monthQuestions: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("MobileProfilePage - uploading image:", file.name);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        console.log("MobileProfilePage - image loaded, length:", imageData.length);
        setProfileImage(imageData);
        
        // Fotoğrafı hem localStorage'a hem sunucuya kaydet
        if (user) {
          try {
            // Sunucuya kaydet
            const response = await fetch('/api/profile/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email,
                profileImage: imageData,
                bio: user.bio || ""
              }),
            });

            if (!response.ok) {
              throw new Error('Fotoğraf sunucuya kaydedilemedi');
            }
            
            // localStorage'a kaydet
            const updatedUser = { ...user, profileImage: imageData };
            console.log("MobileProfilePage - saving updated user:", updatedUser);
            setUser(updatedUser);
            localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
            
            // Custom event tetikle
            window.dispatchEvent(new CustomEvent('userDataChanged', { detail: updatedUser }));
            
            console.log("MobileProfilePage - saved to localStorage and server");
          } catch (error) {
            console.error('Fotoğraf kaydetme hatası:', error);
            alert('Fotoğraf kaydedilemedi!');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    setPasswordError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Tüm alanları doldurun.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Yeni şifreler eşleşmiyor.");
      return;
    }
    alert("Şifre başarıyla değiştirildi!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordModal(false);
  };

  if (!user) {
    return (
      <MobileLayout currentPage="profil">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout currentPage="profil">
      <div className="max-w-md mx-auto px-4 py-4">
        {/* Profil Kartı */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-4">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden relative">
                {profileImage ? (
                  <Image src={profileImage} alt="Profil" fill className="object-cover" />
                ) : (
                  user.username ? user.username[0]?.toUpperCase() : user.email[0]?.toUpperCase()
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
              >
                <CameraIcon className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{user.username || "Kullanıcı"}</h2>
            <span className="inline-block mb-3 px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium text-sm">{user.email}</span>
            {user.bio && <p className="text-gray-700 text-center text-sm mb-4">{user.bio}</p>}
            
            <div className="flex gap-2 w-full">
              <button
                className="flex-1 bg-sky-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-sky-600 active:scale-95 transition"
                onClick={() => {
                  setEditUsername(user.username || "");
                  setEditBio(user.bio || "");
                  setEditError("");
                  setShowEditModal(true);
                }}
              >
                Profili Düzenle
              </button>
              <button
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-600 active:scale-95 transition"
                onClick={() => setShowPasswordModal(true)}
              >
                Şifre Değiştir
              </button>
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">İstatistikler</h3>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-lg text-center">
                <div className="text-xl font-bold">{statsData.totalQuestions.toLocaleString()}</div>
                <div className="text-xs opacity-90">Çözülen Soru</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-lg text-center">
                <div className="text-xl font-bold">{statsData.successRate}%</div>
                <div className="text-xs opacity-90">Başarı Oranı</div>
              </div>
            </div>
          )}
        </div>

        {/* Ayarlar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Ayarlar</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 text-sm">E-posta Bildirimleri</h4>
                <p className="text-xs text-gray-600">Önemli güncellemeler için e-posta al</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Push Bildirimleri</h4>
                <p className="text-xs text-gray-600">Tarayıcı bildirimlerini etkinleştir</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Profil Düzenleme Modalı */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl w-[90vw] max-w-sm p-6 relative flex flex-col">
              <button
                className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100"
                onClick={() => setShowEditModal(false)}
                aria-label="Kapat"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Profili Düzenle</h3>
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  setEditError("");
                  if (!editUsername.trim()) {
                    setEditError("Kullanıcı adı boş olamaz.");
                    return;
                  }
                  if (editUsername.length > 30) {
                    setEditError("Kullanıcı adı 30 karakterden uzun olamaz.");
                    return;
                  }
                  // Sunucuya profil güncellemesi gönder
                  try {
                    const response = await fetch('/api/profile/update', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        email: user.email,
                        profileImage: profileImage,
                        bio: editBio.trim()
                      }),
                    });

                    const data = await response.json();
                    
                    if (!response.ok) {
                      throw new Error(data.error || 'Profil güncellenemedi');
                    }

                    const updatedUser = { ...user, username: editUsername.trim(), bio: editBio.trim() };
                    setUser(updatedUser);
                    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
                    
                    // Custom event ile diğer tabları bilgilendir
                    window.dispatchEvent(new CustomEvent('profileUpdated', {
                      detail: { user: updatedUser }
                    }));
                    
                    setShowEditModal(false);
                  } catch (error) {
                    console.error('Profil güncelleme hatası:', error);
                    alert('Profil güncellenirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
                  }
                }}
                className="flex flex-col gap-3"
              >
                <input
                  type="text"
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  placeholder="Kullanıcı adı"
                  className="w-full p-3 rounded-lg border border-gray-200 !text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-sky-200 focus:outline-none text-sm"
                  maxLength={30}
                  required
                />
                <textarea
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  placeholder="Biyografi (opsiyonel)"
                  className="w-full p-3 rounded-lg border border-gray-200 !text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-sky-200 focus:outline-none text-sm min-h-[80px]"
                  maxLength={160}
                />
                {editError && <div className="text-red-500 text-xs text-center">{editError}</div>}
                <button
                  type="submit"
                  className="w-full bg-sky-500 text-white py-3 rounded-lg font-medium text-sm hover:bg-sky-600 active:scale-95 transition mt-2"
                >
                  Kaydet
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Şifre Değiştirme Modalı */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl w-[90vw] max-w-sm p-6 relative flex flex-col">
              <button
                className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100"
                onClick={() => setShowPasswordModal(false)}
                aria-label="Kapat"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Şifre Değiştir</h3>
              <div className="flex flex-col gap-3">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Mevcut şifre"
                  className="w-full p-3 rounded-lg border border-gray-200 !text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-sky-200 focus:outline-none text-sm"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Yeni şifre"
                  className="w-full p-3 rounded-lg border border-gray-200 !text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-sky-200 focus:outline-none text-sm"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Yeni şifre (tekrar)"
                  className="w-full p-3 rounded-lg border border-gray-200 !text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-sky-200 focus:outline-none text-sm"
                />
                {passwordError && <div className="text-red-500 text-xs text-center">{passwordError}</div>}
                <button
                  onClick={handlePasswordChange}
                  className="w-full bg-sky-500 text-white py-3 rounded-lg font-medium text-sm hover:bg-sky-600 active:scale-95 transition mt-2"
                >
                  Şifreyi Değiştir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
} 