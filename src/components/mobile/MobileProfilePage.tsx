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

  // SVG Pattern for background
  const svgPattern = (
    <svg className="absolute inset-0 w-full h-full" style={{zIndex:0}} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="6" fill="#e0e7ff" fillOpacity="0.25" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern-circles)" />
    </svg>
  );

  if (!user) {
    return (
      <div className="relative min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white flex items-center justify-center overflow-x-hidden">
        {svgPattern}
        <MobileLayout currentPage="profil">
          <div className="flex items-center justify-center py-12 relative z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          </div>
        </MobileLayout>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white overflow-x-hidden">
      {svgPattern}
      <MobileLayout currentPage="profil">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] p-4">
          <div className="bg-gradient-to-br from-white via-fuchsia-50 to-sky-50 rounded-3xl p-8 shadow-2xl border-2 border-sky-100 w-full max-w-md flex flex-col items-center animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-400 flex items-center justify-center mb-4 shadow-lg animate-pop-in">
              <span className="text-4xl font-extrabold text-white drop-shadow-lg">{user.username ? user.username[0]?.toUpperCase() : user.email[0]?.toUpperCase()}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-sky-700 mb-1 tracking-tight drop-shadow-lg animate-fade-in">{user.username || "Kullanıcı"}</h2>
            <span className="inline-block mb-2 px-4 py-1 rounded-xl bg-gradient-to-r from-fuchsia-400 to-sky-400 text-white font-bold text-base shadow pointer-events-none animate-bounce">{user.email}</span>
            {user.bio && <p className="text-sky-700 mt-2 text-center animate-fade-in">{user.bio}</p>}
            <button className="mt-6 bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow hover:from-fuchsia-500 hover:to-sky-500 active:scale-97 transition-all duration-200 animate-fade-in">Profili Düzenle</button>
          </div>
        </div>
      </MobileLayout>
      {/* Animasyonlar için ek CSS */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in {
          animation: pop-in 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
} 