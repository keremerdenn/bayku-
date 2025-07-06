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
    <header className="p-4">
      <nav className="container mx-auto max-w-7xl flex justify-between items-center p-4 rounded-xl glass-effect-modal">
        <a href="#" className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg">
            <OwlIcon />
          </div>
          <span className="text-xl md:text-2xl font-bold text-white">Baykuş</span>
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
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Menüyü aç/kapat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Mobil Menü - Renk sorunu düzeltildi */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-xl bg-white/95 backdrop-blur-lg border border-white/30 shadow-2xl">
          <div className="space-y-4">
            <a href="#catalogs" className="block text-gray-800 hover:text-sky-600 py-3 px-4 rounded-lg hover:bg-sky-50 transition-colors font-medium">
              Dersler
            </a>
            <a href="#" className="block text-gray-800 hover:text-sky-600 py-3 px-4 rounded-lg hover:bg-sky-50 transition-colors font-medium">
              Sınavlar
            </a>
            <a href="#" className="block text-gray-800 hover:text-sky-600 py-3 px-4 rounded-lg hover:bg-sky-50 transition-colors font-medium">
              Hakkımızda
            </a>
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <button 
                className="w-full text-left text-gray-800 hover:text-sky-600 py-3 px-4 rounded-lg hover:bg-sky-50 transition-colors font-semibold" 
                onClick={() => {
                  onLogin();
                  setIsMobileMenuOpen(false);
                }}
              >
                Giriş Yap
              </button>
              <button 
                className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 transition-colors shadow-lg" 
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