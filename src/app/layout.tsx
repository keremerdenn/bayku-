import type { Metadata } from "next";
import "./globals.css";
import "../styles/mobile-sidebar.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        {/* Preload kritik kaynaklar */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" media="all" />
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        {/* Örnek kritik CSS preload */}
        <link rel="preload" as="style" href="/globals.css" />
        
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Baykuş" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-sans antialiased">
        <div className="relative min-h-screen">
          {children}
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
