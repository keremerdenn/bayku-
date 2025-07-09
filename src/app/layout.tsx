import type { Metadata } from "next";
import "./globals.css";
import "../styles/mobile-sidebar.css";
import MobileProvider from "../components/mobile/MobileProvider";
import MobileLayout from "../components/mobile/MobileLayout";

export const metadata: Metadata = {
  title: "Baykuş - Sınav Başarısına Giden Yolda En Güçlü Rehberin",
  description: "Binlerce güncel ÖSYM sorusu, kişiselleştirilmiş testler ve takıldığın her soruda topluluk desteği bir tık uzağında.",
  // SEO ve Performance optimizasyonları
  keywords: ["sınav", "ÖSYM", "test", "eğitim", "başarı"],
  authors: [{ name: "Baykuş" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  // Open Graph
  openGraph: {
    title: "Baykuş - Sınav Başarısına Giden Yolda En Güçlü Rehberin",
    description: "Binlerce güncel ÖSYM sorusu, kişiselleştirilmiş testler ve takıldığın her soruda topluluk desteği bir tık uzağında.",
    type: "website",
    locale: "tr_TR",
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Baykuş - Sınav Başarısına Giden Yolda En Güçlü Rehberin",
    description: "Binlerce güncel ÖSYM sorusu, kişiselleştirilmiş testler ve takıldığın her soruda topluluk desteği bir tık uzağında.",
  },
};

// Normal Desktop Layout
function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {children}
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        {/* Preload kritik kaynaklar */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Performance optimizasyonu */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="font-sans antialiased">
        <MobileProvider 
          mobileComponent={MobileLayout}
          desktopComponent={DesktopLayout}
          props={{ children }}
        />
      </body>
    </html>
  );
}
