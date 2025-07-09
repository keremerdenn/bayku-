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
  AcademicCapIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";
import NotificationSystem from "./NotificationSystem";

// Gradientli Baykuş SVG ikonu
const OwlIcon = () => (
  <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const USER_KEY = "sinavPusulasiUser";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(USER_KEY);
      setIsLoggedIn(!!userStr);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUsername(user.username || "Kullanıcı");
          setEmail(user.email || "");
          setIsAdmin(user.email === "keremerdeen@gmail.com");
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
      {/* Mobil Menü Butonu - Daha iyi tasarım */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-sky-500 text-white rounded-xl shadow-lg hover:bg-sky-600 transition-all duration-200 modal-close-btn"
        aria-label="Menüyü aç/kapat"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Mobil Overlay - Daha iyi z-index */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Tamamen yeniden tasarlandı */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo ve başlık - Mobil için optimize */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 md:pt-8 md:pb-6">
          <div className="w-12 h-12 md:w-10 md:h-10 flex items-center justify-center">
            <OwlIcon />
          </div>
          <span className="font-extrabold text-2xl md:text-xl tracking-tight bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">Baykuş</span>
        </div>
        
        {/* Menü Linkleri - Mobil için optimize */}
        <nav className="flex-1 px-4 pb-2 space-y-3">
          <a href="#/dashboard" className="nav-link flex items-center p-4 md:p-3 rounded-xl sidebar-link-active shadow-md bg-gradient-to-r from-sky-100 to-sky-200 border border-sky-300">
            <HomeIcon className="w-7 h-7 md:w-5 md:h-5 mr-4 md:mr-2 text-sky-600" />
            <span className="font-semibold text-lg md:text-sm">Panelim</span>
          </a>
          <a href="#/sorucozme" className="nav-link flex items-center p-4 md:p-3 rounded-xl hover:bg-sky-50 transition">
            <PencilIcon className="w-7 h-7 md:w-5 md:h-5 mr-4 md:mr-2 text-sky-500" />
            <span className="font-medium text-lg md:text-sm">Soru Çöz</span>
          </a>
          <a href="#/sohbet" className="nav-link flex items-center p-4 md:p-3 rounded-xl hover:bg-sky-50 transition">
            <ChatBubbleLeftRightIcon className="w-7 h-7 md:w-5 md:h-5 mr-4 md:mr-2 text-sky-500" />
            <span className="font-medium text-lg md:text-sm">Sohbet Odaları</span>
          </a>
          <a href="#/ai-asistan" className="nav-link flex items-center p-4 md:p-3 rounded-xl hover:bg-sky-50 transition">
            <AcademicCapIcon className="w-7 h-7 md:w-5 md:h-5 mr-4 md:mr-2 text-indigo-500" />
            <span className="font-medium text-lg md:text-sm">Baykuş AI Asistan</span>
          </a>
          <a href="#/derslerim" className="nav-link flex items-center p-4 md:p-3 rounded-xl hover:bg-sky-50 transition">
            <BookOpenIcon className="w-7 h-7 md:w-5 md:h-5 mr-4 md:mr-2 text-sky-500" />
            <span className="font-medium text-lg md:text-sm">Derslerim</span>
          </a>
          <a href="#/verilerim" className="nav-link flex items-center p-4 md:p-3 rounded-xl hover:bg-sky-50 transition">
            <ChartBarIcon className="w-7 h-7 md:w-5 md:h-5 mr-4 md:mr-2 text-sky-500" />
            <span className="font-medium text-lg md:text-sm">Verilerim</span>
          </a>
          <a href="#/profil" className="nav-link flex items-center p-4 md:p-3 rounded-xl hover:bg-sky-50 transition">
            <UserIcon className="w-7 h-7 md:w-5 md:h-5 mr-4 md:mr-2 text-sky-500" />
            <span className="font-medium text-lg md:text-sm">Profilim</span>
          </a>
          {isAdmin && (
            <a href="#/admin" className="nav-link flex items-center p-4 md:p-3 rounded-xl hover:bg-sky-50 transition">
              <AcademicCapIcon className="w-7 h-7 md:w-5 md:h-5 mr-4 md:mr-2 text-indigo-500" />
              <span className="font-medium text-lg md:text-sm">Admin Paneli</span>
            </a>
          )}
        </nav>
        
        {/* Kullanıcı Profili - Mobil için optimize */}
        <div className="sidebar-profile px-4 pb-6">
          <div className="sidebar-profile-box p-4 md:p-3">
            <div className="flex items-center space-x-3">
              <div className="sidebar-profile-avatar w-12 h-12 md:w-10 md:h-10 flex items-center justify-center text-white font-bold text-lg md:text-base">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-base md:text-sm truncate">{username}</p>
                <p className="text-sky-200 text-sm md:text-xs truncate">{email}</p>
              </div>
            </div>
          </div>
          {/* Çıkış Yap butonu - sadece giriş yapılmışsa */}
          {isLoggedIn && (
            <div className="mt-4 flex justify-center">
              <LogoutButton sidebarMode />
            </div>
          )}
        </div>
        {/* Karanlık mod ve bildirim ikonları - En alt kısım */}
        <div className="flex items-center gap-2 px-6 pb-6 mt-auto">
          <ThemeToggle />
          <NotificationSystem />
        </div>
      </aside>
    </>
  );
}
