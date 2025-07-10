"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatPage from "./ChatPage";
import VerilerimPage from "./VerilerimPage";
import NotificationSystem from "./NotificationSystem";
import ThemeToggle from "./ThemeToggle";
import ProfilePage from "./ProfilePage";
import AdminPanel from "./AdminPanel";
import RoomsPage from "./RoomsPage";
import LessonsPage from "./LessonsPage";
import SolvePage from "./SolvePage";

const USER_KEY = "sinavPusulasiUser";

const pageTitles: Record<string, string> = {
  dashboard: "Panelim",
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
  let username = "Kullanıcı";
  let email = "";
  let isAdmin = false;
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        username = user.username || username;
        email = user.email || "";
        isAdmin = (email === "keremerdeen@gmail.com");
      } catch {}
    }
  }

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
          <h1 className="text-2xl font-bold mb-2">Hoş Geldin!</h1>
          <p className="text-sky-100 text-lg">Başlamak için üstteki menüyü kullanabilirsin.</p>
        </div>
        {/* Dashboard'da başka örnek içerik yok */}
      </div>
    );
  } else if (activePage === "admin" && isAdmin) {
    pageContent = <AdminPanel />;
  } else if (activePage === "sohbet") {
    pageContent = <RoomsPage />;
  } else if (activePage === "ai-asistan") {
    pageContent = <ChatPage />;
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
            <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm mobile-header-avatar">
              {username?.[0]?.toUpperCase() || "U"}
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