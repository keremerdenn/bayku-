"use client";
import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserIcon,
  AcademicCapIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import LogoutButton from "../LogoutButton";

// Gradientli Baykuş SVG ikonu - Mobil için büyütülmüş
const MobileOwlIcon = () => (
  <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="22" rx="10" ry="7" fill="url(#mobileOwlGradient)"/>
    <ellipse cx="11.5" cy="14" rx="3.5" ry="4" fill="#fff"/>
    <ellipse cx="20.5" cy="14" rx="3.5" ry="4" fill="#fff"/>
    <circle cx="11.5" cy="14" r="1.2" fill="#0ea5e9"/>
    <circle cx="20.5" cy="14" r="1.2" fill="#0ea5e9"/>
    <ellipse cx="16" cy="18.5" rx="2.5" ry="1.2" fill="#e5e7eb"/>
    <path d="M8 10 Q16 2 24 10" stroke="#0ea5e9" strokeWidth="2" fill="none"/>
    <defs>
      <linearGradient id="mobileOwlGradient" x1="6" y1="22" x2="26" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8"/>
        <stop offset="1" stopColor="#6366f1"/>
      </linearGradient>
    </defs>
  </svg>
);

const USER_KEY = "sinavPusulasiUser";

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function MobileLayout({ children, currentPage = "dashboard" }: MobileLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(USER_KEY);
      
      if (!userStr) {
        // Kullanıcı giriş yapmamış, landing page'e yönlendir
        window.location.href = "/";
        return;
      }

      try {
        const user = JSON.parse(userStr);
        setUsername(user.username || "Kullanıcı");
        setEmail(user.email || "");
        setIsAdmin(user.email === "keremerdeen@gmail.com");
        setIsLoggedIn(true);
      } catch {
        // Geçersiz user data, landing page'e yönlendir
        localStorage.removeItem(USER_KEY);
        window.location.href = "/";
        return;
      }
      
      setIsLoading(false);
    }
  }, []);

  // Loading durumunda loading göster
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Giriş yapmamış kullanıcılar için boş div (yönlendirme yapılacak)
  if (!isLoggedIn) {
    return <div></div>;
  }

  const initial = username?.[0]?.toUpperCase() || "U";

  const menuItems = [
    { id: "dashboard", href: "#/dashboard", icon: HomeIcon, label: "Panelim" },
    { id: "sorucozme", href: "#/sorucozme", icon: PencilIcon, label: "Soru Çöz" },
    { id: "sohbet", href: "#/sohbet", icon: ChatBubbleLeftRightIcon, label: "Sohbet Odaları" },
    { id: "ai-asistan", href: "#/ai-asistan", icon: AcademicCapIcon, label: "Baykuş AI Asistan" },
    { id: "derslerim", href: "#/derslerim", icon: BookOpenIcon, label: "Derslerim" },
    { id: "verilerim", href: "#/verilerim", icon: ChartBarIcon, label: "Verilerim" },
    { id: "profil", href: "#/profil", icon: UserIcon, label: "Profilim" },
  ];

  if (isAdmin) {
    menuItems.push({ id: "admin", href: "#/admin", icon: AcademicCapIcon, label: "Admin Paneli" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobil Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo ve Başlık */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <MobileOwlIcon />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">
              Baykuş
            </span>
          </div>

          {/* Menü Butonu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 rounded-xl bg-sky-500 text-white shadow-lg hover:bg-sky-600 transition-all duration-200 active:scale-95"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobil Menü Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobil Sidebar */}
      <aside className={`fixed top-0 left-0 w-full h-full bg-white z-50 transition-all duration-300 ease-in-out transform ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center">
              <MobileOwlIcon />
            </div>
            <span className="font-extrabold text-3xl tracking-tight bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">
              Baykuş
            </span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <XMarkIcon className="w-8 h-8 text-gray-600" />
          </button>
        </div>

        {/* Mobil Menü */}
        <nav className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <a
                key={item.id}
                href={item.href}
                className={`mobile-nav-link flex items-center p-6 rounded-2xl transition-all duration-200 active:scale-95 ${
                  isActive 
                    ? 'bg-gradient-to-r from-sky-100 to-sky-200 border-2 border-sky-300 shadow-lg' 
                    : 'hover:bg-sky-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className={`w-10 h-10 mr-6 ${isActive ? 'text-sky-600' : 'text-sky-500'}`} />
                <span className={`font-semibold text-xl ${isActive ? 'text-sky-900' : 'text-gray-800'}`}>
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Mobil Kullanıcı Profili */}
        <div className="p-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-lg truncate">{username}</p>
                <p className="text-sky-100 text-base truncate">{email}</p>
              </div>
            </div>
            {isLoggedIn && (
              <div className="mt-4">
                <LogoutButton sidebarMode />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Ana İçerik */}
      <main className="pt-20 pb-20 px-4">
        {children}
      </main>

      {/* Mobil Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          {menuItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-sky-600 bg-sky-50' : 'text-gray-600 hover:text-sky-500'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            );
          })}
          
          {/* Çıkış Yap Butonu */}
          {isLoggedIn && (
            <button
              onClick={() => {
                localStorage.removeItem(USER_KEY);
                window.location.reload();
              }}
              className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 text-red-600 hover:text-red-700"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Çıkış</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
} 