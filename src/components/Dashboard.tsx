"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import ChatPage from "./ChatPage";
import RoomsPage from "./RoomsPage";
import DerslerimPage from "./DerslerimPage";
import VerilerimPage from "./VerilerimPage";

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

const Dashboard = () => {
  let username = "Kullanıcı";
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        username = user.username || username;
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
      <>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Hoş Geldin, {username}!</h1>
        <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">Bugün hedeflerine bir adım daha yaklaşma zamanı.</p>
        {/* İstatistik Kartları - Mobil için optimize */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          <StatCard title="Toplam Çözülen Soru" value="1,245" icon={<svg className="w-5 h-5 md:w-6 md:h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h3m-3-10h.01M9 10h.01M12 10h.01M15 10h.01M9 13h.01M12 13h.01M15 13h.01M4 7h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" /></svg>} />
          <StatCard title="Genel Başarı Oranı" value="%78.2" icon={<svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6-4a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} colorClass="bg-green-100" />
          <StatCard title="Haftalık Puan" value="850" icon={<svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m6 4v4m-2-2h4M12 3v10m0 0l-3-3m3 3l3-3" /></svg>} colorClass="bg-yellow-100" />
          <StatCard title="Günlük Seri" value="12 Gün" icon={<svg className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} colorClass="bg-indigo-100" />
        </div>
        {/* Grafikler Alanı - Mobil için optimize */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-900">Haftalık Net Değişimi</h3>
            <div className="relative h-48 md:h-64 lg:h-80 flex items-center justify-center">
              <LineChart />
            </div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-900">Soru Dağılımı</h3>
            <div className="relative h-48 md:h-64 lg:h-80 flex items-center justify-center">
              <DoughnutChart />
            </div>
          </div>
        </div>
      </>
    );
  } else if (activePage === "sohbet") {
    pageContent = <RoomsPage />;
  } else if (activePage === "ai-asistan") {
    pageContent = <ChatPage />;
  } else if (activePage === "derslerim") {
    pageContent = <DerslerimPage />;
  } else if (activePage === "verilerim") {
    pageContent = <VerilerimPage />;
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