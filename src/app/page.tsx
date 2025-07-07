"use client";

import React, { useEffect, useState, Suspense } from "react";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";

const USER_KEY = "sinavPusulasiUser";

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydration için güvenli kontrol
    if (typeof window !== "undefined") {
      const user = localStorage.getItem(USER_KEY);
      setIsLoggedIn(!!user);
      setIsLoading(false);
    }
  }, []);

  // İlk render ve loading durumu
  if (isLoading || isLoggedIn === null) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isLoggedIn ? <Dashboard /> : <LandingPage />}
    </Suspense>
  );
}
