"use client";
import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  UserIcon
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
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) {
        window.location.href = "/";
        return;
      }
      try {
        const user = JSON.parse(userStr);
        setUsername(user.username || "Kullanıcı");
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
      {/* Sade Üst Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 h-12 flex items-center justify-center">
        <span className="font-semibold text-base text-gray-800 tracking-tight">Baykuş</span>
      </header>
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