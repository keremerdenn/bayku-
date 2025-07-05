"use client";
import { useState, useEffect } from "react";
import React from "react";
// Heroicons yeni sürüm importları
import {
  HomeIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  WalletIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

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
    <aside className="glass-sidebar text-sky-900 w-64 h-screen fixed top-0 left-0 flex flex-col z-40 transition-transform duration-300 ease-in-out shadow-2xl">
      {/* Logo ve başlık */}
      <div className="flex items-center gap-3 px-6 pt-8 pb-6">
        <OwlIcon />
        <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">Baykuş</span>
      </div>
      {/* Menü Linkleri */}
      <nav className="flex-1 px-4 pb-2 space-y-1">
        <a href="#/dashboard" className="nav-link flex items-center p-3 rounded-xl sidebar-link-active shadow-md bg-gradient-to-r from-sky-100 to-sky-200 border border-sky-300">
          <HomeIcon className="w-5 h-5 mr-2 text-sky-600" />
          <span className="font-semibold">Panelim</span>
        </a>
        <a href="#/sorucozme" className="nav-link flex items-center p-3 rounded-xl hover:bg-sky-50 transition">
          <PencilIcon className="w-5 h-5 mr-2 text-sky-500" />
          <span className="font-medium">Soru Çöz</span>
        </a>
        <a href="#/sohbet" className="nav-link flex items-center p-3 rounded-xl hover:bg-sky-50 transition">
          <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2 text-sky-500" />
          <span className="font-medium">Sohbet</span>
        </a>
        <a href="#/sorutartismasi" className="nav-link flex items-center p-3 rounded-xl hover:bg-sky-50 transition">
          <UserGroupIcon className="w-5 h-5 mr-2 text-sky-500" />
          <span className="font-medium">Soru Tartışması</span>
        </a>
        <a href="#/derslerim" className="nav-link flex items-center p-3 rounded-xl hover:bg-sky-50 transition">
          <BookOpenIcon className="w-5 h-5 mr-2 text-sky-500" />
          <span className="font-medium">Derslerim</span>
        </a>
        <a href="#/denemelerim" className="nav-link flex items-center p-3 rounded-xl hover:bg-sky-50 transition">
          <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-sky-500" />
          <span className="font-medium">Denemelerim</span>
        </a>
        <a href="#/sorucuzdanim" className="nav-link flex items-center p-3 rounded-xl hover:bg-sky-50 transition">
          <WalletIcon className="w-5 h-5 mr-2 text-sky-500" />
          <span className="font-medium">Soru Cüzdanım</span>
        </a>
        <a href="#/verilerim" className="nav-link flex items-center p-3 rounded-xl hover:bg-sky-50 transition">
          <ChartBarIcon className="w-5 h-5 mr-2 text-sky-500" />
          <span className="font-medium">Verilerim</span>
        </a>
      </nav>
      {/* Profil Alanı */}
      <div className="mt-auto w-full px-6 pb-12 pt-2 flex flex-col gap-4">
        <div className="flex items-center gap-3 bg-white/80 rounded-2xl p-4 shadow-md">
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold rounded-full text-xl shadow">
            {initial}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sky-900 text-base leading-tight">{username}</span>
            <span className="text-xs text-sky-700 opacity-80">{email}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
