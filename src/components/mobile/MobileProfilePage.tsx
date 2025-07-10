"use client";
import React, { useState, useEffect } from "react";
import MobileLayout from "./MobileLayout";

const USER_KEY = "sinavPusulasiUser";

interface User {
  email: string;
  username?: string;
  bio?: string;
}

export default function MobileProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
          const userData: User = JSON.parse(userStr);
          setUser(userData);
        }
      } catch {
        console.error("Kullanıcı bilgisi alınamadı");
      }
    }
  }, []);

  if (!user) {
    return (
      <MobileLayout currentPage="profil">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout currentPage="profil">
      <div className="max-w-md mx-auto px-4 py-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm w-full max-w-md flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3">
            <span className="text-3xl font-bold text-blue-600">{user.username ? user.username[0]?.toUpperCase() : user.email[0]?.toUpperCase()}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">{user.username || "Kullanıcı"}</h2>
          <span className="inline-block mb-2 px-3 py-1 rounded bg-gray-100 text-gray-500 font-medium text-xs">{user.email}</span>
          {user.bio && <p className="text-gray-700 mt-2 text-center text-sm">{user.bio}</p>}
          <button className="mt-6 bg-blue-500 text-white px-5 py-2 rounded font-medium text-sm hover:bg-blue-600 active:scale-95 transition">Profili Düzenle</button>
        </div>
      </div>
    </MobileLayout>
  );
} 