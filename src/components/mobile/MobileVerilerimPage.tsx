"use client";
import React from "react";
import MobileLayout from "./MobileLayout";

export default function MobileVerilerimPage() {
  return (
    <MobileLayout currentPage="verilerim">
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verilerim</h2>
          <p className="text-gray-500">Henüz veriniz yok.</p>
        </div>
      </div>
    </MobileLayout>
  );
} 