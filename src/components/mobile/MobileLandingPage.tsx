"use client";
import React from "react";
import { ArrowRightIcon, StarIcon, UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

export default function MobileLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🦉</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-sky-500 to-blue-600 text-transparent bg-clip-text">
              Baykuş
            </span>
          </div>
          <a
            href="#/auth"
            className="bg-sky-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-sky-600 transition-all duration-200"
          >
            Giriş Yap
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-8">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            Sınav Başarısına Giden Yolda
            <span className="block bg-gradient-to-r from-sky-500 to-blue-600 text-transparent bg-clip-text">
              En Güçlü Rehberin
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Binlerce güncel ÖSYM sorusu, kişiselleştirilmiş testler ve takıldığın her soruda topluluk desteği bir tık uzağında.
          </p>
          
          <div className="flex flex-col space-y-3">
            <a
              href="#/auth"
              className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Hemen Başla</span>
              <ArrowRightIcon className="w-5 h-5" />
            </a>
            
            <a
              href="#/demo"
              className="border-2 border-sky-500 text-sky-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-sky-50 transition-all duration-200"
            >
              Demo İncele
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Neden Baykuş?</h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Güncel Sorular</h3>
                <p className="text-gray-600">Binlerce ÖSYM sorusu ile güncel müfredata uygun çalış</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Topluluk Desteği</h3>
                <p className="text-gray-600">Arkadaşlarınla sohbet et, soruları tartış</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <StarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Kişiselleştirilmiş</h3>
                <p className="text-gray-600">AI destekli öğrenme ile kendi hızında ilerle</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-8">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">Rakamlarla Baykuş</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-600 mb-2">10K+</div>
              <div className="text-gray-600 text-sm">Aktif Öğrenci</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-600 mb-2">50K+</div>
              <div className="text-gray-600 text-sm">Çözülen Soru</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-600 mb-2">95%</div>
              <div className="text-gray-600 text-sm">Memnuniyet</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-600 mb-2">24/7</div>
              <div className="text-gray-600 text-sm">Destek</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-8">
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Başarıya Giden Yol Burada Başlıyor</h2>
          <p className="text-sky-100 mb-6">
            Hemen ücretsiz hesap oluştur ve sınav başarına giden yolda ilk adımını at!
          </p>
          <a
            href="#/auth"
            className="bg-white text-sky-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <span>Ücretsiz Başla</span>
            <ArrowRightIcon className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🦉</span>
            </div>
            <span className="font-bold text-lg">Baykuş</span>
          </div>
          
          <p className="text-gray-400 text-sm">
            Sınav başarısına giden yolda en güçlü rehberin
          </p>
          
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Gizlilik</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Kullanım Şartları</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">İletişim</a>
          </div>
          
          <p className="text-gray-500 text-xs">
            © 2024 Baykuş. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
} 