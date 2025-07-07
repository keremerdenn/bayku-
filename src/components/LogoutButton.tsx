"use client";
import { useEffect, useState } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LogoutButton({ navbarMode = false, sidebarMode = false }: { navbarMode?: boolean, sidebarMode?: boolean }) {
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
          : sidebarMode
            ? "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-600 text-white font-bold shadow-md hover:bg-sky-700 transition-all text-base focus:outline-none focus:ring-2 focus:ring-sky-300"
            : "fixed top-6 right-6 z-[60] flex items-center gap-2 px-3 py-2 md:px-5 md:py-2 rounded-xl bg-white text-sky-600 font-bold shadow-xl border border-gray-200 hover:bg-sky-50 transition-all text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-sky-300"
      }
      aria-label="Çıkış Yap"
    >
      <ArrowRightOnRectangleIcon className={sidebarMode ? "w-5 h-5" : "w-4 h-4 md:w-5 md:h-5"} />
      <span className="hidden sm:inline">Çıkış Yap</span>
    </button>
  );
} 