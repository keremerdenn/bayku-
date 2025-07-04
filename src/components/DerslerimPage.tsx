"use client";

import React from "react";

const DerslerimPage = () => {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          Derslerim
        </h1>
        <p className="text-lg text-gray-600 mt-1">Tüm derslerin ve konuların detaylı analizi.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Örnek ders kartı */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">TYT Matematik</h3>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">İyi</span>
          </div>
          <p className="text-gray-600 mb-4">Temel matematik konuları ve problem çözme</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Temel Kavramlar</span>
              <span className="text-sm font-semibold text-green-600">%90</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: "90%" }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Üslü Sayılar</span>
              <span className="text-sm font-semibold text-green-600">%92</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: "92%" }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Problemler</span>
              <span className="text-sm font-semibold text-red-600">%45</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full transition-all duration-500" style={{ width: "45%" }}></div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Çalışmaya Başla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DerslerimPage; 