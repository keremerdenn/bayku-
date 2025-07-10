"use client";
import React, { useState, useEffect } from "react";
import MobileLayout from "./MobileLayout";
import { UserIcon, EnvelopeIcon, CalendarIcon, AcademicCapIcon, CogIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const USER_KEY = "sinavPusulasiUser";

interface User {
  email: string;
  username?: string;
  bio?: string;
}

export default function MobileProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: ""
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
          const userData: User = JSON.parse(userStr);
          setUser(userData);
          setFormData({
            username: userData.username || "",
            email: userData.email || "",
            bio: userData.bio || ""
          });
        }
      } catch {
        console.error("Kullanıcı bilgisi alınamadı");
      }
    }
  }, []);

  if (!user) {
    return (
      <MobileLayout currentPage="profil">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout currentPage="profil">
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profilim</h2>
          {/* Kullanıcı bilgileri burada gösterilecek */}
        </div>
      </div>
    </MobileLayout>
  );
} 