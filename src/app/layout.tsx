import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "KTÜ Farabi Hastanesi | Uluslararası Hasta Portalı",
  description:
    "Karadeniz Teknik Üniversitesi Farabi Hastanesi Uluslararası Hasta Merkezi. 36+ seçkin profesör ve 26 tıbbi birimle küresel düzeyde teşhis, cerrahi ve şifa portalı.",
  keywords: [
    "Farabi Hastanesi",
    "KTÜ Farabi",
    "Uluslararası Hasta Merkezi",
    "Trabzon Hastane",
    "Sağlık Turizmi Türkiye",
    "Online Randevu Farabi",
  ],
  authors: [{ name: "KTÜ Farabi IT Department" }],
  icons: {
    icon: "/assets/ktu_logo.png",
    shortcut: "/assets/ktu_logo.png",
    apple: "/assets/ktu_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/assets/ktu_logo.png" type="image/png" />
        <link rel="shortcut icon" href="/assets/ktu_logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/ktu_logo.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
