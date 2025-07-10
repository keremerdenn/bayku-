"use client";
import React, { useState, useEffect } from "react";
import MobileLayout from "./MobileLayout";
import MobileRoomsPage from "./MobileRoomsPage";
import MobileChatPage from "./MobileChatPage";
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
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Hoş Geldin!</h1>
                  <p className="text-sky-100 text-lg">Başlamak için üstteki menüyü kullanabilirsin.</p>
                </div>
              </div>
            </div>
            {/* Panelde premium kutu ve badge örneği */}
            <div className="grid gap-4 grid-cols-2 mt-6">
              <div className="aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-white rounded-2xl shadow-xl border-2 border-sky-100">
                <span className="text-2xl font-bold text-sky-700 mb-2">Toplam Soru</span>
                <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-200 to-sky-200 text-sky-800 font-semibold text-base shadow">1234</span>
              </div>
              <div className="aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-white rounded-2xl shadow-xl border-2 border-sky-100">
                <span className="text-2xl font-bold text-sky-700 mb-2">Çözülen Test</span>
                <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-200 to-sky-200 text-sky-800 font-semibold text-base shadow">56</span>
              </div>
            </div>
            {/* Dashboard'da başka örnek içerik yok */}
          </div>
        );
      case "sohbet":
        return <MobileRoomsPage />;
      case "ai-asistan":
        return <MobileChatPage />;
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