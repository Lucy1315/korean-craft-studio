import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import { Header } from "@/components/Header";
import { PracticeNotice } from "@/components/PracticeNotice";
import "./globals.css";

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-serif-kr",
  subsets: ["latin"],
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-sans-kr",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "온결 공방",
  description:
    "한국 전통 공예를 소개하는 가상의 실습용 공방 사이트입니다. 공예품을 둘러보고 주문 문의와 클래스 신청을 연습해 볼 수 있습니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSerifKr.variable} ${notoSansKr.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <PracticeNotice />
        <Header />
        {children}
      </body>
    </html>
  );
}
