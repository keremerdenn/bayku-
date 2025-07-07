"use client";
import { useEffect, useState } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LogoutButton({ navbarMode = false }: { navbarMode?: boolean }) {
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
      className={
        navbarMode
          ? "flex items-center gap-2 px-3 py-2 md:px-5 md:py-2 rounded-xl bg-white text-sky-600 font-bold shadow-xl border border-gray-200 hover:bg-sky-50 transition-all text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-sky-300"
          : "fixed top-6 right-6 z-[60] flex items-center gap-2 px-3 py-2 md:px-5 md:py-2 rounded-xl bg-white text-sky-600 font-bold shadow-xl border border-gray-200 hover:bg-sky-50 transition-all text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-sky-300"
      }
      aria-label="Çıkış Yap"
    >
      <ArrowRightOnRectangleIcon className="w-4 h-4 md:w-5 md:h-5" />
      <span className="hidden sm:inline">Çıkış Yap</span>
    </button>
  );
} 