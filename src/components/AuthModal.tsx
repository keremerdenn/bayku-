"use client";

import React, { useRef, useEffect } from "react";

type AuthModalProps = {
  visible: boolean;
  onClose: () => void;
  showRegister: boolean;
  onSwitchForm: (register: boolean) => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (username: string, email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
};

const AuthModal: React.FC<AuthModalProps> = ({ 
  visible, 
  onClose, 
  showRegister, 
  onSwitchForm, 
  onLogin, 
  onRegister,
  isLoading = false,
  error = ""
}) => {
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);
  const registerUsernameRef = useRef<HTMLInputElement>(null);
  const registerEmailRef = useRef<HTMLInputElement>(null);
  const registerPasswordRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [registerUsernameError, setRegisterUsernameError] = React.useState("");

  // Mobilde klavye açıldığında modal'ın yukarı kaymasını engelle
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      
      // Mobilde viewport height'ı sabitle
      const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setViewportHeight();
      window.addEventListener('resize', setViewportHeight);
      
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('resize', setViewportHeight);
      };
    }
  }, [visible]);

  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div 
        ref={modalRef}
        className="w-full max-w-md rounded-2xl p-4 sm:p-6 md:p-8 relative shadow-2xl border border-white/20 auth-modal-content my-auto"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          boxShadow: '0 8px 40px 0 rgba(14, 165, 233, 0.18)',
          minHeight: 'fit-content',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Kapat Butonu - Mobil için optimize */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 text-gray-500 hover:text-sky-500 transition-colors duration-200 disabled:opacity-50 bg-white/70 rounded-full p-1.5 sm:p-2 md:p-1 shadow-md modal-close-btn z-10"
          disabled={isLoading}
          aria-label="Modal'ı kapat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        {/* Giriş Formu */}
        {!showRegister && (
          <>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-3 sm:mb-4 md:mb-6 text-center pt-2">Giriş Yap</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
            <form onSubmit={async e => {
              e.preventDefault();
              if (loginEmailRef.current && !isLoading) {
                await onLogin(loginEmailRef.current.value, loginPasswordRef.current?.value || '');
              }
            }} className="auth-form">
              <div className="mb-3 sm:mb-4">
                <label className="block text-slate-700 text-sm font-semibold mb-1.5 sm:mb-2 form-label">E-posta Adresi</label>
                <input 
                  ref={loginEmailRef} 
                  type="email" 
                  required 
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-3 rounded-lg bg-white text-slate-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition disabled:opacity-50 disabled:cursor-not-allowed form-input auth-input text-sm sm:text-base" 
                  placeholder="ornek@email.com"
                />
              </div>
              <div className="mb-4 sm:mb-6">
                <label className="block text-slate-700 text-sm font-semibold mb-1.5 sm:mb-2 form-label">Şifre</label>
                <input 
                  ref={loginPasswordRef} 
                  type="password" 
                  required 
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-3 rounded-lg bg-white text-slate-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition disabled:opacity-50 disabled:cursor-not-allowed form-input auth-input text-sm sm:text-base" 
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-sky-500 text-white font-bold py-2.5 sm:py-3 md:py-3 px-4 rounded-lg hover:bg-sky-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none form-button auth-button text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs sm:text-sm md:text-base">Giriş Yapılıyor...</span>
                  </div>
                ) : (
                  'Giriş Yap'
                )}
              </button>
              <p className="text-center text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4 md:mt-6">
                Hesabın yok mu? <button type="button" onClick={() => onSwitchForm(true)} className="font-semibold text-sky-500 hover:underline transition-colors duration-200">Kayıt Ol</button>
              </p>
            </form>
          </>
        )}
        
        {/* Kayıt Formu */}
        {showRegister && (
          <>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-3 sm:mb-4 md:mb-6 text-center pt-2">Hesap Oluştur</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
            <form onSubmit={async e => {
              e.preventDefault();
              if (registerUsernameRef.current && registerEmailRef.current && !isLoading) {
                const val = registerUsernameRef.current.value;
                if (val.length > 20 || !/^[a-zA-Z0-9ğüşöçıİĞÜŞÖÇ_]+$/.test(val)) {
                  setRegisterUsernameError("Kullanıcı adı geçersiz.");
                  return;
                }
                await onRegister(val, registerEmailRef.current.value, registerPasswordRef.current?.value || '');
              }
            }} className="auth-form">
              <div className="mb-3 sm:mb-4">
                <label className="block text-slate-700 text-sm font-semibold mb-1.5 sm:mb-2 form-label">Kullanıcı Adı</label>
                <input 
                  ref={registerUsernameRef} 
                  type="text" 
                  required 
                  minLength={3} 
                  maxLength={20}
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-3 rounded-lg bg-white text-slate-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition disabled:opacity-50 disabled:cursor-not-allowed form-input auth-input text-sm sm:text-base" 
                  placeholder="Kullanıcı adınız"
                  onChange={e => {
                    const val = e.target.value;
                    if (val.length > 20) {
                      setRegisterUsernameError("Kullanıcı adı 20 karakterden uzun olamaz.");
                    } else if (!/^[a-zA-Z0-9ğüşöçıİĞÜŞÖÇ_]+$/.test(val)) {
                      setRegisterUsernameError("Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir.");
                    } else {
                      setRegisterUsernameError("");
                    }
                  }}
                />
                {registerUsernameError && <div className="text-red-500 text-xs mt-1">{registerUsernameError}</div>}
              </div>
              <div className="mb-3 sm:mb-4">
                <label className="block text-slate-700 text-sm font-semibold mb-1.5 sm:mb-2 form-label">E-posta Adresi</label>
                <input 
                  ref={registerEmailRef} 
                  type="email" 
                  required 
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-3 rounded-lg bg-white text-slate-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition disabled:opacity-50 disabled:cursor-not-allowed form-input auth-input text-sm sm:text-base" 
                  placeholder="ornek@email.com"
                />
              </div>
              <div className="mb-4 sm:mb-6">
                <label className="block text-slate-700 text-sm font-semibold mb-1.5 sm:mb-2 form-label">Şifre</label>
                <input 
                  ref={registerPasswordRef} 
                  type="password" 
                  required 
                  minLength={6} 
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-3 rounded-lg bg-white text-slate-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition disabled:opacity-50 disabled:cursor-not-allowed form-input auth-input text-sm sm:text-base" 
                  placeholder="En az 6 karakter"
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-sky-500 text-white font-bold py-2.5 sm:py-3 md:py-3 px-4 rounded-lg hover:bg-sky-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none form-button auth-button text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs sm:text-sm md:text-base">Kayıt Oluşturuluyor...</span>
                  </div>
                ) : (
                  'Kayıt Ol'
                )}
              </button>
              <p className="text-center text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4 md:mt-6">
                Zaten bir hesabın var mı? <button type="button" onClick={() => onSwitchForm(false)} className="font-semibold text-sky-500 hover:underline transition-colors duration-200">Giriş Yap</button>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal; 