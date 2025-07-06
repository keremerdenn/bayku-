"use client";
import { useEffect, useState } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LogoutButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("sinavPusulasiUser");
      setShow(!!user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sinavPusulasiUser");
    window.location.reload();
  };

  if (!show) return null;

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 md:px-5 md:py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold shadow-lg border-2 border-white/40 hover:scale-105 transition-transform text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-sky-300"
      aria-label="Çıkış Yap"
    >
      <ArrowRightOnRectangleIcon className="w-4 h-4 md:w-5 md:h-5" />
      <span className="hidden sm:inline">Çıkış Yap</span>
    </button>
  );
} 