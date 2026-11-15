import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moment",
  description: "텍스트와 이미지를 함께 공유하는 소셜 네트워킹 서비스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-text">{children}</body>
    </html>
  );
}
