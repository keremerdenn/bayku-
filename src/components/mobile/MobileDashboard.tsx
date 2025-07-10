"use client";
import React, { useState, useEffect } from "react";
import MobileLayout from "./MobileLayout";
import MobileRoomsPage from "./MobileRoomsPage";

import MobileDerslerimPage from "./MobileDerslerimPage";
import MobileVerilerimPage from "./MobileVerilerimPage";
import MobileProfilePage from "./MobileProfilePage";
import MobileAdminPanel from "./MobileAdminPanel";
import MobileSolvePage from "./MobileSolvePage";

const USER_KEY = "sinavPusulasiUser";

export default function MobileDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsAdmin(user.email === "keremerdeen@gmail.com");
        } catch {}
      }
    }

    // Hash routing
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#\//, "");
      setActivePage(hash || "dashboard");
    };
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Sayfa içeriğini render et
  const renderPageContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Hoş Geldin Kartı */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
              <h1 className="text-base font-semibold text-gray-800 mb-1">Hoş geldiniz!</h1>
              <p className="text-xs text-gray-500">Başlamak için menüyü kullanabilirsin.</p>
            </div>
            
            {/* Duyurular Bölümü */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#f59e0b"/>
                </svg>
                Duyurular
              </h2>
              <div className="space-y-3">
                <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <h3 className="text-xs font-medium text-amber-800">Yeni Özellik!</h3>
                      <div className="mt-1 text-xs text-amber-700">
                        <p>Artık sohbet odalarında arkadaşlarınla birlikte soru çözebilirsin!</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <h3 className="text-xs font-medium text-blue-800">Güncelleme</h3>
                      <div className="mt-1 text-xs text-blue-700">
                        <p>Derslerim bölümünde artık konuları ve testleri daha kolay yönetebilirsin.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <h3 className="text-xs font-medium text-green-800">Başarı!</h3>
                      <div className="mt-1 text-xs text-green-700">
                        <p>Son güncellemelerle birlikte performans iyileştirmeleri yapıldı.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "sohbet":
        return <MobileRoomsPage />;
      case "derslerim":
        return <MobileDerslerimPage />;
      case "verilerim":
        return <MobileVerilerimPage />;
      case "profil":
        return <MobileProfilePage />;
      case "admin":
        return isAdmin ? <MobileAdminPanel /> : (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
            <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmuyor.</p>
          </div>
        );
      case "sorucozme":
        return <MobileSolvePage />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sayfa Bulunamadı</h2>
            <p className="text-gray-600">Bu sayfa henüz mevcut değil.</p>
          </div>
        );
    }
  };

  return (
    <MobileLayout currentPage={activePage}>
      {renderPageContent()}
    </MobileLayout>
  );
} 