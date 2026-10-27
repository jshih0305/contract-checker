import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

// 中文字型檔很大，不預先載入，交給 unicode-range 分段下載
const notoSans = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  weight: ["400", "500", "700"],
  preload: false,
});

const notoSerif = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  weight: ["500", "700"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 合約審查器｜簽名之前，先讓 AI 讀過每一條",
  description: "上傳合約，AI 以律師視角逐條審閱，標出風險條款、提出修改建議，並整理缺漏條款與關鍵條件。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant-TW"
      className={`${notoSans.variable} ${notoSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* 瀏覽器擴充功能常會在 body 加屬性，忽略這類 hydration 差異 */}
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
