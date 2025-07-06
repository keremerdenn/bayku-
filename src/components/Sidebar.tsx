"use client";
import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

// Gradientli Baykuş SVG ikonu
const OwlIcon = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="22" rx="10" ry="7" fill="url(#owlGradient)"/>
    <ellipse cx="11.5" cy="14" rx="3.5" ry="4" fill="#fff"/>
    <ellipse cx="20.5" cy="14" rx="3.5" ry="4" fill="#fff"/>
    <circle cx="11.5" cy="14" r="1.2" fill="#0ea5e9"/>
    <circle cx="20.5" cy="14" r="1.2" fill="#0ea5e9"/>
    <ellipse cx="16" cy="18.5" rx="2.5" ry="1.2" fill="#e5e7eb"/>
    <path d="M8 10 Q16 2 24 10" stroke="#0ea5e9" strokeWidth="2" fill="none"/>
    <defs>
      <linearGradient id="owlGradient" x1="6" y1="22" x2="26" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8"/>
        <stop offset="1" stopColor="#6366f1"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("sinavPusulasiUser");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUsername(user.username || "Kullanıcı");
          setEmail(user.email || "");
        } catch {
          setUsername("Kullanıcı");
          setEmail("");
        }
      }
    }
  }, []);

  // Kullanıcı baş harfi
  const initial = username?.[0]?.toUpperCase() || "U";

  return (
    <>
      {/* Mobil Menü Butonu - Modern ve hizalı */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] w-9 h-9 flex items-center justify-center bg-white/90 border border-gray-200 shadow-md rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
        aria-label="Menüyü aç/kapat"
        style={{boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}
      >
        {isOpen ? (
          <XMarkIcon className="w-5 h-5 text-sky-600" />
        ) : (
          <Bars3Icon className="w-5 h-5 text-sky-600" />
        )}
      </button>

      {/* Mobil Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Eski klasik ve koyu mavi gradientli */}
      <aside className={`glass-sidebar w-64 h-screen fixed top-0 left-0 flex flex-col z-[55] transition-all duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Logo ve başlık */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-2">
          <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full">
            <OwlIcon />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">Baykuş</span>
        </div>
        {/* Menü Linkleri */}
        <nav className="flex-1 px-2 pt-2 pb-4 space-y-1">
          <a href="#/dashboard" className="nav-link sidebar-link-active flex items-center gap-2">
            <HomeIcon className="w-5 h-5" />
            <span>Panelim</span>
          </a>
          <a href="#/sorucozme" className="nav-link flex items-center gap-2">
            <PencilIcon className="w-5 h-5" />
            <span>Soru Çöz</span>
          </a>
          <a href="#/sohbet" className="nav-link flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span>Sohbet</span>
          </a>
          <a href="#/sorutartisma" className="nav-link flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span>Soru Tartışması</span>
          </a>
          <a href="#/derslerim" className="nav-link flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5" />
            <span>Derslerim</span>
          </a>
          <a href="#/denemelerim" className="nav-link flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5" />
            <span>Denemelerim</span>
          </a>
          <a href="#/sorucuzdanim" className="nav-link flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5" />
            <span>Soru Cüzdanım</span>
          </a>
          <a href="#/verilerim" className="nav-link flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5" />
            <span>Verilerim</span>
          </a>
        </nav>
        {/* Kullanıcı Profili ve Çıkış Butonu */}
        <div className="px-4 pb-6">
          <div className="sidebar-profile-box flex items-center gap-3 mb-2">
            <div className="sidebar-profile-avatar w-10 h-10 flex items-center justify-center text-white text-lg font-bold">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{username}</p>
              <p className="text-white/70 text-xs truncate">{email}</p>
            </div>
          </div>
          <button className="logout-btn-modern" onClick={() => {/* Çıkış işlemi */}}>
            Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
}
