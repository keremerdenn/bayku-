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
      // Basit validation - gerçek uygulamada API çağrısı yapılır
      if (!email || !password) {
        throw new Error('Email ve şifre gereklidir');
      }
      
      if (password.length < 6) {
        throw new Error('Şifre en az 6 karakter olmalıdır');
      }
      
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gerçek uygulamada burada API'den kullanıcı doğrulaması yapılır
      const user = { username: email.split("@")[0], email };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
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
      
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = { username, email };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
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
    <div id="landing-page-container" className="min-h-screen">
      <AuthModal
        visible={modalOpen}
        onClose={closeModal}
        showRegister={showRegister}
        onSwitchForm={switchForm}
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={isLoading}
      />
      
      {/* Feedback Toast */}
      {userFeedback.type && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          userFeedback.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {userFeedback.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{userFeedback.message}</span>
          </div>
        </div>
      )}

      {/* Hero Section with Enhanced Background */}
      <div className="relative w-full overflow-x-hidden min-h-screen">
        {/* Enhanced Background with Multiple Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-sky-500 to-blue-600"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative z-10">
          {/* Enhanced Header with Better Separation */}
          <header className="relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md border-b border-white/20"></div>
            <nav className="relative container mx-auto max-w-7xl flex justify-between items-center p-6">
              <a href="#" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl group-hover:bg-white/30 transition-all duration-300 shadow-lg">
                  {/* Enhanced Baykuş SVG ikonu */}
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="16" cy="22" rx="10" ry="7" fill="#ffffff"/>
                    <ellipse cx="11.5" cy="14" rx="3.5" ry="4" fill="#0ea5e9"/>
                    <ellipse cx="20.5" cy="14" rx="3.5" ry="4" fill="#0ea5e9"/>
                    <circle cx="11.5" cy="14" r="1.2" fill="#ffffff"/>
                    <circle cx="20.5" cy="14" r="1.2" fill="#ffffff"/>
                    <ellipse cx="16" cy="18.5" rx="2.5" ry="1.2" fill="#e5e7eb"/>
                    <path d="M8 10 Q16 2 24 10" stroke="#ffffff" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <span className="text-3xl font-bold text-white group-hover:text-sky-200 transition-colors duration-300 drop-shadow-lg">Baykuş</span>
              </a>
              
              {/* Enhanced Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-white/90 hover:text-white font-medium transition-colors duration-200">Özellikler</a>
                <a href="#pricing" className="text-white/90 hover:text-white font-medium transition-colors duration-200">Fiyatlandırma</a>
                <a href="#contact" className="text-white/90 hover:text-white font-medium transition-colors duration-200">İletişim</a>
                <button 
                  onClick={() => openModal(false)}
                  className="bg-white/20 text-white font-semibold px-6 py-2 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
                >
                  Giriş Yap
                </button>
              </div>
              
              {/* Enhanced Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </nav>
            
            {/* Enhanced Mobile Menu */}
            {mobileMenuOpen && (
              <div 
                ref={mobileMenuRef}
                className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg"
              >
                <div className="container mx-auto px-6 py-4 space-y-4">
                  <a href="#features" className="block text-gray-800 hover:text-sky-600 font-medium transition-colors duration-200">Özellikler</a>
                  <a href="#pricing" className="block text-gray-800 hover:text-sky-600 font-medium transition-colors duration-200">Fiyatlandırma</a>
                  <a href="#contact" className="block text-gray-800 hover:text-sky-600 font-medium transition-colors duration-200">İletişim</a>
                  <div className="pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => openModal(false)}
                      className="w-full bg-sky-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-sky-600 transition-all duration-200"
                    >
                      Giriş Yap
                    </button>
                  </div>
                </div>
              </div>
            )}
          </header>
          
          {/* Enhanced Hero Section */}
          <main className="container mx-auto max-w-5xl text-center py-32 md:py-40 px-6">
            <h1 className="text-display font-extrabold text-white leading-tight mb-8 drop-shadow-2xl">
              Sınav Başarısına Giden Yolda <span className="text-sky-200 bg-gradient-to-r from-sky-200 to-blue-200 bg-clip-text text-transparent">En Güçlü</span> Rehberin
            </h1>
            <p className="mt-8 text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed font-medium">
              Binlerce güncel ÖSYM sorusu, kişiselleştirilmiş testler ve takıldığın her soruda topluluk desteği bir tık uzağında. Potansiyelini keşfetmeye hazır mısın?
            </p>
            <div className="mt-12">
              <button 
                className="landing-btn-primary py-4 px-8 text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl" 
                onClick={() => openModal(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Yükleniyor...</span>
                  </div>
                ) : (
                  'Ücretsiz Kayıt Ol'
                )}
              </button>
            </div>
          </main>
        </div>
      </div>
      
      {/* Enhanced Catalog Section */}
      <section id="catalogs" className="py-20 sm:py-28 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-heading font-bold text-gray-900 mb-6">Sınav Kategorilerini Keşfet</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">TYT, AYT ve daha fazlası için derslere ve konulara ayrılmış binlerce soru seni bekliyor.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Enhanced Catalog Cards */}
            <a href="#" className="landing-card block p-8 group" onClick={() => openModal(false)}>
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-sky-100 text-sky-600 group-hover:bg-sky-200 transition-all duration-300 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h3m-3-10h.01M9 10h.01M12 10h.01M15 10h.01M9 13h.01M12 13h.01M15 13h.01M4 7h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors duration-300 mb-4">TYT Matematik</h3>
              <p className="text-gray-600 leading-relaxed">Temel Kavramlar, Sayılar, Problemler, Geometri ve daha fazlası.</p>
            </a>
            <a href="#" className="landing-card block p-8 group" onClick={() => openModal(false)}>
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-sky-100 text-sky-600 group-hover:bg-sky-200 transition-all duration-300 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors duration-300 mb-4">AYT Fizik</h3>
              <p className="text-gray-600 leading-relaxed">Vektörler, Mekanik, Elektrik, Manyetizma, Modern Fizik.</p>
            </a>
            <a href="#" className="landing-card block p-8 group" onClick={() => openModal(false)}>
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-sky-100 text-sky-600 group-hover:bg-sky-200 transition-all duration-300 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors duration-300 mb-4">TYT Türkçe</h3>
              <p className="text-gray-600 leading-relaxed">Paragraf, Dil Bilgisi, Anlam Bilgisi, Yazım Kuralları.</p>
            </a>
            <a href="#" className="landing-card block p-8 group" onClick={() => openModal(false)}>
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-sky-100 text-sky-600 group-hover:bg-sky-200 transition-all duration-300 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.354a1.76 1.76 0 013.417-.592V5.882a1.76 1.76 0 013.417.592l2.147 6.354a1.76 1.76 0 01-3.417.592z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors duration-300 mb-4">AYT Biyoloji</h3>
              <p className="text-gray-600 leading-relaxed">Hücre, Kalıtım, Sistemler, Ekoloji ve Bitki Biyolojisi.</p>
            </a>
          </div>
        </div>
      </section>
      
      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Enhanced Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-sky-500 rounded-xl shadow-lg">
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="16" cy="22" rx="10" ry="7" fill="#ffffff"/>
                    <ellipse cx="11.5" cy="14" rx="3.5" ry="4" fill="#0ea5e9"/>
                    <ellipse cx="20.5" cy="14" rx="3.5" ry="4" fill="#0ea5e9"/>
                    <circle cx="11.5" cy="14" r="1.2" fill="#ffffff"/>
                    <circle cx="20.5" cy="14" r="1.2" fill="#ffffff"/>
                    <ellipse cx="16" cy="18.5" rx="2.5" ry="1.2" fill="#e5e7eb"/>
                    <path d="M8 10 Q16 2 24 10" stroke="#ffffff" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <span className="text-3xl font-bold">Baykuş</span>
              </div>
              <p className="text-gray-300 mb-8 max-w-md leading-relaxed text-lg">
                Sınav başarısına giden yolda en güçlü rehberiniz. Binlerce güncel soru, kişiselleştirilmiş testler ve topluluk desteği.
              </p>
              {/* Enhanced Social Media */}
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-sky-500 transition-all duration-300 group shadow-lg">
                  <svg className="w-6 h-6 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-sky-500 transition-all duration-300 group shadow-lg">
                  <svg className="w-6 h-6 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-sky-500 transition-all duration-300 group shadow-lg">
                  <svg className="w-6 h-6 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-sky-500 transition-all duration-300 group shadow-lg">
                  <svg className="w-6 h-6 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Enhanced Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Hızlı Linkler</h3>
              <ul className="space-y-3">
                <li><a href="#catalogs" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium">Dersler</a></li>
                <li><a href="#" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium">Sınavlar</a></li>
                <li><a href="#" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium">Hakkımızda</a></li>
                <li><a href="#" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium">İletişim</a></li>
              </ul>
            </div>
            
            {/* Enhanced Contact */}
            <div>
              <h3 className="text-xl font-semibold mb-6">İletişim</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300 font-medium">info@baykus.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-300 font-medium">+90 (212) 555-0123</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-300 font-medium">İstanbul, Türkiye</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Bottom Line */}
          <div className="border-t border-gray-800 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm font-medium">
                © 2024 Baykuş. Tüm hakları saklıdır.
              </p>
              <div className="flex space-x-8 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-sky-400 text-sm font-medium transition-colors duration-200">Gizlilik Politikası</a>
                <a href="#" className="text-gray-400 hover:text-sky-400 text-sm font-medium transition-colors duration-200">Kullanım Şartları</a>
                <a href="#" className="text-gray-400 hover:text-sky-400 text-sm font-medium transition-colors duration-200">Çerez Politikası</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 