"use client";
import React, { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import AuthModal from "../AuthModal";

export default function MobileLandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleClose = () => {
    setShowAuthModal(false);
    setShowRegister(false);
    setError("");
  };

  const handleSwitchForm = (register: boolean) => {
    setShowRegister(register);
    setError("");
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Giriş başarısız');
      }
      localStorage.setItem("sinavPusulasiUser", JSON.stringify(data.user));
      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Giriş başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Kayıt başarısız');
      }
      localStorage.setItem("sinavPusulasiUser", JSON.stringify(data.user));
      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Kayıt başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between items-center">
      {/* Üstte büyük Baykuş logosu ve başlık */}
      <header className="w-full flex flex-col items-center pt-10 pb-4">
        <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
          <ellipse cx="16" cy="22" rx="10" ry="7" fill="#2563eb"/>
          <ellipse cx="11.5" cy="14" rx="3.5" ry="4" fill="#fff"/>
          <ellipse cx="20.5" cy="14" rx="3.5" ry="4" fill="#fff"/>
          <circle cx="11.5" cy="14" r="1.2" fill="#2563eb"/>
          <circle cx="20.5" cy="14" r="1.2" fill="#2563eb"/>
          <ellipse cx="16" cy="18.5" rx="2.5" ry="1.2" fill="#e5e7eb"/>
          <path d="M8 10 Q16 2 24 10" stroke="#2563eb" strokeWidth="2" fill="none"/>
        </svg>
        <span className="font-bold text-2xl text-gray-800 tracking-tight">Baykuş</span>
      </header>

      {/* Hero ve Hakkımızda */}
      <main className="flex-1 w-full flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 leading-tight">Sınav Başarısına Giden Yolda <span className="block text-blue-600">Dijital Rehberin</span></h1>
          <p className="text-base text-gray-600 leading-relaxed">Kişiselleştirilmiş testler, topluluk desteği ve akıllı analizlerle başarıya ulaş. Hemen giriş yap veya kayıt ol!</p>
          <button
            onClick={handleAuthClick}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-blue-700 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <span>Giriş Yap / Kayıt Ol</span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
        {/* Hakkımızda */}
        <div className="mt-10 bg-gray-50 border border-gray-100 rounded-xl p-5 w-full max-w-md mx-auto text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Hakkımızda</h2>
          <p className="text-sm text-gray-600">Baykuş, öğrencilerin sınav başarısını artırmak için modern, sade ve kullanıcı dostu bir platform sunar. Akıllı testler, analizler ve topluluk desteğiyle her zaman yanınızdayız.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-gray-400 border-t border-gray-100 bg-white">
        &copy; {new Date().getFullYear()} Baykuş. Tüm hakları saklıdır.
      </footer>

      <AuthModal
        visible={showAuthModal}
        onClose={handleClose}
        showRegister={showRegister}
        onSwitchForm={handleSwitchForm}
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
} 