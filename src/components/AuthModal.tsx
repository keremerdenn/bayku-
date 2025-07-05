"use client";

import React, { useRef } from "react";

type AuthModalProps = {
  visible: boolean;
  onClose: () => void;
  showRegister: boolean;
  onSwitchForm: (register: boolean) => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (username: string, email: string, password: string) => Promise<void>;
  isLoading?: boolean;
};

const AuthModal: React.FC<AuthModalProps> = ({ 
  visible, 
  onClose, 
  showRegister, 
  onSwitchForm, 
  onLogin, 
  onRegister,
  isLoading = false
}) => {
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);
  const registerUsernameRef = useRef<HTMLInputElement>(null);
  const registerEmailRef = useRef<HTMLInputElement>(null);
  const registerPasswordRef = useRef<HTMLInputElement>(null);

  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl p-8 relative shadow-2xl border border-white/20"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          boxShadow: '0 8px 40px 0 rgba(14, 165, 233, 0.18)'
        }}
      >
        {/* Kapat Butonu */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-sky-500 transition-colors duration-200 disabled:opacity-50 bg-white/70 rounded-full p-1 shadow-md"
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        {/* Giriş Formu */}
        {!showRegister && (
          <>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Giriş Yap</h2>
            <form onSubmit={async e => {
              e.preventDefault();
              if (loginEmailRef.current && !isLoading) {
                await onLogin(loginEmailRef.current.value, loginPasswordRef.current?.value || '');
              }
            }}>
              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-semibold mb-2">E-posta Adresi</label>
                <input 
                  ref={loginEmailRef} 
                  type="email" 
                  required 
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-white text-slate-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition disabled:opacity-50 disabled:cursor-not-allowed" 
                  placeholder="ornek@email.com"
                />
              </div>
              <div className="mb-6">
                <label className="block text-slate-700 text-sm font-semibold mb-2">Şifre</label>
                <input 
                  ref={loginPasswordRef} 
                  type="password" 
                  required 
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-white text-slate-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition disabled:opacity-50 disabled:cursor-not-allowed" 
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Giriş Yapılıyor...</span>
                  </div>
                ) : (
                  'Giriş Yap'
                )}
              </button>
              <p className="text-center text-gray-500 text-sm mt-6">
                Hesabın yok mu? <button type="button" onClick={() => onSwitchForm(true)} className="font-semibold text-sky-500 hover:underline transition-colors duration-200">Kayıt Ol</button>
              </p>
            </form>
          </>
        )}
        
        {/* Kayıt Formu */}
        {showRegister && (
          <>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Hesap Oluştur</h2>
            <form onSubmit={async e => {
              e.preventDefault();
              if (registerUsernameRef.current && registerEmailRef.current && !isLoading) {
                await onRegister(registerUsernameRef.current.value, registerEmailRef.current.value, registerPasswordRef.current?.value || '');
              }
            }}>
              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-semibold mb-2">Kullanıcı Adı</label>
                <input 
                  ref={registerUsernameRef} 
                  type="text" 
                  required 
                  minLength={3} 
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-white text-slate-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition disabled:opacity-50 disabled:cursor-not-allowed" 
                  placeholder="Kullanıcı adınız"
                />
              </div>
              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-semibold mb-2">E-posta Adresi</label>
                <input 
                  ref={registerEmailRef} 
                  type="email" 
                  required 
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-white text-slate-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition disabled:opacity-50 disabled:cursor-not-allowed" 
                  placeholder="ornek@email.com"
                />
              </div>
              <div className="mb-6">
                <label className="block text-slate-700 text-sm font-semibold mb-2">Şifre</label>
                <input 
                  ref={registerPasswordRef} 
                  type="password" 
                  required 
                  minLength={6} 
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-white text-slate-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition disabled:opacity-50 disabled:cursor-not-allowed" 
                  placeholder="En az 6 karakter"
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Kayıt Oluşturuluyor...</span>
                  </div>
                ) : (
                  'Kayıt Ol'
                )}
              </button>
              <p className="text-center text-gray-500 text-sm mt-6">
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