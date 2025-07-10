"use client";

import React, { useState, useRef, useEffect } from "react";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userFeedback, setUserFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklanınca mobil menüyü kapat
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileMenuOpen]);

  // Feedback mesajını otomatik temizle
  useEffect(() => {
    if (userFeedback.type) {
      const timer = setTimeout(() => {
        setUserFeedback({ type: null, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userFeedback]);

  // Kullanılmayan importlar, state'ler ve fonksiyonlar silindi

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex flex-col justify-center items-center">
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🦉</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-sky-500 to-blue-600 text-transparent bg-clip-text">
              Baykuş
            </span>
          </div>
          {/* Giriş/Kayıt butonu burada olacak */}
        </div>
      </header>
      <section className="flex-1 flex flex-col justify-center items-center w-full px-4 py-8">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            Sınav Başarısına Giden Yolda
            <span className="block bg-gradient-to-r from-sky-500 to-blue-600 text-transparent bg-clip-text">
              Dijital Rehberin
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Kişiselleştirilmiş testler, topluluk desteği ve daha fazlası için hemen giriş yap veya kayıt ol.
          </p>
        </div>
      </section>
      <footer className="bg-gray-900 text-white px-4 py-8 w-full text-center">
        <span className="text-sm">&copy; {new Date().getFullYear()} Baykuş. Tüm hakları saklıdır.</span>
      </footer>
    </div>
  );
};

export default LandingPage; 