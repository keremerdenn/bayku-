"use client";

import React from "react";

const VerilerimPage = () => {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <svg className="w-8 h-8 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          Verilerim
        </h1>
        <p className="text-lg text-gray-600 mt-1">Tüm istatistiklerin ve analizlerin burada.</p>
      </header>
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">İstatistikler Yakında!</h2>
        <p className="text-gray-500">Bu sayfada ileride detaylı analiz ve grafikler yer alacak.</p>
      </div>
    </div>
  );
};

export default VerilerimPage; 