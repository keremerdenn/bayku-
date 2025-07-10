"use client";

import React, { useState, useRef, useEffect } from "react";
import AuthModal from "./AuthModal";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userFeedback, setUserFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Auth modal fonksiyonları
  const handleAuthClick = (register = false) => {
    setShowRegister(register);
    setShowAuthModal(true);
    setError("");
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleAuthClick(false)}
              className="bg-sky-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-sky-600 transition-all duration-200"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => handleAuthClick(true)}
              className="bg-white text-sky-600 border border-sky-500 px-4 py-2 rounded-xl font-semibold hover:bg-sky-50 transition-all duration-200"
            >
              Kayıt Ol
            </button>
          </div>
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
};

export default LandingPage; 