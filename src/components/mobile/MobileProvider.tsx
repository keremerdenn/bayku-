"use client";
import React, { useState, useEffect } from "react";

interface MobileProviderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mobileComponent: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  desktopComponent: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: any;
}

export default function MobileProvider({ 
  mobileComponent: MobileComponent, 
  desktopComponent: DesktopComponent,
  props = {}
}: MobileProviderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsLoaded(true);
    };

    // İlk yükleme
    checkMobile();

    // Ekran boyutu değişikliklerini dinle
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Yükleme tamamlanana kadar loading göster
  if (!isLoaded) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
    </div>;
  }

  // Mobil cihazlarda mobil bileşeni, masaüstünde normal bileşeni göster
  return isMobile ? <MobileComponent {...props} /> : <DesktopComponent {...props} />;
} 