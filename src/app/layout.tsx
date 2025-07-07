import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baykuş - Sınav Başarısına Giden Yolda En Güçlü Rehberin",
  description: "Binlerce güncel ÖSYM sorusu, kişiselleştirilmiş testler ve takıldığın her soruda topluluk desteği bir tık uzağında.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
