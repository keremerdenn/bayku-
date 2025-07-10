"use client";
import React, { useState, useEffect } from "react";
import MobileLayout from "./MobileLayout";
import { XMarkIcon } from "@heroicons/react/24/outline";

const USER_KEY = "sinavPusulasiUser";

interface User {
  email: string;
  username?: string;
  bio?: string;
}

export default function MobileProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
          const userData: User = JSON.parse(userStr);
          setUser(userData);
          setEditUsername(userData.username || "");
          setEditBio(userData.bio || "");
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout currentPage="profil">
      <div className="max-w-md mx-auto px-4 py-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm w-full max-w-md flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3">
            <span className="text-3xl font-bold text-blue-600">{user.username ? user.username[0]?.toUpperCase() : user.email[0]?.toUpperCase()}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">{user.username || "Kullanıcı"}</h2>
          <span className="inline-block mb-2 px-3 py-1 rounded bg-gray-100 text-gray-500 font-medium text-xs">{user.email}</span>
          {user.bio && <p className="text-gray-700 mt-2 text-center text-sm">{user.bio}</p>}
          <button
            className="mt-6 bg-blue-500 text-white px-5 py-2 rounded font-medium text-sm hover:bg-blue-600 active:scale-95 transition"
            onClick={() => {
              setEditUsername(user.username || "");
              setEditBio(user.bio || "");
              setEditError("");
              setShowEditModal(true);
            }}
          >
            Profili Düzenle
          </button>
        </div>
      </div>
      {/* Düzenleme Modalı */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl w-[90vw] max-w-sm p-6 relative flex flex-col">
            <button
              className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100"
              onClick={() => setShowEditModal(false)}
              aria-label="Kapat"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Profili Düzenle</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                setEditError("");
                if (!editUsername.trim()) {
                  setEditError("Kullanıcı adı boş olamaz.");
                  return;
                }
                if (editUsername.length > 30) {
                  setEditError("Kullanıcı adı 30 karakterden uzun olamaz.");
                  return;
                }
                const updatedUser = { ...user, username: editUsername.trim(), bio: editBio.trim() };
                setUser(updatedUser);
                localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
                setShowEditModal(false);
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                value={editUsername}
                onChange={e => setEditUsername(e.target.value)}
                placeholder="Kullanıcı adı"
                className="w-full p-2 rounded border border-gray-200 !text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm"
                maxLength={30}
                required
              />
              <textarea
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                placeholder="Biyografi (opsiyonel)"
                className="w-full p-2 rounded border border-gray-200 !text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm min-h-[60px]"
                maxLength={160}
              />
              {editError && <div className="text-red-500 text-xs text-center">{editError}</div>}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded font-medium text-sm hover:bg-blue-600 active:scale-95 transition mt-2"
              >Kaydet</button>
            </form>
          </div>
        </div>
      )}
    </MobileLayout>
  );
} 