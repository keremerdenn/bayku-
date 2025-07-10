"use client";

import React, { useState, useRef, useEffect } from "react";
import AuthModal from "./AuthModal";

const USER_KEY = "sinavPusulasiUser";

const LandingPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userFeedback, setUserFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const openModal = (register: boolean) => {
    setShowRegister(register);
    setModalOpen(true);
    setMobileMenuOpen(false); // Menü açıksa kapat
  };
  const closeModal = () => setModalOpen(false);
  const switchForm = (register: boolean) => setShowRegister(register);

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

  // Giriş ve kayıt işlemleri
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setUserFeedback({ type: null, message: '' });
    
    try {
      // Validation
      if (!email || !password) {
        throw new Error('Email ve şifre gereklidir');
      }
      
      if (password.length < 6) {
        throw new Error('Şifre en az 6 karakter olmalıdır');
      }
      
      // API çağrısı
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Giriş yapılırken bir hata oluştu');
      }
      
      // Giriş başarılı
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } catch (error) {
        console.error('localStorage yazma hatası:', error);
        throw new Error('Giriş bilgileri kaydedilemiyor. Lütfen tekrar deneyin.');
      }
      
      setUserFeedback({ type: 'success', message: 'Başarıyla giriş yapıldı!' });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setUserFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setUserFeedback({ type: null, message: '' });
    
    try {
      // Validation
      if (!username || !email || !password) {
        throw new Error('Tüm alanlar gereklidir');
      }
      
      if (username.length < 3) {
        throw new Error('Kullanıcı adı en az 3 karakter olmalıdır');
      }
      
      if (password.length < 6) {
        throw new Error('Şifre en az 6 karakter olmalıdır');
      }
      
      // Email format kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Geçerli bir email adresi giriniz');
      }
      
      // API çağrısı
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Kayıt olurken bir hata oluştu');
      }
      
      // Kayıt başarılı - otomatik giriş yap
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } catch (error) {
        console.error('localStorage yazma hatası:', error);
        throw new Error('Kullanıcı bilgileri kaydedilemiyor. Lütfen tekrar deneyin.');
      }
      
      setUserFeedback({ type: 'success', message: 'Hesabınız başarıyla oluşturuldu!' });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setUserFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.' });
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