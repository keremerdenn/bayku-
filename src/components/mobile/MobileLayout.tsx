"use client";
import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const USER_KEY = "sinavPusulasiUser";

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const tabItems = [
  { id: "dashboard", href: "#/dashboard", icon: HomeIcon, label: "Ana Sayfa" },
  { id: "sorucozme", href: "#/sorucozme", icon: PencilIcon, label: "Soru Çöz" },
  { id: "sohbet", href: "#/sohbet", icon: ChatBubbleLeftRightIcon, label: "Sohbet" },
  { id: "derslerim", href: "#/derslerim", icon: BookOpenIcon, label: "Derslerim" },
  { id: "profil", href: "#/profil", icon: UserIcon, label: "Profil" },
];

export default function MobileLayout({ children, currentPage = "dashboard" }: MobileLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) {
        window.location.href = "/";
        return;
      }
      try {
        JSON.parse(userStr);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem(USER_KEY);
        window.location.href = "/";
        return;
      }
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <div></div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* iOS tarzı Üst Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 h-12 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Baykuş Logo */}
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="16" cy="22" rx="10" ry="7" fill="#2563eb"/>
            <ellipse cx="11.5" cy="14" rx="3.5" ry="4" fill="#fff"/>
            <ellipse cx="20.5" cy="14" rx="3.5" ry="4" fill="#fff"/>
            <circle cx="11.5" cy="14" r="1.2" fill="#2563eb"/>
            <circle cx="20.5" cy="14" r="1.2" fill="#2563eb"/>
            <ellipse cx="16" cy="18.5" rx="2.5" ry="1.2" fill="#e5e7eb"/>
            <path d="M8 10 Q16 2 24 10" stroke="#2563eb" strokeWidth="2" fill="none"/>
          </svg>
          <span className="font-semibold text-base text-gray-800 tracking-tight">Baykuş</span>
        </div>
        {/* Menü Butonu */}
        <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded hover:bg-gray-100 transition">
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
      </header>
      {/* Menü Modalı */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="bg-black/30 flex-1" onClick={() => setIsMenuOpen(false)} />
          <aside className="w-64 max-w-[80vw] bg-white h-full shadow-lg border-l border-gray-100 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="16" cy="22" rx="10" ry="7" fill="#2563eb"/>
                  <ellipse cx="11.5" cy="14" rx="3.5" ry="4" fill="#fff"/>
                  <ellipse cx="20.5" cy="14" rx="3.5" ry="4" fill="#fff"/>
                  <circle cx="11.5" cy="14" r="1.2" fill="#2563eb"/>
                  <circle cx="20.5" cy="14" r="1.2" fill="#2563eb"/>
                  <ellipse cx="16" cy="18.5" rx="2.5" ry="1.2" fill="#e5e7eb"/>
                  <path d="M8 10 Q16 2 24 10" stroke="#2563eb" strokeWidth="2" fill="none"/>
                </svg>
                <span className="font-semibold text-base text-gray-800 tracking-tight">Baykuş</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded hover:bg-gray-100 transition">
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col py-2">
              {tabItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-3 px-5 py-3 text-base rounded transition-colors duration-150 ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
      {/* İçerik */}
      <main className="flex-1 pt-12 pb-16 bg-white min-h-[calc(100vh-56px)]">{children}</main>
      {/* Alt Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 h-14 flex items-center justify-around">
        {tabItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full text-xs transition-colors duration-150 ${isActive ? "text-blue-600" : "text-gray-400 hover:text-blue-500"}`}
            >
              <Icon className={`w-6 h-6 mb-0.5 ${isActive ? "" : ""}`} />
              <span className="font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
} 