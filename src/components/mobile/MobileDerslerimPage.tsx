"use client";
import React from "react";
import MobileLayout from "./MobileLayout";

// Ders tipi kaldırıldı

export default function MobileDerslerimPage() {
  // dersler değişkeni kaldırıldı

  return (
    <MobileLayout currentPage="derslerim">
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Derslerim</h2>
          <p className="text-gray-500">Henüz dersiniz yok.</p>
        </div>
      </div>
    </MobileLayout>
  );
} 