"use client";
import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

// Gradientli Baykuş SVG ikonu
const OwlIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        className="md:hidden fixed top-4 left-4 z-[60] w-10 h-10 flex items-center justify-center bg-white/90 border border-gray-200 shadow-md rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
        aria-label="Menüyü aç/kapat"
        style={{boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-sky-600" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-sky-600" />
        )}
      </button>

      {/* Mobil Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Modern ve kompakt */}
      <aside className={`glass-sidebar w-[85vw] max-w-xs h-screen fixed top-0 left-0 flex flex-col z-[55] transition-all duration-300 ease-in-out shadow-2xl md:w-64 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Üstte logo ve X aynı hizada */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-sky-100 rounded-full">
              <OwlIcon />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">Baykuş</span>
          </div>
          <button onClick={()=>setIsOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full border border-gray-200 shadow-sm p-0.5">
            <XMarkIcon className="w-5 h-5 text-sky-600" />
          </button>
        </div>
        {/* Menü Linkleri */}
        <nav className="flex-1 px-2 pb-2 space-y-1 mt-2">
          <a href="#/dashboard" className="nav-link flex items-center gap-2 p-3 rounded-xl sidebar-link-active shadow bg-gradient-to-r from-sky-100 to-sky-200 border border-sky-300 text-base">
            <HomeIcon className="w-5 h-5 text-sky-600" />
            <span className="font-semibold">Panelim</span>
          </a>
          <a href="#/sorucozme" className="nav-link flex items-center gap-2 p-3 rounded-xl hover:bg-sky-50 transition text-base">
            <PencilIcon className="w-5 h-5 text-sky-500" />
            <span className="font-medium">Soru Çöz</span>
          </a>
          <a href="#/sohbet" className="nav-link flex items-center gap-2 p-3 rounded-xl hover:bg-sky-50 transition text-base">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-sky-500" />
            <span className="font-medium">Sohbet</span>
          </a>
          <a href="#/derslerim" className="nav-link flex items-center gap-2 p-3 rounded-xl hover:bg-sky-50 transition text-base">
            <BookOpenIcon className="w-5 h-5 text-sky-500" />
            <span className="font-medium">Derslerim</span>
          </a>
          <a href="#/verilerim" className="nav-link flex items-center gap-2 p-3 rounded-xl hover:bg-sky-50 transition text-base">
            <ChartBarIcon className="w-5 h-5 text-sky-500" />
            <span className="font-medium">Verilerim</span>
          </a>
          <a href="#/ayarlar" className="nav-link flex items-center gap-2 p-3 rounded-xl hover:bg-sky-50 transition text-base">
            <Cog6ToothIcon className="w-5 h-5 text-sky-500" />
            <span className="font-medium">Ayarlar</span>
          </a>
        </nav>
        {/* Kullanıcı Profili */}
        <div className="sidebar-profile px-4 pb-4 mt-auto">
          <div className="sidebar-profile-box p-3 flex items-center gap-3">
            <div className="sidebar-profile-avatar w-9 h-9 flex items-center justify-center text-white font-bold text-base">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{username}</p>
              <p className="text-sky-200 text-xs truncate">{email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
