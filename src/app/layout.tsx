import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3B82F6",
};

export const metadata: Metadata = {
  title: {
    default: "DevClub",
    template: "%s | DevClub",
  },
  description:
    "サークル向けオンボーディングSaaS - 新入生の成長を加速する学習プラットフォーム",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "DevClub",
    description:
      "サークル向けオンボーディングSaaS - 新入生の成長を加速する学習プラットフォーム",
    siteName: "DevClub",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "DevClub",
    description:
      "サークル向けオンボーディングSaaS - 新入生の成長を加速する学習プラットフォーム",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${notoSansJP.variable} font-sans antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
