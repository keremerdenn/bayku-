"use client";
import React, { useState, useEffect } from "react";
import MobileLayout from "./MobileLayout";
import MobileRoomsPage from "./MobileRoomsPage";
import MobileChatPage from "./MobileChatPage";
import MobileDerslerimPage from "./MobileDerslerimPage";
import MobileVerilerimPage from "./MobileVerilerimPage";
import MobileProfilePage from "./MobileProfilePage";
import MobileAdminPanel from "./MobileAdminPanel";
import { 
  ChartBarIcon, 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon, 
  AcademicCapIcon,
  UserIcon,
  ClockIcon,
  StarIcon
} from "@heroicons/react/24/outline";

const USER_KEY = "sinavPusulasiUser";

export default function MobileDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [username, setUsername] = useState("Kullanıcı");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUsername(user.username || "Kullanıcı");
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
                  <h1 className="text-2xl font-bold mb-2">Hoş Geldin! 👋</h1>
                  <p className="text-sky-100 text-lg">Bugün neler yapmak istiyorsun?</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Hızlı İstatistikler */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Çözülen Soru</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                  </div>
                  <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-sky-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Doğruluk Oranı</p>
                    <p className="text-2xl font-bold text-gray-900">%87</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <StarIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Çalışma Süresi</p>
                    <p className="text-2xl font-bold text-gray-900">4.5s</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Aktif Ders</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BookOpenIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Hızlı Erişim */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Hızlı Erişim</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => window.location.hash = "#/sorucozme"}
                  className="mobile-action-card bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 active:scale-95"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center">
                      <BookOpenIcon className="w-8 h-8 text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Soru Çöz</h3>
                      <p className="text-gray-600 text-sm">Yeni sorularla pratik yap</p>
                    </div>
                    <div className="text-sky-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.hash = "#/sohbet"}
                  className="mobile-action-card bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 active:scale-95"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                      <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Sohbet Odaları</h3>
                      <p className="text-gray-600 text-sm">Arkadaşlarınla çalış</p>
                    </div>
                    <div className="text-green-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.hash = "#/ai-asistan"}
                  className="mobile-action-card bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 active:scale-95"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <AcademicCapIcon className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">AI Asistan</h3>
                      <p className="text-gray-600 text-sm">Baykuş&apos;tan yardım al</p>
                    </div>
                    <div className="text-purple-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Son Aktiviteler */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Son Aktiviteler</h2>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">Matematik sorusu çözdün</p>
                      <p className="text-gray-500 text-sm">2 saat önce</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">Fizik testini tamamladın</p>
                      <p className="text-gray-500 text-sm">4 saat önce</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">Sohbet odasına katıldın</p>
                      <p className="text-gray-500 text-sm">6 saat önce</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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