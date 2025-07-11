"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Image from 'next/image';

import dynamic from 'next/dynamic';

const VerilerimPage = dynamic(() => import('./VerilerimPage'));
const AdminPanel = dynamic(() => import('./AdminPanel'));
const RoomsPage = dynamic(() => import('./RoomsPage'));
const LessonsPage = dynamic(() => import('./LessonsPage'));
const ProfilePage = dynamic(() => import('./ProfilePage'));
const SolvePage = dynamic(() => import('./SolvePage'));

import NotificationSystem from "./NotificationSystem";
import ThemeToggle from "./ThemeToggle";

const USER_KEY = "sinavPusulasiUser";

const pageTitles: Record<string, string> = {
  dashboard: "Ana Sayfa",
  sorucozme: "Soru Çöz",
  sohbet: "Sohbet",
  sorutartismasi: "Soru Tartışması",
  derslerim: "Derslerim",
  denemelerim: "Denemelerim",
  sorucuzdanim: "Soru Cüzdanım",
  verilerim: "Verilerim",
};

// Kullanılmayan importlar silindi

const Dashboard = () => {
  const [username, setUsername] = useState("Kullanıcı");
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = () => {
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem(USER_KEY);
        console.log("Dashboard - localStorage data:", userStr);
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            console.log("Dashboard - parsed user data:", user);
            setUsername(user.username || "Kullanıcı");
            setProfileImage(user.profileImage || null);
            console.log("Dashboard - set profileImage:", user.profileImage);
            setIsAdmin((user.email === "keremerdeen@gmail.com"));
          } catch (error) {
            console.error("Dashboard - user data parse error:", error);
          }
        }
      }
    };

    loadUserData();

    // localStorage değişikliklerini dinle
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USER_KEY) {
        loadUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Routing mantığı
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#\//, "");
      setActivePage(hash || "dashboard");
    };
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Sidebar linklerine tıklanınca hash değişecek, burada ana içerik değişecek
  let pageContent = null;
  if (activePage === "dashboard") {
    pageContent = (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
          <h1 className="text-xl font-bold mb-2">Hoş Geldin!</h1>
          <p className="text-sky-100 text-base">Başlamak için üstteki menüyü kullanabilirsin.</p>
        </div>
        
        {/* Duyurular Bölümü */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#f59e0b"/>
            </svg>
            Duyurular
          </h2>
          <div className="space-y-4">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Yeni Özellik!</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>Artık sohbet odalarında arkadaşlarınla birlikte soru çözebilirsin!</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Güncelleme</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Derslerim bölümünde artık konuları ve testleri daha kolay yönetebilirsin.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Başarı!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Son güncellemelerle birlikte performans iyileştirmeleri yapıldı.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (activePage === "admin" && isAdmin) {
    pageContent = <AdminPanel />;
  } else if (activePage === "sohbet") {
    pageContent = <RoomsPage />;
  } else if (activePage === "derslerim") {
    pageContent = <LessonsPage />;
  } else if (activePage === "verilerim") {
    pageContent = <VerilerimPage />;
  } else if (activePage === "profil") {
    pageContent = <ProfilePage username={username} />;
  } else if (activePage === "sorucozme") {
    pageContent = <SolvePage />;
  } else {
    pageContent = (
      <div className="w-full p-6 md:p-8 text-center text-gray-500">
        <h2 className="text-xl md:text-2xl font-bold mb-2">{pageTitles[activePage] || "Sayfa"} Yakında!</h2>
        <p className="text-sm md:text-base">Bu sayfa için içerik yakında eklenecek.</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 transition-all duration-300 ease-in-out min-h-screen bg-gray-50">
        {/* Mobil Header - Tamamen yeniden tasarlandı */}
        <header className="bg-white shadow-md w-full flex items-center justify-between px-4 h-16 md:hidden sticky top-0 z-30 mobile-header">
          <div className="flex items-center space-x-3 mobile-header-content">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center mobile-header-logo">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="16" cy="22" rx="8" ry="5" fill="#ffffff"/>
                <ellipse cx="12" cy="14" rx="3" ry="3" fill="#0ea5e9"/>
                <ellipse cx="20" cy="14" rx="3" ry="3" fill="#0ea5e9"/>
                <circle cx="12" cy="14" r="1" fill="#ffffff"/>
                <circle cx="20" cy="14" r="1" fill="#ffffff"/>
                <ellipse cx="16" cy="18" rx="2" ry="1" fill="#e5e7eb"/>
                <path d="M8 10 Q16 2 24 10" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-800">Baykuş</span>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <NotificationSystem />
            <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm mobile-header-avatar overflow-hidden relative">
              {profileImage ? (
                <Image src={profileImage} alt="Profil" fill className="object-cover" />
              ) : (
                username?.[0]?.toUpperCase() || "U"
              )}
            </div>
          </div>
        </header>
        
        {/* Ana İçerik - Mobil için optimize */}
        <main className="pt-16 md:pt-0 p-4 sm:p-6 lg:p-8 mobile-content">
          {pageContent}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 