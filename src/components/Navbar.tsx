import React, { useState } from "react";

type NavbarProps = {
  onLogin: () => void;
  onRegister: () => void;
};

// Baykuş SVG ikonu (daha belirgin ve modern)
const OwlIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="22" rx="10" ry="7" fill="#0ea5e9"/>
    <ellipse cx="11.5" cy="14" rx="3.5" ry="4" fill="#fff"/>
    <ellipse cx="20.5" cy="14" rx="3.5" ry="4" fill="#fff"/>
    <circle cx="11.5" cy="14" r="1.2" fill="#0ea5e9"/>
    <circle cx="20.5" cy="14" r="1.2" fill="#0ea5e9"/>
    <ellipse cx="16" cy="18.5" rx="2.5" ry="1.2" fill="#e5e7eb"/>
    <path d="M8 10 Q16 2 24 10" stroke="#0ea5e9" strokeWidth="2" fill="none"/>
  </svg>
);

const Navbar: React.FC<NavbarProps> = ({ onLogin, onRegister }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="p-2 md:p-4">
      <nav className="container mx-auto max-w-7xl flex justify-between items-center p-2 md:p-4 rounded-xl glass-effect-modal">
        <a href="#" className="flex items-center space-x-2 md:space-x-3">
          <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white/20 rounded-full">
            <OwlIcon />
          </div>
          <span className="text-lg md:text-2xl font-bold text-white">Baykuş</span>
        </a>
        
        {/* Masaüstü Menü */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#catalogs" className="text-white/80 hover:text-white font-medium transition-colors">Dersler</a>
          <a href="#" className="text-white/80 hover:text-white font-medium transition-colors">Sınavlar</a>
          <a href="#" className="text-white/80 hover:text-white font-medium transition-colors">Hakkımızda</a>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <button className="auth-trigger-btn text-white font-semibold hover:text-gray-200 transition-colors" onClick={onLogin}>
            Giriş Yap
          </button>
          <button className="auth-trigger-btn bg-white text-sky-600 font-bold py-2 px-5 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105 shadow-lg" onClick={onRegister}>
            Kayıt Ol
          </button>
        </div>
        
        {/* Mobil Menü Butonu */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center bg-white/90 border border-gray-200 shadow-md rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
            aria-label="Menüyü aç/kapat"
            style={{boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Mobil Menü - Modern ve kompakt */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-start justify-end bg-black/30 backdrop-blur-sm">
          <div className="w-[85vw] max-w-xs mt-4 mr-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 animate-in slide-in-from-right-2 relative">
            {/* Üstte logo ve X aynı hizada */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 flex items-center justify-center bg-sky-100 rounded-full">
                  <OwlIcon />
                </div>
                <span className="text-lg font-bold text-sky-600">Baykuş</span>
              </div>
              <button onClick={()=>setIsMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full border border-gray-200 shadow-sm p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-1 mt-2">
              <a href="#catalogs" className="flex items-center gap-2 text-gray-700 hover:text-sky-600 px-3 py-2 rounded-lg hover:bg-sky-50 transition-colors text-base">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                Dersler
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-sky-600 px-3 py-2 rounded-lg hover:bg-sky-50 transition-colors text-base">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" /></svg>
                Sınavlar
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-sky-600 px-3 py-2 rounded-lg hover:bg-sky-50 transition-colors text-base">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6" /></svg>
                Hakkımızda
              </a>
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3 space-y-2">
              <button 
                className="w-full text-left text-gray-700 hover:text-sky-600 px-3 py-2 rounded-lg hover:bg-sky-50 transition-colors font-semibold text-base" 
                onClick={() => {
                  onLogin();
                  setIsMobileMenuOpen(false);
                }}
              >
                Giriş Yap
              </button>
              <button 
                className="w-full bg-sky-500 text-white font-bold py-2 rounded-lg hover:bg-sky-600 transition-colors shadow-lg text-base" 
                onClick={() => {
                  onRegister();
                  setIsMobileMenuOpen(false);
                }}
              >
                Kayıt Ol
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; 