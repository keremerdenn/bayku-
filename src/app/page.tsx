"use client";

import React, { useEffect, useState } from "react";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";

const USER_KEY = "sinavPusulasiUser";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem(USER_KEY);
      setIsLoggedIn(!!user);
    }
  }, []);

  if (isLoggedIn === null) {
    // İlk renderda hiçbir şey gösterme (isteğe bağlı: loading ekranı eklenebilir)
    return null;
  }

  return isLoggedIn ? <Dashboard /> : <LandingPage />;
}
