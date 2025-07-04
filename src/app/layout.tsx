import type { Metadata } from "next";
import "./globals.css";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import LogoutButton from "../components/LogoutButton";

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
        <LogoutButton />
        {children}
      </body>
    </html>
  );
}
